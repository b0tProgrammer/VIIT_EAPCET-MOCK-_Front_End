import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubjectTabs from '../components/SubjectTabs';
import QuestionPanel from '../components/QuestionPanel';
import Questionnavigation from '../components/Questionsnavigation';
import ActionBar from '../components/ActionBar';
import mockQuestions, { mockUser } from '../data/mockData';
import { QuestionStatus } from '../components/Questionsnavigation';
import { useNavigate } from 'react-router-dom';

function Exampage() {
  const navigate = useNavigate();
  const subjects = Object.keys(mockQuestions);
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState(
    subjects.reduce((acc, subject) => ({
      ...acc,
      [subject]: Array(mockQuestions[subject].length).fill(QuestionStatus.NOT_VISITED)
    }), {})
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [activeSubject]: {
        ...prev[activeSubject],
        [currentQuestionIndex]: optionIndex
      }
    }));
    updateQuestionStatus(QuestionStatus.ANSWERED);
  };

  const updateQuestionStatus = (status) => {
    setQuestionStatus(prev => ({
      ...prev,
      [activeSubject]: prev[activeSubject].map((s, i) => 
        i === currentQuestionIndex ? status : s
      )
    }));
  };

  const handleMarkForReview = () => {
    // If already answered, mark as marked+answered
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
    if (answers[activeSubject]?.[currentQuestionIndex] !== undefined) {
      updateQuestionStatus(QuestionStatus.ANSWERED);
    } else {
      updateQuestionStatus(QuestionStatus.NOT_ANSWERED);
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions[activeSubject].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (subjects.indexOf(activeSubject) < subjects.length - 1) {
      setActiveSubject(subjects[subjects.indexOf(activeSubject) + 1]);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = () => {
    // Implement submission logic
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    setShowSubmitModal(false);
    navigate('/results');
  };

  const cancelSubmit = () => {
    setShowSubmitModal(false);
  };

  const currentQuestion = mockQuestions[activeSubject][currentQuestionIndex];
  const selectedAnswer = answers[activeSubject]?.[currentQuestionIndex];

  const questions = mockQuestions[activeSubject].map((q, index) => ({
    number: index + 1,
    status: questionStatus[activeSubject][index]
  }));

  // Calculate summary statistics
  const totalQuestions = subjects.reduce((total, subject) => total + mockQuestions[subject].length, 0);
  const answered = Object.values(questionStatus).flat().filter(status => status === QuestionStatus.ANSWERED || status === QuestionStatus.MARKED_FOR_REVIEW_ANSWERED).length;
  const notAnswered = Object.values(questionStatus).flat().filter(status => status === QuestionStatus.NOT_ANSWERED).length;
  const markedForReview = Object.values(questionStatus).flat().filter(status => status === QuestionStatus.MARKED_FOR_REVIEW || status === QuestionStatus.MARKED_FOR_REVIEW_ANSWERED).length;
  const notVisited = Object.values(questionStatus).flat().filter(status => status === QuestionStatus.NOT_VISITED).length;

  // Mark a question as visited (NOT_ANSWERED) when the user views it if it was NOT_VISITED
  useEffect(() => {
    const status = questionStatus[activeSubject][currentQuestionIndex];
    if (status === QuestionStatus.NOT_VISITED) {
      updateQuestionStatus(QuestionStatus.NOT_ANSWERED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubject, currentQuestionIndex]);

  // Ensure selecting an answer updates statuses correctly (handle answered + marked combos)
  useEffect(() => {
    const isAnswered = selectedAnswer !== undefined;
    const status = questionStatus[activeSubject][currentQuestionIndex];
    if (isAnswered) {
      // If currently marked-for-review, convert to marked+answered
      if (status === QuestionStatus.MARKED_FOR_REVIEW) {
        updateQuestionStatus(QuestionStatus.MARKED_FOR_REVIEW_ANSWERED);
      } else {
        updateQuestionStatus(QuestionStatus.ANSWERED);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer]);

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
          // Auto-submit after 3 warnings
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
      // Still hide the modal even if failed, as user acknowledged
      setShowFullscreenWarning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header
        examTitle={mockUser.examTitle}
        userName={mockUser.name}
        timeInMinutes={mockUser.timeInMinutes}
      />

      <SubjectTabs
        subjects={subjects}
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
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
            questions={questions}
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

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Submission</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-semibold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-semibold text-green-600">{answered}</span>
              </div>
              <div className="flex justify-between">
                <span>Not Answered:</span>
                <span className="font-semibold text-red-600">{notAnswered}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <span className="font-semibold text-yellow-600">{markedForReview}</span>
              </div>
              <div className="flex justify-between">
                <span>Not Visited:</span>
                <span className="font-semibold text-gray-600">{notVisited}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={confirmSubmit}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
              >
                Yes, Submit
              </button>
              <button
                onClick={cancelSubmit}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
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
                <button
                  onClick={reenterFullscreen}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                >
                  Return to Full Screen
                </button>
                <button
                  onClick={confirmSubmit}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
                >
                  Continue Anyway
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Exampage;
