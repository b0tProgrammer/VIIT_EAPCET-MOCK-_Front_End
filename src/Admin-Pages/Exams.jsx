import { useState } from "react";
import AdminSideBar from "../components/AdminSiderBar"; // adjust path if needed
import { Menu as MenuIcon } from "lucide-react";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import {  useNavigate } from "react-router-dom";
export default function CreateQuestionPaper() {
  const [difficulty, setDifficulty] = useState({
    Mathematics: 10,
    Physics: 10,
    Chemistry: 10,
  });
  const navigate = useNavigate();
  const [stream, setStream] = useState("Engineering");
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);

  const handleChange = (subject, value) => {
    setDifficulty((prev) => ({ ...prev, [subject]: Number(value) }));
  };

  return (
    <>
      <NavBarMain />
      <div className="flex flex-1 bg-[#f9fcff] font-poppins text-gray-800">
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
        {/* Main Content */}
        <main className="flex-1 py-10 px-4 sm:px-8 lg:px-12 flex flex-col items-center overflow-y-auto">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2 font-medium self-start"
            onClick={() => {
              setIsAdminSideBarOpen(!isAdminSideBarOpen);
            }}
          >
            <MenuIcon size={24} />
          </button>

          {/* Form Container */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-8 mx-auto">
            <h2 className="text-2xl font-semibold text-[#003973] mb-8 text-center">
              Create Question Paper
            </h2>

            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-5 mb-8">
              {/* Exam Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Exam Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g., 3 hours"
                  className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
                />
              </div>

              {/* Stream Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">Stream</label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-4 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
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
              <div className="flex-1 bg-[#F0FEFF] border border-[#0080FF] rounded-[30px] shadow py-4 text-center cursor-pointer hover:scale-105 transition">
                <p className="text-lg font-semibold text-[#003973]">
                  Percentage
                </p>
                <p className="text-sm text-gray-600">
                  Set the overall difficulty with few clicks
                </p>
              </div>
              <div className="flex-1 bg-[#F0FEFF] border border-[#0080FF] rounded-[30px] shadow py-4 text-center cursor-pointer hover:scale-105 transition"
                onClick={() => navigate("/independentLevels")}
              >
                <p className="text-lg font-semibold text-[#003973]">Custom</p>
                <p className="text-sm text-gray-600">
                  Set each question’s difficulty
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              *Default Percentage is chosen
            </p>

            {/* Difficulty Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border border-gray-300 rounded-xl text-sm">
                <thead className="bg-[#F0FEFF] border-b border-[#0080FF] text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { subject: "Mathematics", total: 80 },
                    { subject: "Physics", total: 40 },
                    { subject: "Chemistry", total: 40 },
                  ].map(({ subject, total }) => (
                    <tr key={subject} className="border-t border-gray-200">
                      <td className="px-4 py-2">{subject}</td>
                      <td className="px-4 py-2">
                        <select
                          value={difficulty[subject]}
                          onChange={(e) =>
                            handleChange(subject, e.target.value)
                          }
                          className="w-full bg-[#F0FEFF] border border-[#0080FF] rounded-lg px-3 py-2 shadow focus:ring-2 focus:ring-[#0080FF] focus:outline-none"
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
                      <td className="px-4 py-2">{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#003973] mb-2">Summary</h3>
              <p>Total Marks: 160</p>
              <p>Total Questions: 160</p>
              <p>
                Difficulty Mix:{" "}
                <span className="text-[#0080FF] font-medium">
                  Math {difficulty.Mathematics}%, Physics {difficulty.Physics}%,
                  Chemistry {difficulty.Chemistry}%
                </span>
              </p>
              <p>
                Stream:{" "}
                <span className="text-[#0080FF] font-medium">{stream}</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-[#003973] text-white px-5 py-2 rounded-lg hover:bg-[#004c99] transition">
                Preview Paper
              </button>
              <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition">
                Save as Draft
              </button>
            </div>

            <div className="flex justify-center mt-6">
              <button className="border-2 border-[#003973] text-[#003973] px-5 py-2 rounded-lg hover:bg-[#003973] hover:text-white transition">
                + Generate Question Paper
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
