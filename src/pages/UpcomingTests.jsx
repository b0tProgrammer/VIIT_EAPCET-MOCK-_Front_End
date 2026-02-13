import { useState, useEffect } from 'react'; 
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from '../components/Sidebar'; 
import { Menu as MenuIcon } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://viiteapcet-backend.onrender.com'; 
const LATE_START_WINDOW_MINUTES = 15;

// Utility: compute remaining time to a start timestamp (accepts number or parsable string)
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

function CountdownTimer({ startTime, durationHours, onStart, examId }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [status, setStatus] = useState('upcoming');
    const [canStart, setCanStart] = useState(false);

    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const examStartTimeMs = new Date(startTime).getTime() - IST_OFFSET_MS;
    const startWindowEndMs = examStartTimeMs + (LATE_START_WINDOW_MINUTES * 60 * 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const timeToStart = examStartTimeMs - now;
            const timeToStartWindowEnd = startWindowEndMs - now;

            if (timeToStartWindowEnd <= 0) {
                setStatus('expired');
                setTimeLeft(0);
                setCanStart(false);
                clearInterval(interval);
            } else if (timeToStart <= 0) {
                // we're within the live start window
                setStatus('live');
                setTimeLeft(Math.floor(timeToStartWindowEnd / 1000));
                setCanStart(true);
            } else {
                // upcoming: not yet started
                setStatus('upcoming');
                setTimeLeft(Math.floor(timeToStart / 1000));
                setCanStart(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [examStartTimeMs, startWindowEndMs]);

    // derive display text using getTimeLeft to match Student_Dashboard
    const computeDisplayText = () => {
        if (!startTime) return 'N/A';
        if (status === 'expired') return 'EXPIRED';
        if (status === 'live') {
            const windowEndMs = startWindowEndMs;
            return getTimeLeft(windowEndMs).text;
        }
        return getTimeLeft(examStartTimeMs).text;
    };

    const getStatusText = () => {
        const dateOptions = {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        };
        const dateString = new Date(examStartTimeMs).toLocaleString([], dateOptions);
        
        if (status === 'live') return `Start Window Closes in:`;
        if (status === 'expired') return 'Exam Start Window Closed';
        
        return `Starts ${dateString} (in):`;
    };
    
    return (
        <div className="flex flex-col items-start sm:items-end">
            <p className={`text-sm mb-1 ${status === 'live' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                {getStatusText()}
            </p>
            <div className="text-3xl font-bold text-gray-800 mb-2">
                {computeDisplayText()}
            </div>
            <button
                onClick={() => onStart(examId)}
                className={`px-5 py-2 rounded-lg transition font-medium ${
                    canStart
                    ? 'bg-[#003973] text-white hover:bg-[#004c99]'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!canStart || status === 'expired'}
            >
                {canStart ? 'Start Exam Now' : 'Start Test'}
            </button>
        </div>
    );
}

function TestCard({ examId, examName, durationHours, totalMarks, startTime, onStart }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200
                        flex flex-col sm:flex-row justify-between sm:items-center
                        space-y-4 sm:space-y-0 sm:space-x-4">

            <div>
                        <p className="text-sm text-gray-500 mb-1">Mock Test | {durationHours} Hrs | {totalMarks} Marks</p>
                        <h3 className="text-2xl font-bold text-gray-800">{examName}</h3>
                        {startTime && (
                            <p className="text-xs text-gray-500 mt-1">
                                Scheduled : {new Date(new Date(startTime).getTime() - (5.5 * 60 * 60 * 1000)).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
            </div>
            
            <CountdownTimer 
                examId={examId}
                startTime={startTime} 
                durationHours={durationHours}
                onStart={onStart}
            />
        </div>
    );
}

export default function UpcomingTests() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // State for fetched test data
    const [upcomingTests, setUpcomingTests] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchExams = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication required. Please log in again.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/student/exams`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.clear();
                        navigate('/login'); 
                        return;
                    }
                    throw new Error(data.message || "Failed to fetch exams.");
                }
                
                const now = Date.now();
                const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
                const filteredExams = (data.exams || [])
                    .map(exam => ({
                        id: exam.id,
                        name: exam.title,
                        durationHours: exam.durationHours,
                        totalMarks: exam.totalMarks,
                        startTime: exam.startTime, 
                        startTimeMsAdj: new Date(exam.startTime).getTime() - IST_OFFSET_MS,
                    }))
                    .filter(exam => {
                         const examStartTimeMs = exam.startTimeMsAdj;
                         const startWindowEnd = examStartTimeMs + (LATE_START_WINDOW_MINUTES * 60 * 1000);
                         return startWindowEnd > now;
                    })
                    .sort((a, b) => a.startTimeMsAdj - b.startTimeMsAdj);
                setUpcomingTests(filteredExams);
                setError(null);
            } catch (err) {
                console.error("Exam Fetch Error:", err);
                setError(err.message);
                setUpcomingTests([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExams();
    }, [navigate]);

    // Handler for starting the exam: navigates to instructions with Paper ID

    const handleStartExam = (paperId) => {
        navigate(`/instructions?paperId=${paperId}`);
    };

    // Create simulated start times (in seconds from now) for display purposes
    // const simulateStartSeconds = (index) => {
    //     if (index === 0) return 3 * 3600; // 3 hours
    //     if (index === 1) return 24 * 3600; // 1 day
    //     if (index === 2) return 4 * 24 * 3600; // 4 days
    //     return (index + 2) * 24 * 3600; // later tests
    // };

    return (
        <>
            {isLoading && <Loader/>}
            <NavBar />
            <div className="flex min-h-screen">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className="flex-1 p-6 bg-gray-50">
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
                    
                    {/* Status Messages */}
                    {isLoading && <p className="text-center py-10 text-xl text-blue-600">Loading available tests...</p>}
                    {error && <p className="text-center py-10 text-xl text-red-600 border border-red-300 bg-red-50 rounded-lg">{error}</p>}
                    
                    {!isLoading && !error && upcomingTests.length === 0 && (
                        <p className="text-center py-10 text-xl text-gray-500">No active mock tests are available right now. Check back later!</p>
                    )}

                    {/* List of Test Cards */}
                    <div className="space-y-6">
                        {!isLoading && upcomingTests.map((test, idx) => (
                            <>
                                <TestCard 
                                key={test.id} 
                                examId={test.id}
                                examName={test.name} 
                                durationHours={test.durationHours} 
                                totalMarks={test.totalMarks}
                                onStart={handleStartExam}
                                startTime={test.startTime}
                                // startSeconds={simulateStartSeconds(idx)}
                            />
                            </>
                        ))}
                    </div>

                </main> 
            </div> 
            <Footer />
        </>
    );
}

// --- TestCard Component (Styling is kept) ---