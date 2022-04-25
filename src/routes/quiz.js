import { useParams } from 'react-router'

export default function Quiz() {
  let params = useParams()

  return (
    <>
      <h1>Quiz id {params.quizId}</h1>
    </>
  )
}
