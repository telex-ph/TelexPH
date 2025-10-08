"use client";

import React from "react";
import Image from "next/image"; 
import ExperienceCard from "./ExperienceCard";

const GRID_IMAGES = [
  { src: "/images/choose1.jpg", alt: "Choose Option 1", priority: true },
  { src: "/images/choose2.jpg", alt: "Choose Option 2", priority: false },
  { src: "/images/choose3.jpg", alt: "Choose Option 3", priority: false },
];

const CenterGrid = () => {
  return (
    <div
      className="lg:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6
      max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:mx-0"
    >
      {/* 1. Image 1 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] shadow-md">
        <Image
          src={GRID_IMAGES[0].src}
          alt={GRID_IMAGES[0].alt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 250px"
          loading="eager"
          priority={GRID_IMAGES[0].priority}
        />
      </div>

      {/* 2. Image 2 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] shadow-md">
        <Image
          src={GRID_IMAGES[1].src}
          alt={GRID_IMAGES[1].alt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 250px"
          loading="lazy"
        />
      </div>

      {/* 3. Experience Card */}
      <div>
        <ExperienceCard />
      </div>

      {/* 4. Image 3 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[180px] md:h-[200px] lg:h-[220px] shadow-md">
        <Image
          src={GRID_IMAGES[2].src}
          alt={GRID_IMAGES[2].alt}
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