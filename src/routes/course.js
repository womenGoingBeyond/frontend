import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import styles from '../styles/components/Course.module.css'
import Header from '../components/Header'
import Skeleton from '@mui/material/Skeleton'
import Auth from '../util/auth'

export default function Course() {
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [lessonsImages, setLessonsImages] = useState([])
  const params = useParams()
  const navigate = useNavigate()

  const overviewURL = `api/courses/${params.courseId}?populate[Content][populate][Media][fields][0]=url&populate[lessons][fields][0]=id&populate[lessons][fields][1]=title`
  const cmsURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN

  useEffect(() => {
    fetchCourseInfo().catch(console.error)
  }, [])

  const fetchCourseInfo = async () => {
    let response = await Api.get(overviewURL)
    let course = response.data

    // fetch lesson info in parallel
    let lessonEntries = course.lessons.map(async lesson => {
      let lessonResponse = await Api.get(`api/lessons/${lesson.id}?populate[Content][populate][Media][fields][0]=url`)
      let progress = await fetchLessonStatus(lesson)
      return [lessonResponse, progress]
    })

    let lessonsArray = [], lessonImagesArray = []
    for (const entry of lessonEntries) {
      let e = await entry
      let lesson = e[0].data
      let progress = e[1].data

      let img = {}
      if (lesson.Content.length) {
        for (const content of lesson.Content) {
          if (content.__component.includes('media')) {
            img.src = content.URL ? content.URL : `${cmsURL}${content.Media.url}`
            img.alt = content.Caption ? content.Caption : lesson.Description
          }
        }
        console.log(require('../img/logo.svg'))
        if (!img.src) img.src = 'https://picsum.photos/200/300?grayscale'
        if (!img.alt) img.alt = lesson.Description
        lessonImagesArray.push(img)
      }
      lesson.done = progress[0].done
      lessonsArray.push(lesson)
    }

    setLessons(lessonsArray)
    setLessonsImages(lessonImagesArray)
    setCourse(course)
  }

  const fetchLessonStatus = async (lesson) => {
    let apiEndpoint = `api/user-lesson-states?filters[$and][0][users_permissions_user][id][$eq]=${Auth.getUserIdFromJWT()}&filters[$and][1][lesson][id][$eq]=${lesson.id}`
    return Api.get(apiEndpoint)
  }

  const lessonClickHandler = (lessonId) => {
    navigate(`/courses/${params.courseId}/lessons/${lessonId}`)
  }

  return (
    <>
      <Header/>
      <main>
        {course !== null ?
          <>
            <h1>{course.Title}</h1>
            <div className={[styles.course, styles.overview].join(' ')}>
              <div className={styles.header}>
                {/*<p>{progress}%</p>*/}
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
            </div>
            <div className={styles.lessonsContainer}>
              <h2 className={styles.lessonsHeader}>Lessons</h2>
              <div className={styles.lessonsWrapper}>
                {lessons.length > 0 ? lessons.map((lesson, index) =>
                  <div
                    key={lesson.Title + index}
                    className={styles.lesson}
                    id={`lesson-${lesson.id}`}
                    onClick={() => lessonClickHandler(lesson.id)}
                  >
                    <img
                      src={lessonsImages[index].src}
                      alt={lessonsImages[index].alt}
                      width={'40px'}
                      height={'40px'}
                    />
                    <h3>{lesson.Title}</h3>
                    <div
                      className={styles.lessonsDone}
                      style={{ backgroundColor: `${lesson.done ? 'rgba(0,255,0,.7)' : 'none'}` }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </>
          :
          <Skeleton
            sx={{ bgcolor: 'grey.300', width: '90%', height: '150px', mb: '1rem' }}
            variant="rectangular"
          />
        }
      </main>
    </>
  )
}