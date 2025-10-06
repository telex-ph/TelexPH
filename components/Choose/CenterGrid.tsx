import React from "react";
import ExperienceCard from "./ExperienceCard";

const CenterGrid = () => {
  const image1 = "url('/images/choose1.jpg')";
  const image2 = "url('/images/choose2.jpg')";
  const image3 = "url('/images/choose3.jpg')";

  return (
    <div className="lg:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 
                    max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:mx-0">
      <div 
        className="rounded-2xl aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] bg-cover bg-center"
        style={{ backgroundImage: image1 }}
      ></div>
      <div 
        className="rounded-2xl aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] bg-cover bg-center"
        style={{ backgroundImage: image2 }}
      ></div>
      <div>
        <ExperienceCard />
      </div>
      <div 
        className="rounded-2xl aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] bg-cover bg-center"
        style={{ backgroundImage: image3 }}
      ></div>
    </div>
  );
};

export default CenterGrid;