import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/components/Course.module.css'
import Api from '../util/api'
import Header from '../components/Header'
import { Alert, Button, Snackbar } from '@mui/material'
import CustomSkeleton from '../components/CustomSkeleton'

export default function Question() {
  const [question, setQuestion] = useState(null)
  const [answerState, setAnswerState] = useState({ isSubmitted: false, isCorrect: false })
  const [notificationPermitted, setNotificationPermitted] = useState(Notification.permission === 'granted')
  const [snackbarObject, setSnackbarObject] = useState({ open: false, message: '', severity: '' })

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

    if (response) {
      setAnswerState({ isSubmitted: !!response, isCorrect: response.data.state })
    } else {
      // check if backSync is active
      let swRegistration = await navigator.serviceWorker.ready
      let tags = await swRegistration.sync.getTags()
      for (let tag of tags) {
        if (tag.includes(`QUESTION_${params.questionId}_ANSWERED`)) {
          showNotification({ body: 'There is no connectivity. But dont worry we take care of it 😉' })
            .catch(console.error)
          break
        }
      }

      // check for downloaded course, if yes, simulate the completed topic
      const hasCache = await caches.has(`dl-course-${params.courseId}`)
      if (hasCache) {
        // TODO: simulate the completed topic and recalculate the lesson status and course progress
        navigate(`/courses/${params.courseId}/lessons/${params.lessonId}`)
      }
    }
  }

  const backToQuizOverview = () => {
    navigate(`/courses/${params.courseId}/lessons/${params.lessonId}/quizzes/${params.quizId}`)
  }

  const showNotification = async ({ title = 'Hi there 👋', body }) => {
    // check for notification, if allowed, notify otherwise show snackbar
    let notificationPermission = Notification.permission
    if (notificationPermission === 'default') {
      let permission = await Notification.requestPermission()
      // Try to get the permission from user
      if (permission === 'granted') {
        setNotificationPermitted(true)
        let notification = new Notification(title, { body })
        notification.addEventListener('click', (event) => {
          event.preventDefault()
        })
        return
      } else {
        setSnackbarObject({ open: true, message: body, severity: 'success' })
      }
    }

    if (notificationPermitted) {
      let notification = new Notification(title, { body })
      notification.addEventListener('click', (event) => {
        event.preventDefault()
        console.log('click on notification')
      })
    } else {
      setSnackbarObject({ open: true, message: body, severity: 'success' })
    }
  }

  const handleCloseSnackbar = () => setSnackbarObject({ open: false, message: '', severity: '' })

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
        {notificationPermitted ? null :
          <Snackbar
            open={snackbarObject.open}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              variant="filled"
              severity={snackbarObject.severity}
              sx={{ width: '100%' }}
              children={snackbarObject.message}
            />
          </Snackbar>
        }
      </main>
    </>
  )
}
