import React from "react";
import ExperienceCard from "./ExperienceCard";

const CenterGrid = () => {
  return (
    <div className="lg:col-span-4 grid grid-cols-2 grid-rows-2 gap-6">
      <div className="bg-gray-300 rounded-2xl h-53"></div>
      <div className="bg-gray-300 rounded-2xl h-53"></div>
      <div>
        <ExperienceCard />
      </div>
      <div className="bg-gray-300 rounded-2xl h-53"></div>
    </div>
  );
};

export default CenterGrid;
