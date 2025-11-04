// components/UpcomingTests.jsx
import { useState } from 'react'; // <-- 1. Import useState
import NavBar from "./NavBarMain";
import Footer from "./Footer";
import Sidebar from './SideBar'; // <-- 2. Import Sidebar
import { Menu as MenuIcon } from 'lucide-react'; // <-- 3. Import MenuIcon
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
// --- Mock Data ---
const upcomingTestData = [
  { id: 1, name: "Mock_Exam_22", time: "01:00:00" },
  { id: 2, name: "Mock_Exam_23", time: "02:00:00" },
  { id: 3, name: "Mock_Exam_24", time: "03:00:00" },
  { id: 4, name: "Mock_Exam_25", time: "04:00:00" },
  { id: 5, name: "Mock_Exam_26", time: "05:00:00" },
];



export default function UpcomingTests() {
  
  // <-- 4. Add state for the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <NavBar />
      <AnimatedBackground />
      {/* 5. Add a main flex container */}
      <div className="flex min-h-screen">

        {/* 6. Render Sidebar and pass props */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* 7. Wrap all page content in <main> */}
        <main className="flex-1 p-6 bg-gray-50">

          {/* 8. Add mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 mb-4 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <MenuIcon size={24} />
          </button>

          {/* Page Header */}
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">
            Upcoming Tests
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your Next Challenge Awaits! Gear up for the next round of practice. Compete, improve, and track your growth with every mock test.
          </p>
      
          {/* List of Test Cards */}
          <div className="space-y-6">
            {upcomingTestData.map((test) => (
              <TestCard 
                key={test.id} 
                examName={test.name} 
                time={test.time} 
              />
            ))}
          </div>

        </main> {/* 9. Close main wrapper */}
      </div> {/* 10. Close flex container */}

      <Footer />
    </>
  );
}

// ... (TestCard component is unchanged)
function TestCard({ examName, time }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200
                    flex flex-col sm:flex-row justify-between sm:items-center
                    space-y-4 sm:space-y-0 sm:space-x-4">

      <div>
        <p className="text-sm text-gray-500 mb-1">Next Mock Test in</p>
        <h3 className="text-2xl font-bold text-gray-800">{examName}</h3>
      </div>

      <div className="flex flex-col items-start sm:items-end">
        <div className="text-3xl font-bold text-gray-800 mb-2">{time}</div>
        <div className="bg-green-200 text-white-700 px-4 py-1 rounded-md text-sm font-medium">
          Starts in
        </div>
      </div>
    </div>
  );
}
