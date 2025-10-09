"use client";

import React, { useState } from "react";
import { FaFire, FaArrowRight } from "react-icons/fa";
import ComingSoonModal from "@/components/Modals/ComingSoonModal"; 
import { FONT_CLASSES, COLORS } from "@/constant/styles"; 
import { DEFAULT_MAX_WIDTH_CLASS, SECTION_HEIGHT } from "@/constant/layout";

const CompanyDetails: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`py-12 ${SECTION_HEIGHT.standard}`}>
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        <div className="flex justify-end mb-4">
          <div className="hidden lg:flex justify-end mb-4">
            {/* Updated: Entire div (button + text) is now clickable */}
            <div 
              className="flex items-center gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={openModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal();
                }
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double-trigger from parent
                  openModal();
                }}
                className={`flex items-center justify-center gap-2 
                  bg-[${COLORS.primary}] text-white w-14 h-14 rounded-full 
                  hover:bg-[#800000] transition-all hover:scale-105 shadow-lg`}
                type="button"
              >
                <FaArrowRight className="w-5 h-5 rotate-[-45deg]" />
              </button>
              <p className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 select-none`}>
                About Us
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-3 lg:gap-8 items-start">
          <div className="space-y-4 lg:col-span-1 order-1 lg:order-2">
            <div>
              <h3 className={`text-2xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-3 mt-5`}>
                Best Business <br /> Support Services
              </h3>
              <p className={`text-gray-600 ${FONT_CLASSES.rubikRegular}`}>
                At Telex Philippines, we provide innovative and cost-efficient
                outsourcing solutions that help businesses thrive in
                today&apos;s competitive world.
              </p>
            </div>
          </div>

          {/* Award Card */}
          <div 
            className={`relative bg-white shadow-xl p-3 sm:p-4 rounded-xl border-t-4 transform transition duration-300 hover:scale-[1.02] flex flex-col justify-between lg:col-span-1 
              border-t-[${COLORS.primary}] order-2 lg:order-1 mt-2 lg:mt-0`} 
          >
            <div className="flex items-start mb-1">
              <FaFire className="text-2xl sm:text-3xl text-orange-500 mr-2 mt-0" />
              <div className="text-lg sm:text-xl text-yellow-400">★★★★★</div>
            </div>

            <div className="flex-grow mt-1">
              <p
                className={`text-3xl sm:text-4xl ${FONT_CLASSES.poppinsBlack} my-1 leading-none text-[${COLORS.primary}]`}
              >
                2024
              </p>
              <p className={`text-base sm:text-lg ${FONT_CLASSES.openSansBold} text-gray-800`}>
                Best Performer Awards
              </p>
            </div>
            <div
              className={`absolute bottom-[-10px] right-[-10px] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg bg-[${COLORS.primary}]`}
            >
              <FaArrowRight className="text-white text-sm sm:text-base rotate-[-45deg]" />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1 order-3 lg:order-3 mt-[-4px] sm:mt-0">
            <h3 className={`text-2xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-2`}>
              Best Feature List <br /> About Us
            </h3>
            <ul className={`space-y-2 text-gray-600 ${FONT_CLASSES.rubikRegular}`}>
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

          {/* Updated: Mobile - Entire div (button + text) is now clickable */}
          <div className="lg:hidden mt-1 mb-30 col-span-full flex justify-center order-5">
            <div 
              className="flex items-center gap-4 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={openModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal();
                }
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double-trigger from parent
                  openModal();
                }}
                className={`flex items-center justify-center gap-2 bg-[${COLORS.primary}] text-white w-11 h-11 rounded-full hover:bg-[#800000] transition-all hover:scale-105 shadow-lg`}
                type="button"
              >
                <FaArrowRight className="w-4 h-4 rotate-[-45deg]" />
              </button>
              <p className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 select-none`}>
                View About Us
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Render the Modal - Now with Full Blur Coverage */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="About Us - Coming Soon"
        message="The About Us page is under development and will be launched soon. Stay tuned for more details about Telex Philippines!"
        // backgroundImageSrc="/images/your-about-bg.jpg" // Optional: Add if you want a custom bg like Services
      />
    </div>
  );
};

export default CompanyDetails;