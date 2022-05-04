import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import Header from '../components/Header'
import CustomSkeleton from '../components/CustomSkeleton'
import styles from '../styles/components/Course.module.css'
import { Button } from '@mui/material'

export default function Quiz() {
  const [quiz, setQuiz] = useState(null)
  let params = useParams()

  let infoURL = `api/quizzes/${params.quizId}?populate=%2A`
  useEffect(() => {
    fetchQuizInfo()
      .then(data => {
        console.log('data:', data)
        setQuiz(data)
      })
      .catch(console.error)
  }, [])

  const fetchQuizInfo = async () => {
    let response = await Api.get(infoURL)
    return response.data
  }

  /**
   * @param {MouseEvent} event
   */
  const onlyOne = (event) => {
    // It can be used for another types for answering like multiple. The current state is only single answer.
    let checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
      if (item !== event.target) item.checked = false
    })
  }

  const sendRequest = () => {
    let answers = document.querySelectorAll(`.${styles.quizAnswer}`),
      states = [], input

    for (let answer of answers) {
      input = answer.querySelector('input')
      states.push({ id: +(answer.id.split('-')[1]), state: input.checked })
    }


    console.log(states)
  }

  return (
    <>
      <Header/>
      <main>
        {quiz ?
          <>
            <h1>{quiz.Title}</h1>
            <div className={styles.quizContainer}>
              <p className={styles.quizQuestion}>{quiz.question}</p>
              <div className={styles.quizAnswers}>
                {quiz.answers.map((answer, index) =>
                  <div
                    key={answer + index}
                    className={styles.quizAnswer}
                    id={`answer-${answer.id}`}
                  >
                    <label htmlFor={`answer-${index}`}>{answer.Content}</label>
                    <input type="checkbox" id={`answer-${index}`} name="check" onClick={onlyOne}/>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="contained"
              children={'submit'}
              type={'submit'}
              sx={{ marginTop: '2rem' }}
              onClick={sendRequest}
            />
          </>
          :
          <CustomSkeleton/>
        }

      </main>
    </>
  )
}
