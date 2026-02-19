import { useState, useEffect, useMemo } from "react"; 
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Menu as MenuIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const API = import.meta.env.VITE_API_URL;
const LATE_START_WINDOW_MINUTES = 15; 

function getTimeLeft(startTime) {
    const startMs = typeof startTime === 'number' ? startTime : Date.parse(startTime);
    const nowMs = Date.now();
    const diff = startMs - nowMs;

        if (diff <= 0) {
            return { seconds: 0, text: '0h 0m 0s' };
        }
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const text = days > 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m ${seconds}s`;
        return { seconds: totalSeconds, text };
}

function DashboardCountdown({ nextMockTest, nextExamStartTime, onStart }) {
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(null);
    const [status, setStatus] = useState('upcoming'); 

    useEffect(() => {
        if (!nextExamStartTime) return;
        const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
        const examStartTime = new Date(nextExamStartTime).getTime() - IST_OFFSET_MS; // apply -5.5h
        const startWindowEnd = examStartTime + (LATE_START_WINDOW_MINUTES * 60 * 1000);
        
        const interval = setInterval(() => {
            const now = Date.now();
            const timeToStart = examStartTime - now;
            const timeToStartWindowEnd = startWindowEnd - now;
            if (timeToStartWindowEnd <= 0) {
                setStatus('expired');
                setTimeLeftSeconds(0);
                clearInterval(interval);
            } else if (timeToStart <= 0) {
                setStatus('live');
                setTimeLeftSeconds(Math.floor(timeToStartWindowEnd / 1000));
            } else {
                setStatus('upcoming');
                setTimeLeftSeconds(Math.floor(timeToStart / 1000));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextExamStartTime]);

    const canStart = status === 'live';

    let countdownText = 'N/A';
    if (nextMockTest) {
        const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
        const startAdj = new Date(nextMockTest.startTime).getTime() - IST_OFFSET_MS;
        if (status === 'upcoming') {
            countdownText = getTimeLeft(startAdj).text;
        } else if (status === 'live') {
            const windowEndMs = startAdj + (LATE_START_WINDOW_MINUTES * 60 * 1000);
            countdownText = getTimeLeft(windowEndMs).text;
        } else if (status === 'expired') {
            countdownText = 'Missed';
        }
    }
    
    const getHeaderText = () => {
        if (!nextMockTest) return 'No Active Test';
        if (status === 'live') return 'Start Window Closes In';
        if (status === 'expired') return 'Missed Start Window';
        return 'Next Mock Test Starts In';
    }

    return (
        <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200">
            <p className="text-gray-600 text-sm mb-2">{getHeaderText()}</p>
            <div className="flex justify-between items-center mb-3">
                <span className="text-3xl font-bold text-gray-800">
                    {nextMockTest ? countdownText : 'N/A'}
                </span>
                    <button 
                    className={`px-5 py-2 rounded-lg transition duration-150 ease-in-out ${
                        canStart 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-200 text-gray-700 cursor-not-allowed'
                    }`} 
                    onClick={onStart} 
                    disabled={!canStart || status === 'expired' || !nextMockTest?.id}
                >
                    Start
                </button>
            </div>
            <p className="text-xl font-semibold text-gray-700">
                {nextMockTest?.title || 'Check Upcoming Tests'}
            </p>
                <div className="mt-2 text-sm text-gray-600">
                    {nextMockTest?.durationHours && (
                        <div>Duration: {nextMockTest.durationHours} hour{nextMockTest.durationHours > 1 ? 's' : ''}</div>
                    )}
                    {nextMockTest?.totalMarks && (
                        <div>Total Marks: {nextMockTest.totalMarks}</div>
                    )}
                    {nextMockTest?.startTime && (
                        <div className="text-xs text-gray-500 mt-1">
                            Scheduled: {new Date(new Date(nextMockTest.startTime).getTime() - (5.5 * 60 * 60 * 1000)).toLocaleString([], {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                    )}
                    {status === 'live' && (
                        <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</div>
                    )}
                </div>
        </div>
    );
}


function StudentDashboard() {
  const [username, setUsername] = useState('Student');
  const [nextMockTest, setNextMockTest] = useState(null);
  const [nextExamStartTime, setNextExamStartTime] = useState(null);
  const [examsWritten, setExamsWritten] = useState(0);
  const [passPercentage, setPassPercentage] = useState('N/A');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const performancePoints = useMemo(() => history.map(h => ({
    score: Number(h.score || 0),
    total: Number(h.totalMarks || 1)
  })), [history]);
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUsername(localStorage.getItem("name"));
    setLoading(true);
    if (!token) return; 
    const fetchData = async () => {
      try {
        const [examsRes, historyRes] = await Promise.all([
          fetch(`${API}/api/student/exams`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/student/results/history?studentId=${localStorage.getItem("studentId")}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        if (examsRes.ok) {
          const examsData = await examsRes.json();
          const now = Date.now();
          const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
          const examsList = (examsData.exams || []).map(exam => ({
                            id: exam.id,
                            title: exam.title,
                            durationHours: exam.durationHours,
                            totalMarks: exam.totalMarks,
                            startTime: exam.startTime,
                            startTimeMs: new Date(exam.startTime).getTime(),
                            startTimeMsAdj: new Date(exam.startTime).getTime() - IST_OFFSET_MS,
                        }));

          const activeExams = examsList
                        .filter(exam => {
                            const startMs = exam.startTimeMsAdj;
                            const windowEnd = startMs + (LATE_START_WINDOW_MINUTES * 60 * 1000);
                            return startMs <= now && windowEnd > now;
                        })
                        .sort((a, b) => a.startTimeMsAdj - b.startTimeMsAdj);
            const active = activeExams[0];
            setNextMockTest(active);
            setNextExamStartTime(active.startTime);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartExam = () => {
        if(nextMockTest?.id) {
            navigate(`/instructions?paperId=${nextMockTest.id}`);
        }
    };

  return (
    <>
       {loading && <Loader/>}
      <NavBar />
      <div className="flex min-h-screen"> 
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
                {/* 🚨 REPLACING OLD MOCK TEST CARD WITH DashboardCountdown 🚨 */}
            <DashboardCountdown
                nextMockTest={nextMockTest}
                nextExamStartTime={nextExamStartTime}
                onStart={handleStartExam}
            />

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