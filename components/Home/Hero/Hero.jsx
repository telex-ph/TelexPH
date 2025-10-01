import React from "react";
import Link from "next/link";
import HeroClients from "./HeroClients";

const Hero = () => {
  return (
    <>
      <div id="home" className="relative w-full h-[90vh] md:h-[100vh] bg-red-950 pt-[10vh] lg:pt-[10vh] flex flex-col justify-center">
        <div className="relative z-[100] w-full h-full flex items-center">
          <div className="w-full px-4 xl:w-[88%] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
              
              {/* Left Content (Text and Buttons) */}
              <div className="py-10 lg:py-0">
                <p className="text-base md:text-lg text-white mb-2">
                  Innovate, Grow, and Transform Your World
                </p>
                <h1 className="text-[35px] sm:text-[45px] md:text-[55px] lg:text-[70px] text-white font-bold leading-tight mb-6">
                  We're Global <br />
                  Logistic Provider
                </h1>
                <p className="text-white text-base max-w-lg mb-8">
                  We embrace the latest construction technologies and
                  sustainable practices to deliver modern and eco-friendly
                  solutions.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="#"
                    className="rounded px-8 py-3 text-sm font-semibold text-center overflow-hidden group bg-red-700 relative
                      hover:bg-red-800 text-white transition-all ease-out duration-300 border border-white"
                  >
                    REQUEST A QUOTE
                  </Link>
                  <Link
                    href="#"
                    className="rounded px-8 py-3 text-sm font-semibold text-center overflow-hidden group bg-transparent relative
                      hover:bg-red-500 text-white transition-all ease-out duration-300 border border-white"
                  >
                    LEARN MORE
                  </Link>
                </div>

                {/* Reviews and Avatars */}
                <div className="flex items-center mt-6 space-x-3">
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

              {/* Right Content (Floating Cards) */}
              <div className="relative h-full hidden lg:block min-h-[400px]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-xl w-64 transform translate-x-0 transition duration-500 hover:translate-x-2">
                    <p className="text-red-600 font-bold text-xl">
                      30-Years Experience
                    </p>
                    <p className="text-sm text-gray-600">
                      A warranty extending up to 30 years provides.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-xl w-64 transform translate-x-0 transition duration-500 hover:translate-x-2">
                    <p className="text-red-600 font-bold text-lg">
                      Transport by Road
                    </p>
                    <p className="text-sm text-gray-600">
                      Solar panels can be installed very easy and simple.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-xl w-64 transform translate-x-0 transition duration-500 hover:translate-x-2">
                    <p className="text-red-600 font-bold text-lg">
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

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Client Logos Section */}
      <HeroClients />
    </>
  );
};

export default Hero;
