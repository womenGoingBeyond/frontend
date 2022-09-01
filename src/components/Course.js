import PropTypes from 'prop-types'
import styles from '../styles/components/Course.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Api from '../util/api'
import DownloadIcon from '@mui/icons-material/Download'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone'
import DeleteIcon from '@mui/icons-material/Delete'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useLoading }  from '../components/LoadingContext'

export default function Course({ course, keyValue, userCourse, cacheName }) {
  const [progress, setProgress] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [isUserCourse, setIsUserCourse] = useState(userCourse)
  const [isCourseDownloaded, setIsCourseDownloaded] = useState(false)
  const navigate = useNavigate()
  const {t, i18n} = useTranslation()
  const { loading, setLoading } = useLoading();

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
      setLoading(false);
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
    // setLoading(true);
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

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 7,
    marginTop: 6,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "#ACCB53",
    },
  }));

  return (
    <>
      {showMore ?
        <div
          id={`course-${course.id}`}
          className={[styles.course].join(' ')}
          key={keyValue}
          onClick={showMoreHandler}
        >
          <div className={styles.header}>
          <h4>{course.Title}</h4>
         <p className={styles.courseProgress}>
            <div className={styles.progress}> {progress}/100% <div className={styles.lightning}/></div>
         
          <BorderLinearProgress className={styles.linearProgress} variant="determinate" value={progress} /></p> 
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

          <div className={styles.horizontalLine}/>
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
            <span onClick={registerOrContinueHandler}>{isUserCourse ? `${t("continueCourse")}` : `${t("startCourse")}`}</span>
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

        <div className={styles.header}>
          <h4>{course.Title}</h4>
         <p className={styles.courseProgress}>
            <div className={styles.progress}> {progress}/100% <div className={styles.lightning}/></div>
         
          <BorderLinearProgress className={styles.linearProgress} variant="determinate" value={progress} /></p>
          </div> 
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
