import {useEffect, useState} from 'react'
import Api from '../util/api'
import Skeleton from '@mui/material/Skeleton'
import Course from '../components/Course'
import styles from '../styles/routes/courses.module.css'
import Auth from "../util/auth";

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [currentCourse, setCurrentCourse] = useState([])

  useEffect(() => {
    fetchCourses()
  }, [])

  function fetchCourses() {
    const allCourses = Api.get('api/courses',
      `${composeCourseFieldSelection(['title', 'description'])}&sort[0]=id`)
    const userCourses = Api.get('api/courses',
      `?populate=[users]&filters[users][id][$eq]=${Auth.getUserIdFromJWT()}`)

    /* For now the requirement is to enroll only one course at the same time*/
    Promise.allSettled([allCourses, userCourses])
      .then(results => {
        results[0].status === 'fulfilled' && setCourses(results[0].value.data)
        results[1].status === 'fulfilled' && setCurrentCourse(results[1].value.data[0])
      })
      .catch(console.error)
  }

  /**
   *
   * @param {array<string>} fields
   * @return {string}
   */
  function composeCourseFieldSelection(fields = []) {
    if (fields.length === 0) return ''

    let param = '?'
    for (let i = 0; i < fields.length; i++) {
      param += `fields[${i}]=${fields[i]}&`
    }
    return param.slice(0, -1)
  }

  return (
    <>
      <main className={styles.main}>
        <h1>Courses</h1>
        <section className={styles.courses}>
          {courses.length > 0
            ? courses.map((course, index) =>
              <Course course={course} keyValue={index} key={'courses' + index}/>
            )
            : <>
              <Skeleton
                sx={{bgcolor: 'grey.300', width: '90%', height: '150px', mb: '1rem'}}
                variant="rectangular"
              />
              <Skeleton
                sx={{bgcolor: 'grey.300', width: '90%', height: '150px'}}
                variant="rectangular"
              />
              <Skeleton
                sx={{bgcolor: 'grey.300', width: '90%', height: '150px'}}
                variant="rectangular"
              />
            </>
          }
        </section>
      </main>
    </>
  )
}
