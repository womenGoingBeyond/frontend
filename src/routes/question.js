import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/components/Course.module.css'
import Api from '../util/api'
import Header from '../components/Header'
import { Alert, Button, Snackbar } from '@mui/material'
import CustomSkeleton from '../components/CustomSkeleton'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomButton from '../components/CustomButton'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import { useTranslation } from 'react-i18next'
import Auth from '../util/auth'

export default function Question() {
  const [question, setQuestion] = useState(null)
  const [quiz, setQuiz] = useState("")
  const [answerValue, setAnswerValue] = useState("")
  const [answerState, setAnswerState] = useState({ isSubmitted: false, isCorrect: false })
  const [snackbarObject, setSnackbarObject] = useState({ open: false, message: '', severity: '' })
  const {t, i18n} = useTranslation()

  let params = useParams(), navigate = useNavigate()
  let infoURL = `api/quizzes/${params.quizId}/questions/${params.questionId}?locale=${i18n.language}`
  let questionsOverviewURL = `api/quizzes/${params.quizId}/questions?locale=${i18n.language}`

  useEffect(() => {
    Api.get(infoURL)
      .then(data => {
        setQuestion(data)
        setAnswerState({ isSubmitted: !!data, isCorrect: data.state })
        data.answers.map((answer, index) => {
            if(answer.id == data.provided_answer_ids[0]){
              setAnswerValue(`answer-${index}`)
            }
          })
      })
      .catch(console.error)
      Api.get(questionsOverviewURL)
      .then(quiz => {
        setQuiz(quiz.data.title)
      })
      .catch(console.error)
  }, [])

  const handleClick = event => {
    setAnswerValue(event.currentTarget.value)
    // console.log(event.currentTarget.value);
  };


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

    //console.log(`api/quizzes/${params.quizId}/questions/${params.questionId}/validate`)
    let response = await Api.post(`api/quizzes/${params.quizId}/questions/${params.questionId}/validate`, {
      'answer_ids': states
    })


    if (response) {
      if(response.data.state){
        handleSnackbar({ open: true, message: t('correctAnswerMessage'), severity: 'success' })

        let apiEndpoint = `api/user-course-progresses/${params.courseId}` 
        const fetchCourseStatus = await Api.get(apiEndpoint)

        let apiEndpoint2 = `api/user-lesson-states?filters[$and][0][users_permissions_user][id][$eq]=${Auth.getUserIdFromJWT()}&filters[$and][1][lesson][id][$eq]=${params.lessonId}`
        const fetchLessonStatus = await Api.get(apiEndpoint2)

        if(fetchLessonStatus.data != null && fetchLessonStatus.data[0].done){
        //   //lesson done

        //   // get lesson numbers and finished lessons in course
        //   //redirect to lesson complete with course complete value
            navigate(`/completedlesson/`, {
              state: {
                finishedCourse: (fetchCourseStatus.data[0].progress == 1),
                params: params
              }
            })
        //   fetchCourseStatus.data[0].progress == 1
        }

      }else{
        handleSnackbar({ open: true, message: t('wrongAnswerMessage'), severity: 'error' })
      }
      setAnswerState({ isSubmitted: !!response, isCorrect: response.data.state })
    } else {
      // check if backSync is active
      let swRegistration = await navigator.serviceWorker.ready
      let tags = await swRegistration.sync.getTags()

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

  /**
   * The **handleSnackbar** function is a template for setting the _snackbarObject_ state.
   *
   * @param {boolean} open triggers the open or the close state of snackbar
   * @param {string} message the message to be shown in UI
   * @param {string} severity kind of message
   */
   function handleSnackbar({ open, message, severity }) {
    setSnackbarObject({ open, message, severity })
  }

  const handleCloseSnackbar = () => setSnackbarObject({ open: false, message: '', severity: '' })

  return (
    <> 
    <Header isSubpage="true" title={quiz} goBackPath={`/courses/${params.courseId}/lessons/${params.lessonId}/quizzes/${params.quizId}`}/> 
      <main>
        {question ?
          <>
            <div className={styles.quizContainer}>
              <h3 className={styles.quizQuestion}>{question.question}</h3>
              <div className={styles.quizAnswers}>
              {question.type === 'single' ?  
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="check"
                    value={answerValue}
                    onChange={handleClick}
                >
                          
                {question.answers.map((answer, index) =>
                          <div
                            key={answer + index}
                            className={styles.quizAnswer}
                            id={`answer-${answer.id}`}
                          > 
                          

                  <FormControlLabel value={`answer-${index}`} 
                  
                  control={
                  <Radio 
                  id={`answer-${index}`}
                  name="check"
                  sx={{
                    color: "#666",
                    '&.Mui-checked': {
                      color: "#ce6328",
                    },
                  }}
                  />
                  } label={answer.content} />
                                  </div>
                )}
                </RadioGroup>
  
              : 
              <FormGroup>
                  {question.answers.map((answer, index) =>
                    <div
                      key={answer + index}
                      className={styles.quizAnswer}
                      id={`answer-${answer.id}`}
                    >
                      <FormControlLabel control={<Checkbox
                      id={`answer-${index}`}
                      name="check"
                      defaultChecked={question.provided_answer_ids.includes(answer.id)}
                  sx={{
                    color: "#666",
                    '&.Mui-checked': {
                      color: "#ce6328",
                    },
                  }}
                />} label={answer.content} />
                    </div>
                  )}
              </FormGroup>
              }  

              
              </div>
            </div>
        <CustomButton 
        style={{ marginTop:"40px", width: "100%"}}
        children={answerState.isCorrect ? `${t("nextQuestion")}` : `${t("submitAnswers")}`}
        customBGColor={answerState.isCorrect ? '#009900' : ''}
        onClick={answerState.isCorrect ? backToQuizOverview : validateAnswer}
          />

   
          </>
          :
          <CustomSkeleton/>
        }
          <Snackbar
            open={snackbarObject.open}
            autoHideDuration={5000}
            style={{marginTop:"60px"}}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
        
      </main>
    </>
  )
}
