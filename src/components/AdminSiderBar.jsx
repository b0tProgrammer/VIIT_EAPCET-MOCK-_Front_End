// components/AdminSideBar.jsx
import {
  Home as HomeIcon,
  Pen as PenIcon,
  Heart as LoveIcon,
  User as UserIcon,
  FileText as ReportIcon,
  Settings as SettingsIcon,
  X as XIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function AdminSideBar({ isAdminSideBarOpen, setIsAdminSideBarOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-sm z-30 transition-transform duration-300 ease-in-out 
      ${isAdminSideBarOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:static lg:h-auto`}
    >
      {/* --- Mobile close button --- */}
      <button
        onClick={() => setIsAdminSideBarOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 focus:outline-none"
      >
        <XIcon size={24} />
      </button>

      <nav className="space-y-2 mt-12">
        <AdminSideBarItem
          icon={HomeIcon}
          label="Dashboard"
          to="/dashboard"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
        <AdminSideBarItem
          icon={PenIcon}
          label="Questions"
          to="/questions"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
        <AdminSideBarItem
          icon={LoveIcon}
          label="Exams"
          to="/exams"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
        <AdminSideBarItem
          icon={UserIcon}
          label="Students"
          to="/students"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
        <AdminSideBarItem
          icon={ReportIcon}
          label="Reports"
          to="/reports"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
        <AdminSideBarItem
          icon={SettingsIcon}
          label="Settings"
          to="/settings"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
      </nav>
    </aside>
  );
}

function AdminSideBarItem({ icon: Icon, label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-base">{label}</span>
    </NavLink>
  );
}

export default AdminSideBar;
