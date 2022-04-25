import { Route, Routes } from 'react-router-dom'
import App from './App'
import Login from './routes/login'
import Courses from './routes/courses'
import Register from './routes/register'
import Course from './routes/course'
import AuthMiddleware from './components/AuthMiddleware'
import Lesson from './routes/lesson'
import Topic from './routes/topic'
import Quiz from './routes/quiz'

export default function router() {
  return (
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path={'courses'} element={<AuthMiddleware><Courses/></AuthMiddleware>}/>
      <Route path={'courses/:courseId'} element={<AuthMiddleware><Course/></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId'} element={<AuthMiddleware><Lesson/></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId/topics/:topicId'} element={<AuthMiddleware><Topic/></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId/quizzes/:quizId'} element={<AuthMiddleware><Quiz/></AuthMiddleware>}/>
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  )
}

// courses (list all courses)
//    courses/:courseId/ (list all lessons)
//        lessons/:lessonIs (list all topics and quizzes)
//            topics/:topicsId  (display topic)
//            quizzes/:quizId   (display quiz)
