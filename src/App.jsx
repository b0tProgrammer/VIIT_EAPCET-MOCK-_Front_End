import NavBarMain from "./components/NavBarMain";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarMain />
      <SideBar />
      <Footer />
    </div>
  );
}
