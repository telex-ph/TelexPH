import React from "react";
import Link from "next/link";
import { RESPONSIVE_HEIGHT } from "@/constant/layout";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

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

        {/* Content Container - Ibinaba ng kaunti */}
        <div className="relative z-10 w-full h-full flex items-center pb-0 -mt-12">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content - Takes 5 columns */}
              <div className="lg:col-span-5 pt-40 sm:pt-28 lg:pt-25 lg:pl-20 px-4 sm:px-0">
                {/* Subheading */}
                <p className="text-sm sm:text-base text-white mb-2 font-open-sans-bold">
                  Your trusted partner in Business Process Outsourcing
                </p>

                {/* Main Title */}
                <h1 className="text-[35px] sm:text-[40px] md:text-[48px] lg:text-[55px] text-white font-poppins-black leading-tight mb-4 sm:mb-5">
                  Your Partner to
                  <br />
                  Scale Smarter
                </h1>

                {/* Body Text */}
                <p className="text-white text-xs sm:text-sm leading-relaxed max-w-lg mb-5 sm:mb-6 font-rubik">
                  We deliver world-class business support services designed to
                  optimize efficiency, reduce costs, and empower your growth.
                  Together, let's build smarter, scalable solutions for your
                  success.
                </p>

                {/* Button */}
                <div className="mb-5 sm:mb-6">
                  <Link
                    href="#"
                    className="inline-block rounded px-6 sm:px-7 py-2 sm:py-2.5 text-xs font-open-sans-bold uppercase tracking-wide bg-white hover:bg-gray-100 text-[#a10000] transition-all ease-out duration-300"
                  >
                    REQUEST A QUOTE
                  </Link>
                </div>

                <div className="flex items-center relative z-[10]">
                  {/* Avatars */}
                  <div className="flex -space-x-2 mr-4">
                    {[
                      "/images/avatar4.jpg",
                      "/images/avatar1.jpeg",
                      "/images/avatar2.jpeg",
                      "/images/avatar3.jpg",
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

                  {/* Reviews */}
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

              {/* Right Content - Takes 7 columns */}
              <div className="lg:col-span-7 relative hidden lg:flex items-end justify-start h-full">
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

                {/* Floating Cards Container - Ibinaba ng kaunti */}
                <div className="absolute -right-8 xl:-right-16 top-[65%] -translate-y-1/2 space-y-3 w-[240px] xl:w-[280px]">
                  {/* Card 1 - Seamless Transactions */}
                  <div className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
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
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-sm xl:text-base mb-1">
                          Seamless Transactions
                        </h3>
                        <p className="text-[9px] xl:text-[10px] text-gray-600 leading-relaxed font-rubik">
                          Multi-channel support that keeps customers connected.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Smart Operations */}
                  <div className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
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
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-sm xl:text-base mb-1">
                          Smart Operations
                        </h3>
                        <p className="text-[9px] xl:text-[10px] text-gray-600 leading-relaxed font-rubik">
                          Streamlined workflows for maximum efficiency.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Scalable Solutions */}
                  <div className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
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
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-sm xl:text-base mb-1">
                          Scalable Solutions
                        </h3>
                        <p className="text-[9px] xl:text-[10px] text-gray-600 leading-relaxed font-rubik">
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
