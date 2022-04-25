import { useParams } from 'react-router'

export default function Lesson() {
  let params = useParams()

  return (
    <>
      <h1>Lesson id {params.lessonId}</h1>
    </>
  )
}
