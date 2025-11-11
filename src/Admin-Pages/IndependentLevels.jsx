import { useState } from "react";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import AdminSideBar from "../components/AdminSiderBar";
import { Menu as MenuIcon } from "lucide-react";

const subjects = [
  { name: "Mathematics", questions: 80 },
  { name: "Physics", questions: 40 },
  { name: "Chemistry", questions: 40 },
];

export default function IndependentLevels() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);

  // Store difficulty levels
  const [difficulties, setDifficulties] = useState(() => {
    const init = {};
    subjects.forEach((subj) => {
      init[subj.name] = Array(subj.questions).fill(1); // default = Easy (1)
    });
    return init;
  });

  // Handle difficulty cycling
  const diff = [1, 2, 3]; // 1: Easy, 2: Medium, 3: Hard
  const handleClick = (subject, index) => {
    setDifficulties((prev) => {
      const updated = { ...prev };
      const current = updated[subject][index];
      updated[subject][index] = diff[(current+1) % diff.length];
      return updated;
    });
  };

  const getTextColor = (level) => {
    switch (level) {
      case 1:
        return "text-green-600"; // Easy
      case 2:
        return "text-yellow-600"; // Medium
      case 3:
        return "text-red-600"; // Hard
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <NavBarMain />

      <div className="flex min-h-screen bg-[#f9fcff] font-[Poppins] text-gray-800 relative">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 
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

        {/* Overlay for mobile */}
        {isAdminSideBarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsAdminSideBarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col py-10 px-4 sm:px-6 lg:px-10">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2 font-medium self-start"
            onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
          >
            <MenuIcon size={24} />
            <span>Menu</span>
          </button>

          {/* Centered content container */}
          <div className="w-full max-w-[1200px] mx-auto space-y-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#003973]">
              Choose Independent Level for Each Question!
            </h2>

            {subjects.map((subject) => (
              <div key={subject.name}>
                <h3 className="font-bold text-lg mb-3 text-[#003973]">
                  {subject.name}
                </h3>

                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2 justify-items-center">
                  {difficulties[subject.name].map((level, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleClick(subject.name, idx)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center 
                        border border-[#0080FF] rounded-[30px] 
                        bg-[#F0FEFF] shadow-[0_5px_10px_rgba(0,0,0,0.3)]
                        hover:scale-105 active:scale-95 transition-transform duration-200 
                        font-medium text-sm ${getTextColor(level)}`}
                      title={`Q${idx + 1}: ${
                        level === 1 ? "Easy" : level === 2 ? "Medium" : "Hard"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Note */}
            <div className="text-sm text-gray-600 mt-6 text-center">
              *Tap each box to change its difficulty level (1 → Easy, 2 → Medium, 3 → Hard)
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="px-5 py-2 bg-[#F0FEFF] text-black border border-[#0080FF] rounded-xl shadow-md hover:shadow-lg transition">
                Preview Paper
              </button>
              <button className="px-5 py-2 bg-[#F0FEFF] text-black border border-[#0080FF] rounded-xl shadow-md hover:shadow-lg transition">
                Save as Draft
              </button>
            </div>

            <div className="flex justify-center mt-6">
              <button className="px-6 py-2 bg-white border-2 border-[#0080FF] rounded-xl shadow-md font-semibold text-[#0080FF] hover:bg-[#F0FEFF] transition">
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