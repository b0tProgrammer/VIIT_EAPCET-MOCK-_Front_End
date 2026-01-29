import { useState, useEffect } from "react";
import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import Footer from "../components/Footer";
import { Menu as MenuIcon, X } from "lucide-react";
import logo from "../assets/Logov1.svg";

// Voucher Modal Component
const VoucherModal = ({ paperId, topStudents, onClose, onSubmit }) => {
  const [vouchers, setVouchers] = useState(
    topStudents.map((_, index) => ({ rank: index + 1, code: '' }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVoucherChange = (index, value) => {
    const updated = [...vouchers];
    updated[index].code = value;
    setVouchers(updated);
  };

  const handleSubmit = async () => {
    // Validate that all codes are non-empty
    if (vouchers.some(v => !v.code.trim())) {
      alert('Please enter voucher codes for all students.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(vouchers);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#003973] to-[#005ca0] px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Amazon Voucher Codes for Top Students</h3>
          <button
            className="text-white hover:text-gray-200 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Enter Amazon voucher codes for the top {topStudents.length} students. These will be sent in their result email.
          </p>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rank {index + 1}: {student.name} (Score: {student.score})
                </label>
                <input
                  type="text"
                  placeholder="Enter voucher code (e.g., AMZN-XXXX-XXXX)"
                  value={vouchers[index].code}
                  onChange={(e) => handleVoucherChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003973] focus:outline-none"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-[#003973] text-white hover:bg-[#005ca0] transition-colors font-medium disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Results & Vouchers'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Reports() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReports, setExpandedReports] = useState({});
  const [voucherModal, setVoucherModal] = useState({ show: false, paperId: null, topStudents: [] });
  const [isSubmittingMail, setIsSubmittingMail] = useState(false);
  const API = import.meta.env.VITE_API_URL || "https://viiteapcet-backend.onrender.com";
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/admin/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetch reports response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports");
      }

      console.log("Reports data received:", data.reports);
      setReports(data.reports);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };
/*
  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };
*/
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };


  // Fetch top 10 students and open voucher modal
  const handleSendMails = async (paperId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch top 10 students for this paper
      const response = await fetch(`${API}/api/admin/top-students/${paperId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message}`);
        return;
      }

      // Open voucher modal with top students
      setVoucherModal({
        show: true,
        paperId: paperId,
        topStudents: data.topStudents || []
      });
    } catch (err) {
      console.error("Failed to fetch top students:", err);
      alert("An error occurred while fetching top students.");
    }
  };

  // Submit vouchers and send results
  const handleSubmitVouchers = async (vouchers) => {
    try {
      setIsSubmittingMail(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/api/admin/send-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paperId: voucherModal.paperId,
          vouchers: vouchers
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setVoucherModal({ show: false, paperId: null, topStudents: [] });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to send mails with vouchers:", err);
      alert("An error occurred while sending emails.");
    } finally {
      setIsSubmittingMail(false);
    }
  };

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

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-20 w-20">
                  <img src={logo} alt="Loading..." />
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium">Error: {error}</p>
                <button
                  onClick={fetchReports}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* No Reports State */}
            {!loading && !error && reports.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 text-lg">
                  No reports available yet.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Reports will appear here once exams are created and attempted.
                </p>
              </div>
            )}

            {/* Reports List */}
            {!loading && !error && reports.length > 0 && (
              <>
                {/* Latest/Featured Report */}
                {reports[0] && (
                  <div className="bg-[#eaf6ff] rounded-xl shadow-md p-6 border border-blue-100 mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">
                      {reports[0].title}
                    </h3>

                    <div className="text-base text-gray-700 space-y-1 mb-6">
                      
                      <div>
                        Start Date:{" "}
                        <span className="font-medium">
                          {formatDate(reports[0].startDate)}
                        </span>
                      </div>
                      <div>
                        Total Students:{" "}
                        <span className="font-medium">
                          {reports[0].completed}
                        </span>
                      </div>
                      <div>
                        Avg Score:{" "}
                        <span className="font-medium">
                          {reports[0].avgScore}
                        </span>
                      </div>
                      <div>
                        Status:{" "}
                        <span className="font-medium">{reports[0].status}</span>
                      </div>
                    </div>

                    {/* Subject-wise Analytics */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-[#eaf6ff] rounded-xl border border-gray-800 shadow-sm p-6 w-full max-w-4xl overflow-hidden">
                        <div className="text-lg font-medium text-gray-700 mb-4">
                          Subject-Wise Analytics Report
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
                              {reports[0].subjectAnalytics &&
                                reports[0].subjectAnalytics.map(
                                  (subject, idx) => (
                                    <tr key={idx}>
                                      <td className="py-3 px-4 border border-gray-800 capitalize">
                                        {subject.subject.toLowerCase()}
                                      </td>
                                      <td className="py-3 px-4 border border-gray-800">
                                        {subject.avgScore}/{subject.maxMarks}
                                      </td>
                                      <td className="py-3 px-4 border border-gray-800">
                                        {subject.maxMarks}
                                      </td>
                                    </tr>
                                  )
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Participation Stats */}
                    <div className="text-base text-gray-700 space-y-1 mb-4">
                      <div>
                        Registered:{" "}
                        <span className="font-medium">
                          {reports[0].registered}
                        </span>
                      </div>
                      <div>
                        Attempted:{" "}
                        <span className="font-medium">
                          {reports[0].attempted}
                        </span>
                      </div>
                      <div>
                        Attempt:{" "}
                        <span className="font-medium">
                          {reports[0].attemptPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => handleSendMails(reports[0].id)}
                        className="bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:bg-gray-50"
                      >
                        + Send Mails
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsible older reports */}
                {reports.length > 1 && (
                  <div className="space-y-2">
                    {reports.slice(1).map((report) => (
                      <details
                        key={report.id}
                        className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:border-gray-300 transition"
                      >
                        <summary className="cursor-pointer text-gray-800 font-medium">
                          + Results For {report.title}
                        </summary>
                        <div className="mt-3 border-t border-gray-200 pt-3">
                          <div className="text-base text-gray-700 space-y-1 mb-4">
                            <div>
                              Start Date:{" "}
                              <span className="font-medium">
                                {formatDate(report.startDate)}
                              </span>
                            </div>
                            <div>
                              Total Students:{" "}
                              <span className="font-medium">
                                {report.totalStudents}
                              </span>
                            </div>
                            <div>
                              Registered:{" "}
                              <span className="font-medium">
                                {report.registered}
                              </span>
                            </div>
                            <div>
                              Attempted:{" "}
                              <span className="font-medium">
                                {report.attempted}
                              </span>
                            </div>
                            <div>
                              Completed:{" "}
                              <span className="font-medium">
                                {report.completed}
                              </span>
                            </div>
                            <div>
                              Avg Score:{" "}
                              <span className="font-medium">
                                {report.avgScore}
                              </span>
                            </div>
                            <div>
                              Status:{" "}
                              <span className="font-medium">
                                {report.isActive ? "Active" : "Complete"}
                              </span>
                            </div>
                          </div>

                          {Array.isArray(report.subjectAnalytics) &&
                            report.subjectAnalytics.length > 0 && (
                              <div className="flex justify-center mb-4">
                                <div className="bg-[#eaf6ff] rounded-xl border border-gray-800 shadow-sm p-6 w-full max-w-4xl overflow-hidden">
                                  <div className="text-lg font-medium text-gray-700 mb-4">
                                    Subject-Wise Analytics Report
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
                                        {report.subjectAnalytics.map(
                                          (subject, idx) => (
                                            <tr key={idx}>
                                              <td className="py-3 px-4 border border-gray-800 capitalize">
                                                {subject.subject.toLowerCase()}
                                              </td>
                                              <td className="py-3 px-4 border border-gray-800">
                                                {subject.avgScore}/
                                                {subject.maxMarks}
                                              </td>
                                              <td className="py-3 px-4 border border-gray-800">
                                                {subject.maxMarks}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )}

                          <div className="mt-2">
                            <button
                              onClick={() => handleSendMails(report.id)}
                              className="bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:bg-gray-50"
                            >
                              + Send Mails
                            </button>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
      
      {voucherModal.show && (
        <VoucherModal
          paperId={voucherModal.paperId}
          topStudents={voucherModal.topStudents}
          onClose={() => setVoucherModal({ show: false, paperId: null, topStudents: [] })}
          onSubmit={handleSubmitVouchers}
        />
      )}
    </div>
  );
}
