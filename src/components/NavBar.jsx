import logo from "../assets/Logov1.svg";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NavBar({ onMenuToggle }) {

  const navigate = useNavigate();

  return (
    <nav className="bg-[#003973] text-white font-poppins">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="VCET Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-semibold">VCET LOGO</span>
        </div>

        {/* Navigation Links (hidden on mobile) */}
        <ul className="hidden md:flex space-x-8 text-white font-medium">
          <li className="hover:text-gray-200 cursor-pointer"> <a href="#about" className="hover:text-gray-200 cursor-pointer">About</a> </li>
          <li className="hover:text-gray-200 cursor-pointer"> <a href="#accreditations" className="hover:text-gray-200 cursor-pointer">Accreditations</a> </li>
          <li className="hover:text-gray-200 cursor-pointer"> <a href="#stats" className="hover:text-gray-200 cursor-pointer">Stats</a> </li>
          <li className="hover:text-gray-200 cursor-pointer"> <a href="#programs" className="hover:text-gray-200 cursor-pointer">Programs</a> </li>
          <li className="hover:text-gray-200 cursor-pointer"> <a href="#placements" className="hover:text-gray-200 cursor-pointer">Placements</a> </li>
          <li className="hover:text-gray-200 cursor-pointer" onClick={() => navigate("/register")} >Register</li>
        </ul>

        {/* Mobile Menu Button (visible only on small screens) */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-white hover:text-gray-200"
        >
          <Menu size={28} />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;