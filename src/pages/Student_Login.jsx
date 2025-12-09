import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function Student_Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const API_BASE_URL = "http://localhost:3000/api/auth/login"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setError("⚠️ Please fill in all fields including role.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Login failed. Please check your credentials.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // Success: optionally store token, call callback, and navigate
      if (data.token) {
        try { localStorage.setItem("authToken", data.token); } catch (err) { console.error("LocalStorage error:", err); }
      }
      if (onLoginSuccess) onLoginSuccess(data);

      if (role === "teacher" || role === "admin") {
        navigate("/admin-pages/teacherdashboard");
      } else {
        navigate("/student_dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again later.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative z-10 font-poppins">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
            VIIT's (Mock EAPCET) Login Form
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-3 mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-black">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#EFF7FF] border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#003973] outline-none shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-black">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#EFF7FF] border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#003973] outline-none shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block font-medium mb-1 text-black">
                Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#EFF7FF] border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#003973] outline-none shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-[#003973] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#002952] transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "SUBMIT"}
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <span
                onClick={() => navigate("/")}
                className="text-[#003973] font-medium cursor-pointer hover:text-[#002952] transition-colors duration-300 underline-offset-2 hover:underline"
              >
                Back to Home
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Student_Login;
