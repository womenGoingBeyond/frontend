import { useParams } from 'react-router'

export default function Topic() {
  let params = useParams()

  return (
    <>
      <h1>Topic id {params.topicId}</h1>
    </>
  )
}
