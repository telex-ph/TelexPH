import React from "react";
import Image from "next/image";

const FooterPosts: React.FC = () => {
  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="font-poppins-black mb-2 text-sm sm:text-base text-white">Popular Post</h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto sm:mx-0">
        {/* First Post - Special with Overlay */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post1.webp" 
            alt="Book a Free Consultation" 
            fill
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-[#a10000]/80 p-2 sm:p-4 flex flex-col justify-between">
            <div className="flex justify-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#a10000]" 
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
            
            <div className="text-white px-1 sm:px-0">
              <p className="text-xs sm:text-sm lg:text-base font-open-sans-bold leading-tight">
                Book a Free Consultation
              </p>
            </div>
          </div>
        </div>
        
        {/* Second Post */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post2.webp" 
            alt="Post 2"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Third Post */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post3.webp" 
            alt="Post 3"
            fill
            className="object-cover"
          />
        </div>

        {/* Fourth Post */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post4.webp" 
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