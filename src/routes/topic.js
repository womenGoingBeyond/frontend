import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Api from '../util/api'
import styles from '../styles/components/Course.module.css'
import Header from '../components/Header'
import { Button } from '@mui/material'
import Auth from '../util/auth'

export default function Topic() {
  const [topic, setTopic] = useState(null)
  const [htmlElements, setHtmlElements] = useState('')
  const [isTopicCompleted, setIsTopicCompleted] = useState(false)
  const [progressId, setProgressId] = useState(NaN)
  let params = useParams()

  const infoURL = `api/topics/${params.topicId}?populate[Content][populate][Media][fields][0]=url`
  const cmsURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_LMS_DOMAIN : process.env.REACT_APP_DEV_LMS_DOMAIN
  const mediaTypes = new Map([['jpg', 'img'], ['jpeg', 'img'], ['png', 'img'], ['gif', 'img'], ['webp', 'img'], ['mp4', 'video'], ['mp3', 'audio']])


  useEffect(() => {
    fetchTopicInfo()
      .then(async topic => {
        let progress = await Api.get(`api/user-topic-states?filters[$and][0][users_permissions_user][id][$eq]=${Auth.getUserIdFromJWT()}&filters[$and][1][topic][id][$eq]=${topic.id}`)

        setProgressId(progress.data[0].id)
        setIsTopicCompleted(progress.data[0].done)
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
        mediaData.src = content.URL ? content.URL : `${cmsURL}${content.Media.url}`
        mediaData.alt = content.Caption ? content.Caption : ''
        let splitURL = mediaData.src.split('.')
        let mediaType = mediaTypes.get(splitURL[splitURL.length - 1])
        elements.push(richEditor[mediaType].generate(mediaData))
      }
    }
    return elements
  }

  const markTopicAsDone = async () => {
    let updatedProgress = await Api.put(`api/user-topic-states/${progressId}`, {
      data: { 'done': true }
    })
    console.log('d', updatedProgress)
    setIsTopicCompleted(true)
  }

  return (
    <>
      <Header/>
      <main>
        {topic !== null ? <h1 className={styles.topicHeader}>{topic.Title}</h1> : null}
        {htmlElements.length > 0 ?
          <div
            className={styles.topicContainer}
            dangerouslySetInnerHTML={{ __html: htmlElements }}
          />
          : null
        }
        <Button
          variant="contained"
          children={isTopicCompleted ? 'Done' : 'Complete'}
          sx={{ marginTop: '4rem' }}
          disabled={isTopicCompleted}
          onClick={markTopicAsDone}
        />
      </main>
    </>
  )
}