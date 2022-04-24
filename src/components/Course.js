import PropTypes from 'prop-types'
import styles from '../styles/components/Course.module.css'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import DownloadIcon from '@mui/icons-material/Download'

export default function Course({ course, keyValue, userCourse, cacheName }) {
  const [progress, setProgress] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [downloadRequests, setDownloadRequests] = useState({})
  const [isUserCourse, setIsUserCourse] = useState(userCourse)
  const baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN

  useEffect(() => {
    if (isUserCourse) {
      Promise.allSettled([
        fetchCourseProgress(),
        fetchCourseMetadata()
      ])
        .catch(console.error)
    }
  }, [isUserCourse])

  const fetchCourseProgress = () => {
    return Api.get(`api/user-course-progresses/${course.id}`)
      .then(response => setProgress(response.data.progress))
      .catch(console.error)
  }

  const fetchCourseMetadata = () => {
    return Api.get(`api/courses/${course.id}/meta`)
      .then(response => {
        let requests = response.data.requests.map(request => {
          if (request.startsWith('/')) {
            return new Request(`${baseURL}${request}`, {
              method: 'GET',
              mode: 'cors',
              headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.sessionStorage.getItem('wgb-jwt')}`
              })
            })
          } else {
            return new Request(request)
          }
        }).filter(Boolean)
        setDownloadRequests(requests)
      })
      .catch(console.error)
  }

  const showMoreHandler = () => setShowMore(prevState => !prevState)

  const registerOrContinueHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isUserCourse) {
      Api.put(`api/courses/${course.id}/register`)
        .then(() => Api.get(cacheName))
        .then(() => setIsUserCourse(true))
        .catch(console.error)
    } else {
      console.log('%c continue the course', 'color: red')
    }
  }

  const buttonClickHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()

    downloadCourse()
      .catch(console.error)
  }

  /**
   * @return {Promise<void>}
   */
  const downloadCourse = async () => {
    // check for background fetch API support
    return fallbackFetch()
  }

  /**
   * @return {Promise<void>}
   */
  const fallbackFetch = async () => {
    try {
      const cache = await caches.open(`course-${course.id}`)
      let _ = downloadRequests.map(async request => {
        let response = await fetch(request)
        return await cache.put(request, response)
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {showMore ?
        <div
          id={`course-${course.id}`}
          className={[styles.course, styles.overview].join(' ')}
          key={keyValue}
          onClick={showMoreHandler}
        >
          <div className={styles.header}>
            <h4>{course.Title}</h4>
            {isUserCourse ? <p>{progress}%</p> : null}
          </div>
          <div className={styles.img}>
            <img
              src={course.Content.length
                ? course.Content[0].URL !== null
                  ? course.Content[0].URL
                  : `${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN}${course.Content[0].Media.url}`
                : `https://picsum.photos/200/300?grayscale`
              }
              alt={course.Content.length
                ? course.Content[0].Caption.length ? course.Content[0].Caption : `${course.Title} image`
                : `${course.Title} image`
              }
            />
          </div>
          <div className={styles.description}>
            <p>{course.Description.length ? course.Description : ''}</p>
          </div>
          <div className={styles.footer}>
            {isUserCourse ? <DownloadIcon onClick={buttonClickHandler}/> : null}
            <span onClick={registerOrContinueHandler}>{isUserCourse ? 'continue' : 'start'}</span>
          </div>
        </div>
        :
        <div
          id={`course-${course.id}`}
          className={[styles.course, styles.courseShort].join(' ')}
          key={keyValue}
          style={{
            backgroundColor: course.category.Color || '#aaa'
          }}
          onClick={showMoreHandler}
        >
          <h4>{course.Title}</h4>
          {isUserCourse ? <p>{progress}%</p> : null}
          {/*<div dangerouslySetInnerHTML={{ __html: course.Description }}/>*/}
        </div>
      }
    </>
  )
}

Course.propTypes = {
  course: PropTypes.object.isRequired,
  userCourse: PropTypes.bool.isRequired,
  cacheName: PropTypes.string.isRequired,
  keyValue: PropTypes.number
}
