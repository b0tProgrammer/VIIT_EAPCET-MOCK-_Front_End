import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import { useState } from "react";
import Footer from "../components/Footer";

export default function TeacherDashboard() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(true);

  return (
    <>
      <NavBarMain />
      <div className="flex min-h-screen bg-[#f9fcff] font-[Poppins]">
        <AdminSideBar isAdminSideBarOpen={isAdminSideBarOpen} setIsSidebarOpen={setIsAdminSideBarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {/* Changed "Hello Teacher, Welcome" to "Hello Admin, Welcome" */}
          <h1 className="text-2xl font-bold text-black mb-6">Hello Admin, Welcome</h1>

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Modified the first stat card to be "Total Users" with larger text */}
            <div className="bg-[#eaf6ff] text-center rounded-2xl shadow-md p-6 col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center">
              <h2 className="text-5xl font-bold text-[#003973] mb-2">69</h2>
              <p className="text-gray-700 font-medium text-xl">Total Users</p> {/* Increased font size */}
            </div>

            {/* "Active Exams" card */}
            <div className="bg-[#eaf6ff] text-center rounded-2xl shadow-md p-6 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold text-[#003973] mb-2">69</h2>
              <p className="text-gray-700 font-medium">Active Exams</p>
            </div>

            {/* "Average Score" card */}
            <div className="bg-[#eaf6ff] text-center rounded-2xl shadow-md p-6 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold text-[#003973] mb-2">118/160</h2>
              <p className="text-gray-700 font-medium">Average Score</p>
            </div>
          </div>

          {/* Upcoming Exams */}
          <section>
            <h2 className="text-xl font-semibold text-black mb-4">Upcoming Exams</h2>

            <div className="space-y-4">
              {[
                { name: "Mock_Exam_22", time: "01:00:00" },
                { name: "Mock_Exam_23", time: "02:00:00" },
                { name: "Mock_Exam_24", time: "03:00:00" },
              ].map((exam, index) => (
                <div
                  key={index}
                  className="bg-[#eaf6ff] rounded-xl shadow-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-600">Next Mock Test In</p>
                    <h3 className="text-lg font-semibold text-[#003973]">{exam.name}</h3>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold text-black">{exam.time}</h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-md text-gray-700">
                      Starts in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity - Keeping the existing structure as no specific visual was provided for it */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-black mb-4">Recent Activity</h2>
            <div className="bg-[#eaf6ff] rounded-xl p-4 shadow-md text-gray-600">
              No recent activity available.
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}