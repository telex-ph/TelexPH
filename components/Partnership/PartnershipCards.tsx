// components/Partnership/PartnershipCards.tsx

import React from "react";
// Updated import path, nasa iisang folder na
import FallbackImage from "./FallbackImage";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

// Data para sa cards (gaya ng nasa larawan)
const partnershipData = [
  { 
    title: "Trusted Partnership", 
    description: "Building long-term client relationships worldwide.", 
    iconSrc: "/icons/partnership-gear.svg", // Placeholder for icon
    iconAlt: "Gear Icon"
  },
  { 
    title: "Trusted Partnership", 
    description: "Building long-term client relationships worldwide.", 
    iconSrc: "/icons/partnership-team.svg", // Placeholder for icon
    iconAlt: "Team Icon"
  },
  { 
    title: "Trusted Partnership", 
    description: "Building long-term client relationships worldwide.", 
    iconSrc: "/icons/partnership-growth.svg", // Placeholder for icon
    iconAlt: "Growth Icon"
  },
  { 
    title: "Trusted Partnership", 
    description: "Building long-term client relationships worldwide.", 
    iconSrc: "/icons/partnership-stars.svg", // Placeholder for icon
    iconAlt: "Stars Icon"
  },
];

const PartnershipCards = () => {
  return (
    <section className="w-full py-16 bg-gray-100">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        <div className="relative mx-auto max-w-[1000px] shadow-2xl bg-white border border-gray-200">
          
          {/* Top Image Section (Team Photo) */}
          <div className="w-full h-auto">
            <div className="w-full min-h-[300px] bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                TEAM PHOTO / OFFICE IMAGE HERE (Replace with Next/Image)
            </div>
          </div>
          
          {/* Bottom Cards Section */}
          <div className="absolute left-0 right-0 bottom-0 px-4 md:px-8 pt-4 pb-8 transform translate-y-1/2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {partnershipData.map((item, index) => (
                <div 
                  key={index} 
                  className="relative bg-white p-4 pt-8 rounded-lg shadow-xl text-center flex flex-col items-center border border-gray-200 overflow-hidden"
                >
                  {/* Icon Area */}
                  <div className="relative w-12 h-12 mb-3 bg-white rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-white border-2 border-red-600 rounded-full flex items-center justify-center">
                      <FallbackImage
                          src={item.iconSrc}
                          alt={item.iconAlt}
                          width={30}
                          height={30}
                          className="text-red-600" 
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col items-center z-10">
                    <p className="text-lg font-bold text-gray-800 font-open-sans-bold mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 font-rubik-regular mb-4 max-w-[150px]">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Red Bottom Curve/Fill - Base sa design sa image */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-red-600 rounded-b-lg"></div>
                  {/* Maliit na red circle sa ilalim ng text */}
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-red-600 rounded-full bg-red-600"></div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      {/* Space sa ilalim para sa cards na nakalabas */}
      <div className="h-32 md:h-48"></div> 
    </section>
  );
};

export default PartnershipCards;