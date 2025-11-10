import React, { useRef } from "react";
import AdminSideBar from "../components/AdminSiderBar";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";

function Questions() {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploaded file: ${file.name}`);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "Question,Option A,Option B,Option C,Option D,Answer\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "question_template.csv";
    link.click();
  };

  return (
    <>
    <NavBarMain />
    <div className="flex min-h-screen bg-gray-50 font-[Poppins]">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
          Add Question
        </h2>

        {/* Upload Section */}
        <div className="flex flex-col space-y-3 mb-8">
          <button
            onClick={handleUploadClick}
            className="px-5 py-2 rounded-md border border-blue-300 text-blue-700 bg-white shadow-sm hover:bg-blue-50 transition-all duration-300 w-fit"
          >
            + Upload
          </button>
          <input
            type="file"
            accept=".csv,.xlsx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-xs text-gray-500">
            Upload Questions in .CSV / .xlsx format
          </span>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 p-5 rounded-md shadow-sm border border-blue-100 mb-8">
          <p className="text-sm font-semibold text-gray-800 mb-2">IMPORTANT</p>
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-1 rounded-md border border-blue-300 text-blue-700 bg-white shadow-sm hover:bg-blue-50 transition-all duration-300"
          >
            Download Model
          </button>
          <p className="text-xs text-gray-600 mt-2">
            File should be in this above format. Please go through the template.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200">
            Add questions
          </button>
          <button className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200">
            Preview Added Questions
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Questions;
