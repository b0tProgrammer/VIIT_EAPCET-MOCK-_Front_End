import { useState, useMemo } from "react";
import AdminSideBar from "../components/AdminSiderBar"; 
import { Menu as MenuIcon, X, Eye, FileText } from "lucide-react";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import {  useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://viiteapcet-backend.onrender.com'; 
const SUBJECT_TOTALS = { 
    Mathematics: 80,
    Physics: 40,
    Chemistry: 40,
};

const getFutureDateTimeLocal = (hoursAhead = 24) => {
    const d = new Date(Date.now() + hoursAhead * 3600 * 1000);
    // Format to 'YYYY-MM-DDTHH:MM' required by datetime-local
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const PaperPreviewModal = ({ questions, paperTitle, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col relative overflow-hidden">
                <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#003973]">Preview: {paperTitle} ({questions.length} Qs)</h3>
                    <button
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="font-bold text-gray-900 mb-2">Q{index + 1}:</div>
                            <div className="text-xs text-gray-500 mt-1 mb-2">({q.subject} | {q.difficulty} | Answer: {q.correctAnswer})</div>
                            <div className="prose max-w-full text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: q.html || q.text }} />
                        </div>
                    ))}
                </div>
                <div className="bg-white border-t p-4 flex justify-end">
                    <button
                        className="px-5 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors font-medium"
                        onClick={onClose}
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CreateQuestionPaper() {
    const [form, setForm] = useState({
        title: '',
        startTime: getFutureDateTimeLocal(18),
        duration: 3,
    });
    const [difficultyPercentage, setDifficultyPercentage] = useState({
        Mathematics: 50, // Default to 50% Medium
        Physics: 50,
        Chemistry: 50,
    });
    const [stream, setStream] = useState("Engineering");
    const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);

    const [paperId, setPaperId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); // {type: 'success'/'error', message: ''}
    const [previewQuestions, setPreviewQuestions] = useState(null);
    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDifficultyChange = (subject, value) => {
        setDifficultyPercentage((prev) => ({ ...prev, [subject]: Number(value) }));
    };

    const calculatedCounts = useMemo(() => {
        let counts = {};
        let totalQuestions = 0;

        for (const subject in SUBJECT_TOTALS) {
            const total = SUBJECT_TOTALS[subject];
            const mediumPercentage = difficultyPercentage[subject];
            const mediumCount = Math.round(total * (mediumPercentage / 100));

            const remaining = total - mediumCount;
            const easyCount = Math.floor(remaining / 2);
            const hardCount = remaining - easyCount;

            counts[subject] = {
                MEDIUM: mediumCount,
                EASY: easyCount,
                HARD: hardCount,
                TOTAL: total,
            };
            totalQuestions += total;
        }

        return { counts, totalQuestions };
    }, [difficultyPercentage]);


    const handleGeneratePaper = async () => {
        const token = localStorage.getItem('token');
        if (!form.title.trim() || !form.startTime.trim()) {
            setStatus({ type: 'error', message: 'Exam Name and Start Time are required.' });
            return;
        }
        setIsLoading(true);
        setStatus(null);
        setPreviewQuestions(null); 
        const distributionPayload = {};
        for (const subject in calculatedCounts.counts) {
            const subjectKey = subject.toUpperCase(); 
            distributionPayload[subjectKey] = {
                EASY: calculatedCounts.counts[subject].EASY,
                MEDIUM: calculatedCounts.counts[subject].MEDIUM,
                HARD: calculatedCounts.counts[subject].HARD,
            };
        }
        const adminId = 1; 
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/create-paper-custom`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                 },
                body: JSON.stringify({
                    adminId: adminId,
                    title: form.title.trim(),
                    startTime: form.startTime+":00+05:30",
                    durationHours: parseInt(form.duration) || 3,
                    distribution: distributionPayload,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate question paper.');
            }
            setPaperId(data.paperId);
            setStatus({ 
                type: 'success', 
                message: `✅ Paper created successfully! Total questions: ${data.totalQuestions}. ID: ${data.paperId}` 
            });

        } catch (error) {
            console.error('Generation Error:', error);
            setStatus({ type: 'error', message: error.message || 'Error creating paper.' });
        } finally {
            setIsLoading(false);
        }
    };


    const handlePreviewPaper = async () => {
        if (!paperId) {
            alert('Please generate a paper first to preview.');
            setStatus({ type: 'error', message: 'Generate a paper first using the "Generate Question Paper" button.' });
            return;
        }
        
        setIsLoading(true);
        setStatus(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/preview-paper/${paperId}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch paper questions.');
            }
            setPreviewQuestions(data.questions);
            setStatus({ type: 'success', message: `Fetched ${data.questions.length} questions for preview.` });
        } catch (error) {
            console.error('Preview Error:', error);
            setStatus({ type: 'error', message: error.message || 'Error fetching preview.' });
        } finally {
            setIsLoading(false);
        }
    };
    const isFormValid = form.title.trim() !== '';
    const totalQuestions = calculatedCounts.totalQuestions;
    const totalMarks = totalQuestions; 
    return (
        <>
            <NavBarMain />
            <div className="flex flex-1 min-h-screen bg-[#f9fcff] font-poppins text-gray-800">
                <aside
                    className={`fixed lg:static top-0 left-0 h-full w-64 bg-white
                        transform transition-transform duration-300 ease-in-out z-50
                        ${
                            isAdminSideBarOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                        }`}
                >
                    <AdminSideBar
                        isAdminSideBarOpen={isAdminSideBarOpen}
                        setIsAdminSideBarOpen={setIsAdminSideBarOpen}
                    />
                </aside>
                <main className="flex-1 py-10 px-4 sm:px-8 lg:px-12 flex flex-col items-center overflow-y-auto">
                    <button
                        className="lg:hidden mb-4 text-[#003973] flex items-center gap-2 font-medium self-start"
                        onClick={() => {
                            setIsAdminSideBarOpen(!isAdminSideBarOpen);
                        }}
                        disabled={isLoading}
                    >
                        <MenuIcon size={24} />
                    </button>

                    
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-8 mx-auto">
                        <h2 className="text-2xl font-semibold text-[#003973] mb-8 text-center">
                            Create Question Paper
                        </h2>

                        {status && (
                            <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                                status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'
                            }`}>
                                {status.message}
                            </div>
                        )}
                        {paperId && (
                            <p className="text-center text-sm font-medium text-blue-600 mb-6">
                                Paper ID: {paperId} is ready. Click Preview or Generate.
                            </p>
                        )}
                        <div className="grid grid-cols-1 gap-5 mb-8">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="title">
                                    Exam Name
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={form.title || ''}
                                    onChange={handleFormChange}
                                    className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="date">Exam Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="startTime"
                                    name="startTime"
                                    value={form.startTime || ''}
                                    onChange={handleFormChange}
                                    className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                                    disabled={isLoading}
                                    min={getFutureDateTimeLocal(1)}
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="duration">
                                    Duration (e.g., 3 hours)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="6"
                                    step="0.5"
                                    id="duration"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleFormChange}
                                    placeholder="e.g., 3 hours"
                                    className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Stream Dropdown */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="stream">Stream</label>
                                <select
                                    id="stream"
                                    value={stream}
                                    onChange={(e) => setStream(e.target.value)}
                                    className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                                    disabled={isLoading}
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Agricultural">Agricultural</option>
                                </select>
                            </div>
                        </div>

                        {/* Difficulty Cards */}
                        <h3 className="text-md font-semibold mb-2 text-[#003973]">
                            Difficulty
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-6 mb-4">
                            <div className="flex-1 bg-[#F0FEFF] border border-[#0080FF] rounded-[30px] shadow py-4 text-center cursor-pointer transition">
                                <p className="text-lg font-semibold text-[#003973]">
                                    Percentage
                                </p>
                                <p className="text-sm text-gray-600">
                                    Set the overall difficulty mix
                                </p>
                            </div>
                            <div className="flex-1 bg-[#F0FEFF] border border-[#0080FF] rounded-[30px] shadow py-4 text-center cursor-pointer hover:scale-105 transition"
                                onClick={() => navigate("/independentLevels", { state: { title: form.title, startTime: form.startTime, duration: form.duration } })}
                            >
                                <p className="text-lg font-semibold text-[#003973]">Custom</p>
                                <p className="text-sm text-gray-600">
                                    Set each question’s difficulty
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-6">
                            *The percentage below represents the target mix of **MEDIUM** questions. EASY and HARD questions will share the remaining percentage.
                        </p>

                        {/* Difficulty Table */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full border border-gray-300 rounded-xl text-sm">
                                <thead className="bg-[#F0FEFF] border-b border-[#0080FF] text-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Subject</th>
                                        <th className="px-4 py-2 text-left">Difficulty (Medium %)</th>
                                        <th className="px-4 py-2 text-left">Total Qs</th>
                                        <th className="px-4 py-2 text-left">E:M:H Qs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(SUBJECT_TOTALS).map(([subject, total]) => (
                                        <tr key={subject} className="border-t border-gray-200">
                                            <td className="px-4 py-2">{subject}</td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={difficultyPercentage[subject]}
                                                    onChange={(e) =>
                                                        handleDifficultyChange(subject, e.target.value)
                                                    }
                                                    className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-3 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                                                    disabled={isLoading}
                                                >
                                                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(
                                                        (val) => (
                                                            <option key={val} value={val}>
                                                                {val}%
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </td>
                                            <td className="px-4 py-2 font-medium">{total}</td>
                                            <td className="px-4 py-2 text-xs">
                                                {calculatedCounts.counts[subject].EASY} : 
                                                <span className="font-bold text-blue-600"> {calculatedCounts.counts[subject].MEDIUM} </span> : 
                                                {calculatedCounts.counts[subject].HARD}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 className="font-semibold text-[#003973] mb-2">Summary</h3>
                            <p>Total Marks: {totalMarks}</p>
                            <p>Total Questions: {totalQuestions}</p>
                            <p>
                                Stream:{" "}
                                <span className="text-[#0080FF] font-medium">{stream}</span>
                            </p>
                            {paperId && (
                                <p className="mt-2 text-sm font-semibold text-green-600">
                                    Paper Generated (ID: {paperId})
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button 
                                className="bg-[#003973] text-white px-5 py-2 rounded-lg hover:bg-[#004c99] transition flex items-center gap-2 disabled:opacity-50"
                                onClick={handlePreviewPaper}
                                disabled={isLoading || !paperId}
                            >
                                <Eye size={18} />
                                Preview Paper
                            </button>
                            <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                            disabled={isLoading}
                            >
                                Save as Draft
                            </button>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button 
                                className="border-2 border-[#003973] text-[#003973] px-5 py-2 rounded-lg hover:bg-[#003973] hover:text-white transition flex items-center gap-2 disabled:opacity-50"
                                onClick={handleGeneratePaper}
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? <FileText size={18} /> : null}
                                {isLoading ? 'Generating...' : '+ Generate Question Paper'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
            {previewQuestions && (
                <PaperPreviewModal 
                    questions={previewQuestions} 
                    paperTitle={form.title} 
                    onClose={() => setPreviewQuestions(null)} 
                />
            )}
        </>
    );
}