import React, { useState } from "react";
import AdminSideBar from "../components/AdminSiderBar"; // Adjust path as needed
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
const API = "http://localhost:3000";

function AdminRegisterTeacher() {
  const [isAdminSideBarOpen, setIsAdminSideBarOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Admin token missing. Please log in as Admin first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/api/admin/register-teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, email, studentId, temporaryPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register teacher.");
      }

      setSuccess(`✅ ${fullName} registered successfully! Login ID: ${studentId}`);
      setFullName("");
      setEmail("");
      setStudentId("");
      setTemporaryPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-[poppins]">
      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto ${
          isAdminSideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSideBar
          isAdminSideBarOpen={isAdminSideBarOpen}
          setIsAdminSideBarOpen={setIsAdminSideBarOpen}
        />
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col">
        <NavBarMain />
        {/* --- NAVBAR --- */}

        {/* --- FORM CONTENT --- */}
        <main className="p-6 md:p-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-[#003973] p-4">
              <h2 className="text-2xl font-bold text-white text-center font-[poppins]">
                Register New Teacher
              </h2>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4 border border-green-200">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003973] focus:outline-none transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003973] focus:outline-none transition-all"
                    placeholder="teacher@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Login ID (Username)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003973] focus:outline-none transition-all"
                    placeholder="e.g., bio_teacher_01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={temporaryPassword}
                    onChange={(e) => setTemporaryPassword(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003973] focus:outline-none transition-all"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-md font-bold text-white transition-all duration-300 shadow-lg ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#003973] hover:bg-[#002952] active:transform active:scale-95"
                  }`}
                >
                  {loading ? "Processing..." : "Register Teacher"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isAdminSideBarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsAdminSideBarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default AdminRegisterTeacher;