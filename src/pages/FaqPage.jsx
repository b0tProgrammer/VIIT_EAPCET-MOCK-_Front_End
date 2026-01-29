import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import SideBar from "../components/Sidebar";
import FAQ from "../components/FAQ";
import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react"; // <-- 2. Import Menu icon

export default function FaqPage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarMain />
      <div className="flex-1 flex relative">
        <SideBar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 p-6 bg-gray-50 relative"> {/* Added padding and bg */}
          {/* 7. Add a mobile menu button (visible only on small screens) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 mb-4 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            <MenuIcon size={24} />
          </button>
          <FAQ />
        </main>
      </div>

      <Footer />
    </div>
  );
}