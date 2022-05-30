import { useEffect, useState } from 'react'
import Api from '../util/api'
import Category from '../components/Category'
import styles from '../styles/routes/courses.module.css'
import mainStyles from '../styles/main.module.css'
import Auth from '../util/auth'
import Header from '../components/Header'
import CustomSkeleton from '../components/CustomSkeleton'

export default function Categories() {
  const [categories, setCategories] = useState([]) 

  const allCoursesAPIEndpoint = `api/categories?populate[category][fields][0]=name&populate[category][fields][1]=color
    &sort[0]=id`.replaceAll(' ', '')

  useEffect(() => {
    fetchCategories()
    init().catch(console.error)
  }, [])

  async function init() {

    if (Notification.permission === 'default') {
      let permission = await Notification.requestPermission()
      if (permission === 'granted') {
        showDummyNotification()
      }
    }
  }

  function fetchCategories() {
    const allCourses = Api.get(allCoursesAPIEndpoint)

    /* For now the requirement is to enroll only one course at the same time */
    Promise.allSettled([allCourses])
      .then(results => {
          console.log(results)
        results[0].status === 'fulfilled' && setCategories(results[0].value.data)
      })
      .catch(console.error)
  }

  function showDummyNotification() {
    new Notification('Hi there 👋', {
      body: 'The notification is activated'
    })
  }

  return (
    <>
      <Header title="Category"/>
      <main>
        <div className={mainStyles.titleText}>Category</div>
        <section className={styles.courses}>
          {categories.length > 0
            ? categories.map((category, index) =>
              <Category
                category={category}
                keyValue={index}
                key={'categories' + index} 
              />
            )
            :
            <CustomSkeleton amount={3}/>
          }
        </section>
      </main>
    </>
  )
}
