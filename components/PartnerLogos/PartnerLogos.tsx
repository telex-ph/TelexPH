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

  const logosForLoop = [...logos, ...logos]; // Duplicate para sa infinite loop

  const defaultLogoStyle: React.CSSProperties = {
    opacity: 0.5, 
    filter: 'grayscale(10%)',
  };

  const hoveredLogoStyle: React.CSSProperties = {
    opacity: 1, 
    filter: 'grayscale(0%)', 
  };
    
  const baseLogoClasses = 'w-auto object-contain cursor-pointer transition-all duration-300 ease-in-out';

  // Enlarged for first logo (index 0) - using standard Tailwind classes for better compatibility
  const enlargedSizeClasses = 'h-20 sm:h-16'; // h-20=80px on mobile, h-16=64px on sm+ (slightly larger than before for visibility)
  
  // Default for most logos - larger on mobile
  const defaultSizeClasses = 'h-16 sm:h-12'; // h-16=64px on mobile, h-12=48px on sm+ (close to 65px/50px, standard classes)
  
  // Special small size for 4th logo (index 3) - fixed small
  const smallSizeClasses = 'h-12'; // h-12=48px on all sizes (no enlargement)
    
  const logoItemStyle: React.CSSProperties = {
    width: `${100 / logos.length}%`, 
  };
    
  const containerWidthStyle: React.CSSProperties = {
    width: '200%', // 200% dahil duplicated ang array
  };

  return (
    <div className="bg-gray-50 py-10 flex justify-center w-full"> 
      <div className={`flex items-center ${DEFAULT_MAX_WIDTH_CLASS} w-full overflow-hidden`}>
        
        {/* Ito ang div na may infinite sliding animation */}
        <div
          className="flex items-center animate-infinite-slide group hover:pause-animation"
          style={containerWidthStyle}
        >
          
          {logosForLoop.map((logo, index) => {
            const originalIndex = index % logos.length; 
            
            // Determine size classes based on index
            let sizeClasses: string;
            if (originalIndex === 0) {
              sizeClasses = enlargedSizeClasses; // First logo: enlarged
            } else if (originalIndex === 3) {
              sizeClasses = smallSizeClasses; // 4th logo: keep small, no enlargement
            } else {
              sizeClasses = defaultSizeClasses; // Rest: larger on mobile
            }
            
            return (
              <div 
                key={index}
                className={`flex-shrink-0 px-6 sm:px-8 flex items-center justify-center`} // Reduced px on mobile for better fit with larger images
                style={logoItemStyle}
                onMouseEnter={() => setHoveredIndex(originalIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${baseLogoClasses} ${sizeClasses} max-w-full`} // Added max-w-full to prevent overflow
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