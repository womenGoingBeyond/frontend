import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/components/Course.module.css'
import Api from '../util/api'
import Header from '../components/Header'
import { Button } from '@mui/material'
import CustomSkeleton from '../components/CustomSkeleton'

export default function Question() {
  const [question, setQuestion] = useState(null)
  const [answerState, setAnswerState] = useState({ isSubmitted: false, isCorrect: false })

  let params = useParams(), navigate = useNavigate()
  let infoURL = `api/quizzes/${params.quizId}/questions/${params.questionId}`

  useEffect(() => {
    Api.get(infoURL)
      .then(data => {
        setQuestion(data)
      })
      .catch(console.error)
  }, [])

  const validateAnswer = async () => {
    let answers = document.querySelectorAll(`.${styles.quizAnswer}`),
      states = [], input

    for (let answer of answers) {
      input = answer.querySelector('input')
      if (input.checked) {
        states.push(+(answer.id.split('-')[1]))
      }
    }
    // User did not select anything
    if (states.length === 0) return

    let response = await Api.post(`api/quizzes/${params.quizId}/questions/${params.questionId}/validate`, {
      'answer_ids': states
    })
    setAnswerState({ isSubmitted: !!response, isCorrect: response.data.state })
  }

  const backToQuizOverview = () => {
    navigate(`/courses/${params.courseId}/lessons/${params.lessonId}/quizzes/${params.quizId}`)
  }

  return (
    <>
      <Header/>
      <main>
        {question ?
          <>
            <div className={styles.quizContainer}>
              <h2 className={styles.quizQuestion}>{question.question}</h2>
              <div className={styles.quizAnswers}>
                {question.answers.map((answer, index) =>
                  <div
                    key={answer + index}
                    className={styles.quizAnswer}
                    id={`answer-${answer.id}`}
                  >
                    <label htmlFor={`answer-${index}`}>{answer.content}</label>
                    <input
                      type={question.type === 'single' ? 'radio' : 'checkbox'}
                      id={`answer-${index}`}
                      name="check"
                      defaultChecked={question.provided_answer_ids.includes(answer.id)}
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="contained"
              children={answerState.isCorrect ? 'next' : 'submit'}
              color={answerState.isCorrect ? 'success' : 'primary'}
              type={'submit'}
              sx={{ marginTop: '2rem' }}
              onClick={answerState.isCorrect ? backToQuizOverview : validateAnswer}
            />
          </>
          :
          <CustomSkeleton/>
        }
      </main>
    </>
  )
}
