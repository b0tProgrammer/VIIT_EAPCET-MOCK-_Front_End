import React from "react";
import NavBar from "./NavBarMain";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Student_Login({ onLoginSuccess }) {
  // This state is just for the form inputs

  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  // This function is called by the form
  const handleSubmit = (event) => {
    event.preventDefault();

    // In a real app, you would check credentials here.
    console.log(`Form submitted with: ${username} / ${password}`);
    navigate("/student_dashboard");
    // --- THIS IS THE KEY ---
    // It calls the function passed down from App.js,
    // which tells App.js to change the state.
    onLoginSuccess();
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            VCET(Mock Test) Login Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-base font-medium text-gray-700"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-blue-100 bg-opacity-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-blue-100 bg-opacity-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="px-8 py-2 bg-blue-50 bg-opacity-80 text-gray-600 font-semibold rounded-lg border border-gray-300 transition duration-300 ease-in-out hover:bg-blue-100 hover:scale-105 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:scale-105"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Student_Login;
