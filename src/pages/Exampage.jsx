import { useState, useEffect, useMemo, useCallback, useRef } from 'react'; // 🚨 Added useRef, useCallback
import Header from '../components/Header';
import SubjectTabs from '../components/SubjectTabs';
import QuestionPanel from '../components/QuestionPanel';
import Questionnavigation from '../components/Questionsnavigation'; // Note: Renamed to match case convention
import ActionBar from '../components/ActionBar';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000'; 

// 🚨 FIX 1: Define the QuestionStatus Enum
export const QuestionStatus = {
    NOT_VISITED: 'not-visited', 
    NOT_ANSWERED: 'not-answered', 
    ANSWERED: 'answered', 
    MARKED_FOR_REVIEW: 'marked-for-review', 
    MARKED_FOR_REVIEW_ANSWERED: 'marked-for-review-answered', 
};

// Helper to calculate question number across subjects
const calculateQuestionNumber = (questionsBySubject, activeSubject, currentIndex) => {
    let total = 0;
    for (const subject in questionsBySubject) {
        if (subject === activeSubject) {
            return total + currentIndex + 1;
        }
        total += questionsBySubject[subject].length;
    }
    return total + 1;
};

function Exampage() {
    const navigate = useNavigate();
    const location = useLocation();

    // --- State for Dynamic Data ---
    const [paperData, setPaperData] = useState(null); 
    const [questionsBySubject, setQuestionsBySubject] = useState({}); 
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [attemptId, setAttemptId] = useState(null); 
    
    // 🚨 FIX 2: Ref for preventing multiple submissions
    const submittingRef = useRef(false);

    // Get paperId from URL
    const paperId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('paperId');
    }, [location.search]);

    const subjects = useMemo(() => paperData ? Object.keys(questionsBySubject) : [], [paperData, questionsBySubject]);
    
    // --- Existing Exam State ---
    const [activeSubject, setActiveSubject] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questionStatus, setQuestionStatus] = useState({});
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    
    // ... (fetchExamData useEffect is UNCHANGED from previous step)
    useEffect(() => {
        if (!paperId) {
            setLoadError("Invalid test link. Paper ID is missing.");
            setIsLoading(false);
            return;
        }

        const fetchExamData = async () => {
            const studentId = 1; 

            try {
                const response = await fetch(`${API_BASE_URL}/api/student/start-exam`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentId: studentId, paperId: paperId }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to start exam.');
                }
                
                const groupedQuestions = data.questions.reduce((acc, q) => {
                    const subject = q.subject;
                    if (!acc[subject]) acc[subject] = [];
                    acc[subject].push(q);
                    return acc;
                }, {});

                // If no questions loaded at all (empty paper)
                if (Object.keys(groupedQuestions).length === 0) {
                     throw new Error("The selected question paper contains no questions.");
                }

                setPaperData(data);
                setAttemptId(data.attemptId); 
                setQuestionsBySubject(groupedQuestions);
                setActiveSubject(Object.keys(groupedQuestions)[0]);
                
                const initialStatus = Object.keys(groupedQuestions).reduce((acc, subject) => {
                    acc[subject] = Array(groupedQuestions[subject].length).fill(QuestionStatus.NOT_VISITED);
                    return acc;
                }, {});
                setQuestionStatus(initialStatus);
                setAnswers({}); // Reset answers state on new load
                
            } catch (err) {
                console.error("Exam Start Error:", err);
                setLoadError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExamData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paperId]);

    // Ensure state dependencies are based on dynamic data
    const currentQuestionList = questionsBySubject[activeSubject] || [];
    const currentQuestion = currentQuestionList[currentQuestionIndex];
    const selectedAnswer = answers[activeSubject]?.[currentQuestionIndex];

    // Re-implemented Handlers to use Dynamic Data
    const updateQuestionStatus = useCallback((status) => {
        setQuestionStatus(prev => ({
            ...prev,
            [activeSubject]: prev[activeSubject].map((s, i) => 
                i === currentQuestionIndex ? status : s
            )
        }));
    }, [activeSubject, currentQuestionIndex]);

    const handleAnswerSelect = (optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [activeSubject]: {
                ...prev[activeSubject],
                [currentQuestionIndex]: optionIndex
            }
        }));
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < currentQuestionList.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (subjects.indexOf(activeSubject) < subjects.length - 1) {
            setActiveSubject(subjects[subjects.indexOf(activeSubject) + 1]);
            setCurrentQuestionIndex(0);
        }
    };
    
    const handleMarkForReview = () => {
        const isAnswered = answers[activeSubject]?.[currentQuestionIndex] !== undefined;
        updateQuestionStatus(isAnswered ? QuestionStatus.MARKED_FOR_REVIEW_ANSWERED : QuestionStatus.MARKED_FOR_REVIEW);
        goToNextQuestion();
    };

    const handleClearResponse = () => {
        setAnswers(prev => {
            const subjectAnswers = { ...prev[activeSubject] };
            delete subjectAnswers[currentQuestionIndex];
            return { ...prev, [activeSubject]: subjectAnswers };
        });
        updateQuestionStatus(QuestionStatus.NOT_ANSWERED);
    };

    const handleSaveNext = () => {
        if (answers[activeSubject]?.[currentQuestionIndex] === undefined) {
             updateQuestionStatus(QuestionStatus.NOT_ANSWERED);
        }
        goToNextQuestion();
    };

    const prepareAnswersForSubmission = () => {
        const submissionPayload = {};
        for (const subject in questionsBySubject) {
            questionsBySubject[subject].forEach((q, index) => {
                const selectedOption = answers[subject]?.[index];
                if (selectedOption !== undefined) {
                    submissionPayload[q.id] = selectedOption; 
                }
            });
        }
        return submissionPayload;
    };

    const handleSubmit = () => {
        setShowSubmitModal(true);
    };

    const confirmSubmit = async () => {
        if (!attemptId) {
            alert("Error: Cannot submit. Attempt ID is missing.");
            return;
        }
        
        // 🚨 FIX 3: Prevent double submission
        if (submittingRef.current) return;
        submittingRef.current = true;
        
        const submissionAnswers = prepareAnswersForSubmission();

        try {
            const response = await fetch(`${API_BASE_URL}/api/student/submit-attempt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attemptId: attemptId,
                    answers: submissionAnswers,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                submittingRef.current = false; // Allow retry on non-network failure
                throw new Error(errorData.message || 'Failed to submit exam.');
            }

            // Successful submission: Clear state and navigate
            setAttemptId(null); // Clear ID to prevent future submissions
            submittingRef.current = false;
            const studentId = 1;
            setShowSubmitModal(false);
           navigate(`/results?paperId=${paperId}&studentId=${studentId}`); 

        } catch (error) {
            submittingRef.current = false;
            console.error("Submission Error:", error);
            alert(`Error during submission: ${error.message}. Please try again.`);
            setShowSubmitModal(false);
        }
    };

    const cancelSubmit = () => {
        setShowSubmitModal(false);
    };
    
    // ... (rest of useEffects and fullscreen handlers are UNCHANGED) ...
     // Request full screen on mount
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                await document.documentElement.requestFullscreen();
            } catch (error) {
                console.error('Failed to enter full screen:', error);
            }
        };
        enterFullscreen();

        // Cleanup function to exit full screen on unmount
        return () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(console.error);
            }
        };
    }, []);

    // Listen for full screen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // Full screen exited
                const newWarnings = fullscreenWarnings + 1;
                setFullscreenWarnings(newWarnings);
                setShowFullscreenWarning(true);

                if (newWarnings >= 3) {
                    handleSubmit();
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [fullscreenWarnings]);

    const reenterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setShowFullscreenWarning(false);
        } catch (error) {
            console.error('Failed to re-enter full screen:', error);
            setShowFullscreenWarning(false);
        }
    };

    // Mark a question as visited (NOT_ANSWERED) when the user views it if it was NOT_VISITED
    useEffect(() => {
        if (!activeSubject || !questionStatus[activeSubject]) return;

        const status = questionStatus[activeSubject][currentQuestionIndex];
        if (status === QuestionStatus.NOT_VISITED) {
            updateQuestionStatus(QuestionStatus.NOT_ANSWERED);
        }
    }, [activeSubject, currentQuestionIndex, questionStatus, updateQuestionStatus]);

    // Ensure selecting an answer updates statuses correctly
    useEffect(() => {
        if (!activeSubject || !questionStatus[activeSubject]) return;

        const isAnswered = selectedAnswer !== undefined;
        const status = questionStatus[activeSubject][currentQuestionIndex];

        if (isAnswered) {
            if (status === QuestionStatus.MARKED_FOR_REVIEW) {
                updateQuestionStatus(QuestionStatus.MARKED_FOR_REVIEW_ANSWERED);
            } else if (status !== QuestionStatus.MARKED_FOR_REVIEW_ANSWERED) {
                updateQuestionStatus(QuestionStatus.ANSWERED);
            }
        }
    }, [activeSubject, currentQuestionIndex, selectedAnswer, questionStatus, updateQuestionStatus]);


    // Calculate summary statistics
    const allStatuses = useMemo(() => Object.values(questionStatus).flat(), [questionStatus]);
    const totalQuestions = allStatuses.length;
    const answered = allStatuses.filter(status => status === QuestionStatus.ANSWERED || status === QuestionStatus.MARKED_FOR_REVIEW_ANSWERED).length;
    const notAnswered = allStatuses.filter(status => status === QuestionStatus.NOT_ANSWERED).length;
    const markedForReview = allStatuses.filter(status => status === QuestionStatus.MARKED_FOR_REVIEW || status === QuestionStatus.MARKED_FOR_REVIEW_ANSWERED).length;
    const notVisited = allStatuses.filter(status => status === QuestionStatus.NOT_VISITED).length;


    // --- Loading & Error Display ---
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-xl font-medium">Loading Exam Data...</div>;
    }

    if (loadError || !paperData || !currentQuestion) {
        return <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-red-50 text-red-700">
            <h1 className="text-2xl font-bold mb-4">Error Loading Test</h1>
            <p>{loadError || "Could not retrieve question paper or current question is missing. Please check the Paper ID and try again."}</p>
        </div>;
    }
    
    // --- Data mapping for QuestionNavigation ---
    const questionsForPanel = currentQuestionList.map((q, index) => ({
        number: calculateQuestionNumber(questionsBySubject, activeSubject, index),
        status: questionStatus[activeSubject][index]
    }));
    
    // ----------------------------------------------------
    // 🎨 Render JSX (Styling UNCHANGED)
    // ----------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-100 relative">
            <Header
                examTitle={paperData.paperTitle || "Mock Test"}
                userName={"Student User"} 
                timeInMinutes={Math.floor(paperData.timeRemainingSeconds / 60)} 
            />

            <SubjectTabs
                subjects={subjects}
                activeSubject={activeSubject}
                onSubjectChange={(subject) => {
                    setActiveSubject(subject);
                    setCurrentQuestionIndex(0);
                }}
            />

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <div className="flex-grow">
                        <QuestionPanel
                            question={currentQuestion}
                            selectedAnswer={selectedAnswer}
                            onAnswerSelect={handleAnswerSelect}
                        />
                    </div>

                    <Questionnavigation
                        questions={questionsForPanel}
                        currentQuestion={currentQuestionIndex}
                        onQuestionClick={setCurrentQuestionIndex}
                    />
                </div>
            </div>

            <ActionBar
                onMarkForReview={handleMarkForReview}
                onClearResponse={handleClearResponse}
                onSaveNext={handleSaveNext}
                onSubmit={handleSubmit}
            />

            {/* Submit Confirmation Modal (uses calculated statistics) */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                   <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Submission</h2>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between"><span>Total Questions:</span><span className="font-semibold">{totalQuestions}</span></div>
                            <div className="flex justify-between"><span>Answered:</span><span className="font-semibold text-green-600">{answered}</span></div>
                            <div className="flex justify-between"><span>Not Answered:</span><span className="font-semibold text-red-600">{notAnswered}</span></div>
                            <div className="flex justify-between"><span>Marked for Review:</span><span className="font-semibold text-yellow-600">{markedForReview}</span></div>
                            <div className="flex justify-between"><span>Not Visited:</span><span className="font-semibold text-gray-600">{notVisited}</span></div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={confirmSubmit} className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200">Yes, Submit</button>
                            <button onClick={cancelSubmit} className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Warning Modal */}
            {showFullscreenWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                   <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4 text-center text-red-600">Warning!</h2>
                        <p className="text-gray-700 mb-6 text-center">
                            You have exited full screen mode. This is warning {fullscreenWarnings} of 3.
                            {fullscreenWarnings >= 3 ? ' The test will now be submitted automatically.' : ' Please return to full screen mode to continue the test.'}
                        </p>
                        {fullscreenWarnings < 3 && (
                            <div className="flex justify-center gap-4">
                                <button onClick={reenterFullscreen} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200">Return to Full Screen</button>
                                <button onClick={confirmSubmit} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200">Continue Anyway</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exampage;