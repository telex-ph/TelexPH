"use client";

import React, { useState } from 'react';
import { DEFAULT_MAX_WIDTH_CLASS } from '../../constant/layout'; 

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

  const logosForLoop = [...logos, ...logos]; 

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
    
  const logoItemStyle: React.CSSProperties = {
    width: `${100 / logos.length}%`, 
  };
    
  const containerWidthStyle: React.CSSProperties = {
    width: '200%',
  };

  return (
    <div className="bg-gray-50 py-10 flex justify-center w-full"> 
      <div className={`flex items-center ${DEFAULT_MAX_WIDTH_CLASS} w-full overflow-hidden`}>
        
        <div
          className="flex items-center animate-infinite-slide group hover:pause-animation"
          style={containerWidthStyle}
        >
          
          {logosForLoop.map((logo, index) => {
            const originalIndex = index % logos.length; 
            const sizeClasses = originalIndex === 0 ? enlargedSizeClasses : defaultSizeClasses;
            
            return (
              <div 
                key={index}
                className={`flex-shrink-0 px-8 flex items-center justify-center`}
                style={logoItemStyle}
                onMouseEnter={() => setHoveredIndex(originalIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${baseLogoClasses} ${sizeClasses}`}
                  style={{
                    ...defaultLogoStyle,
                    ...(originalIndex === hoveredIndex ? hoveredLogoStyle : {}),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerLogos;