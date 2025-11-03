// components/Results.jsx
import React from 'react';
import NavBar from './NavBarMain';
import Footer from './Footer';

import { 
  // We ONLY need the icons for the *content*
  CheckCircle,
  Timer,
  Target,
  Trophy,
  Plus,
  Minus,
  ClipboardList as ClipboardIcon,
  CalendarDays as CalendarIcon, 
} from 'lucide-react';

// --- Centralized Data Store ---
const allExamData = {
  "Mock_Exam_20": {
    examName: "Mock_Exam_20",
    date: "01 Nov 2025",
    score: "112 / 160",
    timeTaken: "2h 45m",
    accuracy: "78%",
    rank: "23 / 240",
    percentile: "90.4%",
    mathsScore: 70, 
    physicsScore: 62,
    chemistryScore: 33,
    insights: [
      "You spend most time on Mathematics (avg 65s per question) — try timed practice.",
      "Your Chemistry accuracy is excellent; maintain with quick revisions.",
      "Focus on Modern Physics to improve weak concepts."
    ]
  },
  "Mock_Exam_19": {
    examName: "Mock_Exam_19",
    date: "25 Oct 2025",
    score: "105 / 160",
    timeTaken: "2h 50m",
    accuracy: "72%",
    rank: "45 / 240",
    percentile: "81.2%",
    mathsScore: 60,
    physicsScore: 55,
    chemistryScore: 40,
    insights: [
      "Good improvement in Physics.",
      "Time management in Chemistry is a bit slow.",
      "Continue practicing Mathematics."
    ]
  },
  "Mock_Exam_18": {
    examName: "Mock_Exam_18",
    date: "18 Oct 2025",
    score: "98 / 160",
    timeTaken: "2h 40m",
    accuracy: "68%",
    rank: "67 / 240",
    percentile: "72.0%",
    mathsScore: 50,
    physicsScore: 45,
    chemistryScore: 48,
    insights: [
      "Score is consistent, but focus on accuracy is needed.",
      "Review Organic Chemistry fundamentals.",
    ]
  },
  "Mock_Exam_17": {
    examName: "Mock_Exam_17",
    date: "11 Oct 2025",
    score: "110 / 160",
    timeTaken: "2h 48m",
    accuracy: "75%",
    rank: "31 / 240",
    percentile: "87.0%",
    mathsScore: 65,
    physicsScore: 60,
    chemistryScore: 45,
    insights: [
      "Strong performance in Mathematics.",
      "Physics score is good, but could be higher with more attention to detail.",
    ]
  }
};

// --- Props are removed ---
function Results() {
  
  const [currentExamName, setCurrentExamName] = React.useState("Mock_Exam_20");
  const [openAccordion, setOpenAccordion] = React.useState(null);

  const handleAccordionToggle = (examName) => {
    setOpenAccordion(openAccordion === examName ? null : examName);
  };

  const handleViewExamReport = (examName) => {
    setCurrentExamName(examName);
    setOpenAccordion(null); 
  };

  const currentExamData = allExamData[currentExamName];

  const pastExams = Object.keys(allExamData).filter(
    (exam) => exam !== currentExamName
  );

  // Return ONLY the content, not the full layout
  return (
    // --- ALL LAYOUT (flex, overlay, sidebar, header) IS REMOVED ---
    <>
      <NavBar />
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">
        Results For {currentExamData.examName}
      </h1>

      {/* --- Performance Summary Card --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <StatItem icon={ClipboardIcon} color="text-blue-600" label="Mock Test:" value={currentExamData.examName} />
          <StatItem icon={CalendarIcon} color="text-gray-600" label="Date:" value={currentExamData.date} />
          <StatItem icon={CheckCircle} color="text-green-600" label="Score:" value={currentExamData.score} isBold={true} />
          <StatItem icon={Timer} color="text-gray-600" label="Time Taken:" value={currentExamData.timeTaken} />
          <StatItem icon={Target} color="text-gray-600" label="Accuracy:" value={currentExamData.accuracy} />
        </div>
      </div>

      {/* --- Bar Chart Code --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <div className="w-full h-80 flex items-end justify-around px-8 relative">
          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between">
            <span className="text-gray-500">60</span>
            <span className="text-gray-500">40</span>
            <span className="text-gray-500">20</span>
            <span className="text-gray-500">0</span>
          </div>
          {/* Y-Axis Title */}
          <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 -rotate-90">
            <span className="text-xl font-semibold text-gray-700">Score</span>
          </div>
          
          {/* Baseline */}
          <div className="absolute bottom-10 left-8 right-0 h-0.5 bg-gray-300"></div>

          {/* Bars */}
          <Bar subject="Maths" score={currentExamData.mathsScore} color="bg-blue-600" />
          <Bar subject="Physics" score={currentExamData.physicsScore} color="bg-orange-500" />
          <Bar subject="Chemistry" score={currentExamData.chemistryScore} color="bg-green-600" />
        </div>
      </div>

      {/* --- Rank & Insights Code --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rank/Percentile */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3">
          <p className="text-xl"><span className="font-semibold">Your Rank:</span> {currentExamData.rank}</p>
          <p className="text-xl"><span className="font-semibold">Percentile:</span> {currentExamData.percentile}</p>
          <div className="flex items-center text-lg font-semibold text-gray-800 pt-2">
            <Trophy size={20} className="mr-2 text-yellow-500" />
            <span>You performed better than {currentExamData.percentile} of test-takers in this exam.</span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">AI Insights:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {currentExamData.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Past Results Accordion --- */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Results</h2>
        <div className="space-y-4">
          {pastExams.map((exam) => (
            <AccordionItem 
              key={exam}
              examName={exam}
              data={allExamData[exam]} // Get data from the central store
              isOpen={openAccordion === exam}
              onToggle={() => handleAccordionToggle(exam)}
              onViewReport={() => handleViewExamReport(exam)} // Pass the handler
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

// --- Accordion Item Component ---
function AccordionItem({ examName, data, isOpen, onToggle, onViewReport }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* --- Header (The Clickable Button) --- */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="text-xl font-semibold text-gray-700">Results For {examName}</span>
        {isOpen ? (
          <Minus size={24} className="text-blue-600" />
        ) : (
          <Plus size={24} className="text-blue-600" />
        )}
      </button>
      
      {/* --- Content (The Collapsible Part) --- */}
      <div
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-5 border-t border-gray-200">
          <p className="text-lg"><span className="font-semibold">Score:</span> {data.score}</p>
          <p className="text-lg"><span className="font-semibold">Accuracy:</span> {data.accuracy}</p>
          <p className="text-lg"><span className="font-semibold">Rank:</span> {data.rank}</p>
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
      <span className={`ml-2 ${isBold ? 'font-bold text-gray-900' : ''}`}>{value}</span>
    </div>
  );
}

function Bar({ subject, score, color }) {

  const maxScore = 80;
  const heightPercent = Math.min((score / maxScore) * 100, 100); // Capped at 100%

  return (
    <div className="flex flex-col items-center w-24 h-full pt-2">
      {/* Container for the bar, flex-1 to grow and items-end to align bar to bottom */}
      <div className="flex-1 flex items-end w-16">
        {/* The bar itself */}
        <div 
            className={`w-full rounded-t-lg ${color} hover:opacity-90 transition-all`} 
            style={{ height: `${heightPercent}%` }}>
        </div>
      </div>
      <span className="mt-2 font-semibold text-lg text-gray-800">{subject}</span>
    </div>
  );
}

export default Results;