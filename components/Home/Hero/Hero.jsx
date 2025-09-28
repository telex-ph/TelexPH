import React from "react";
import SearchBox from "../../Helper/SearchBox";
import Link from "next/link"; 
import Image from "next/image"; // Idagdag para sa plane image

const Hero = () => {
  return (
    // Pinalitan ang height at kulay ng background
    <div className="relative w-full h-[100vh] bg-red-800 pt-[10vh] lg:pt-[10vh]">
      {/* Walang Overlay at Video */}

      {/* Text Content at Images */}
      <div className="relative z-[100] w-full h-full">
        <div className="flex items-center justify-center w-full h-full px-4 xl:w-[88%] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
            
            {/* Left Content (Text) */}
            <div>
                <p className="text-lg text-white mb-2">Innovate, Grow, and Transform Your World</p>
                <h1 className="text-[35px] md:text-[55px] lg:text-[70px] text-white font-bold leading-tight mb-6">
                    We're Global <br />
                    Logistic Provider
                </h1>
                <p className="text-white text-base max-w-lg mb-8">
                    We embrace the latest construction technologies and sustainable practices to deliver modern and eco-friendly solutions.
                </p>

                {/* Buttons - Pinalitan ang SearchBox ng Request/Learn More buttons */}
                <div className="flex space-x-4">
                    <Link
                        href="#"
                        className="rounded px-8 py-3 text-sm overflow-hidden group bg-red-700 relative
                        hover:bg-red-800 text-white transition-all ease-out duration-300 border border-white"
                    >
                        REQUEST A QUOTE
                    </Link>
                    <Link
                        href="#"
                        className="rounded px-8 py-3 text-sm overflow-hidden group bg-transparent relative
                        hover:bg-red-500 text-white transition-all ease-out duration-300 border border-white"
                    >
                        LEARN MORE
                    </Link>
                </div>
                
                {/* Reviews at Avatars */}
                <div className="flex items-center mt-6 space-x-3">
                    {/* Placeholder for Avatars (Use actual images or icons here) */}
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-red-600"></div>
                        <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-red-600"></div>
                        <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-red-600"></div>
                    </div>
                    <div className="text-white">
                        <div className="text-amber-400 text-sm">★★★★★</div>
                        <p className="text-sm">5.5K Review</p>
                    </div>
                </div>

            </div>

            {/* Right Content (Plane Image at Info Boxes) */}
            <div className="relative h-full hidden lg:block">
                {/* Placeholder for the Plane Image - **IMPORTANT: Dapat may plane image ka na ilalagay dito** */}
                {/* I assume ang plane image ay ilalagay mo sa isang folder */}
                {/* <Image 
                    src="/images/plane.png" // Palitan ito ng actual path ng image mo
                    alt="Cargo Plane"
                    layout="fill"
                    objectFit="contain"
                    className="absolute z-10 bottom-0 left-0" 
                /> */}
                
                {/* Right-side Info Boxes - Use position absolute or similar layout */}
                <div className="absolute right-0 top-1/4 z-20 space-y-4">
                    {/* 30-Years Experience Box */}
                    <div className="bg-white p-4 rounded-lg shadow-xl w-64">
                        <p className="text-red-600 font-bold text-xl">30-Years Experience</p>
                        <p className="text-sm text-gray-600">A warranty extending up to 30 years provides.</p>
                    </div>
                    {/* Transport by Road Box */}
                    <div className="bg-white p-4 rounded-lg shadow-xl w-64">
                        <p className="text-red-600 font-bold text-lg">Transport by Road</p>
                        <p className="text-sm text-gray-600">Solar panels can be installed very easy and simple.</p>
                    </div>
                    {/* Transport By Air Box */}
                    <div className="bg-white p-4 rounded-lg shadow-xl w-64">
                        <p className="text-red-600 font-bold text-lg">Transport By Air</p>
                        <p className="text-sm text-gray-600">Solar panels can be installed very easy and simple.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        {/* Slider Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;