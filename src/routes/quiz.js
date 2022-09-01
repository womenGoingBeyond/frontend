import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import Header from '../components/Header'
import CustomSkeleton from '../components/CustomSkeleton'
import styles from '../styles/components/Course.module.css'
import { useTranslation } from 'react-i18next'

export default function Quiz() {
  const {t, i18n} = useTranslation()
  const [quiz, setQuiz] = useState(null)
  let params = useParams(), navigate = useNavigate()
  let questionsOverviewURL = `api/quizzes/${params.quizId}/questions`
  

  useEffect(() => {
    Api.get(questionsOverviewURL)
      .then(quiz => {
        setQuiz(quiz.data)
      })
      .catch(console.error)
  }, [])

  const navigateToQuestion = (questionId) => {
    navigate(`/courses/${params.courseId}/lessons/${params.lessonId}/quizzes/${params.quizId}/questions/${questionId}`)
  }

  return (
    <>
    
{quiz !== null ? 
    <Header isSubpage="true" title={quiz.title}/>
    :null
    }
      <main>
        {quiz ?
          <>
            <div className={styles.quizContainer}>
                    <div className={styles.lessonsWrapper}>
              {quiz.questions.length > 0 ? quiz.questions.map((question, index) =>
                  <div
                    key={question.id + index}
                    className={styles.lesson}
                    id={`topic-${question.id}`}
                    onClick={() => navigateToQuestion(question.id)}
                  >
                    <div>{t("questionTopic")} {index + 1}</div>
                    <div
                      className={styles.lessonsDone}
                      style={{ backgroundColor: `${question.state ? 'rgba(0,255,0,.7)' : 'none'}` }}
                    />
                  </div>
                )
                : null}
                </div>
            </div>
          </>
          :
          <CustomSkeleton/>
        }
      </main>
    </>
  )
}
