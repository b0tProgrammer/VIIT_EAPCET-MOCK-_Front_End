import { useState } from "react";
import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import Footer from "../components/Footer";
import { Menu as MenuIcon } from "lucide-react";

export default function Reports() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-poppins">
      <NavBarMain />

      <div className="flex flex-1">
        {/* ✅ Sidebar inside <aside> and fixed font */}
        {/* Sidebar */}
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

        {/* ✅ Main content area */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {/* Mobile toggle button */}
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2"
            onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
          >
            <MenuIcon size={24} />
          </button>

          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Reports
            </h2>

            {/* Main report card */}
            <div className="bg-[#eaf6ff] rounded-xl shadow-md p-6 border border-blue-100 mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Mock_Exam_20
              </h3>

              <div className="text-base text-gray-700 space-y-1 mb-6">
                <div>
                  Feedback: <span className="font-medium">8.9 of 10</span>
                </div>
                <div>
                  Start Date: <span className="font-medium">01 Nov 25</span>
                </div>
                <div>
                  Total Students: <span className="font-medium">243</span>
                </div>
                <div>
                  Avg Score: <span className="font-medium">84.3</span>
                </div>
                <div>
                  Status: <span className="font-medium">Complete</span>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="bg-[#eaf6ff] rounded-xl border border-gray-800 shadow-sm p-6 w-full max-w-4xl overflow-hidden">
                  <div className="text-lg font-medium text-gray-700 mb-4">
                    3. Subject-Wise Analytics Report
                  </div>
                  <div className="overflow-auto">
                    <table className="w-full text-lg text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 border border-gray-800">
                            Subject
                          </th>
                          <th className="py-3 px-4 border border-gray-800">
                            Avg Score
                          </th>
                          <th className="py-3 px-4 border border-gray-800">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 border border-gray-800">
                            Mathematics
                          </td>
                          <td className="py-3 px-4 border border-gray-800">
                            68.6/80
                          </td>
                          <td className="py-3 px-4 border border-gray-800">
                            80
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border border-gray-800">
                            Physics
                          </td>
                          <td className="py-3 px-4 border border-gray-800">
                            28.6/40
                          </td>
                          <td className="py-3 px-4 border border-gray-800">
                            40
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border border-gray-800">
                            Chemistry
                          </td>
                          <td className="py-3 px-4 border border-gray-800">
                            18.3/40
                          </td>
                          <td className="py-3 px-4 border border-gray-800">
                            40
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="text-base text-gray-700 space-y-1 mb-4">
                <div>
                  Registered: <span className="font-medium">400</span>
                </div>
                <div>
                  Attempted: <span className="font-medium">320</span>
                </div>
                <div>
                  Attempt: <span className="font-medium">90%</span>
                </div>
              </div>

              <div className="mt-4">
                <button className="bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:bg-gray-50">
                  + Send Mails
                </button>
              </div>
            </div>

            {/* Collapsible older reports */}
            <div className="space-y-2">
              <details className="p-3">
                <summary className="cursor-pointer text-gray-800 font-medium">
                  + Results For Mock_Exam_19
                </summary>
              </details>
              <details className="p-3">
                <summary className="cursor-pointer text-gray-800 font-medium">
                  + Results For Mock_Exam_18
                </summary>
              </details>
              <details className="p-3">
                <summary className="cursor-pointer text-gray-800 font-medium">
                  + Results For Mock_Exam_17
                </summary>
              </details>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
