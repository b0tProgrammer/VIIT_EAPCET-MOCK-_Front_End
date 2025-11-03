import Company1 from "../assets/AmazonLogo.png";
import Company2 from "../assets/AccentureLogo.png";
import Company3 from "../assets/TCSLogo.png";
import Company4 from "../assets/InfosysLogo.png";
import Company5 from "../assets/CognizantLogo.png";
import Company6 from "../assets/CiscoLogo.png";
import Company7 from "../assets/DmartLogo.png";
import Company8 from "../assets/DeloitteLogo.png";

const OurRecruiters = () => {
  const companies = [
    Company1,
    Company2,
    Company3,
    Company4,
    Company5,
    Company6,
    Company7,
    Company8,
  ];

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-12 rounded-xl mx-4 md:mx-12 shadow-sm">
      {/* Heading */}
      <div className="flex justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 relative after:content-[''] after:block after:w-[120px] after:h-[2px] after:bg-[#003973] after:mx-auto after:mt-2">
          Our Recruiters
        </h2>
      </div>

      {/* Infinite Scrolling Logos */}
      <div className="overflow-hidden relative">
        <div className="flex items-center animate-scroll-left space-x-12 w-max">
          {/* Repeat the logos twice for a perfect infinite loop */}
          {[...companies, ...companies].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Company ${index + 1}`}
              className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition duration-3"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurRecruiters;
