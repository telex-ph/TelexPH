import React from "react";
import Image from "next/image";

const FooterCTA = () => {
  return (
    <div className="relative z-20"> 
      <div className="w-full bg-red-600 text-white shadow-xl h-32 sm:h-40 overflow-hidden relative flex items-center px-8 sm:px-12">
        
        {/* Text Content - Left Side */}
        <div className="z-10">
          <h2 className="text-3xl font-bold mb-2">
            Join the Future of Construction:
          </h2>
          <p className="text-xl">Contact Us Now</p>
        </div>
        <div className="absolute inset-0 right-0 top-0 h-full w-full">
            {/* 
            <img 
                src="/images/cta-banner-guy.png" 
                alt="Delivery man on scooter" 
                className="absolute right-0 bottom-0 h-full object-cover" 
                style={{maxWidth: '450px', objectPosition: 'right bottom'}} 
            /> 
            */}
            <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>

        {/* Button - Right Side */}
        <button className="z-20 absolute right-8 sm:right-12 bg-white text-red-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition whitespace-nowrap">
          GET A QUOTE
        </button>
      </div>
    </div>
  );
};

export default FooterCTA;