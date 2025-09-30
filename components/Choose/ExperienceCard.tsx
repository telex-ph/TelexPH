import React from 'react';

const ExperienceCard = () => {
  return (
    <div className="bg-red-500 rounded-2xl flex flex-col items-center justify-center text-white py-6 px-6 shadow-xl relative overflow-hidden h-53">
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 rounded-full -mr-12 -mt-12 opacity-50"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 border-[3px] border-white rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
          </svg>
        </div>
        <div className="text-4xl font-bold mb-1 text-center">30+</div>
        <div className="text-white text-base font-medium text-center">Years Experience</div>
      </div>
    </div>
  );
};

export default ExperienceCard;
