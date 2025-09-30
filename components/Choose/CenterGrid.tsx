import React from "react";
import ExperienceCard from "./ExperienceCard";

const CenterGrid = () => {
  return (
    <div className="lg:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 
                    max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:mx-0">
      <div className="bg-gray-300 rounded-2xl aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px]"></div>
      <div className="bg-gray-300 rounded-2xl aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px]"></div>
      <div>
        <ExperienceCard />
      </div>
      <div className="bg-gray-300 rounded-2xl aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px]"></div>
    </div>
  );
};

export default CenterGrid;