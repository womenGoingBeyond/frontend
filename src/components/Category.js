import PropTypes from 'prop-types'
import styles from '../styles/components/Course.module.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import DownloadIcon from '@mui/icons-material/Download'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone'
import DeleteIcon from '@mui/icons-material/Delete'

export default function Category({ category, keyValue }) {
  const navigate = useNavigate()

//   useEffect(() => {
//     fetchCategories()
//     init().catch(console.error)
//   }, [])


  return (
    <>
        <div
          id={`category-${category.id}`}
          className={styles.category}
          key={keyValue}
          style={{ backgroundColor: category.Color || '#aaa' }}
        //   onClick={showMoreHandler}
        >
          <h4>{category.Name}</h4>
        </div>
    </>
  )
}

Category.propTypes = {
  category: PropTypes.object.isRequired,
  keyValue: PropTypes.number
}
