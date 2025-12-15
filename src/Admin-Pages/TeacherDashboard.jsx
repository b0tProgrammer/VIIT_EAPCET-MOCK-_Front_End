import { useState, useEffect } from "react";
import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Menu as MenuIcon } from "lucide-react";

export default function TeacherDashboard() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, forceTick] = useState(0);

  const API_BASE_URL = "http://localhost:3000/api/admin/stats";
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch admin stats");

        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getTimeLeft(startTime) {
    const startDate = new Date(startTime);
    const now = new Date();
    const diff = startDate - now;

    if (diff <= 0) return "Started";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (loading || !details) {
    return <Loader />;
  }

  return (
    <>
      <NavBarMain />

      <div className="flex flex-1 bg-[#f9fcff] font-poppins relative">
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white
          transform transition-transform duration-300 z-50
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

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <button
            className="lg:hidden mb-4 text-[#003973] flex items-center gap-2"
            onClick={() => setIsAdminSideBarOpen(!isAdminSideBarOpen)}
          >
            <MenuIcon size={24} />
          </button>

          <h1 className="text-2xl font-bold mb-6">Hello Admin, Welcome</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard label="Total Users" value={details.totalStudents} />
            <StatCard
              label="Active Exam(s)"
              value={details.upcomingExamsCount}
            />
            <StatCard label="Average Score" value={details.averageScore} />
          </div>

          {/* Upcoming Exams */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>

            <div className="space-y-4">
              {details.upcomingExamsDetails.map((exam, index) => (
                <div
                  key={index}
                  className="bg-[#eaf6ff] rounded-xl shadow-md p-4 flex justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      {exam.durationHours} hrs | {exam.totalMarks} marks
                    </p>
                    <h3 className="text-lg font-semibold">{exam.title}</h3>
                  </div>

                  <div className="text-right">
                    <h3 className="text-xl font-bold">{getTimeLeft(exam.startTime)}</h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Starts in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#eaf6ff] rounded-2xl shadow-md p-6 text-center">
      <h2 className="text-3xl font-bold text-[#003973] mb-2">{value}</h2>
      <p className="text-gray-700 font-medium">{label}</p>
    </div>
  );
}
