import React from "react";
import Link from "next/link";
import HeroClients from "./HeroClients"; // Assuming this is used elsewhere or will be used
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";
const HERO_BG_IMAGE = "/images/background"; 

const Hero = () => {
  return (
    <>
      <div
        id="home"
        className="relative w-full h-[90vh] md:h-[100vh] pt-[20vh] lg:pt-[10vh] flex flex-col justify-center bg-cover bg-center"
        // Apply the background image style
        style={{
          backgroundImage: `url(${HERO_BG_IMAGE})`,
        }}
      >
        {/* Background Overlay for Readability */}
        <div className="absolute inset-0 bg-red-950 opacity-90 z-[50]"></div>

        {/* Content Container (z-index is high to sit on top of the overlay) */}
        <div className="relative z-[100] w-full h-full flex items-center">
          <div className={DEFAULT_MAX_WIDTH_CLASS}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
              {/* Left Content (Text and Buttons) */}
              <div className="py-10 lg:py-0 pl-7 md:pl-13">
                {/* 2. Subheading/Emphasis: Open Sans Bold (700) */}
                <p className="text-base md:text-lg text-white mb-2 font-open-sans-bold">
                  Your trusted partner in Business Process Outsourcing
                </p>

                {/* 1. Main Title: Poppins Black (900) */}
                <h1 className="text-[35px] sm:text-[45px] md:text-[55px] lg:text-[70px] text-white font-poppins-black leading-tight mb-6">
                  Your Partner to <br />
                  Scale Smarter
                </h1>

                {/* 3. Body Text: Rubik Regular (Default) */}
                <p className="text-white text-base max-w-lg mb-8">
                  We deliver world-class business support services designed to
                  optimize efficiency, reduce costs, and empower your growth.
                  Together, let's build smarter, scalable solutions for your
                  success.
                </p>

                {/* Buttons - Open Sans Bold para sa emphasis */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="#"
                    className="rounded px-8 py-3 text-sm font-open-sans-bold text-center overflow-hidden group bg-white relative
                hover:bg-gray-100 text-[#a10000] transition-all ease-out duration-300 border border-white"
                  >
                    REQUEST A QUOTE
                  </Link>
                </div>

                {/* Reviews and Avatars - Rubik Regular (Default) */}
                <div className="flex items-center mt-6 space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-red-600"></div>
                    <div className="w-10 h-10 bg-gray-400 rounded-full border-2 border-red-600 ml-2"></div>
                    <div className="w-10 h-10 bg-gray-500 rounded-full border-2 border-red-600 ml-2"></div>
                    <div className="w-10 h-10 bg-gray-500 rounded-full border-2 border-red-600 ml-2"></div>
                    <div className="text-white ml-4">
                      <div className="text-amber-400 text-m">★★★★★</div>
                      <p className="text-sm">5.5K Review</p>{" "}
                      {/* Rubik Regular */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content (Floating Cards) */}
              <div className="relative h-full hidden lg:block min-h-[400px]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 space-y-4">
                  {/* Card 1 - Title: Open Sans Bold, Body: Rubik Regular */}
                  <div className="bg-white p-4 rounded-lg shadow-xl w-64 transform translate-x-0 transition duration-500 hover:translate-x-2">
                    <p className="text-red-600 font-open-sans-bold text-xl">
                      30-Years Experience
                    </p>
                    <p className="text-sm text-gray-600">
                      A warranty extending up to 30 years provides.
                    </p>
                  </div>

                  {/* Card 2 - Title: Open Sans Bold, Body: Rubik Regular */}
                  <div className="bg-white p-4 rounded-lg shadow-xl w-64 transform translate-x-0 transition duration-500 hover:translate-x-2">
                    <p className="text-red-600 font-open-sans-bold text-lg">
                      Transport by Road
                    </p>
                    <p className="text-sm text-gray-600">
                      Solar panels can be installed very easy and simple.
                    </p>
                  </div>

                  {/* Card 3 - Title: Open Sans Bold, Body: Rubik Regular */}
                  <div className="bg-white p-4 rounded-lg shadow-xl w-64 transform translate-x-0 transition duration-500 hover:translate-x-2">
                    <p className="text-red-600 font-open-sans-bold text-lg">
                      Transport By Air
                    </p>
                    <p className="text-sm text-gray-600">
                      Solar panels can be installed very easy and simple.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Dots - Rubik Regular (Default) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[150]">
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;