import React from "react";
import Image from "next/image";

const FooterPosts = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-poppins-black mb-2 text-white">Popular Post</h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <img 
            src="/images/post1.svg" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-[#a10000]/80 p-4 flex flex-col justify-between">
            <div className="flex justify-start">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-[#a10000]" 
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
            
            <div className="text-white">
              <p className="text-lg font-open-sans-bold leading-tight">
                Book a Free<br />Consultation
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post2.jpg" 
            alt="Post 2"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src="/images/post3.jpg" 
            alt="Post 3"
            fill
            className="object-cover"
          />
        </div>

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