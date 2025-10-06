import React from "react";
import { DEFAULT_MAX_WIDTH_CLASS, SECTION_HEIGHT } from "@/constant/layout";
import CompanyDetails from "./CompanyDetails";

const AboutUs = () => {
  return (
    <div
      id="about"
      className={`pt-20 pb-20 bg-[#f8f8f8] relative overflow-hidden scroll-mt-[120px] flex items-center justify-center ${SECTION_HEIGHT.compact} min-h-[460px]`}
    >
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {/* Background Large Outline Text inside same max-width */}
        <div className="absolute bottom-15 left-0 w-full pointer-events-none z-0">
          <div
            className={`${DEFAULT_MAX_WIDTH_CLASS} 
                       text-[3rem] md:text-[5rem] lg:text-[6rem] 
                       font-open-sans-bold select-none leading-[1.0] text-left whitespace-normal`}
          >
            <span className="text-outline-red-thin break-words">
              TELEX BUSINESS <br />
              SUPPORT SERVICES
            </span>
          </div>
        </div>

        {/* Foreground content */}
        <div className="relative z-10">
          <CompanyDetails />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
