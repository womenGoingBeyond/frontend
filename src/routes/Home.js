import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const TYPE = 'sfwd-courses'
    const URL = `${process.env.REACT_APP_WP_DOMAIN}/${process.env.REACT_APP_LD_EXT}/${TYPE}`

    fetch(URL, {
      mode: 'no-cors'
    })
      .then(response => response.json())
      .then(data => {
        for (const course of data) {
          console.log('course', course)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <></>
  )
}
