// src/pages/Student_Login.jsx

import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Student_Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const API = "http://localhost:3000"; // Define your API endpoint
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [init, setInit] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ... validation and loading logic ...

    try {
      // 1. Send credentials to the backend login endpoint
      // ... fetch logic ...
      
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed. Invalid credentials or server error.");
      }
      
      // Store token and user info
      localStorage.setItem('userToken', result.token);
      localStorage.setItem('userInfo', JSON.stringify(result.user));

      // 2. Successful Login Response
      const loggedInUser = result.user; 
      const actualRole = loggedInUser?.role || 'UNKNOWN';

      // 3. Role Verification and Navigation
      
      if (role === 'user' && actualRole === 'STUDENT') {
          alert(`Welcome, ${loggedInUser.fullName}!`);
          if (onLoginSuccess) onLoginSuccess(loggedInUser);
          navigate("/student_dashboard");
      } 
      // 🚨 ADMIN/TEACHER REDIRECT FIX 🚨
      else if ((role === 'admin' || role === 'teacher') && actualRole !== 'STUDENT') {
          alert(`Welcome, ${loggedInUser.fullName}! You are logged in as ${actualRole}.`);
          if (onLoginSuccess) onLoginSuccess(loggedInUser);
          
          // Use the exact, explicit path defined in App.jsx
          navigate("/admin-pages/teacherdashboard"); 
      } 
      else {
          // Role Mismatch or unexpected role returned
          throw new Error(`Role mismatch. You logged in as ${actualRole}, but selected ${role} in the dropdown.`);
      }

    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };
=======
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        // Handle login failure (400, 401 errors from backend)
        throw new Error(result.message || "Login failed. Invalid credentials or server error.");
      }

      const result = await response.json();

      if (role === 'user') {
        localStorage.setItem("studentToken", result.student.accessToken);
        if (onLoginSuccess) onLoginSuccess(loggedInUser);
        navigate("/student_dashboard");
      } 

      // Admin/Teacher Login (Check against the backend's returned role)
      else if ((role === 'admin' || role === 'teacher')) {
        if(onLoginSuccess) onLoginSuccess(loggedInUser);
        navigate("/admin-pages/teacherdashboard");
      }
      else {
        throw new Error(`Role mismatch. You logged in as ${actualRole}, but selected ${role} in the dropdown.`);
      }
      localStorage.setItem("role", role);
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };
>>>>>>> d256d73122971dba033ae8891d50506def519cea

  // ... return JSX unchanged ...
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
                <option value="user">User (Student)</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
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