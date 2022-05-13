import PropTypes from 'prop-types'
import styles from '../styles/components/Course.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Api from '../util/api'
import DownloadIcon from '@mui/icons-material/Download'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone'
import DeleteIcon from '@mui/icons-material/Delete'

export default function Course({ course, keyValue, userCourse, cacheName }) {
  const [progress, setProgress] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [isUserCourse, setIsUserCourse] = useState(userCourse)
  const [isCourseDownloaded, setIsCourseDownloaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // check if the course is already downloaded
    caches.has(`dl-course-${course.id}`)
      .then(hasCache => setIsCourseDownloaded(hasCache))
      .catch(console.error)

    // listen to messages
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessages)

    // clean up
    return () => navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessages)
  }, [])

  useEffect(() => {
    if (isUserCourse) {
      fetchCourseProgress()
        .catch(console.error)
    }
  }, [isUserCourse])

  /**
   * @param {MessageEvent} event
   */
  const handleServiceWorkerMessages = (event) => {
    if (event.data && event.data.type === 'DOWNLOAD_COMPLETED') {
      console.log('done')
      updateDownloadState(true)
    }

    if (event.data && event.data.type === 'DOWNLOAD_DELETED') {
      console.log('cache deleted')
      updateDownloadState(false)
    }
  }

  const updateDownloadState = (state) => setIsCourseDownloaded(state)

  const fetchCourseProgress = () => {
    return Api.get(`api/user-course-progresses/${course.id}`)
      .then(response => setProgress(response.data.length > 0 ? response.data[0].progress * 100 : 0))
      .catch(console.error)
  }

  const showMoreHandler = () => setShowMore(prevState => !prevState)

  const registerOrContinueHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isUserCourse) {
      Api.post(`api/courses/${course.id}/register`)
        .then(() => setIsUserCourse(true))
        .catch(console.error)
    } else {
      navigate(`/courses/${course.id}`)
    }
  }

  // check for background fetch API support
  const downloadCourse = (event) => {
    event.stopPropagation()
    event.preventDefault()
    fallbackFetch()
  }

  const removeDownloadedCourse = (event) => {
    event.stopPropagation()
    event.preventDefault()
    navigator.serviceWorker.controller.postMessage({
      type: 'DELETE_COURSE',
      id: course.id,
    })
  }

  const fallbackFetch = () => {
    navigator.serviceWorker.controller.postMessage({
      type: 'DOWNLOAD_COURSE',
      id: course.id,
      baseURL: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN,
      jwt: window.sessionStorage.getItem('wgb-jwt')
    })
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
            {isUserCourse ?
              <div>
                {isCourseDownloaded ?
                  <div>
                    <DownloadDoneIcon/>
                    <DeleteIcon onClick={removeDownloadedCourse}/>
                  </div>
                  : <DownloadIcon onClick={downloadCourse}/>
                }
              </div>
              : null
            }
            <span onClick={registerOrContinueHandler}>{isUserCourse ? 'continue' : 'start'}</span>
          </div>
        </div>
        :
        <div
          id={`course-${course.id}`}
          className={[styles.course, styles.courseShort].join(' ')}
          key={keyValue}
          style={{ backgroundColor: course.category.Color || '#aaa' }}
          onClick={showMoreHandler}
        >
          <h4>{course.Title}</h4>
          {isUserCourse ? <p>{progress}%</p> : null}
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
