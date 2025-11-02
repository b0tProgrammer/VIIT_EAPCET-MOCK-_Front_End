import logo from "../assets/LogoV1.svg";
import { User } from "lucide-react";

function NavBarMain() {
  return (
    <header className="bg-[#003973] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="grid grid-cols-3 items-center">
          {/* left: thin red accent + logo + wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-[#e74c3c] rounded-sm mr-3" />

            <div className="flex items-center gap-3">
              <img src={logo} alt="VIGNAN logo" className="h-10 w-10 object-contain" />
              <div className="leading-tight">
                <div className="text-base font-semibold">VIGNAN's</div>
                <div className="text-xs text-white/80">Institute of Information Technology</div>
              </div>
            </div>
          </div>

          {/* center: main title */}
          <div className="text-center">
            <div className="text-lg md:text-2xl lg:text-3xl font-bold">Mock EAPCET Portal</div>
          </div>

          {/* right: profile icon */}
          <div className="flex justify-end">
            <button aria-label="profile" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/5">
              <User className="h-5 w-5 text-white/90" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBarMain;