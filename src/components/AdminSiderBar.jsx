// components/AdminSideBar.jsx
import {
  Home as HomeIcon,
  CalendarDays as CalendarIcon,
  ClipboardList as ClipboardIcon,
  CircleHelp as HelpIcon,
  X as XIcon, // Import XIcon
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Receive setIsAdminSideBarOpen
function AdminSideBar({ isAdminSideBarOpen, setIsAdminSideBarOpen }) { 
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 z-30 transition-transform duration-300 ease-in-out 
      ${isAdminSideBarOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:static lg:h-auto`}
    >
      {/* --- ADDED: Mobile close button --- */}
      <button
        onClick={() => setIsAdminSideBarOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <XIcon size={24} />
      </button>

      {/* Use onClick to close AdminSideBar on mobile after navigation */}
      <nav className="space-y-2 mt-12 lg:mt-0">
        <AdminSideBarItem icon={HomeIcon} label="Dashboard" to="/student_dashboard" onClick={() => setIsAdminSideBarOpen(false)} />
        <AdminSideBarItem icon={CalendarIcon} label="Upcoming Tests" to="/upcoming_tests" onClick={() => setIsAdminSideBarOpen(false)} />
        <AdminSideBarItem icon={ClipboardIcon} label="Results" to="/results" onClick={() => setIsAdminSideBarOpen(false)} />
        <AdminSideBarItem icon={HelpIcon} label="FAQ's" to="/faq" onClick={() => setIsAdminSideBarOpen(false)} />
      </nav>
    </aside>
  );
}

// Receive onClick prop
function AdminSideBarItem({ icon: Icon, label, to, onClick }) { 
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

export default AdminSideBar;