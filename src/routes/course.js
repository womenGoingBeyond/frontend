import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import styles from '../styles/components/Course.module.css'
import Header from '../components/Header'
import Auth from '../util/auth'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CustomSkeleton from '../components/CustomSkeleton'
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export default function Course() {
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(0)
  const [lessons, setLessons] = useState([])
  const params = useParams()
  const navigate = useNavigate()
  const {t, i18n} = useTranslation()
  let courseTitle = "ggg"

  const overviewURL = `api/courses/${params.courseId}?locale=${i18n.language}&populate[Content][populate][Media][fields][0]=url&populate[lessons][fields][0]=id&populate[lessons][fields][1]=title`

  useEffect(() => {
    fetchCourseInfo().catch(console.error)
  }, [])

 

  const fetchCourseInfo = async () => {
    let response = await Api.get(overviewURL)
    let course = response.data


    Api.get(`api/user-course-progresses/${course.id}`)
    .then(response => setProgress(response.data.length > 0 ? response.data[0].progress * 100 : 0))
    .catch(console.error)


    // fetch lesson info in parallel
    let lessonEntries = course.lessons.map(async lesson => {
      let lessonResponse = await Api.get(`api/lessons/${lesson.id}?locale=${i18n.language}&populate[Content][populate][Media][fields][0]=url`)
      let progress = await fetchLessonStatus(lesson)
      return [lessonResponse, progress]
    })

    let lessonsArray = []
    for (const entry of lessonEntries) {
      let e = await entry
      let lesson = e[0].data
      let progress = e[1].data
      console.log("e", e)
      lesson.started = (progress.length > 0)
      lesson.done = progress.length > 0 ? progress[0].done : false
      lesson.progress = progress
      lessonsArray.push(lesson)
    }
console.log ("sjdns", lessonsArray)
    setLessons(lessonsArray)
    setCourse(course)
    courseTitle = course.Title
  }

  const fetchLessonStatus = async (lesson) => {
    let apiEndpoint = `api/user-lesson-states?filters[$and][0][users_permissions_user][id][$eq]=${Auth.getUserIdFromJWT()}&filters[$and][1][lesson][id][$eq]=${lesson.id}`
    return Api.get(apiEndpoint)
  }

  const lessonClickHandler = (lessonId) => {
    navigate(`/courses/${params.courseId}/lessons/${lessonId}`)
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

{course !== null ?
    <Header title={course.Title} isSubpage="true"/>
    : null
}
      <main>
        {course !== null ?
          <>
            <div className={[styles.course, styles.overview].join(' ')}>
             
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
                    <div>{lesson.Title}</div>

                    {/* <div className={(index ? styles.lightning : styles.lightning + " " + styles.empty)}/> */}
                    <div className={(lesson.started && lesson.done ? styles.lightning : styles.lightning + " " + styles.empty)}>
                      {/*""+lesson.started */}
                      </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
          :
          <CustomSkeleton amount={2}/>
        }
      </main>
    </>
  )
}
