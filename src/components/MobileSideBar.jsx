import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // You might need to install lucide-react: npm install lucide-react

// Placeholder links - replace with your actual nav links
const navLinks = [
  { title: "Home", href: "/" },
  { title: "Login", href: "/login" },
  { title: "Register", href: "/register" },
  { title: "About", href: "#about" }, // Example for an anchor link
];

function MobileSideBar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 p-6"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold text-[#003973]">Menu</span>
              <button onClick={onClose} className="text-gray-600 hover:text-black">
                <X size={24} />
              </button>
            </div>
            
            <nav>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      onClick={onClose} // Close sidebar on link click
                      className="text-lg text-gray-700 hover:text-[#003973] font-medium"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileSideBar;