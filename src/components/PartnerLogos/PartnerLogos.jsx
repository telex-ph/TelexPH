
import { useState } from "react";
import { DEFAULT_MAX_WIDTH_CLASS } from "../../constant/layout";
const logos = [
  { src: "/images/logo1.webp", alt: "Partner Logo 1" },
  { src: "/images/logo2.webp", alt: "Partner Logo 2" },
  { src: "/images/logo3.webp", alt: "Partner Logo 3" },
  { src: "/images/logo4.webp", alt: "Partner Logo 4" },
  { src: "/images/logo5.webp", alt: "Partner Logo 5" },
  { src: "/images/logo6.webp", alt: "Partner Logo 6" },
  { src: "/images/logo7.webp", alt: "Partner Logo 7" },
  { src: "/images/logo8.webp", alt: "Partner Logo 8" }
];
const PartnerLogos = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const logosForLoop = [...logos, ...logos];
  const defaultLogoStyle = {
    opacity: 0.5,
    filter: "grayscale(10%)"
  };
  const hoveredLogoStyle = {
    opacity: 1,
    filter: "grayscale(0%)"
  };
  const baseLogoClasses = "w-auto object-contain cursor-pointer transition-all duration-300 ease-in-out";
  const enlargedSizeClasses = "h-20 sm:h-16";
  const defaultSizeClasses = "h-16 sm:h-12";
  const smallSizeClasses = "h-12";
  const logoItemStyle = {
    width: `${100 / logos.length}%`
  };
  const containerWidthStyle = {
    width: "200%"
    // 200% dahil duplicated ang array
  };
  return <div className="bg-gray-50 py-10 flex justify-center w-full"> 
      <div className={`flex items-center ${DEFAULT_MAX_WIDTH_CLASS} w-full overflow-hidden`}>
        
        {
    /* Ito ang div na may infinite sliding animation */
  }
        <div
    className="flex items-center animate-infinite-slide group hover:pause-animation"
    style={containerWidthStyle}
  >
          
          {logosForLoop.map((logo, index) => {
    const originalIndex = index % logos.length;
    let sizeClasses;
    if (originalIndex === 0) {
      sizeClasses = enlargedSizeClasses;
    } else if (originalIndex === 3) {
      sizeClasses = smallSizeClasses;
    } else {
      sizeClasses = defaultSizeClasses;
    }
    return <div
      key={index}
      className={`flex-shrink-0 px-6 sm:px-8 flex items-center justify-center`}
      style={logoItemStyle}
      onMouseEnter={() => setHoveredIndex(originalIndex)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
                <img
      src={logo.src}
      alt={logo.alt}
      className={`${baseLogoClasses} ${sizeClasses} max-w-full`}
      style={{
        ...defaultLogoStyle,
        ...originalIndex === hoveredIndex ? hoveredLogoStyle : {}
      }}
    />
              </div>;
  })}
        </div>
      </div>
    </div>;
};
var stdin_default = PartnerLogos;
export {
  stdin_default as default
};
