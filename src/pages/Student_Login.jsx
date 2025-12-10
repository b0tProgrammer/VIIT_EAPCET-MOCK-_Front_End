import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function Student_Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const API = "http://localhost:3000"; // Define your API endpoint
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [init, setInit] = useState(false);

  // Particle engine initialization (Keep this for the UI effect)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      setError("⚠️ Please fill in all fields including role.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Send credentials to the backend login endpoint
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle failed login (e.g., Invalid credentials)
        throw new Error(result.message || "Login failed. Please check your credentials.");
      }

      // 2. Successful Login Response
      const loggedInUser = result.user; // Contains { id, identifier, fullName, role }

      // 3. Role Verification and Navigation
      
      // Enforce that 'user' role is only used by students (or the generic login endpoint)
      if (role === 'user' && loggedInUser.role === 'STUDENT') {
          // Logged in as a Student
          alert(`Welcome, ${loggedInUser.fullName}!`);
          if (onLoginSuccess) onLoginSuccess(loggedInUser);
          navigate("/student_dashboard");
      } 
      else if ((role === 'admin' || role === 'teacher') && loggedInUser.role !== 'STUDENT') {
          // Logged in as Admin/Teacher (assuming the backend's login route handles these)
          alert(`Welcome, ${loggedInUser.fullName}! You are logged in as ${loggedInUser.role}.`);
          if (onLoginSuccess) onLoginSuccess(loggedInUser);
          navigate("/admin-pages/teacherdashboard");
      } 
      else {
          // Handle role mismatch (e.g., student selects 'admin' role)
          throw new Error(`Role mismatch: You logged in as ${loggedInUser.role}, but selected ${role}.`);
      }

    } catch (err) {
      // Display the error from the backend or custom mismatch error
      setError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ... Particle Background JSX (Assuming it's correct) ... */}
      
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
                <option value="user">User (Student)</option> {/* Updated text */}
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading} // Disable while loading
                className={`text-white px-6 py-2 rounded-md shadow-md transition duration-300 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#003973] hover:bg-[#002952]"
                }`}
              >
                {loading ? "Logging In..." : "SUBMIT"}
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