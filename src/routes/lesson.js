import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import Header from '../components/Header'
import styles from '../styles/components/Course.module.css'
import Auth from '../util/auth'
import CustomSkeleton from '../components/CustomSkeleton'

export default function Lesson() {
  const [lesson, setLesson] = useState(null)
  const [topics, setTopics] = useState([])
  let params = useParams()
  let navigate = useNavigate()

  const overviewURL = `api/lessons/${params.lessonId}?fields[0]=Title&fields[1]=Description&populate[Content][populate][Media][fields][0]=url&populate[topics][fields][0]=id&populate[topics][fields][0]=Title`

  useEffect(() => {
    fetchLessonInfo().catch(console.error)
  }, [])

  const fetchLessonInfo = async () => {
    let response = await Api.get(overviewURL)
    let topics = response.data.topics

    // fetch topic status
    let topicStatusEntries = topics.map(async topic => {
      let endpoint = `api/user-topic-states?filters[$and][0][users_permissions_user][id][$eq]=${Auth.getUserIdFromJWT()}&filters[$and][1][topic][id][$eq]=${topic.id}`
      return await Api.get(endpoint)
    })

    for (let i = 0; i < topics.length; i++) {
      let progress = await topicStatusEntries[i]
      topics[i].done = progress.data.length > 0 ? progress.data[0].done : false
    }

    setLesson(response.data)
    setTopics(topics)
  }

  const topicClickHandler = (topicId) => {
    navigate(`/courses/${params.courseId}/lessons/${params.lessonId}/topics/${topicId}`)
  }

  return (
    <>
      <Header/>
      <main>
        {lesson !== null ?
          <>
            <h1>{lesson.Title}</h1>
            <div className={[styles.course, styles.overview].join(' ')}>
              <div className={styles.header}>
              </div>
              <div className={styles.description}>
                <p>{lesson.Description.length ? lesson.Description : ''}</p>
              </div>
            </div>
            <div className={styles.lessonsContainer}>
              <h2 className={styles.lessonsHeader}>Topics</h2>
              <div className={styles.lessonsWrapper}>
                {topics.length > 0 ? topics.map((topic, index) =>
                  <div
                    key={topic.Title + index}
                    className={styles.lesson}
                    id={`topic-${topic.id}`}
                    onClick={() => topicClickHandler(topic.id)}
                  >
                    <h3>{topic.Title}</h3>
                    <div
                      className={styles.lessonsDone}
                      style={{ backgroundColor: `${topic.done ? 'rgba(0,255,0,.7)' : 'none'}` }}
                    />
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
