import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import BottomNav from './components/BottomNav'
import TopBar from './components/TopBar'
import Mentor from './components/Mentor'
import Home from './pages/Home'
import Modules from './pages/Modules'
import Lesson from './pages/Lesson'
import Quiz from './pages/Quiz'
import Profile from './pages/Profile'
import Simulator from './pages/Simulator'
import Story from './pages/Story'
import RealityCheck from './pages/RealityCheck'
import QuizBattle from './pages/QuizBattle'
import Personality from './pages/Personality'
import BeforeAfter from './pages/BeforeAfter'

function AppRoutes() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/quiz/') || location.pathname === '/simulator' || location.pathname === '/story' || location.pathname === '/reality-check' || location.pathname === '/quiz-battle' || location.pathname === '/personality' || location.pathname === '/before-after'

  return (
    <>
      {!hideNav && <TopBar />}
      <main className={`relative w-full max-w-lg mx-auto min-h-screen ${!hideNav ? 'pt-14' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/modules/:slug" element={<Modules />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/story" element={<Story />} />
        <Route path="/reality-check" element={<RealityCheck />} />
        <Route path="/quiz-battle" element={<QuizBattle />} />
        <Route path="/personality" element={<Personality />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
      {!hideNav && <BottomNav />}
      {!hideNav && <Mentor />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <AppRoutes />
      </FeedbackProvider>
    </AuthProvider>
  )
}
