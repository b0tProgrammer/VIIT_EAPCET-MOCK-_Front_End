import { useRef, useState } from "react";
import AdminSideBar from "../components/AdminSiderBar";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import LazyPreviewList from "../components/LazyPreviewList";

import { Menu as MenuIcon, Upload, FileText, PlusCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:3000";

const simpleCSVParse = (csvText) => {
  const rows = csvText.trim().split("\n").slice(1); 
  return rows
    .map((row, index) => {
      const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const cleanedCols = cols.map((c) => c.trim().replace(/^"|"$/g, ""));
      if (cleanedCols.length < 6) return null; 
      return {
        id: Date.now() + index,
        question: cleanedCols[0] || "",
        optionA: cleanedCols[1] || "",
        optionB: cleanedCols[2] || "",
        optionC: cleanedCols[3] || "",
        optionD: cleanedCols[4] || "",
        subject: cleanedCols[5] || "",
        topic: cleanedCols[6] || "",
        difficulty: cleanedCols[7] || "",
        answer: cleanedCols[8] || "",
        questionImage: null,
        optionAImage: null,
        optionBImage: null,
        optionCImage: null,
        optionDImage: null,
      };
    })
    .filter((q) => q !== null);
};

function Questions() {
  const fileInputRef = useRef(null);
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = simpleCSVParse(text);
      setQuestions(parsed);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Question,Option A,Option B,Option C,Option D,Subject,Topic,Difficulty,Answer\n" +
      '"What is the capital of France?",Paris,London,Rome,Berlin,Social,Capitals,Easy,"Option A"\n';
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "question_template.csv";
    link.click();
  };

  const handleAddQuestion = () => {
    const subject = prompt("Name of the subject(MATHEMATICS/PHYSICS/CHEMISTRY): ");
    const topic = prompt("Name of the topic: ");
    const difficulty = prompt("What's the difficulty(EASY/MEDIUM/HARD): ")
    const correctOption = prompt("correct option(A/B/C/D): ")
    if(!subject || !topic || !difficulty || !correctOption) return;
    const newQuestion = {
      id: Date.now(),
      question: "New Question Text",
      subject: subject,
      topic: topic,
      difficulty: difficulty,
      optionA: "Option A Text",
      optionB: "Option B Text",
      optionC: "Option C Text",
      optionD: "Option D Text",
      answer: `Option ${correctOption}`,
      questionImage: null,
      optionAImage: null,
      optionBImage: null,
      optionCImage: null,
      optionDImage: null,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleSaveToBackend = async () => {
    if (questions.length === 0) {
      alert("No questions to upload.");
      return;
    }
    setIsUploading(true);
    setLoading(true);
    setOpenPreview(false);
    const formData = new FormData();
    const questionsPayload = [];
    const token = localStorage.getItem("token");
    questions.forEach((q) => {
      const questionData = {
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        answer: q.answer.at(-1),
        id: q.id,
      };
      questionsPayload.push(questionData);
    });
    console.log("Questions Payload:", questionsPayload);
    formData.append("questions", JSON.stringify(questionsPayload));
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/teacher/save-questions`,
        {
          method: "POST",
          body: formData,
          headers : {Authorization: `Bearer ${token}`},
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload questions");
      }

      const result = await response.json();
      // console.log("Upload Success:", result); 
      alert(`Success: ${result.message || "Questions uploaded successfully!"}`);

      // Cleanup state after successful upload
      questions.forEach((q) => {
        const imageFields = [
          "question",
          "optionA",
          "optionB",
          "optionC",
          "optionD",
        ];
      });
      setQuestions([]);
      setFileName("");
    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Error during upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fcff] font-poppins text-gray-800">
      <NavBarMain />
      {loading && <Loader />}
      <div className="flex flex-1">
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${
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

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2 font-medium"
            onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
          >
            <MenuIcon size={24} />
          </button>

          {openPreview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
              <LazyPreviewList
                questions={questions}
                onUpdate={(index, field, val) => {
                  setQuestions((prev) => {
                    const copy = [...prev];
                    copy[index][field] = val;
                    return copy;
                  });
                }}
                onClose={() => {
                  setOpenPreview(false);
                }}
                onDelete={(index) => {
                  setQuestions((prev) => prev.filter((_, i) => i !== index));
                }}
                onSave={handleSaveToBackend}
              />
            </div>
          )}

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            Add Question
          </h2>

          {/* Upload Section */}
          <div className="flex flex-col space-y-3 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleUploadClick}
                className="px-5 py-2 rounded-md border border-blue-300 text-blue-700 bg-white shadow-sm hover:bg-blue-50 transition-all duration-300 w-fit flex items-center gap-2"
              >
                <Upload size={18} />
                Upload CSV
              </button>
              <button
                onClick={() => {
                  handleAddQuestion();
                }}
                className="px-5 py-2 rounded-md border border-green-300 text-green-700 bg-white shadow-sm hover:bg-green-50 transition-all duration-300 w-fit flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add New Question
              </button>
            </div>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <FileText size={16} />
                <span>Questions loaded from: {fileName} </span>
              </div>
            )}
            {!fileName && questions.length === 0 && (
              <span className="text-xs text-gray-500">
                Upload Questions in .CSV format or add manually.
              </span>
            )}
            {questions.length > 0 && (
              <span className="text-sm text-gray-600 font-medium">
                {questions.length} questions loaded and ready for review.
              </span>
            )}
          </div>

          {/* Template Info */}
          <div className="bg-blue-50 p-5 rounded-md shadow-sm border border-blue-100 mb-8">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              CSV TEMPLATE
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-1 rounded-md border border-blue-300 text-blue-700 bg-white shadow-sm hover:bg-blue-50 transition-all duration-300"
            >
              Download Model
            </button>
            <p className="text-xs text-gray-600 mt-2">
              File must follow the exact order: Question,Option A,Option
              B,Option C,Option D,Answer
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {questions.length > 0 && (
              <button
                onClick={() => {
                  setOpenPreview(true);
                }}
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-blue-50 transition duration-200 bg-white text-gray-700 font-medium"
              >
                Preview & Edit Questions ({questions.length})
              </button>
            )}
            {questions.length > 0 && (
              <button
                onClick={handleSaveToBackend}
                disabled={isUploading}
                className="px-6 py-2 rounded-md bg-[#003973] text-white hover:bg-blue-800 transition-colors font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={18} />
                {isUploading ? "Uploading..." : "Quick Save & Upload"}
              </button>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Mobile Sidebar Overlay */}
      {isAdminSideBarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsAdminSideBarOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
export default Questions;