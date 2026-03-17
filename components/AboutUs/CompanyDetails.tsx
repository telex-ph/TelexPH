"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaFire, FaArrowRight } from "react-icons/fa";
import { FONT_CLASSES, COLORS } from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS, SECTION_HEIGHT } from "@/constant/layout";

const CompanyDetails: React.FC = () => {
  const router = useRouter();

  // Updated button logic to redirect instead of opening modal
  const AboutUsButton = ({ isLargeScreen = false }: { isLargeScreen?: boolean }) => (
    <div
      className={`flex items-center gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${
        isLargeScreen ? "justify-end" : "justify-center"
      }`}
      onClick={() => router.push("/about")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push("/about");
        }
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push("/about");
        }}
        className={`flex items-center justify-center gap-2 
          bg-[${COLORS.primary}] text-white ${
          isLargeScreen ? "w-14 h-14" : "w-11 h-11"
        } rounded-full 
          hover:bg-[#800000] transition-all hover:scale-105 shadow-lg`}
        type="button"
      >
        <FaArrowRight
          className={`${
            isLargeScreen ? "w-5 h-5" : "w-4 h-4"
          } rotate-[-45deg]`}
        />
      </button>
      <p
        className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 select-none`}
      >
        {isLargeScreen ? "About Us" : "View About Us"}
      </p>
    </div>
  );

  return (
    <div className={`py-12 ${SECTION_HEIGHT.standard}`}>
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {/* Large Screen Button */}
        <div className="flex justify-end mb-4">
          <div className="hidden lg:flex justify-end mb-4">
            <AboutUsButton isLargeScreen={true} />
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-6 lg:gap-8 items-start">
          {/* Company Description Text */}
          <div className="space-y-4 lg:col-span-1 order-2 lg:order-2">
            <div>
              <h3
                className={`text-2xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-3`}
              >
                Best Business <br /> Support Services
              </h3>
              <p className={`text-gray-600 ${FONT_CLASSES.rubikRegular}`}>
                At Telex Philippines, we provide innovative and cost-efficient
                outsourcing solutions that help businesses thrive in today&apos;s
                competitive world.
              </p>
            </div>
          </div>

          {/* Award Card */}
          <div
            className={`relative bg-white shadow-xl p-4 rounded-xl border-t-4 transform transition duration-300 hover:scale-[1.02] flex flex-col justify-between lg:col-span-1 
              border-t-[${COLORS.primary}] order-1 lg:order-1`}
          >
            <div className="flex items-start mb-1">
              <FaFire className="text-3xl text-orange-500 mr-2 mt-0" />
              <div className="text-xl text-yellow-400">★★★★★</div>
            </div>

            <div className="flex-grow mt-1">
              <p
                className={`text-4xl ${FONT_CLASSES.poppinsBlack} my-1 leading-none text-[${COLORS.primary}]`}
              >
                2024
              </p>
              <p
                className={`text-lg ${FONT_CLASSES.openSansBold} text-gray-800`}
              >
                Best Performer Awards
              </p>
            </div>
            <div
              className={`absolute bottom-[-12px] right-[-12px] w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-[${COLORS.primary}]`}
            >
              <FaArrowRight className="text-white text-base rotate-[-45deg]" />
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-4 lg:col-span-1 order-3 lg:order-3">
            <h3
              className={`text-2xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-2`}
            >
              Best Feature List <br /> About Us
            </h3>
            <ul
              className={`space-y-2 text-gray-600 ${FONT_CLASSES.rubikRegular}`}
            >
              {[
                "Award-Winning Excellence",
                "Scalable Solutions",
                "Smart Technologies",
                "Global Reach",
                "Expert Workforce",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <span
                    className={`text-lg mr-3 ${FONT_CLASSES.openSansBold} text-[${COLORS.primary}]`}
                  >
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Image Block */}
          <div className="hidden lg:block relative min-h-[400px] mt-0 lg:mt-0 lg:col-span-2 order-4">
            <img
              src="images/post1.webp"
              alt="Post 1"
              className="absolute top-0 left-0 w-[90%] h-[300px] object-cover rounded-xl z-10 shadow-lg"
            />
            <img
              src="images/post5.webp"
              alt="Post 5"
              className="absolute bottom-0 right-0 w-[60%] h-[200px] object-cover rounded-xl z-20 shadow-xl"
            />
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden col-span-full flex justify-center order-4 p-4">
            <AboutUsButton isLargeScreen={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
