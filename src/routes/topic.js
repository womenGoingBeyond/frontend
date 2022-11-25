import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import styles from '../styles/components/Course.module.css'
import Header from '../components/Header'
import { Alert, Button, Snackbar } from '@mui/material'
import CustomSkeleton from '../components/CustomSkeleton'
import { useTranslation } from 'react-i18next'
import Auth from '../util/auth'

export default function Topic() {
  const [topic, setTopic] = useState(null)
  const [htmlElements, setHtmlElements] = useState('')
  const [isTopicCompleted, setIsTopicCompleted] = useState(false) 
  const [snackbarObject, setSnackbarObject] = useState({ open: false, message: '', severity: '' })
  const {t, i18n} = useTranslation()

  let params = useParams()
  let navigate = useNavigate()

  const infoURL = `api/topics/${params.topicId}?locale=${i18n.language}&populate[Content][populate][Media][fields][0]=url`
  const mediaTypes = new Map([
    ['jpg', 'img'], ['jpeg', 'img'], ['png', 'img'], ['gif', 'img'], ['webp', 'img'], ['mp4', 'video'], ['mp3', 'audio']
  ])
  useEffect(() => {
    fetchTopicInfo()
      .then(async topic => {
        let status = await Api.get(`api/topics/${params.topicId}/status?locale=${i18n.language}&`)
        setIsTopicCompleted(status.data ? status.data.done : false)
        setTopic(topic)
        setHtmlElements(generateHTMLFromContent(topic.Content).join(''))
      })
      .catch(console.error)
  }, [])

  const fetchTopicInfo = async () => {
    let response = await Api.get(infoURL)
    return response.data
  }

  const richEditor = {
    header: {
      generate: function (data) {
        return `<h${data.level}>${data.text}</h${data.level}>`
      }
    },
    paragraph: {
      generate: function (data) {
        return `<p>${data.text}</p>`
      }
    },
    list: {
      generate: function (data) {
        let rawHTML = `<${data.style.includes('unordered') ? 'ul' : 'ol'}>`
        if (data.items.length) {
          for (let item of data.items) {
            rawHTML += `<li>${item}</li>`
          }
        }
        rawHTML += `</${data.style.includes('unordered') ? 'ul' : 'ol'}>`
        return rawHTML
      }
    },
    img: {
      generate: function (data) {
        return `<img src=${data.src} alt=${data.alt}>`
      }
    },
    audio: {
      generate: function (data) {
        return `<audio src=${data.src} controls crossorigin="anonymous"></audio>`
      }
    },
    video: {
      generate: function (data) {
        return `<video src=${data.src} width="320" height="240" controls crossorigin="anonymous"></video>`
      }
    }
  }

  const generateHTMLFromContent = (contents) => {
    let elements = [], mediaData = {}
    for (let content of contents) {
      if (content.__component.includes('paragraph')) {
        let text = JSON.parse(content.Content)
        for (let block of text.blocks) {
          elements.push(richEditor[block.type].generate(block.data))
        }
      } else if (content.__component.includes('media')) {
        mediaData.src = content.URL ? content.URL : content.Media.url
        mediaData.alt = content.Caption ? content.Caption : ''
        let splitURL = mediaData.src.split('.')
        let mediaType = mediaTypes.get(splitURL[splitURL.length - 1])
        elements.push(richEditor[mediaType].generate(mediaData))
      }
    }
    return elements
  }

  const markTopicAsDone = async () => {
    let response = await Api.post(`api/topics/${params.topicId}/complete?locale=${i18n.language}`, {
      data: { 'done': true }
    })


    if (response) {
      navigate(`/courses/${params.courseId}/lessons/${params.lessonId}`)
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

 
          let apiEndpoint = `api/user-course-progresses/${params.courseId}` 
          const fetchCourseStatus = await Api.get(apiEndpoint)
 
          let apiEndpoint2 = `api/user-lesson-states?filters[$and][0][users_permissions_user][id][$eq]=${Auth.getUserIdFromJWT()}&filters[$and][1][lesson][id][$eq]=${params.lessonId}`
          const fetchLessonStatus = await Api.get(apiEndpoint2)
          // console.log(params.lessonId);

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
          }







  }


  const handleCloseSnackbar = () => setSnackbarObject({ open: false, message: '', severity: '' })

  return (
    <>

{topic !== null ? 
    <Header isSubpage="true" title={topic.Title}/>
    :null
    }
      <main>
        {/* {topic !== null ? <h1 className={styles.topicHeader}>{topic.Title}</h1> : null} */}
        {htmlElements.length > 0 ?
          <>
            <div
              className={styles.topicContainer}
              dangerouslySetInnerHTML={{ __html: htmlElements }}
            />
            <Button
              variant="contained"
              children={isTopicCompleted ? `${t("topicDoneButton")}` : `${t("topicCompleteButton")}` }
              sx={{ marginTop: '2rem' }}
              disabled={isTopicCompleted}
              onClick={markTopicAsDone}
            />
          </>
          :
          <CustomSkeleton amount={2}/>
        }
      </main>
    </>
  )
}
