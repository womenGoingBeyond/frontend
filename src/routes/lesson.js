import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import Header from '../components/Header'
import styles from '../styles/components/Course.module.css'
import CustomSkeleton from '../components/CustomSkeleton'
import { useTranslation } from 'react-i18next';

export default function Lesson() {
  const [lesson, setLesson] = useState(null)
  const [topics, setTopics] = useState([])
  const [quizzes, setQuizzes] = useState([])
  let params = useParams()
  let navigate = useNavigate()
  const {t, i18n} = useTranslation()

  const overviewURL = `api/lessons/${params.lessonId}?locale=${i18n.language}&fields[0]=Title&fields[1]=Description&populate[Content][populate][Media][fields][0]=url&populate[topics][fields][0]=id&populate[topics][fields][0]=Title`
  const quizzesRequestURL = `api/lessons/${params.lessonId}/quizzes?locale=${i18n.language}`

  useEffect(() => {
    fetchLessonInfo().catch(console.error)
  }, [])

  const fetchLessonInfo = async () => {
    let overviewPromise = Api.get(overviewURL)
    let quizzesPromise = Api.get(quizzesRequestURL)
    let responses = await Promise.allSettled([overviewPromise, quizzesPromise])

    let promisesStatusIsFulfilled = responses.filter(r => r.status === 'fulfilled')
    if (promisesStatusIsFulfilled.length === 0) {
      return
    }

    let topics = responses[0].value.data.topics

    // fetch and set topic status
    let topicStatusEntries = await Promise.allSettled(topics.map(async topic => Api.get(`api/topics/${topic.id}/status`)))
    for (let entry of topicStatusEntries) {
      if (entry.status === 'fulfilled') {
        for (let topic of topics) {
          if (Object.keys(entry.value).length !== 0 && entry.value.data.topic.id === topic.id) {
            topic.done = entry.value.data.done
          }
        }
      }
    }

    if (responses[1].value.data.length > 0) {
      let quizProgresses = await Promise.allSettled(responses[1].value.data.map(quiz => {
        return Api.get(`api/quizzes/${quiz.id}/progress`)
      }))
      for (let quizProgress of quizProgresses) {
        if (quizProgress.status === 'fulfilled' && quizProgress.value.length > 0) {
          for (let quiz of responses[1].value.data) {
            if (quiz.id === quizProgress.value[0].quiz.id) {
              quiz.progress = quizProgress.value[0].progress
            }
          }
        }
      }
    }

    setLesson(responses[0].value.data)
    setTopics(topics)
    setQuizzes(responses[1].value.data)
  }

  const topicClickHandler = (topicId) => {
    navigate(`/courses/${params.courseId}/lessons/${params.lessonId}/topics/${topicId}`)
  }
  const quizClickHandler = (quizId) => {
    navigate(`/courses/${params.courseId}/lessons/${params.lessonId}/quizzes/${quizId}`)
  }

  return (
    <>

{lesson !== null ?
    <Header title={lesson.Title} isSubpage="true" goBackPath={`/courses/${params.courseId}`}/>
    : null
}
      <main>
        {lesson !== null ?
          <>
            <div className={[styles.course, styles.overview].join(' ')}>
           
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
                    <div>{topic.Title}</div>
                    <div
                      className={styles.lessonsDone}
                      style={{ backgroundColor: `${topic.done ? 'rgba(0,255,0,.7)' : 'none'}` }}
                    />
                  </div>
                ) : null}
              </div>
              {quizzes.length > 0 ?
                <>
                  <h2 className={styles.lessonsHeader}>Quizzes</h2>
                  <div className={styles.lessonsWrapper}>
                    {quizzes.map((quiz, index) =>
                      <div
                        key={quiz.title + index}
                        className={styles.lesson}
                        style={{ display: 'flex', justifyContent: 'space-between' }}
                        id={`quiz-${quiz.id}`}
                        onClick={() => quizClickHandler(quiz.id)}
                      >
                        <div>{quiz.title}</div>
                        <p>{(+(quiz.progress) * 100) || 0}%</p>
                      </div>
                    )}
                  </div>
                </>
                : null}
            </div>
          </>
          :
          <CustomSkeleton amount={2}/>
        }
      </main>
    </>
  )
}
