import { useState, useMemo } from "react";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from 'react-router-dom'; 

export default function InstructionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [agree, setAgree] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Get paperId from URL (e.g., /instructions?paperId=123)
    const paperId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('paperId');
    }, [location.search]);

    const handleStart = () => {
        if (!paperId) {
            alert('Error: Paper ID not found. Please select a test from the list.');
            return;
        }
        if (!agree) return;
        setShowConfirmModal(true);
    };

    const confirmStart = async () => {
        if (!document.fullscreenEnabled) {
            alert('Full screen mode is not supported in your browser. Please use a compatible browser to take the test.');
            return;
        }
        setShowConfirmModal(false);
        try {
            // Request fullscreen as part of the user gesture (click)
            await document.documentElement.requestFullscreen();
        } catch (e) {
            // Not fatal — some browsers or contexts may disallow fullscreen
            console.warn('requestFullscreen failed:', e);
        }
        // Navigate to /exam, passing the paperId as a query param
        navigate(`/exam?paperId=${paperId}`);
    };

    const cancelStart = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavBarMain />

            <main className="flex-1 bg-gray-50 py-8 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-center text-3xl font-semibold text-gray-900 mb-6">
                        Instructions To be Followed
                    </h2>

                    <div className="w-full bg-blue-50 rounded-2xl p-6 shadow-sm">
                        <div className="bg-white rounded-xl p-6">
                            <p className="mb-4 text-sm text-gray-700 font-medium">
                                📘 Instructions for VIIT EAPCET Mock Test
                            </p>

                            <ol className="list-decimal ml-6 space-y-3 text-sm text-gray-700">
                                <li>
                                    <strong>Total Questions:</strong> The test consists of 160
                                    multiple–choice questions divided into Physics (40), Chemistry
                                    (40), and Mathematics (80).
                                </li>
                                <li>
                                    <strong>Duration:</strong> You will have 3 hours (180 minutes)
                                    to complete the test. The timer will start as soon as you
                                    click Start Test.
                                </li>
                                <li>
                                    <strong>Marking Scheme:</strong>
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>Each correct answer carries 1 mark.</li>
                                        <li>There is no negative marking for wrong answers.</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Navigation:</strong>
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>
                                            You can move between questions using the Next and Previous
                                            buttons.
                                        </li>
                                        <li>
                                            Questions can also be accessed directly from the question
                                            palette on the side.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Answer Selection:</strong>
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>
                                            Click on the correct option (A, B, C, or D) to select your
                                            answer.
                                        </li>
                                        <li>
                                            You can change your answer anytime before submission.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Save &amp; Next:</strong>
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>
                                            Use Save &amp; Next to save your current answer and move
                                            to the next question.
                                        </li>
                                        <li>
                                            If you skip a question, it will remain unattempted unless
                                            you return to it later.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Review Option:</strong> You can mark questions for
                                    review if you're unsure and want to revisit them before
                                    submitting.
                                </li>
                                <li>
                                    <strong>Timer &amp; Auto-Submission:</strong> The test will
                                    automatically submit when the timer ends, even if you haven't
                                    answered all questions.
                                </li>
                                <li>
                                    <strong>Do Not Refresh or Close the Window:</strong>{" "}
                                    Refreshing or closing the test window may lead to loss of
                                    progress. Ensure a stable internet connection throughout the
                                    test.
                                </li>
                                <li>
                                    <strong>Result Display:</strong>
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>
                                            Your score and analysis will be displayed immediately
                                            after submission.
                                        </li>
                                        <li>
                                            You can review your answers, check correct responses, and
                                            download your result report.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Fair Practice Policy:</strong>
                                    <ul className="list-disc ml-6 mt-1">
                                        <li>
                                            Do not use calculators, mobile phones, or any unfair
                                            means.
                                        </li>
                                        <li>
                                            The purpose of this mock test is to help you assess your
                                            preparation honestly.
                                        </li>
                                    </ul>
                                </li>
                            </ol>

                            <p className="mt-4 text-sm text-gray-800 font-medium">
                                Note: Once you click Start Test, the timer begins and cannot be
                                paused. Make sure you are ready before starting.
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <label className="inline-flex items-start sm:items-center space-x-3">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 accent-[#003973] cursor-pointer transition-colors duration-200"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                    aria-label="Agree to instructions"
                                />

                                <span className="text-sm text-gray-700">
                                    I have read and understood all the instructions mentioned
                                    above. I agree to follow them during the mock test.
                                </span>
                            </label>

                            <div className="flex-shrink-0">
                                <button
                                    onClick={handleStart}
                                    disabled={!agree}
                                    className={`px-5 py-2 rounded-md text-white font-semibold shadow-sm transition-colors duration-150 ${
                                        agree   
                                            ? "bg-[#003973] hover:bg-blue-800 cursor-pointer"
                                            : "bg-blue-400 cursor-not-allowed"
                                    }`}
                                >
                                    Take the Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Start Test</h2>
                        <p className="text-gray-700 mb-6 text-center">
                            Are you sure you want to start the test? The timer will begin immediately and cannot be paused.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmStart}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                            >
                                Yes, Start Test
                            </button>
                            <button
                                onClick={cancelStart}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}