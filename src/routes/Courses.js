import { useEffect, useState } from 'react'
import Api from '../util/api'
import Skeleton from '@mui/material/Skeleton'
import Course from '../components/Course'
import styles from '../styles/routes/Courses.module.css'

export default function Courses() {
  const [allCourses, setAllCourses] = useState([])
  const [userCourses, setUserCourses] = useState([])

  
  useEffect(() => {
    fetchCourses().catch(console.error)
  }, [])


  const fetchCourses = async () => {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    const courses = await Api.get('ldlms/v2/sfwd-courses')
    const courseUsers = await Api.get('ldlms/v2/users', user.id, `courses`)
    console.log('c', courses)
    console.log('c', courseUsers)
    setAllCourses(courses)
  }


  return (
    <>
      <main className={styles.main}>
        <h1>Courses</h1>
        <section className={styles.courses}>
          {allCourses.length > 0
            ? allCourses.map((course, index) =>
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
            </>
          }
        </section>
      </main>
    </>
  )
}
