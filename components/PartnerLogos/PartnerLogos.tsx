"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// 💡 IMPORT NATIN ANG CONSTANTS MULA SA IYONG LAYOUT FILE
import { DEFAULT_MAX_WIDTH_CLASS } from '../../constant/layout'; 
// NOTE: I-adjust ang path '../../constant/layout' kung hindi ito tugma sa folder structure mo.

const logos = [
  { src: '/images/logo1.png', alt: 'Partner Logo 1' },
  { src: '/images/logo2.png', alt: 'Partner Logo 2' },
  { src: '/images/logo3.png', alt: 'Partner Logo 3' },
  { src: '/images/logo4.png', alt: 'Partner Logo 4' },
  { src: '/images/logo5.png', alt: 'Partner Logo 5' },
  { src: '/images/logo6.png', alt: 'Partner Logo 6' },
  { src: '/images/logo7.png', alt: 'Partner Logo 7' },
  { src: '/images/logo8.png', alt: 'Partner Logo 8' },
];

const PartnerLogos: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const defaultLogoStyle: React.CSSProperties = {
    opacity: 0.5, 
    filter: 'grayscale(10%)',
  };

  const hoveredLogoStyle: React.CSSProperties = {
    opacity: 1, 
    filter: 'grayscale(0%)', 
  };
  
  const baseLogoClasses = 'w-auto object-contain cursor-pointer transition-all duration-300 ease-in-out';

  const enlargedSizeClasses = 'h-[70px]'; 
  const defaultSizeClasses = 'h-[50px]'; 

  return (
    <div className="bg-gray-50 py-10 flex justify-center w-full"> 
      <div className={`flex flex-row flex-wrap justify-center items-center gap-x-10 ${DEFAULT_MAX_WIDTH_CLASS}`}>
        
        {logos.map((logo, index) => {
          const sizeClasses = index === 0 ? enlargedSizeClasses : defaultSizeClasses;
          
          return (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              
              className={`${baseLogoClasses} ${sizeClasses}`}
              style={{
                ...defaultLogoStyle,
                ...(index === hoveredIndex ? hoveredLogoStyle : {}),
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PartnerLogos;