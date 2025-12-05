import { useState, useEffect } from 'react'; 
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from '../components/SideBar'; 
import { Menu as MenuIcon } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// --- Constants ---
const API_BASE_URL = 'http://localhost:3000'; // Ensure this matches your Express port

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
            try {
                const response = await fetch(`${API_BASE_URL}/api/student/exams`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch exams.");
                }

                setUpcomingTests(data.exams.map(exam => ({
                    id: exam.id,
                    name: exam.title,
                    // Format duration nicely
                    duration: `${exam.durationHours} ${exam.durationHours > 1 ? 'Hrs' : 'Hr'}`, 
                    totalMarks: exam.totalMarks
                })));
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
    }, []);

    // Handler for starting the exam: navigates to instructions with Paper ID
    const handleStartExam = (paperId) => {
        navigate(`/instructions?paperId=${paperId}`);
    };


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
                        {!isLoading && upcomingTests.map((test) => (
                            <TestCard 
                                key={test.id} 
                                examId={test.id}
                                examName={test.name} 
                                duration={test.duration} 
                                totalMarks={test.totalMarks}
                                onStart={handleStartExam}
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
function TestCard({ examId, examName, duration, totalMarks, onStart }) {
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200
                        flex flex-col sm:flex-row justify-between sm:items-center
                        space-y-4 sm:space-y-0 sm:space-x-4">

            <div>
                <p className="text-sm text-gray-500 mb-1">Mock Test | {duration} | {totalMarks} Marks</p>
                <h3 className="text-2xl font-bold text-gray-800">{examName}</h3>
            </div>

            <div className="flex flex-col items-start sm:items-end">
                <div className="text-3xl font-bold text-gray-800 mb-2">3 days</div> {/* Placeholder for countdown */}
                <button
                    onClick={() => onStart(examId)}
                    className="bg-[#003973] text-white px-5 py-2 rounded-lg hover:bg-[#004c99] transition font-medium"
                >
                    Start Test
                </button>
            </div>
        </div>
    );
}