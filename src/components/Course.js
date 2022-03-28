import PropTypes from 'prop-types'
import styles from '../styles/components/Course.module.css'

export default function Course({course, keyValue}) {
  return (
    <div className={styles.course} key={keyValue}>
      <div>
        <h4>{course.title.rendered}</h4>
        <div dangerouslySetInnerHTML={{__html: course.content.rendered}}/>
      </div>
    </div>
  )
}

Course.propTypes = {
  course: PropTypes.object.isRequired,
  keyValue: PropTypes.number
}
