import { useParams } from 'react-router'

export default function Course() {
  let params = useParams()

  return (
    <>
      <h1>Course number {params.courseId}</h1>
    </>
  )
}
