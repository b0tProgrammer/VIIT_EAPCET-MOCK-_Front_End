import { useState } from "react";
import AdminSideBar from "../components/AdminSiderBar";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import { Menu as MenuIcon } from "lucide-react";

export default function Students() {

  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false); // initially hidden on mobile

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBarMain />

      <div className="flex flex-1 overflow-hidden">
        <AdminSideBar
          isAdminSideBarOpen={isAdminSideBarOpen}
          setIsAdminSideBarOpen={setIsAdminSideBarOpen}
         />
        <main className="flex-1 overflow-y-auto px-6 py-8">

          {/* Mobile toggle button */}
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2 font-medium"
            onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
          >
            <MenuIcon size={24} />
          </button>

          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              Active Participants
            </h2>

            {/* Top centered pill */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-50 rounded-2xl shadow-md px-6 py-5 border border-blue-200 w-full max-w-3xl">
                <div className="flex items-center justify-center">
                  <div className="bg-[#eaf6ff] rounded-lg px-6 py-4 shadow-sm flex flex-col items-center">
                    <div className="text-5xl font-extrabold text-[#003973]">1234</div>
                    <div className="text-xl text-gray-700">Total Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Detailed Info */}
<section className="mt-10">
  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
    Live Detailed Info.
  </h3>

  <div className="flex justify-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      {/* Students Registered */}
      <div className="bg-[#eaf6ff] rounded-lg shadow-md p-6 border border-blue-100 flex items-center justify-center space-x-4 w-72">
        <div className="bg-blue-50 rounded-lg w-20 h-20 flex items-center justify-center">
          <div className="text-3xl font-bold text-[#003973]">103</div>
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-500">Students</div>
          <div className="text-base font-medium text-[#003973]">Registered</div>
        </div>
      </div>

      {/* Students Attempting */}
      <div className="bg-[#eaf6ff] rounded-lg shadow-md p-6 border border-blue-100 flex items-center justify-center space-x-4 w-72">
        <div className="bg-blue-50 rounded-lg w-20 h-20 flex items-center justify-center">
          <div className="text-3xl font-bold text-[#003973]">95</div>
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-500">Students</div>
          <div className="text-base font-medium text-[#003973]">Attempting</div>
        </div>
      </div>

      {/* Top 5 Rankers */}
      <div className="bg-[#eaf6ff] rounded-lg shadow-md p-6 border border-blue-100 w-72">
        <h4 className="text-base font-semibold text-[#003973] mb-2 text-center">Top 5 Rankers</h4>
        <ul className="text-sm text-gray-700 space-y-1 text-center">
          <li>1. John &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="font-medium">VCET_123</span></li>
          <li>2. Amilly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="font-medium">VCET_123</span></li>
          <li>3. Rock &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="font-medium">VCET_123</span></li>
          <li>4. Stark &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="font-medium">VCET_123</span></li>
          <li>5. Peter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="font-medium">VCET_123</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>


            {/* Alerts */}
            <h3 className="text-lg font-medium text-gray-700 mb-4">Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#eaf6ff] rounded-lg shadow-sm p-4 border border-blue-100">
                <div className="text-sm text-gray-600">Id: VCET_234</div>
                <div className="text-sm text-gray-800 font-medium mt-2">Exam Terminated for shifting tabs</div>
              </div>

              <div className="bg-[#eaf6ff] rounded-lg shadow-sm p-4 border border-blue-100 flex items-center justify-center">
                <div className="text-base text-gray-800 font-medium">24 Students Completed Exam</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
