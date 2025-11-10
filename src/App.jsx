import LandingPage from "./pages/LandingPage";
import InstructionPage from "./pages/Instructions";
import FaqPage from "./pages/FaqPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentLogin from "./pages/Student_Login";
import StudentDashboard from "./pages/Student_Dashboard";
import UpcomingTests from "./pages/UpcomingTests";
import Results from "./pages/Results";
import Register from "./pages/Register";
import Exampage from "./pages/Exampage";
import AdminSideBar from "./components/AdminSiderBar"; // ✅ fixed filename spelling
import TeacherDashboard from "./Admin-Pages/TeacherDashboard"; // ✅ path fixed (lowercase)
import Questions from "./Admin-Pages/Questions"; // ✅ added
// import Exams from "./admin-pages/Exams"; // ✅ added
// import Students from "./admin-pages/Students"; // ✅ added
// import Reports from "./admin-pages/Reports"; // ✅ added
// import Settings from "./admin-pages/Settings"; // ✅ added

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Student Section --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/exam" element={<Exampage />} />
        <Route path="/instructions" element={<InstructionPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/student_login" element={<StudentLogin />} />
        <Route path="/student_dashboard" element={<StudentDashboard />} />
        <Route path="/upcoming_tests" element={<UpcomingTests />} />
        <Route path="/results" element={<Results />} />
        <Route path="/register" element={<Register />} />

        {/* --- Admin Section (Teacher) --- */}
        <Route path="/Admin-Pages/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/Admin-Pages/questions" element={<Questions />} />
        {/* <Route path="/admin-pages/exams" element={<Exams />} />
        <Route path="/admin-pages/students" element={<Students />} />
        <Route path="/admin-pages/reports" element={<Reports />} />
        <Route path="/admin-pages/settings" element={<Settings />} /> */}

        {/* Sidebar Standalone (for testing) */}
        {/* <Route path="/adminbar" element={<AdminSideBar />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
