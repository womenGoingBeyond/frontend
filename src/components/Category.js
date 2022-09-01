import PropTypes from 'prop-types'
import styles from '../styles/components/Category.module.css'
import { useNavigate } from 'react-router'

export default function Category({ category, keyValue }) {
  const navigate = useNavigate()

//   useEffect(() => {
//     fetchCategories()
//     init().catch(console.error)
//   }, [])

function showCoursesForCategory (){
    navigate(`/courses/`, {
      state: category.id,
    })
}

  return (
    <>
        <div
          id={`category-${category.id}`}
          className={styles.category}
          key={keyValue}
          style={{ backgroundColor: category.Color || '#aaa' }}
          onClick={showCoursesForCategory}
        >
          <h3>{category.Name}</h3>
          <p>{category.description}</p>
        </div>
    </>
  )
}

Category.propTypes = {
  category: PropTypes.object.isRequired,
  keyValue: PropTypes.number
}
