import vignanLogo from "../assets/LogoV1.png";
function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-[99999]">
      <img
        src={vignanLogo}
        alt="Loading..."
        className="w-24 h-24 animate-spin"
      />
    </div>
  );
}

export default Loader;