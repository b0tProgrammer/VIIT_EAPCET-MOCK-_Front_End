import { useState, useEffect, useCallback } from "react";
import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import Footer from "../components/Footer";
import { Menu as MenuIcon, RefreshCw } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://viiteapcet-backend.onrender.com";
const REFRESH_INTERVAL = 300;

export default function Students() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL);

  const token = localStorage.getItem("token");

  const [totals, setTotals] = useState({
    totalStudents: 0,
    registered: 0,
    attemptingStudents: 0,
    topRankers: [],
    alerts: [],
  });

  const[currentExam,setCurrentExam] = useState();

  const fetchStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/exam-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch exam stats");

      const data = await response.json();
      setTotals(data);  
      setCurrentExam(data.currentExam?.title)
      setSecondsLeft(REFRESH_INTERVAL);
      console.log(data);
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();

    const apiInterval = setInterval(() => {
      fetchStats();
    }, REFRESH_INTERVAL * 1000);

    return () => clearInterval(apiInterval);
  }, [fetchStats]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleRefresh = async () => {
    await fetchStats();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fcff] font-poppins text-gray-800">
      <NavBarMain />

      <div className="flex flex-1">
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

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="w-full bg-white shadow-sm border-b border-blue-100 sticky top-0 z-30">
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
              <button
                className="lg:hidden text-[#003973]"
                onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
              >
                <MenuIcon size={22} />
              </button>

              <h1 className="text-2xl font-semibold text-[#003973]">
                Active Participants
              </h1>

              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-[#eaf6ff] text-[#003973] font-medium shadow-sm hover:bg-blue-50 transition ${
                    isRefreshing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <RefreshCw
                    size={18}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>

                <span className="text-xs text-gray-500">
                  Auto refresh in <b>{secondsLeft}s</b>
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-[1200px] mx-auto px-6 py-8">
            {/* Total */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#eaf6ff] px-10 py-6 rounded-xl shadow-md">
                <div className="text-5xl font-bold text-[#003973] text-center">
                  {totals.totalStudents}
                </div>
                <div className="text-xl text-gray-700 text-center">
                  Total Users
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
              <StatCard label="Recent Exam" value={currentExam} />
              <StatCard label="Attempting" value={totals.attemptingStudents} />
              <div className="bg-[#eaf6ff] p-6 rounded-lg shadow-md border border-blue-100">
                <h4 className="text-center font-semibold text-[#003973] mb-3">
                  Top 5 Rankers
                </h4>
                <ul className="text-sm text-center space-y-1">
                  {totals.topRankers.map((t, i) => (
                    <li key={i}>
                      {i + 1}. {t.name} - {t.score}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section className="mt-10 mb-12">
               
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Alerts
              </h3> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {totals.alerts? (totals.alerts.map((a) =>
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
                )) : (
                  <div className="col-span-2 text-center text-gray-500">
                    No alerts available.
                  </div>
                )} 
              </div> 
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#eaf6ff] p-6 rounded-lg shadow-md border border-blue-100 text-center">
      <div className="text-4xl font-bold text-[#003973]">{value}</div>
      <div className="text-gray-700 mt-1">{label}</div>
    </div>
  );
}
