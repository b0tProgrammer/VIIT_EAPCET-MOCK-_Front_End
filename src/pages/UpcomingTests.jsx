import { useState, useEffect } from 'react'; 
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from '../components/SideBar'; 
import { Menu as MenuIcon } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// --- Constants ---
const API_BASE_URL = 'http://localhost:3000'; // Ensure this matches your Express port
const LATE_START_WINDOW_MINUTES = 15;

function CountdownTimer({ startTime, durationHours, onStart, examId }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [status, setStatus] = useState('upcoming'); // 'upcoming', 'live', 'expired'
    const [canStart, setCanStart] = useState(false);
    
    const examStartTimeMs = new Date(startTime).getTime();
    // Start window ends 15 minutes after official start time
    const startWindowEndMs = examStartTimeMs + (LATE_START_WINDOW_MINUTES * 60 * 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const timeToStart = examStartTimeMs - now;
            const timeToStartWindowEnd = startWindowEndMs - now;

            if (timeToStartWindowEnd <= 0) {
                // EXPIRED: Start window is closed.
                setStatus('expired');
                setTimeLeft(0);
                setCanStart(false);
                clearInterval(interval);
            } else if (timeToStart <= 0) {
                // LIVE: Within the 15-minute grace period
                setStatus('live');
                setTimeLeft(Math.floor(timeToStartWindowEnd / 1000));
                setCanStart(true);
            } else {
                // UPCOMING
                setStatus('upcoming');
                setTimeLeft(Math.floor(timeToStart / 1000));
                setCanStart(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [examStartTimeMs, startWindowEndMs]);

    // Format function (Days, Hours, Minutes, Seconds)
    const formatTime = (seconds) => {
        if (seconds === null || seconds <= 0) {
            return status === 'expired' ? 'EXPIRED' : '00:00:00';
        }

        const secsTotal = Math.max(0, seconds);
        const days = Math.floor(secsTotal / (3600 * 24));
        const hours = Math.floor((secsTotal % (3600 * 24)) / 3600);
        const minutes = Math.floor((secsTotal % 3600) / 60);
        const secs = secsTotal % 60;

        const d = days > 0 ? `${days}d ` : '';
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(secs).padStart(2, '0');
        
        return `${d}${h}:${m}:${s}`;
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
                {formatTime(timeLeft)}
            </div>
            <button
                onClick={() => onStart(examId)}
                className={`px-5 py-2 rounded-lg transition font-medium ${
                    canStart 
                    ? 'bg-[#003973] text-white hover:bg-[#004c99]' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!canStart}
            >
                {canStart ? 'Start Exam Now' : 'Start Test'}
            </button>
        </div>
    );
}

// --- TestCard Component (Updated to use CountdownTimer) ---
function TestCard({ examId, examName, durationHours, totalMarks, startTime, onStart }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200
                        flex flex-col sm:flex-row justify-between sm:items-center
                        space-y-4 sm:space-y-0 sm:space-x-4">

            <div>
                <p className="text-sm text-gray-500 mb-1">Mock Test | {durationHours} Hrs | {totalMarks} Marks</p>
                <h3 className="text-2xl font-bold text-gray-800">{examName}</h3>
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the backend on component mount
    useEffect(() => {
        const fetchExams = async () => {
            // 🚨 STEP 1: Get the token from local storage
            const token = localStorage.getItem('userToken');

            if (!token) {
                // Handle case where user is not logged in (though protected by higher-level route likely)
                setError("Authentication required. Please log in again.");
                setIsLoading(false);
                return;
            }

            try {
                // 🚨 STEP 2: Include the Authorization header in the fetch call
                const response = await fetch(`${API_BASE_URL}/api/student/exams`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // <-- CRITICAL FIX
                        'Content-Type': 'application/json',
                    }
                });
                
                const data = await response.json();

                if (!response.ok) {
                    // Check for the unauthorized error and redirect them
                    if (response.status === 401 || response.status === 403) {
                        localStorage.clear();
                        navigate('/student_login'); // Redirect to login on failed auth
                        return;
                    }
                    throw new Error(data.message || "Failed to fetch exams.");
                }
                
                const now = Date.now();
                const filteredExams = (data.exams || [])
                    .map(exam => ({
                        id: exam.id,
                        name: exam.title,
                        durationHours: exam.durationHours,
                        totalMarks: exam.totalMarks,
                        startTime: exam.startTime, // Use the actual start time
                    }))
                    // Filter out exams where the 15 min grace period is over
                    .filter(exam => {
                         const examStartTimeMs = new Date(exam.startTime).getTime();
                         const startWindowEnd = examStartTimeMs + (LATE_START_WINDOW_MINUTES * 60 * 1000);
                         return startWindowEnd > now;
                    })
                    // Sort by nearest start time
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

                // Map and set upcoming tests (UNCHANGED)
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


    // --- JSX Rendering ---
    return (
        <>
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
                            <TestCard 
                                key={test.id} 
                                examId={test.id}
                                examName={test.name} 
                                duration={test.duration} 
                                totalMarks={test.totalMarks}
                                onStart={handleStartExam}
                                startTime={test.startTime}
                                // startSeconds={simulateStartSeconds(idx)}
                            />
                        ))}
                    </div>

                </main> 
            </div> 
            <Footer />
        </>
    );
}

// --- TestCard Component (Styling is kept) ---