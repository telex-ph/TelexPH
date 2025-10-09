import React from 'react';
import { COLORS, FONT_CLASSES } from "@/constant/styles";

const ExperienceCard = () => {
  const DARKER_RED_OVERLAY = '#850000'; 

  return (
    <div className={`
      bg-[${COLORS.primary}] rounded-2xl flex flex-col items-center justify-center text-white 
                    py-6 px-6 shadow-xl relative overflow-hidden 
      aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px]`
    }>
      <div 
        className={`absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 opacity-50`}
        style={{ backgroundColor: DARKER_RED_OVERLAY }}
      ></div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border-[3px] border-white rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
          </svg>
        </div>
        
        <div className={`text-3xl sm:text-4xl ${FONT_CLASSES.openSansBold} mb-1 text-center`}>
          7+
        </div>
        
        <div className={`text-white text-sm sm:text-base ${FONT_CLASSES.openSansBold} text-center`}>
          Years Experience
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;