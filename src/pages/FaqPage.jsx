import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import FAQ from "../components/faq";

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarMain />

      <div className="flex-1 flex relative">
        <SideBar />
        <FAQ />
      </div>

      <Footer />
    </div>
  );
}