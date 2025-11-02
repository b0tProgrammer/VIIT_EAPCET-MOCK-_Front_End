// components/Student_Dashboard.jsx
import React from "react";

function StudentDashboard() {
  const username = "User_95";
  const nextMockTest = "Mock_Exam_21";
  const examsWritten = 20;
  const passPercentage = "78.2%";

  return (
    <>
      {/* Dashboard Content */}
      <h1 className="text-4xl font-semibold text-gray-800 mb-2">
        Hello {username}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        See your Performance here...
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200">
          <p className="text-gray-600 text-sm mb-2">Next Mock Test In</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-3xl font-bold text-gray-800">
              00:00:00
            </span>
            <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 ease-in-out">
              Start
            </button>
          </div>
          <p className="text-xl font-semibold text-gray-700">
            {nextMockTest}
          </p>
        </div>

        <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-center items-center">
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {examsWritten}
          </p>
          <p className="text-lg text-center text-gray-600">
            Overall Exams Written
          </p>
        </div>

        <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-center items-center">
          <p className="text-5xl font-bold text-gray-800 mb-2">
            {passPercentage}
          </p>
          <p className="text-lg text-center text-gray-600">
            Pass Percentage
          </p>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Performance Overview
        </h3>
        <div className="w-full h-80 bg-gradient-to-tr from-blue-100 to-blue-50 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`h-grid-${i}`}
                x1="0"
                y1={20 * (i + 1)}
                x2="100"
                y2={20 * (i + 1)}
                stroke="#e0e7ff"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`v-grid-${i}`}
                x1={16 * (i + 1)}
                y1="0"
                x2={16 * (i + 1)}
                y2="100"
                stroke="#e0e7ff"
                strokeWidth="0.5"
              />
            ))}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points="5,80 20,60 35,70 50,50 65,40 80,20 95,5"
            />
          </svg>

          {/* Labels */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-around text-xs text-gray-500">
            <span>80</span>
            <span>95</span>
            <span>110</span>
            <span>120</span>
            <span>130</span>
            <span>140</span>
            <span>150</span>
            <span>10</span>
          </div>
          <div className="absolute top-0 bottom-8 left-2 flex flex-col justify-between text-xs text-gray-500 py-2">
            <span>160</span>
            <span>140</span>
            <span>120</span>
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;