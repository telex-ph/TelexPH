import React from "react";
import Link from "next/link";
import { RESPONSIVE_HEIGHT } from "@/constant/layout";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

// ✅ Font setup
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-rubik",
  display: "swap",
});

const HERO_BG_IMAGE = "/images/background.jpg";

// ✅ Main Hero component
const Hero = () => {
  return (
    <>
      <div
        id="home"
        className={`relative w-full ${RESPONSIVE_HEIGHT.hero} bg-cover bg-center overflow-hidden ${poppins.variable} ${openSans.variable} ${rubik.variable}`}
        style={{
          backgroundImage: `url(${HERO_BG_IMAGE})`,
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900 to-red-950 opacity-45"></div>

        {/* Content - MODIFIED: 
          1. Changed the main container to `items-end` for default (mobile) view.
          2. Added `pb-12` (padding bottom) to push the content up from the bottom edge.
          3. For screens larger than small (`sm:`), we revert to `items-center` and remove the bottom padding (`sm:pb-0`) to use vertical centering instead. This ensures consistency for bigger screens while fixing the low position on mobile.
        */}
        <div className="relative z-10 w-full h-full flex items-end sm:items-center pb-12 sm:pb-0 pt-0 sm:pt-20 lg:pt-0">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left side - Kept current column spans (full width up to xl, then 5 cols at xl) */}
              <div className="lg:col-span-12 xl:col-span-5 lg:pl-20 px-4 sm:px-0">
                <p className="text-sm sm:text-base text-white mb-2 font-open-sans-bold">
                  Your trusted partner in Business Process Outsourcing
                </p>

                <h1 className="text-[35px] sm:text-[40px] md:text-[48px] lg:text-[55px] text-white font-poppins-black leading-tight mb-4 sm:mb-5">
                  Your Partner to
                  <br />
                  Scale Smarter
                </h1>

                <p className="text-white text-xs sm:text-sm leading-relaxed max-w-lg mb-5 sm:mb-6 font-rubik">
                  We deliver world-class business support services designed to
                  optimize efficiency, reduce costs, and empower your growth.
                  Together, let's build smarter, scalable solutions for your
                  success.
                </p>

                <div className="mb-5 sm:mb-6">
                  <a
                    href="https://hiretelex.com/scale-with-telex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded px-6 sm:px-7 py-2 sm:py-2.5 text-xs font-open-sans-bold uppercase tracking-wide bg-white hover:bg-gray-100 text-[#a10000] transition-all ease-out duration-300"
                  >
                    CONTACT US NOW
                  </a>
                </div>

                {/* Avatars & Reviews */}
                <div className="flex items-center relative z-[10]">
                  <div className="flex -space-x-2 mr-4">
                    {[
                      "/images/avatar1.jpeg",
                      "/images/avatar2.jpeg",
                      "/images/avatar3.jpg",
                      "/images/avatar4.jpg",
                    ].map((src, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden shadow-md"
                      >
                        <img
                          src={src}
                          alt={`Avatar ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-white">
                    <div className="text-amber-400 text-xs sm:text-sm mb-0">
                      ★★★★★
                    </div>
                    <p className="text-[10px] sm:text-xs font-open-sans-bold">
                      5.5K Review
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Hidden until xl screen size (1280px) */}
              <div className="lg:col-span-7 relative hidden xl:flex items-end justify-start h-full">
                <div
                  className="absolute left-0 right-0 flex items-end justify-start"
                  style={{ bottom: "-260px" }}
                >
                  <img
                    src="/images/hpic.png"
                    alt="Customer Service Representatives"
                    className="w-auto h-auto object-contain object-bottom"
                    style={{
                      display: "block",
                      marginLeft: "-100px",
                      maxHeight: "100vh",
                    }}
                  />
                </div>

                {/* Floating cards */}
                <div className="absolute -right-8 xl:-right-16 top-[65%] -translate-y-1/2 space-y-3 w-[280px] xl:w-[300px]">
                  {/* Card 1 */}
                  <div className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 xl:w-10 xl:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 xl:w-5 xl:h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-base xl:text-lg mb-1 whitespace-nowrap">
                          Seamless Transactions
                        </h3>
                        <p className="text-xs xl:text-sm text-gray-600 leading-relaxed font-rubik">
                          Multi-channel support that keeps customers connected.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 xl:w-10 xl:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 xl:w-5 xl:h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-base xl:text-lg mb-1 whitespace-nowrap">
                          Smart Operations
                        </h3>
                        <p className="text-xs xl:text-sm text-gray-600 leading-relaxed font-rubik">
                          Streamlined workflows for maximum efficiency.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 xl:w-10 xl:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 xl:w-5 xl:h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-base xl:text-lg mb-1 whitespace-nowrap">
                          Scalable Solutions
                        </h3>
                        <p className="text-xs xl:text-sm text-gray-600 leading-relaxed font-rubik">
                          Flexible solutions that grow with your business.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
