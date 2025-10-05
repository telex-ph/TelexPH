import React from "react";
import Image from "next/image";

const FooterPosts = () => {
  return (
    <div>
      <h3 className="font-poppins-black mb-4 text-white">Popular Post</h3>
      
      {/* Gamitin ang Grid para sa 2x2 layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Post 1: Red CTA Card with background image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          {/* Background Image */}
          <img 
            src="/images/post1.svg" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Red Overlay with content */}
          <div className="absolute inset-0 bg-red-600/80 p-4 flex flex-col justify-between">
            {/* Icon sa taas */}
            <div className="flex justify-start">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </div>
            </div>
            
            {/* Text sa baba */}
            <div className="text-white">
              <p className="text-lg font-open-sans-bold leading-tight">
                Book a Free<br />Consultation
              </p>
            </div>
          </div>
        </div>
        
        {/* Post 2: JPG Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post2.jpg" 
            alt="Post 2"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Post 3: JPG Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post3.jpg" 
            alt="Post 3"
            fill
            className="object-cover"
          />
        </div>

        {/* Post 4: JPG Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post4.jpg" 
            alt="Post 4"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default FooterPosts;