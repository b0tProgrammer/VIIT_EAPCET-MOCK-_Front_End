// src/pages/Admin_RegisterTeacher.jsx
import React, { useState } from "react";

const API = "http://localhost:3000"; 

function AdminRegisterTeacher() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState(""); // Used as Teacher's Login ID
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem('token'); 

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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, email, studentId, temporaryPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register teacher.");
      }

      setSuccess(`✅ ${fullName} registered successfully! Login ID: ${studentId}`);
      // Clear form after successful registration
      setFullName('');
      setEmail('');
      setStudentId('');
      setTemporaryPassword('');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-black mb-6 border-b pb-2">
        Register New Teacher
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Full Name:
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <label className="block">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <label className="block">
          Login ID (Student ID field):
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            placeholder="Unique ID for login (e.g., bio_teacher)"
            required
          />
        </label>
        <label className="block">
          Temporary Password:
          <input
            type="text"
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#003973] hover:bg-[#002952] text-white"
          }`}
        >
          {loading ? "Registering..." : "Register Teacher"}
        </button>
      </form>
    </div>
  );
}

export default AdminRegisterTeacher;