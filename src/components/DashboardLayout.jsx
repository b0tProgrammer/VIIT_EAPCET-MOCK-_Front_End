// components/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Menu as MenuIcon } from "lucide-react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar (Manages its own open/close state) */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* --- ADDED: Overlay for mobile when sidebar is open --- */}
      <div 
        onClick={() => setIsSidebarOpen(false)} 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      ></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <MenuIcon size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Student Dashboard
          </h1>
          <div></div>
        </header>

        {/* --- MOVED: Desktop Header is now part of the layout --- */}
        <header className="hidden lg:block bg-white shadow-sm p-6"></header>

        {/* The nested routes will render here */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}