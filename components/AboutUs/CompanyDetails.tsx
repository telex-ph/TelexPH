import React from "react";
import { FaFire, FaArrowRight } from "react-icons/fa";

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#800000";

const DEFAULT_MAX_WIDTH_CLASS =
  "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";

const SECTION_HEIGHT = {
  hero: "min-h-[90vh] max-h-[850px]",
  standard: "min-h-[600px] max-h-[800px]",
  compact: "",
  full: "min-h-screen max-h-[1150px]",
} as const;

const DARK_RED_CLASS = "text-[#a10000]";
const BG_DARK_RED_CLASS = "bg-[#a10000]";

const CompanyDetails = () => {
  return (
    <div className={`py-12 ${SECTION_HEIGHT.standard}`}>
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        <div className="flex justify-end mb-4 mt-13">
          <div className="flex items-center gap-4 flex-shrink-0 md:flex">
            <p className="font-open-sans-bold text-lg text-gray-900 hidden md:block">
              About Us
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-3 lg:gap-8 items-start">
          <div className="space-y-4 lg:col-span-1 order-1 lg:order-2">
            <div>
              <h3 className="text-2xl font-open-sans-bold text-gray-900 mb-3 -mt-5">
                Best Business <br /> Support Services
              </h3>
              <p className="font-rubik-regular text-gray-600">
                At Telex Philippines, we provide innovative and cost-efficient
                outsourcing solutions that help businesses thrive in
                today&apos;s competitive world.
              </p>
            </div>
          </div>

          <div className="relative bg-white shadow-xl p-3 sm:p-4 rounded-xl border-t-4 transform transition duration-300 hover:scale-[1.02] flex flex-col justify-between lg:col-span-1 border-t-[#a10000] order-2 lg:order-1 mt-2 lg:mt-0">
            <div className="flex items-start mb-1">
              <FaFire className="text-2xl sm:text-3xl text-orange-500 mr-2 mt-0" />
              <div className="text-lg sm:text-xl text-yellow-400">★★★★★</div>
            </div>

            <div className="flex-grow mt-1">
              <p
                className={`text-3xl sm:text-4xl font-poppins-black my-1 leading-none ${DARK_RED_CLASS}`}
              >
                2024
              </p>
              <p className="text-base sm:text-lg font-open-sans-bold text-gray-800">
                Best Performer Awards
              </p>
            </div>
            <div
              className={`absolute bottom-[-10px] right-[-10px] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${BG_DARK_RED_CLASS}`}
            >
              <FaArrowRight className="text-white text-sm sm:text-base rotate-[-45deg]" />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1 order-3 lg:order-3 mt-[-4px] sm:mt-0">
            <h3 className="text-2xl font-open-sans-bold text-gray-900 mb-2">
              Best Feature List <br /> About Us
            </h3>
            <ul className="space-y-2 font-rubik-regular text-gray-600">
              {[
                "Award-Winning Excellence",
                "Scalable Solutions",
                "Smart Technologies",
                "Global Reach",
                "Expert Workforce",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <span
                    className={`text-lg mr-3 font-open-sans-bold ${DARK_RED_CLASS}`}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block relative min-h-[400px] mt-0 lg:mt-0 lg:col-span-2 order-4">
            <img
              src="images/post1.svg"
              alt="Post 1"
              className="absolute top-0 left-0 w-[90%] h-[300px] object-cover rounded-xl z-10 shadow-lg"
            />
            <img
              src="images/post5.svg"
              alt="Post 5"
              className="absolute bottom-0 right-0 w-[60%] h-[200px] object-cover rounded-xl z-20 shadow-xl"
            />
          </div>

          <div className="lg:hidden mt-1 mb-30 col-span-full flex justify-center order-5">
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                className={`flex items-center justify-center gap-2 ${BG_DARK_RED_CLASS} text-white w-11 h-11 rounded-full hover:bg-[#800000] transition-all hover:scale-105 shadow-lg`}
              >
                <FaArrowRight className="w-4 h-4 rotate-[-45deg]" />
              </button>
              <p className="font-open-sans-bold text-lg text-gray-900">
                View About Us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
