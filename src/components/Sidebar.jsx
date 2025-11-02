import React from "react";
import {
  Home as HomeIcon,
  CalendarDays as CalendarIcon,
  ClipboardList as ClipboardIcon,
  CircleHelp as HelpIcon,
} from "lucide-react";

function Sidebar({ isSidebarOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 z-30 transition-transform duration-300 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:static lg:h-auto`}
    >
      <nav className="space-y-2 mt-12 lg:mt-0">
        <SidebarItem icon={HomeIcon} label="Dashboard" isActive />
        <SidebarItem icon={CalendarIcon} label="Upcoming tests" />
        <SidebarItem icon={ClipboardIcon} label="Results" />
        <SidebarItem icon={HelpIcon} label="FAQ's" />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon: Icon, label, isActive }) {
  const activeClasses =
    "bg-blue-100 bg-opacity-80 text-blue-800 font-semibold shadow-sm";
  const inactiveClasses =
    "text-gray-600 hover:bg-gray-50 hover:text-gray-800";

  return (
    <a
      href="#"
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      <span className="text-base">{label}</span>
    </a>
  );
}

export default Sidebar;