import { useState } from "react"; 
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import { Menu as MenuIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const username = "User_95";
  const nextMockTest = "Mock_Exam_21";
  const examsWritten = 20;
  const passPercentage = "78.2%";
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <NavBar />

      {/* 4. Add a main flex container to hold sidebar AND content */}
      <div className="flex min-h-screen"> 
        
        {/* 5. Pass the state and setter to your Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />  

        {/* 6. Wrap ALL your dashboard content in a 'main' tag */}
        <main className="flex-1 p-6 bg-gray-50 relative"> {/* Added padding and bg */}
          {/* 7. Add a mobile menu button (visible only on small screens) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 mb-4 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <MenuIcon size={24} />
          </button>

          {/* 8. Your original dashboard content goes inside <main> */}
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">
            Hello {username}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            See your Performance here...
          </p>

          {/* Stat Cards (I fixed your flex/grid class here) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200">
              <p className="text-gray-600 text-sm mb-2">Next Mock Test In</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl font-bold text-gray-800">
                  00:00:00
                </span>
                <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 ease-in-out" onClick={() => navigate("/instructions")}>
                  Start
                </button>
              </div>
              <p className="text-xl font-semibold text-gray-700">
                {nextMockTest}
              </p>
            </div>

            <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-center items-center">
              <p className="text-5xl font-bold text-gray-800 mb-2">
                {examsWritten}
              </p>
              <p className="text-lg text-center text-gray-600">
                Overall Exams Written
              </p>
            </div>

            <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-center items-center">
              <p className="text-5xl font-bold text-gray-800 mb-2">
                {passPercentage}
              </p>
              <p className="text-lg text-center text-gray-600">
                Pass Percentage
              </p>
            </div>
          </div>
          {/* Performance Graph */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Overview
            </h3>
            {/* ... your graph svg ... */}
            <div className="w-full h-80 bg-gradient-to-tr from-blue-100 to-blue-50 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* ...svg content... */}
            </div>
          </div>
        </main> 
      </div> 
      <Footer />
    </>
  );
}

export default StudentDashboard;