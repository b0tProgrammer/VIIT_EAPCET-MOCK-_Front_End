import LandingPage from "./components/LandingPage"
import InstructionPage from "./components/Instructions"
import FaqPage from "./components/FaqPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import StudentLogin from "./components/Student_Login"
import StudentDashboard from "./components/Student_Dashboard"
import UpcomingTests from "./components/UpcomingTests"
import Results from "./components/Results"
import Faq from "./components/FaqPage"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/instructions" element={<InstructionPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/Student_Login" element={<StudentLogin/>} />
          <Route path="/student_dashboard" element={<StudentDashboard/>} />
          <Route path="/upcoming_tests" element={<UpcomingTests/>} />
          <Route path="/results" element={ <Results/> }/>
          <Route path="/faq" element={ <Faq/> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}
