import { useRef, useEffect, useState } from "react";
import CiscoImg from "../assets/CiscoLogo.png";
import MockExam from "../assets/AdmissionBanner.png";

function AutoCarousel({
  images,
  items,
  companyLogos,
  name,
  speed = 60,
  cardCount = 5,
}) {
  const containerRef = useRef(null);
  const [isPaused] = useState(false);
  const [direction] = useState(-1);
  let cards = [];
  if (items && items.length > 0) {
    cards = items.slice(0, cardCount);
  } else if (images && images.length > 0) {
    cards = images.slice(0, cardCount).map((img, i) => {
      if (typeof img === "string") {
        const logo =
          companyLogos && companyLogos[i] ? companyLogos[i] : CiscoImg;
        return { image: img, companyLogo: logo, package: "", name: name || "" };
      }
      return {
        image: img.image || MockExam,
        companyLogo:
          img.companyLogo || (companyLogos && companyLogos[i]) || CiscoImg,
        package: img.package || "",
        name: img.name || name || "",
      };
    });
  } else {
    cards = new Array(cardCount)
      .fill(0)
      .map(() => ({
        image: MockExam,
        companyLogo: CiscoImg,
        package: "",
        name: "",
      }));
  }

  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;
    let rafId;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = (now - lastTime) / 1000; // seconds
      lastTime = now;
      const move = direction * speed * dt;
      cont.scrollLeft += move;

      const half = cont.scrollWidth / 2;
      if (direction > 0 && cont.scrollLeft >= half) {
        cont.scrollLeft -= half;
      } else if (direction < 0 && cont.scrollLeft <= 0) {
        cont.scrollLeft += half;
      }

      rafId = requestAnimationFrame(step);
    };

    cont.scrollLeft = 0;
    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [isPaused, direction, speed]);

  return (
    <div className="w-full md:w-[520px] h-[450px] sm:h-[360px] rounded-2xl overflow-hidden shadow-lg relative bg-white mx-auto md:mx-0">
      <div
        ref={containerRef}
        className="flex gap-4 items-stretch w-full h-full whitespace-nowrap overflow-x-hidden"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {[...cards, ...cards].map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 h-full rounded-2xl overflow-hidden relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex justify-center items-center"
          >
            <img
              src={item.image}
              alt={item.name || `card-${idx}`}
              className="max-h-full w-auto object-contain object-center block mx-auto"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            </div>

            <div className="absolute left-4 bottom-4 right-4 flex items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-3">
                {item.companyLogo ? (
                  <img
                    src={item.companyLogo}
                    alt="company"
                    className="h-10 w-10 object-contain rounded-md bg-white p-1"
                  />
                ) : (
                  <div className="h-10 w-10 bg-white/30 rounded-md flex items-center justify-center text-sm font-semibold text-white">
                    LOGO
                  </div>
                )}

                <div className="text-white">
                  {item.name ? (
                    <div className="text-sm font-semibold drop-shadow">
                      {item.name}
                    </div>
                  ) : null}
                  <div className="text-lg font-bold text-cyan-300 drop-shadow">
                    {item.package || ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AutoCarousel;
