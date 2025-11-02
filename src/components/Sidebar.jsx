// components/Sidebar.jsx
import React from "react";
import {
  Home as HomeIcon,
  CalendarDays as CalendarIcon,
  ClipboardList as ClipboardIcon,
  CircleHelp as HelpIcon,
  X as XIcon, // Import XIcon
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Receive setIsSidebarOpen
function Sidebar({ isSidebarOpen, setIsSidebarOpen }) { 
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 z-30 transition-transform duration-300 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:static lg:h-auto`}
    >
      {/* --- ADDED: Mobile close button --- */}
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <XIcon size={24} />
      </button>

      {/* Use onClick to close sidebar on mobile after navigation */}
      <nav className="space-y-2 mt-12 lg:mt-0">
        <SidebarItem icon={HomeIcon} label="Dashboard" to="/dashboard" onClick={() => setIsSidebarOpen(false)} />
        <SidebarItem icon={CalendarIcon} label="Upcoming Tests" to="/dashboard/upcoming-tests" onClick={() => setIsSidebarOpen(false)} />
        <SidebarItem icon={ClipboardIcon} label="Results" to="/dashboard/results" onClick={() => setIsSidebarOpen(false)} />
        <SidebarItem icon={HelpIcon} label="FAQ's" to="/dashboard/faqs" onClick={() => setIsSidebarOpen(false)} />
      </nav>
    </aside>
  );
}

// Receive onClick prop
function SidebarItem({ icon: Icon, label, to, onClick }) { 
  return (
    <NavLink
      to={to}
      onClick={onClick} // Add onClick handler
      // Added 'end' prop to Dashboard link to prevent it from matching all nested routes
      end={to === "/dashboard"} 
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-100 bg-opacity-80 text-blue-800 font-semibold shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      <span className="text-base">{label}</span>
    </NavLink>
  );
}

export default Sidebar;