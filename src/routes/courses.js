import { useEffect, useState } from 'react'
import Api from '../util/api'
import Skeleton from '@mui/material/Skeleton'
import Course from '../components/Course'
import styles from '../styles/routes/courses.module.css'
import Auth from '../util/auth'
import Header from '../components/Header'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [userCourseIds, setUserCourseIds] = useState([])

  const allCoursesAPIEndpoint = `api/courses?populate[category][fields][0]=name&populate[category][fields][1]=color
    &populate[Content][populate][Media][fields][0]=url&sort[0]=id`.replaceAll(' ', '')
  const userCoursesAPIEndpoint = `api/courses?fields[0]=id&populate=[users]&filters[users][id][$eq]=${Auth.getUserIdFromJWT()}`

  useEffect(() => {
    fetchCourses()
  }, [])

  function fetchCourses() {
    const allCourses = Api.get(allCoursesAPIEndpoint)
    const userCourses = Api.get(userCoursesAPIEndpoint)

    /* For now the requirement is to enroll only one course at the same time */
    Promise.allSettled([allCourses, userCourses])
      .then(results => {
        let _userCourseIds = []

        if (results[1].status === 'fulfilled') {
          for (let course of results[1].value.data) {
            _userCourseIds.push(course.id)
          }
        }

        results[0].status === 'fulfilled' && setCourses(results[0].value.data)
        setUserCourseIds(_userCourseIds)
      })
      .catch(console.error)
  }

  return (
    <>
      <Header/>
      <main className={styles.main}>
        <h1>Courses</h1>
        <section className={styles.courses}>
          {courses.length > 0
            ? courses.map((course, index) =>
              <Course
                course={course}
                keyValue={index}
                key={'courses' + index}
                userCourse={userCourseIds.includes(course.id)}
                cacheName={`${userCoursesAPIEndpoint}`}
              />
            )
            : <>
              <Skeleton
                sx={{ bgcolor: 'grey.300', width: '90%', height: '150px', mb: '1rem' }}
                variant="rectangular"
              />
              <Skeleton
                sx={{ bgcolor: 'grey.300', width: '90%', height: '150px' }}
                variant="rectangular"
              />
              <Skeleton
                sx={{ bgcolor: 'grey.300', width: '90%', height: '150px' }}
                variant="rectangular"
              />
            </>
          }
        </section>
      </main>
    </>
  )
}
