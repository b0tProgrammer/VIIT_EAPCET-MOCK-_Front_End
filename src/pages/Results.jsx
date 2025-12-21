import { useState, useEffect, useMemo } from "react";
import NavBar from "../components/NavBarMain";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./../components/Loader";

import {
  CheckCircle,
  Timer,
  Target,
  Trophy,
  Plus,
  Minus,
  ClipboardList as ClipboardIcon,
  CalendarDays as CalendarIcon,
  Menu as MenuIcon,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3000";

const initialResultState = {
  id: null, 
  examName: "Result Summary",
  date: "N/A",
  totalMarks: 160,
  score: "0 / 160",
  timeTaken: "N/A",
  accuracy: "N/A",
  rank: "N/A",
  percentile: "N/A",
  mathsScore: 0,
  physicsScore: 0,
  chemistryScore: 0,
  insights: ["No completed exam data found."],
};

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  ); 
  const studentId = localStorage.getItem("studentId");
  const resultIdFromUrl = queryParams.get("resultId");
  const currentPaperIdFromUrl = queryParams.get("paperId");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentExamData, setCurrentExamData] = useState(initialResultState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  const [allResultsHistory, setAllResultsHistory] = useState([]); 

  const [openAccordion, setOpenAccordion] = useState(null);

  const handleAccordionToggle = (examId) => {
    setOpenAccordion(openAccordion === examId ? null : examId);
  }; 
  const handleViewExamReport = (paperIdToView) => {
    const selectedData = allResultsHistory.find((r) => r.id === paperIdToView);
    if (selectedData) {
      setCurrentExamData({
        ...selectedData,
        score: `${selectedData.score} / ${selectedData.totalMarks}`,
      });
      setOpenAccordion(null);
    }
  };

  const pastExamsForAccordion = useMemo(() => {
    return allResultsHistory.filter((r) => r.id !== currentExamData.id);
  }, [allResultsHistory, currentExamData.id]); 

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      let fetchedHistory = [];
      let currentResult = null; 
      try {
        const token = localStorage.getItem('token');
        const historyResponse = await fetch(
          `${API_BASE_URL}/api/student/results/history?studentId=${studentId}`,
          { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
        );
        const historyData = await historyResponse.json();
        console.log(historyData);
        if (historyResponse.ok) {
          fetchedHistory = historyData.history.map((r) => ({
            ...r,
            score: Number(r.score), 
            totalMarks: Number(r.totalMarks),
          }));
          setAllResultsHistory(fetchedHistory);
        } else {
          if (historyResponse.status === 401 || historyResponse.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          setError(historyData.message || 'Failed to load results history.');
        }
      } catch (err) {
        console.error("History Fetch Error:", err);
        setError("Failed to load results history.");
      }

      if (fetchedHistory.length > 0) {
        let targetResult = null;
        if (resultIdFromUrl) {
          targetResult = fetchedHistory.find(
            (r) => r.id === parseInt(resultIdFromUrl)
          );
        } else if (currentPaperIdFromUrl) {
          targetResult = fetchedHistory.find(
            (r) => String(r.paperId) === String(currentPaperIdFromUrl) || String(r.examName).includes(currentPaperIdFromUrl)
          );
        }

        if (!targetResult) {
          targetResult = fetchedHistory[0];
        }
        currentResult = {
          ...targetResult,
          mathsScore: Number(targetResult.mathsScore),
          physicsScore: Number(targetResult.physicsScore),
          chemistryScore: Number(targetResult.chemistryScore),
          score: `${targetResult.score} / ${targetResult.totalMarks}`,
        };
      } 
      setCurrentExamData(currentResult || initialResultState);
      setIsLoading(false);
    };

    fetchResults();
  }, [studentId, currentPaperIdFromUrl, resultIdFromUrl]);
  /*if (currentExamData.id === null && !error && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700 p-10">
        <h2 className="text-2xl font-bold">No Completed Results Found</h2>     
        <p className="mt-2">
          Please complete an exam and ensure the administrative scoring is run.
        </p>
      </div>
    );
  }*/

  return (
    <>
      {isLoading && <Loader />}
            <NavBar />      
      <div className="flex min-h-screen">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 p-6 bg-gray-50 relative">          
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 mb-4 text-gray-600 rounded-lg hover:bg-gray-200"
          >
                        <MenuIcon size={24} />          
          </button>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error Loading Results! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
                    
          <h1 className="text-4xl font-semibold text-gray-800 mb-6">
                        Results For {currentExamData.examName}          
          </h1>     
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                              
              <StatItem
                icon={ClipboardIcon}
                color="text-blue-600"
                label="Mock Test:"
                value={currentExamData.examName}
              />
                              
              <StatItem
                icon={CalendarIcon}
                color="text-gray-600"
                label="Date:"
                value={currentExamData.date}
              />
                              
              <StatItem
                icon={CheckCircle}
                color="text-green-600"
                label="Score:"
                value={currentExamData.score}
                isBold={true}
              />
                              
              <StatItem
                icon={Timer}
                color="text-gray-600"
                label="Time Taken:"
                value={currentExamData.timeTaken}
              />
                              
              <StatItem
                icon={Target}
                color="text-gray-600"
                label="Accuracy:"
                value={currentExamData.accuracy}
              />
                          
            </div>
                      
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                        
            <div className="w-full h-80 flex items-end justify-around px-8 relative">
                              
              <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between">
                <span className="text-gray-500">80</span>
                <span className="text-gray-500">40</span>
                <span className="text-gray-500">20</span>
                <span className="text-gray-500">0</span>                
              </div>
                              
              <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 -rotate-90">
                                  
                <span className="text-xl font-semibold text-gray-700">
                  Score
                </span>
                                
              </div>
                              
              <div className="absolute bottom-10 left-8 right-0 h-0.5 bg-gray-300"></div>
              <Bar
                subject="Maths"
                score={currentExamData.mathsScore}
                maxScore={80}
                color="bg-blue-600"
              />
                              
              <Bar
                subject="Physics"
                score={currentExamData.physicsScore}
                maxScore={40}
                color="bg-orange-500"
              />
                              
              <Bar
                subject="Chemistry"
                score={currentExamData.chemistryScore}
                maxScore={40}
                color="bg-green-600"
              />
                          
            </div>
                      
          </div>
                    {/* --- Rank & Insights Code (Uses Dynamic Data) --- */}   
                
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3">
                              
              <p className="text-xl">
                <span className="font-semibold">Your Rank:</span> 
                {currentExamData.rank}
              </p>
                              
              <p className="text-xl">
                <span className="font-semibold">Percentile:</span> 
                {currentExamData.percentile}
              </p>
                              
              <div className="flex items-center text-lg font-semibold text-gray-800 pt-2">
                                  
                <Trophy size={20} className="mr-2 text-yellow-500" />           
                      
                <span>
                  You performed better than {currentExamData.percentile} of
                  test-takers in this exam.
                </span>
                                
              </div>
                          
            </div>
                        
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                AI Insights:
              </h3>
                              
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                  
                {currentExamData.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
                                
              </ul>
                          
            </div>
                      
          </div>
                    
          {/* --- Past Results Accordion (Uses Dynamic History) --- */}          
          <div className="mt-10">
                        
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Past Results
            </h2>
                        
            <div className="space-y-4">
                              
              {pastExamsForAccordion.map((exam) => (
                <AccordionItem
                  key={exam.id}
                  examName={exam.examName}
                  data={exam}
                  isOpen={openAccordion === exam.id}
                  onToggle={() => handleAccordionToggle(exam.id)}
                  onViewReport={() => handleViewExamReport(exam.id)}
                />
              ))}
              {allResultsHistory.length === 0 && !isLoading && !error && (
                <p className="text-gray-500 p-4 bg-white rounded-lg border">
                  No past completed exams found.
                </p>
              )}
                          
            </div>
                      
          </div>
                  
        </main>
              
      </div>
            <Footer />    
    </>
  );
}

// ... (Component definitions)

function AccordionItem({ examName, data, isOpen, onToggle, onViewReport }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="text-xl font-semibold text-gray-700">
          Results For {examName}
        </span>

        {isOpen ? (
          <Minus size={24} className="text-blue-600" />
        ) : (
          <Plus size={24} className="text-blue-600" />
        )}
      </button>

      <div
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-5 border-t border-gray-200">
          <p className="text-lg">
            <span className="font-semibold">Score:</span> {data.score}
          </p>

          <p className="text-lg">
            <span className="font-semibold">Accuracy:</span> {data.accuracy}
          </p>

          <p className="text-lg">
            <span className="font-semibold">Rank:</span> {data.rank}
          </p>

          <button
            onClick={onViewReport}
            className="text-blue-600 hover:underline mt-2 inline-block font-medium"
          >
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, color, label, value, isBold = false }) {
  return (
    <div className="flex items-center text-lg text-gray-700">
      <Icon size={18} className={`mr-3 ${color}`} />

      <span className="font-medium">{label}</span>

      <span className={`ml-2 ${isBold ? "font-bold text-gray-900" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// 🚨 Bar component updated to accept maxScore

function Bar({ subject, score, maxScore, color }) {
  const heightPercent = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="flex flex-col items-center w-24 h-full pt-2">
      <div className="flex-1 flex items-end w-16">
        <span className="absolute -top-6 text-sm font-bold text-gray-800">
          {score}
        </span>

        <div
          className={`w-full rounded-t-lg ${color} hover:opacity-90 transition-all`}
          style={{ height: `${heightPercent}%` }}
        ></div>
      </div>

      <span className="mt-2 font-semibold text-lg text-gray-800">
        {subject}
      </span>
    </div>
  );
}

export default Results;