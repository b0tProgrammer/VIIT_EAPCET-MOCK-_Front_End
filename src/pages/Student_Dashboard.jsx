import { useState, useEffect, useMemo } from "react"; 
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import { Menu as MenuIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const API = 'http://localhost:3000';

function StudentDashboard() {
  const [username, setUsername] = useState('Student');
  const [nextMockTest, setNextMockTest] = useState(null);
  const [nextStartSeconds, setNextStartSeconds] = useState(null);
  const [examsWritten, setExamsWritten] = useState(0);
  const [passPercentage, setPassPercentage] = useState('N/A');
  const [history, setHistory] = useState([]);

  // Simple performance points derived from history
  const performancePoints = useMemo(() => history.map(h => ({
    score: Number(h.score || 0),
    total: Number(h.totalMarks || 1)
  })), [history]);
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const user = (() => { try { return JSON.parse(localStorage.getItem('userInfo') || 'null'); } catch { return null; } })();
    if (user?.fullName) setUsername(user.fullName.split(' ')[0]);

    if (!token) return; // skip when not logged in

    const fetchData = async () => {
      try {
        const [examsRes, historyRes] = await Promise.all([
          fetch(`${API}/api/student/exams`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/student/results/history?studentId=${user?.id || user?.studentId || 1}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (examsRes.ok) {
          const examsData = await examsRes.json();
          const exams = examsData.exams || [];
          if (exams.length > 0) {
            setNextMockTest(exams[0].title);
            // simulate start times: first in 3 hours
            setNextStartSeconds(3 * 3600);
          }
        }

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const hist = historyData.history || [];
          setHistory(hist);
          setExamsWritten(hist.length);
          if (hist.length > 0) {
            const passed = hist.filter(h => Number(h.score) / Number(h.totalMarks) >= 0.5).length;
            setPassPercentage(((passed / hist.length) * 100).toFixed(1) + '%');
          } else {
            setPassPercentage('0%');
          }
        }
      } catch (e) {
        console.error('Dashboard fetch error', e);
      }
    };

    fetchData();
  }, []);

  // countdown timer for next test
  useEffect(() => {
    if (!nextStartSeconds) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - t0) / 1000);
      const remaining = Math.max(0, nextStartSeconds - elapsed);
      setNextStartSeconds(prev => (prev !== null ? Math.max(0, prev - 1) : prev));
    }, 1000);
    return () => clearInterval(id);
  }, [nextStartSeconds]);

  const formatCountdown = (secs) => {
    if (secs === null) return '00:00:00';
    const h = Math.floor(secs / 3600).toString().padStart(2,'0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2,'0');
    const s = (secs % 60).toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
  }

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
                {nextMockTest || 'No upcoming test'}
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
            <div className="w-full h-80 bg-white border border-gray-200 rounded-lg px-4 py-6">
                {/* Simple bar chart */}
                <div className="h-full flex items-end gap-3">
                  {performancePoints.length === 0 && (
                    <div className="text-gray-500 mx-auto">No performance data yet.</div>
                  )}
                  {performancePoints.map((p, idx) => {
                    const pct = Math.round((p.score / p.total) * 100);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-8 bg-blue-600" style={{height: `${Math.max(6, pct)}%`, minHeight: 10}}></div>
                        <div className="text-sm mt-2">{pct}%</div>
                      </div>
                    )
                  })}
                </div>
            </div>
          </div>
        </main> 
      </div> 
      <Footer />
    </>
  );
}

export default StudentDashboard;