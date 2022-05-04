/* eslint-disable no-restricted-globals */
import { clientsClaim, } from 'workbox-core'
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { RangeRequestsPlugin } from 'workbox-range-requests'
import PouchDB from 'pouchdb'

const db = new PouchDB('courses')


if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate()
    .then(function (estimate) {
      console.log('estimate', estimate)
      console.log(`Using ${estimate.usage / 1_000_000_000}GB out of ${estimate.quota / 1_000_000_000} GBs.`)
    })
} else {
  console.warn('no storage or estimate')
}


self.__WB_DISABLE_DEV_LOGS = false
// add an activate event listener to sw and inside it, calls `self.clients.claim()`
clientsClaim()


// One feature of service workers is the ability to save a set of files to the cache when the service worker is installing.
// Precache all the assets generated by your build process.
// Their URLs are injected into the manifest variable below. This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST)


// workbox-core's skipWaiting() is deprecated, and developers should switch to calling self.skipWaiting() directly.
// see https://developer.chrome.com/docs/workbox/modules/workbox-core/#the-skipwaiting-wrapper-is-deprecated
// This allows the web app to trigger skipWaiting via registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
  if (event.data && event.data.type === 'DOWNLOAD_COURSE') downloadCourse(event)
  if (event.data && event.data.type === 'DELETE_COURSE') deleteCourse(event)
})


// workbox-routing is a module which makes it easy to "route" these requests to different functions that provide responses
// Set up App Shell-style routing, so that all navigation requests are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
registerRoute(({ request, url }) => {
  console.log('app shell')
  // If this isn't a navigation, skip.
  if (request.mode !== 'navigate') {
    return false
  }
  // If this is a URL that starts with /_, skip.
  if (url.pathname.startsWith('/_')) {
    return false
  }
  // If this looks like a URL for a resource, because it contains // a file extension, skip.
  const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
  if (url.pathname.match(fileExtensionRegexp)) {
    return false
  }
  // Return true to signal that we want to use the handler.
  return true
}, createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'))


// A runtime caching route for requests the metadata of all courses
registerRoute(
  ({ url, request }) => {
    console.log('course metadata')
    if (url.pathname.endsWith('/api/courses')) console.log('%ccourse metadata successful', 'color: green')
    return url.pathname.endsWith('/api/courses')
  },
  new StaleWhileRevalidate({
    cacheName: 'courses-meta'
  })
)


/**
 * Ensure that the downloaded course is served from downloaded material and not from network
 * @async
 * @param {FetchEvent} event
 * @return {Promise<any>}
 */
async function handleRequest({ event }) {
  console.log('fetch for dl')
  const dbResponse = await db.allDocs({ include_docs: true })
  let entry = dbResponse.rows.filter(row => row.doc.requests.includes(event.request.url))

  if (entry.length) {
    console.log('%cfetch for dl successful', 'color: orange')
    let cacheFirstStrategy = new CacheFirst({
      cacheName: `dl-${entry[0].id}`,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new RangeRequestsPlugin()
      ],
      matchOptions: {
        ignoreVary: true
      }
    })
    return cacheFirstStrategy.handle({ event, request: event.request })
  }
  return fetch(event.request)
}

registerRoute(
  () => true,
  handleRequest
)


/**
 * @param {string} msg
 */
function sendMessage(msg) {
  // Obtain an array of Window client objects
  self.clients.matchAll({ type: 'window' }).then(function (clients) {
    if (clients && clients.length) {
      // Respond to last focused tab
      clients[0].postMessage({ type: msg })
    }
  })
}


/**
 *
 * @param {MessageEvent} event
 */
function downloadCourse(event) {
  const courseId = event.data.id
  let init = {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${event.data.jwt}`
    })
  }

  fetch(`${event.data.baseURL}/api/courses/${courseId}/meta`, init)
    .then(response => response.json())
    .then(data => {
      // filter video and audio requests and cache them separately
      let audioAndVideoRequests = data.data.requests.filter(req => req.endsWith('mp4') || req.endsWith('mp3'))
      // remove video and audio requests from original ones
      if (audioAndVideoRequests.length > 0) {
        data.data.requests = data.data.requests.filter(req => !audioAndVideoRequests.includes(req))
      }

      Promise.allSettled(data.data.requests.map(req => {
        if (req.startsWith('/')) req = event.data.baseURL + req
        return fetch(req, init)
      }))
        .then(async (values) => {
            let cache = await caches.open(`dl-course-${courseId}`)
            let cachePromises = [], requests = []

            for (const [key, entry] of Object.entries(values)) {
              if (entry.status === 'fulfilled') {
                cachePromises.push(cache.put(entry.value.url, entry.value))
                requests.push(entry.value.url)
              } else {
                // check for cor issue and run it again with mod no-core. In the most cases it is an extern image link
                if (entry.reason.message.includes('fetch')) {
                  let response = await fetch(`${data.data.requests[key]}`, { mode: 'no-cors' })
                  cachePromises.push(cache.put(data.data.requests[key], response))
                  requests.push(data.data.requests[key])
                } else {
                  console.warn(entry.reason.message, data.data.requests[key])
                }
              }
            }

            Promise.allSettled(cachePromises)
              .then(() => {
                sendMessage('DOWNLOAD_COMPLETED')
              })
              .catch(console.error)

            // put the urls in indexeddb for further respond from cache
            db.put({
              _id: `course-${courseId}`,
              requests: [...requests]
            })
              .then(async (doc) => {
                // Check for audio and video requests. If any cache them and update the refs in indexeddb.
                if (audioAndVideoRequests.length > 0) {
                  try {
                    await downloadVideoAndAudio(audioAndVideoRequests, event.data.baseURL, courseId, init)
                    let courseDoc = await db.get(doc.id)
                    courseDoc.requests = [...courseDoc.requests, ...audioAndVideoRequests]
                    await db.put(courseDoc)
                  } catch (e) {
                    console.error(e)
                  }
                }
              })
              .catch(console.error)
          }
        )
        .catch(console.error)
    })
    .catch(console.error)
}


/**
 *
 * @param {Array<string>} requests
 * @param {string} baseURL
 * @param {number} courseId
 * @param {Object} init
 */
async function downloadVideoAndAudio(requests, baseURL, courseId, init) {
  requests = requests.map(req => {
    if (req.startsWith('/')) req = baseURL + req
    return req
  })

  let cache = await caches.open(`dl-course-${courseId}`)
  let cachePromises = [], promise

  for (let req of requests) {
    promise = cache.add(req)
    cachePromises.push(promise)
  }

  return Promise.allSettled(cachePromises)
}

/**
 *
 * @param {MessageEvent} event
 */
function deleteCourse(event) {
  const courseId = event.data.id

  db.allDocs({ include_docs: true })
    .then(results => {
      Promise.allSettled(results.rows.map(row => {
        if (row.doc.cacheName === `course-${courseId}`) {
          return db.remove(row.doc._id, row.doc._rev)
        }
      }))
        .catch(console.error)
    })
    .catch(console.error)
  caches.delete(`dl-course-${courseId}`)
    .then(cacheDeleted => {
      if (cacheDeleted) {
        db.get(`course-${courseId}`).then(doc => {
          db.remove(doc)
        }).catch(console.error)
      }
    })
    .catch(console.error)
}
