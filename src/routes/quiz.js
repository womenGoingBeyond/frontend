import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import Header from '../components/Header'
import CustomSkeleton from '../components/CustomSkeleton'
import styles from '../styles/components/Course.module.css'

export default function Quiz() {
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
      <Header/>
      <main>
        {quiz ?
          <>
            <h1>{quiz.title}</h1>
            <div className={styles.quizContainer}>
              {quiz.questions.length > 0 ? quiz.questions.map((question, index) =>
                  <div
                    key={question.id + index}
                    className={styles.lesson}
                    id={`topic-${question.id}`}
                    onClick={() => navigateToQuestion(question.id)}
                  >
                    <h3>Question {index + 1}</h3>
                    <div
                      className={styles.lessonsDone}
                      style={{ backgroundColor: `${question.state ? 'rgba(0,255,0,.7)' : 'none'}` }}
                    />
                  </div>
                )
                : null}
            </div>
          </>
          :
          <CustomSkeleton/>
        }
      </main>
    </>
  )
}
