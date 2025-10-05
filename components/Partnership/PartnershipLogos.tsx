// components/Partnership/PartnershipLogos.tsx

import React from "react";
// Updated import path, nasa iisang folder na
import FallbackImage from "./FallbackImage";

const clientLogos = [
  { name: "Aurora Systems", src: "/images/aa.png", color: "#800000" },
  { name: "Nexora Tech", src: "/images/bb.png", color: "#800000" },
  { name: "Zenith Corp", src: "/images/cc.png", color: "#800000" },
  { name: "Novara Labs", src: "/images/ff.png", color: "#800000" },
  { name: "Orion Global", src: "/images/gg.png", color: "#800000" },
];

const PartnershipLogos = () => {
  return (
    <div className="w-full bg-gray-50 py-4 md:py-6">
      <div className="w-full xl:w-[88%] mx-auto px-4">
        <div
          className="flex items-center justify-center md:justify-between 
                     flex-nowrap overflow-x-auto scrollbar-hide gap-x-6"
        >
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="flex items-center space-x-2 min-w-[100px] flex-shrink-0"
            >
              <FallbackImage
                src={client.src}
                alt={client.name}
                width={90}
                height={40}
                className="opacity-80 hover:opacity-100 transition object-contain max-h-8 sm:max-h-10 md:max-h-12"
              />
              <span
                className="font-bold text-xs sm:text-sm md:text-base"
                style={{ color: client.color }}
              >
                {client.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnershipLogos;