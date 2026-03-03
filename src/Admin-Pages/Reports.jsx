import { useState, useEffect } from "react";
import NavBarMain from "../components/NavBarMain";
import AdminSideBar from "../components/AdminSiderBar";
import Footer from "../components/Footer";
import { Menu as MenuIcon, X } from "lucide-react";
import logo from "../assets/LogoV1.png";

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#003973] px-6 py-4 flex justify-between items-center border-b border-blue-800 shrink-0">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Send Results & Vouchers</h3>
          <button
            className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Enter Amazon voucher codes for the top 5 students. These will be sent automatically in their result emails.
            </p>
          </div>

          <div className="space-y-4">
            {topStudents.map((student, index) => (
              <div key={index} className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-gray-800">Rank {index + 1}</span>
                  <span className="text-xs font-medium text-gray-500">{student.name} • {student.score} pts</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter code (e.g., AMZN-1234-5678)"
                  value={vouchers[index].code}
                  onChange={(e) => handleVoucherChange(index, e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003973] focus:border-transparent outline-none transition-all group-hover:border-gray-400"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t shrink-0">
          <button
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-semibold text-sm disabled:opacity-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="w-full flex-1 px-6 py-2 rounded-xl bg-[#003973] text-white hover:bg-[#002d5a] transition-all transform hover:scale-[1.02] active:scale-95 font-semibold text-sm disabled:opacity-50 shadow-lg shadow-blue-900/20"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : 'Send Results & Vouchers'}
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
  const API = import.meta.env.VITE_API_URL || "";
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
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports");
      }
      console.log(data.reports);
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


  const handleSendMails = async (paperId) => {
    try {
      const token = localStorage.getItem("token");
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
      setVoucherModal({
        show: true,
        paperId: paperId,
        topStudents: (data.topStudents || []).slice(0, 5)
      });
    } catch (err) {
      console.error("Failed to fetch top students:", err);
      alert("An error occurred while fetching top students.");
    }
  };
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
        <aside
          className={`fixed lg:static top-0 left-0 h-full w-64 bg-white
    transform transition-transform duration-300 ease-in-out z-50
    ${isAdminSideBarOpen
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
                        disabled={reports[0].mailSent}
                        className={`bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 shadow-sm ${reports[0].mailSent ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      >
                        {reports[0].mailSent ? 'Mails Sent' : '+ Send Mails'}
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
                              disabled={report.mailSent}
                              className={`bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 shadow-sm ${report.mailSent ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                            >
                              {report.mailSent ? 'Mails Sent' : '+ Send Mails'}
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
