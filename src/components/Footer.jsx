import Logo from "../assets/LogoV1.png";
import { MapPin, Mail, Phone } from "lucide-react";
function Footer() {
    return (
        <footer className="bg-[#003973] text-white font-poppins">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                <div className="flex items-center space-x-3 mb-3">
                    <img
                    src={Logo}
                    alt="VIGNAN Logo"
                    className="h-10 w-10 object-contain"
                    />
                    <h1 className="text-2xl font-semibold">VIGNAN</h1>
                </div>
                <p className="text-sm mb-4">
                    Vignan's Institute of Information Technology.
                </p>

                <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                    <MapPin className="w-10 h-10 mt-1" />
                    Beside VSEZ, Duvvada, Vadlapudi, Post: Gajuwaka, Vishakapatnam – 530049, A.P
                    </p>

                    <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:vignaniit@yahoo.com" className="hover:underline">
                        vignaniit@yahoo.com
                    </a>
                    </p>

                    <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+9108912755222" className="hover:underline">
                        +91-08912755222
                    </a>
                    </p>
                </div>
                </div>

                {/* Accreditation */}
                <div>
                <h3 className="font-semibold text-lg mb-3">Accreditation</h3>
                <ul className="space-y-1 text-sm">
                    <li><a href="https://www.vignaniit.edu.in/aicte-approvals" className="hover:underline">AICTE</a></li>
                    <li><a href="https://samadhaan.ugc.ac.in/Home/FeedBack" className="hover:underline">UGC e-Samadhan</a></li>
                    <li><a href="https://www.vignaniit.edu.in/jntuk" className="hover:underline">JNTUK</a></li>
                    <li><a href="https://www.vignaniit.edu.in/AllDocuments/Footer/Certificate%20ARI-C.pdf" className="hover:underline">ARIIA</a></li>
                    <li><a href="https://www.vignaniit.edu.in/AllDocuments/Footer/AISHE.pdf" className="hover:underline">AISHE</a></li>
                </ul>
                </div>

                {/* Support & Access */}
                <div>
                <h3 className="font-semibold text-lg mb-3">Support & Access</h3>
                <ul className="space-y-1 text-sm">
                    <li><a href="https://alumni.vignaniit.edu.in/" className="hover:underline">Alumni</a></li>
                    <li><a href="https://www.vignaniit.edu.in/grievances" className="hover:underline">Grievances</a></li>
                    <li><a href="https://www.vignaniit.edu.in/support/maintenance" className="hover:underline">Maintenance</a></li>
                    <li><a href="https://www.vignaniit.edu.in/screen-reader-access" className="hover:underline">Screen Reader</a></li>
                    <li><a href="https://www.vignaniit.edu.in/rti" className="hover:underline">RTI</a></li>
                </ul>
                </div>

                {/* Statutory */}
                <div>
                <h3 className="font-semibold text-lg mb-3">Statutory</h3>
                <ul className="space-y-1 text-sm">
                    <li><a href="https://www.vignaniit.edu.in/iqac" className="hover:underline">IQAC</a></li>
                    <li><a href="https://www.vignaniit.edu.in/AllDocuments/Footer/NBA.pdf" className="hover:underline">NBA</a></li>
                    <li><a href="https://www.vignaniit.edu.in/naac" className="hover:underline">NAAC</a></li>
                    <li><a href="https://www.vignaniit.edu.in/AllDocuments/Footer/NIRC%20Engineering%20Ranking%20application.pdf" className="hover:underline">NIRF</a></li>
                    <li><a href="https://www.vignaniit.edu.in/access/mhrd-ict" className="hover:underline">MHRD - ICT</a></li>
                </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/20 text-center py-4 text-sm">
                © 2025 Vignan's Institute of Information Technology. All Rights Reserved.
            </div>
        </footer>
    );
}

export default Footer;