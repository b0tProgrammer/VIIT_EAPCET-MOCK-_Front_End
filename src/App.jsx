import LandingPage from "./pages/LandingPage"
import InstructionPage from "./pages/Instructions"
import FaqPage from "./pages/FaqPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import StudentLogin from "./pages/Student_Login"
import StudentDashboard from "./pages/Student_Dashboard"
import UpcomingTests from "./pages/UpcomingTests"
import Results from "./pages/Results"
import Register from "./pages/Register"
import Exampage from "./pages/Exampage"
import AdminSideBar from "./components/AdminSiderBar"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/exam" element={<Exampage />} />
          <Route path="/instructions" element={<InstructionPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/Student_Login" element={<StudentLogin/>} />
          <Route path="/student_dashboard" element={<StudentDashboard/>} />
          <Route path="/upcoming_tests" element={<UpcomingTests/>} />
          <Route path="/results" element={ <Results/> }/>
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/register" element = {<Register/>} />
          <Route path="/AdminBar" element = {<AdminSideBar/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}