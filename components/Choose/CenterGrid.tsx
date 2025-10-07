"use client";

import React from "react";
import Image from "next/image";
import ExperienceCard from "./ExperienceCard";

const CenterGrid = () => {
  const images = [
    "/images/choose1.jpg",
    "/images/choose2.jpg",
    "/images/choose3.jpg",
  ];

  return (
    <div
      className="lg:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6
                 max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:mx-0"
    >
      {/* Image 1 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] shadow-md">
        <Image
          src={images[0]}
          alt="Choose Option 1"
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 250px"
          loading="eager"
          priority
        />
      </div>

      {/* Image 2 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] shadow-md">
        <Image
          src={images[1]}
          alt="Choose Option 2"
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 250px"
          loading="lazy"
        />
      </div>

      {/* Experience Card */}
      <div>
        <ExperienceCard />
      </div>

      {/* Image 3 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] shadow-md">
        <Image
          src={images[2]}
          alt="Choose Option 3"
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 250px"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default CenterGrid;
