import { useRef, useState, useMemo, useCallback } from "react";
import JoditEditor from "jodit-react";
import AdminSideBar from "../components/AdminSiderBar";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import {
  Menu as MenuIcon,
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  PlusCircle,
} from "lucide-react";

const API_BASE_URL = 'http://localhost:3000';

// --- Helper Component: Jodit Rich Text Editor Wrapper ---
const RichTextEditor = ({ value, onChange, placeholder, height = 300 }) => {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || "Start typing...",
    height: height,
    toolbarAdaptive: false,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "subscript", "superscript", "|",
      "ul", "ol", "|",
      "fontsize", "|",
      "align", "undo", "redo"
    ],
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
  }), [placeholder, height]);

  // Use a proper callback to prevent infinite re-renders or performance issues
  const handleBlur = useCallback((newContent) => {
    // Jodit returns the content within a P tag sometimes, so let's clean up
    const cleanedContent = newContent.replace(/<p>|<\/p>/g, "").trim();
    onChange(cleanedContent);
  }, [onChange]);


  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={handleBlur} // Use the useCallback version
        // onChange={(newContent) => {}} // Remove unnecessary onChange
      />
    </div>
  );
};

// --- Custom CSV Parser for simplicity (RECOMMEND using papaparse for production) ---
const simpleCSVParse = (csvText) => {
    // Simple regex to split by comma, ignoring commas inside quotes.
    // NOTE: This is an oversimplification. A full parser like papaparse is recommended.
    const rows = csvText.trim().split("\n").slice(1); // skip header
    
    return rows.map((row, index) => {
        // Simple attempt to split by comma, removing surrounding quotes and trimming
        const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const cleanedCols = cols.map(c => c.trim().replace(/^"|"$/g, ''));

        if (cleanedCols.length < 6) return null; // Skip invalid rows

        return {
            id: Date.now() + index,
            question: cleanedCols[0] || "",
            optionA: cleanedCols[1] || "",
            optionB: cleanedCols[2] || "",
            optionC: cleanedCols[3] || "",
            optionD: cleanedCols[4] || "",
            answer: cleanedCols[5] || "",
            questionImage: null, questionImagePreview: null,
            optionAImage: null, optionAImagePreview: null,
            optionBImage: null, optionBImagePreview: null,
            optionCImage: null, optionCImagePreview: null,
            optionDImage: null, optionDImagePreview: null,
        };
    }).filter(q => q !== null);
};


function Questions() {
  const fileInputRef = useRef(null);
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = simpleCSVParse(text); // Use the custom parser
      
      setQuestions(parsed);
      setShowPreview(true); // Automatically open preview after upload
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  const handleDownloadTemplate = () => {
    const csvContent = "Question,Option A,Option B,Option C,Option D,Answer\n" + 
                       "\"What is the capital of France?\",Paris,London,Rome,Berlin,\"Option A\"\n" +
                       "\"Which option is correct?\",TRUE,FALSE,Maybe,None,\"Option A\""; // Added example content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "question_template.csv";
    link.click();
  };

  // --- Handlers for Editing ---

  const handleAddQuestion = () => {
      const newQuestion = {
          id: Date.now(),
          question: "New Question Text",
          optionA: "Option A Text",
          optionB: "Option B Text",
          optionC: "Option C Text",
          optionD: "Option D Text",
          answer: "Option A", // Default answer
          questionImage: null, questionImagePreview: null,
          optionAImage: null, optionAImagePreview: null,
          optionBImage: null, optionBImagePreview: null,
          optionCImage: null, optionCImagePreview: null,
          optionDImage: null, optionDImagePreview: null,
      };
      setQuestions((prev) => [...prev, newQuestion]);
      setShowPreview(true);
  };
  
  const handleTextChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };
  
  const handleRemoveQuestion = (id) => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      // Cleanup Object URLs for the removed question
      const removedQ = questions.find(q => q.id === id);
      if (removedQ) {
          const imageFields = ['question', 'optionA', 'optionB', 'optionC', 'optionD'];
          imageFields.forEach(field => {
              if (removedQ[`${field}ImagePreview`]) {
                  URL.revokeObjectURL(removedQ[`${field}ImagePreview`]);
              }
          });
      }
  };


  const handleImageChange = (id, targetField, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
           // Revoke previous URL if one existed
           if (q[`${targetField}ImagePreview`]) {
               URL.revokeObjectURL(q[`${targetField}ImagePreview`]);
           }
           return { 
              ...q, 
              [`${targetField}Image`]: file, 
              [`${targetField}ImagePreview`]: imageUrl 
           };
        }
        return q;
      })
    );
    e.target.value = "";
  };

  const handleRemoveImage = (id, targetField) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (q[`${targetField}ImagePreview`]) {
            URL.revokeObjectURL(q[`${targetField}ImagePreview`]);
          }
          return { 
            ...q, 
            [`${targetField}Image`]: null, 
            [`${targetField}ImagePreview`]: null 
          };
        }
        return q;
      })
    );
  };

  const handleSaveToBackend = async () => {
    if (questions.length === 0) {
        alert("No questions to upload.");
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    const questionsPayload = [];

    // 1. Prepare FormData for text and images
    questions.forEach((q, index) => {
        const questionData = {
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            answer: q.answer,
            id: q.id,
        };

        const imageFields = ['question', 'optionA', 'optionB', 'optionC', 'optionD'];
        imageFields.forEach(field => {
            if (q[`${field}Image`]) {
                // Append the actual File object to FormData
                // The key must be unique, so use index + field name
                const formKey = `image_${index}_${field}`;
                formData.append(formKey, q[`${field}Image`], q[`${field}Image`].name);
                // In the payload, only store the key used in FormData
                questionData[`${field}ImageKey`] = formKey;
            }
        });
        
        questionsPayload.push(questionData);
    });

    // 2. Append the JSON payload of question text data
    formData.append('questions', JSON.stringify(questionsPayload));

    // 3. Send to Backend
    try {
        const response = await fetch(`${API_BASE_URL}/api/teacher/save-questions`, {
            method: 'POST',
            // Do NOT manually set Content-Type header when using FormData, 
            // the browser sets it correctly (multipart/form-data) with the boundary.
            // headers: { 'Content-Type': 'multipart/form-data' }, // <--- Important: DO NOT SET THIS MANUALLY!
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload questions");
        }

        const result = await response.json();
        alert(`Success: ${result.message || "Questions uploaded successfully!"}`);
        
        // Cleanup state after successful upload
        questions.forEach(q => {
             const imageFields = ['question', 'optionA', 'optionB', 'optionC', 'optionD'];
             imageFields.forEach(field => {
                 if (q[`${field}ImagePreview`]) URL.revokeObjectURL(q[`${field}ImagePreview`]);
             });
        });
        setQuestions([]);
        setFileName("");
        setShowPreview(false);

    } catch (error) {
        console.error("Upload Error:", error);
        alert(`Error during upload: ${error.message}`);
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fcff] font-poppins text-gray-800">
      <NavBarMain />

      <div className="flex flex-1">
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${
            isAdminSideBarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Add Question</h2>

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
                    onClick={handleAddQuestion}
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
                <span>Questions loaded from: **{fileName}**</span>
              </div>
            )}
            {!fileName && questions.length === 0 && <span className="text-xs text-gray-500">Upload Questions in .CSV format or add manually.</span>}
            {questions.length > 0 && <span className="text-sm text-gray-600 font-medium">{questions.length} questions loaded and ready for review.</span>}
          </div>

          {/* Template Info */}
          <div className="bg-blue-50 p-5 rounded-md shadow-sm border border-blue-100 mb-8">
            <p className="text-sm font-semibold text-gray-800 mb-2">CSV TEMPLATE</p>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-1 rounded-md border border-blue-300 text-blue-700 bg-white shadow-sm hover:bg-blue-50 transition-all duration-300"
            >
              Download Model
            </button>
            <p className="text-xs text-gray-600 mt-2">File must follow the exact order: **Question,Option A,Option B,Option C,Option D,Answer**</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {questions.length > 0 && (
                <button
                    onClick={() => setShowPreview(true)}
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
          <div className="flex flex-wrap gap-4">
            {/* Show Preview button only if questions are loaded/edited */}
            {questions.length > 0 && (
                <button
                    onClick={() => setShowPreview(true)}
                    className="px-5 py-2 border border-gray-300 rounded-md hover:bg-blue-50 transition duration-200 bg-white text-gray-700 font-medium"
                >
                    Preview & Edit Questions ({questions.length})
                </button>
            )}
             {/* Show Quick Save button only if questions are loaded */}
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

      {/* === PREVIEW & EDIT POPUP === */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Review & Modify Questions ({questions.length})</h3>
              <div className="flex items-center gap-3">
                 <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-md border border-green-300 text-green-700 bg-white shadow-sm hover:bg-green-50 transition-all duration-300 flex items-center gap-1 text-sm font-medium"
                >
                    <PlusCircle size={16} /> Add
                </button>
                <button
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  onClick={() => setShowPreview(false)}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-8">
              {questions.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No questions loaded. Please upload a CSV file or use the "Add New Question" button.</p>
              ) : (
                questions.map((q, index) => (
                  <div key={q.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                    
                    {/* --- QUESTION SECTION HEADER --- */}
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <span className="font-bold text-[#003973] text-lg">Question {index + 1}</span>
                        <div className="flex items-center gap-3">
                            {/* Image Upload/Change Button */}
                            <label className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors border border-blue-200 font-medium">
                                <ImageIcon size={16} />
                                {q.questionImage ? "Change Image" : "Add Image"}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleImageChange(q.id, 'question', e)}
                                />
                            </label>
                            {/* Remove Question Button */}
                            <button
                                onClick={() => handleRemoveQuestion(q.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                title="Remove this question"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Jodit Editor for Question */}
                    <div className="mb-4">
                      <RichTextEditor 
                        value={q.question}
                        onChange={(val) => handleTextChange(q.id, "question", val)}
                        placeholder="Type the question here..."
                        height={150} // Taller for Question
                      />
                    </div>

                    {/* Question Image Preview */}
                    {q.questionImagePreview && (
                      <div className="mb-6 relative w-fit group border border-gray-200 rounded p-1">
                        <img 
                          src={q.questionImagePreview} 
                          alt="Question Preview" 
                          className="h-40 w-auto object-contain bg-gray-50 rounded"
                        />
                        <button 
                          onClick={() => handleRemoveImage(q.id, 'question')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-transform hover:scale-110"
                          title="Remove Image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    {/* --- OPTIONS SECTION --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {["A", "B", "C", "D"].map((opt) => (
                        <div key={opt} className={`p-3 rounded-md border flex flex-col gap-2 ${
                            q.answer === `Option ${opt}` ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-gray-50 border-gray-100'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-600 text-sm">Option {opt}</span>
                            <label className="cursor-pointer text-xs flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors font-medium">
                              <ImageIcon size={14} />
                              Add Image
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleImageChange(q.id, `option${opt}`, e)}
                              />
                            </label>
                          </div>

                          {/* Jodit Editor for Options */}
                          <RichTextEditor
                            value={q[`option${opt}`]}
                            onChange={(val) => handleTextChange(q.id, `option${opt}`, val)}
                            placeholder={`Enter Option ${opt}`}
                            height={100} // Shorter for Options
                          />

                          {/* Option Image Preview */}
                          {q[`option${opt}ImagePreview`] && (
                            <div className="mt-2 relative w-fit border border-gray-200 rounded p-1 bg-white">
                              <img 
                                src={q[`option${opt}ImagePreview`]} 
                                alt={`Option ${opt}`} 
                                className="h-24 w-auto object-contain rounded"
                              />
                              <button 
                                onClick={() => handleRemoveImage(q.id, `option${opt}`)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* --- ANSWER SECTION --- */}
                    <div className="mt-6 flex items-center gap-4 p-3 bg-green-100 rounded-md border border-green-300 w-fit">
                      <span className="font-bold text-green-900">Correct Answer:</span>
                      <select
                        className="p-2 border border-green-300 rounded bg-white text-green-900 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer font-bold"
                        value={q.answer}
                        onChange={(e) => handleTextChange(q.id, "answer", e.target.value)}
                      >
                        <option value="Option A">Option A</option>
                        <option value="Option B">Option B</option>
                        <option value="Option C">Option C</option>
                        <option value="Option D">Option D</option>
                      </select>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t p-4 flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                onClick={() => setShowPreview(false)}
              >
                Close Preview
              </button>
              <button
                className="px-6 py-2 rounded-md bg-[#003973] text-white hover:bg-blue-800 transition-colors font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveToBackend}
                disabled={isUploading || questions.length === 0}
              >
                <FileText size={18} />
                {isUploading ? "Saving..." : "Save All Changes & Upload"}
              </button>
            </div>
              
          </div>
        </div>
        
      )}
    </div>
  );
}

export default Questions;