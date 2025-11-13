import {
  Home as HomeIcon,
  Pen as PenIcon,
  Heart as LoveIcon,
  User as UserIcon,
  FileText as ReportIcon,
  X as XIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function AdminSideBar({ isAdminSideBarOpen, setIsAdminSideBarOpen }) {
  return (
    <>
      {/* --- Mobile close button --- */}
      <button
        onClick={() => setIsAdminSideBarOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 focus:outline-none z-40"
      >
        <XIcon size={24} />
      </button>

      <nav className="space-y-2 mt-12 p-4">
        {/* Teacher Dashboard */}
        <AdminSideBarItem
          icon={HomeIcon}
          label="Dashboard"
          to="/admin-pages/teacherdashboard"
          onClick={() => setIsAdminSideBarOpen(false)}
        />

        {/* Questions Page */}
        <AdminSideBarItem
          icon={PenIcon}
          label="Questions"
          to="/admin-pages/questions"
          onClick={() => setIsAdminSideBarOpen(false)}
        />

        {/* Exams Page */}
        <AdminSideBarItem
          icon={LoveIcon}
          label="Exams"
          to="/admin-pages/exams"
          onClick={() => setIsAdminSideBarOpen(false)}
        />

        {/* Students Page */}
        <AdminSideBarItem
          icon={UserIcon}
          label="Students"
          to="/admin-pages/students"
          onClick={() => setIsAdminSideBarOpen(false)}
        />

        {/* Reports Page */}
        <AdminSideBarItem
          icon={ReportIcon}
          label="Reports"
          to="/admin-pages/reports"
          onClick={() => setIsAdminSideBarOpen(false)}
        />
      </nav>
    </>
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
            ? "bg-blue-100 text-blue-700 font-semibold font-[poppins]"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-base font-[poppins]">{label}</span>
    </NavLink>
  );
}

export default AdminSideBar;
