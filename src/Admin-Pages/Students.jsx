import { useState } from "react";
import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import Footer from "../components/Footer";
import { Menu as MenuIcon, RefreshCw } from "lucide-react";

export default function Students() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const API_BASE_URL = "http://localhost:3000/api/admin/exam-stats";
  const token = localStorage.getItem("token");

  const [totals, setTotals] = useState({
    totalStudents: 0,
    registered: 0,
    attemptingStudents: 0,
    topRankers: [],
    alerts: [
      {},
    ],
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch exam stats");
      const data = await response.json();
      console.log("Refresh data:", data);
      setTotals(data);
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fcff] font-poppins text-gray-800">
      {/* === Navbar === */}
      <NavBarMain />
      {/* === Page Layout === */}
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
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

        {/* === Main Section === */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Action Bar */}
          <div className="w-full bg-white shadow-sm border-b border-blue-100 sticky top-0 z-30">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Sidebar Toggle (Mobile) */}
              <button
                className="lg:hidden text-[#003973] flex items-center gap-2 font-medium"
                onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
              >
                <MenuIcon size={22} />
              </button>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-semibold text-[#003973] flex-1 text-center order-last lg:order-none">
                Active Participants
              </h1>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-[#eaf6ff] text-[#003973] font-medium shadow-sm hover:bg-blue-50 transition ${
                  isRefreshing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw
                  className={isRefreshing ? "animate-spin" : ""}
                  size={18}
                />
                <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>
          </div>

          {/* === Main Content === */}
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
            {/* Total Users */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-50 rounded-2xl shadow-md px-6 py-5 border border-blue-200 w-full max-w-3xl">
                <div className="flex items-center justify-center">
                  <div className="bg-[#eaf6ff] rounded-lg px-6 py-4 shadow-sm flex flex-col items-center">
                    <div className="text-5xl font-extrabold text-[#003973]">
                      {totals.totalStudents}
                    </div>
                    <div className="text-xl text-gray-700">Total Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Info Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Live Detailed Info
              </h3>

              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {/* Registered */}
                  <div className="bg-[#eaf6ff] rounded-lg shadow-md p-6 border border-blue-100 flex items-center justify-center space-x-4 w-72">
                    <div className="bg-blue-50 rounded-lg w-20 h-20 flex items-center justify-center">
                      <div className="text-3xl font-bold text-[#003973]">
                        {totals.registered ? totals.registered : 0}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500">Students</div>
                      <div className="text-base font-medium text-[#003973]">
                        Registered
                      </div>
                    </div>
                  </div>

                  {/* attemptingStudents */}
                  <div className="bg-[#eaf6ff] rounded-lg shadow-md p-6 border border-blue-100 flex items-center justify-center space-x-4 w-72">
                    <div className="bg-blue-50 rounded-lg w-20 h-20 flex items-center justify-center">
                      <div className="text-3xl font-bold text-[#003973]">
                        {totals.attemptingStudents}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500">Students</div>
                      <div className="text-base font-medium text-[#003973]">
                        attemptingStudents
                      </div>
                    </div>
                  </div>

                  {/* Top 5 */}
                  <div className="bg-[#eaf6ff] rounded-lg shadow-md p-6 border border-blue-100 w-72">
                    <h4 className="text-base font-semibold text-[#003973] mb-2 text-center">
                      Top 5 Rankers of Last Test
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 text-center">
                      {totals.topRankers.map((t, i) => (
                        <li key={i} className="truncate">
                          {i + 1}. {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Alerts */}
            <section className="mt-10 mb-12">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Alerts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {totals.alerts?.map((a) =>
                  a.meta ? (
                    <div
                      key={a.id}
                      className="bg-[#eaf6ff] rounded-lg shadow-sm p-4 border border-blue-100"
                    >
                      <div className="text-sm text-gray-600">{a.meta}</div>
                      <div className="text-sm text-gray-800 font-medium mt-2">
                        {a.text}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={a.id}
                      className="bg-[#eaf6ff] rounded-lg shadow-sm p-4 border border-blue-100 flex items-center justify-center"
                    >
                      <div className="text-base text-gray-800 font-medium">
                        {a.text}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
      {isAdminSideBarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <aside className="bg-white w-64 p-4 shadow-xl border-r border-blue-100">
            <AdminSideBar />
          </aside>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsAdminSideBarOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
