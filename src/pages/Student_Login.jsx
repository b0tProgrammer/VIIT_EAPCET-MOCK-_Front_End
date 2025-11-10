import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect } from "react";

function Student_Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [init, setInit] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("⚠️ Please fill in both username and password.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError("");
    navigate("/student_dashboard");
    onLoginSuccess();
  };

  return (
    <> 
      <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden">
        {/* Login Form */}
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative z-10 font-[Poppins]">
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

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-[#003973] text-white px-6 py-2 rounded-md shadow-md hover:bg-[#002952] transition duration-300"
              >
                SUBMIT
              </button>
            </div>

            {/* Back to Home */}
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
