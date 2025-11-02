import logo from '../assets/Logov1.svg';
function NavBar() {
    return (
        <nav className="bg-[#003973] text-white font-poppins">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <img
                        src={logo}
                        alt="VCET Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <span className="text-lg font-semibold">VCET LOGO</span>
                </div>
                {/* Navigation Links */}
                <ul className="flex space-x-8 text-white font-medium">
                    <li className="hover:text-gray-200 cursor-pointer">About</li>
                    <li className="hover:text-gray-200 cursor-pointer">Accreditations</li>
                    <li className="hover:text-gray-200 cursor-pointer">Stats</li>
                    <li className="hover:text-gray-200 cursor-pointer">Programs</li>
                    <li className="hover:text-gray-200 cursor-pointer">Placements</li>
                    <li className="hover:text-gray-200 cursor-pointer">Register</li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;