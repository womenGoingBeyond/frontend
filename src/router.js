import { Route, Routes } from 'react-router-dom'
import App from './App'
import Login from './routes/login'
import ResetPass from './routes/resetpass'
import Courses from './routes/courses'
import Register from './routes/register'
import Categories from './routes/categories'
import Course from './routes/course'
import AuthMiddleware from './components/AuthMiddleware'
import Lesson from './routes/lesson'
import Topic from './routes/topic'
import Profile from './routes/profile'
import Settings from './routes/settings'
import Quiz from './routes/quiz'
import MyClasses from './routes/myclasses'
import Question from './routes/question'
import Welcome from './routes/welcome'
import CompletedLesson from './routes/completedlesson'
import CompletedLessons from './routes/completedlessons'
import Navigation from './Navigation';
import LoadingProvider from "./components/LoadingContext"; /// import loader hook

export default function router() { 
  return (
    <LoadingProvider>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="resetpass" element={<ResetPass/>}/>
      <Route path="welcome" element={<Welcome/>}/>
      <Route path={'myclasses'} element={<AuthMiddleware><MyClasses/><Navigation /></AuthMiddleware>}/>
      <Route path={'completedlesson'} element={<AuthMiddleware><CompletedLesson/><Navigation /></AuthMiddleware>}/>
      <Route path={'completedlessons'} element={<AuthMiddleware><CompletedLessons/><Navigation /></AuthMiddleware>}/>
      <Route path={'profile'} element={<AuthMiddleware><Profile/><Navigation /></AuthMiddleware>}/>
      <Route path={'settings'} element={<AuthMiddleware><Settings/><Navigation /></AuthMiddleware>}/>
      <Route path={'categories'} element={<AuthMiddleware><Categories/><Navigation /></AuthMiddleware>}/>
      <Route path={'courses'} element={<AuthMiddleware><Courses/><Navigation /></AuthMiddleware>}/>
      <Route path={'courses/:courseId'} element={<AuthMiddleware><Course/><Navigation /></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId'} element={<AuthMiddleware><Lesson/><Navigation /></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId/topics/:topicId'} element={<AuthMiddleware><Topic/><Navigation /></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId/quizzes/:quizId'} element={<AuthMiddleware><Quiz/><Navigation /></AuthMiddleware>}/>
      <Route path={'courses/:courseId/lessons/:lessonId/quizzes/:quizId/questions/:questionId'}
             element={<AuthMiddleware><Question/><Navigation /></AuthMiddleware>}
      />
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
    </LoadingProvider>
  )
}

// courses (list all courses)
//    courses/:courseId/ (list course with courseId and all his lessons)
//        lessons/:lessonIs (list lesson with the lessonId and all his topics and quizzes)
//            topics/:topicsId  (display topic with the topicId)
//            quizzes/:quizId/questions/questionId   (display quiz with the quizId)
//                questions/questionId  (display question with questionId)
