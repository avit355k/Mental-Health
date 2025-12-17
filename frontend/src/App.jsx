import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Assessments from './pages/Assessments/Assessments';
import Chatbot from './pages/Chatbot/Chatbot';
import AssessmentRunner from './components/assessments/AssessmentRunner';
import Articles from './pages/Resources/Articles';
import Videos from './pages/Resources/Videos';
import Meditation from './pages/Relaxation/Meditation';
import Breathing from './pages/Relaxation/Breathing';
import SleepStories from './pages/Relaxation/SleepStories';
import AssessmentResult from './components/assessments/AssessmentResult';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Profile/Dashboard';
import ArticleDetails from './components/Resoources/ArticleDetails';
import GuidedSession from './pages/Resources/GuidedSession';
import Consultant from './pages/Consultant/Consultant';


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/auth" exact={true} element={<Auth />} />
        <Route path="/assessments" exact={true} element={<Assessments />} />
        <Route path="/assessments/:id" element={<AssessmentRunner />} />
        <Route path="/assessments/:id/result" element={<AssessmentResult />} />
        <Route path="/chat-support" exact={true} element={<Chatbot />} />
        <Route path="/relaxation/meditation" exact={true} element={<Meditation />} />
        <Route path="/relaxation/breathing-exercises" exact={true} element={<Breathing />} />
        <Route path="/relaxation/sleep-stories" exact={true} element={<SleepStories />} />
        <Route path='/resources/articles' exact={true} element={<Articles />} />
        <Route path="/resources/articles/:id" element={<ArticleDetails />} />
        <Route path='/resources/videos' exact={true} element={<Videos />} />
        <Route path='/resources/guided-sessions' exact={true} element={<GuidedSession />} />
        <Route path='/consultants' exact={true} element={<Consultant />} />
        <Route path='/profile' exact={true} element={<Profile />} />
        <Route path='/dashboard' exact={true} element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App