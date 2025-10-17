import React from "react";
import {
  COLORS,
  SEMANTIC_COLORS,
  FONTS,
  FONT_CLASSES,
  FONT_WEIGHTS,
} from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

const ContactSection: React.FC = () => {
  return (
    <section className="border-t border-gray-100 py-8 sm:py-12 flex items-center">
      <div
        className={`${DEFAULT_MAX_WIDTH_CLASS} flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-10`}
      >
        {/* Left Side — Heading */}
        <div className="flex-none w-full lg:w-1/2 space-y-4 sm:space-y-6">
          {/* Section Label — same as “— OUR OFFICES” style */}
          <div className="inline-block mb-1 sm:mb-2">
            <span
              className={`${FONT_CLASSES.openSansBold} text-xs sm:text-sm uppercase tracking-[0.25em] px-4 sm:px-6 py-1 sm:py-2 rounded-full inline-block`}
              style={{
                color: COLORS.primary,
                fontFamily: FONTS.openSans,
                fontWeight: FONT_WEIGHTS.bold,
              }}
            >
              — CONTACT OUR EXPERTS
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-4xl lg:text-5xl leading-snug sm:leading-tight tracking-tight`}
            style={{
              color: SEMANTIC_COLORS.text.primary,
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.black,
            }}
          >
            Connect with Us for{" "}
            <br className="hidden sm:block" />
            <span style={{ color: COLORS.primary }}>Immediate Assistance</span>
          </h1>
        </div>

        {/* Right Side — Description */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-start lg:items-center gap-4 sm:gap-6">
          {/* Vertical line on sm+ */}
          <div
            className="w-1 h-16 sm:h-24 mr-0 sm:mr-4 hidden sm:block flex-shrink-0"
            style={{ backgroundColor: COLORS.primary }}
          />
          <p
            className={`${FONT_CLASSES.rubikRegular} text-sm sm:text-base leading-relaxed`}
            style={{
              color: "#6b7280", // gray-600
              fontFamily: FONTS.rubik,
            }}
          >
            At <b>TelexPH</b>, client satisfaction is our top priority. Our
            dedicated team is committed to providing prompt and courteous
            support to address your outsourcing and staffing needs. Whether
            you're looking for expert advice, service details, or customized
            solutions — we're here to help you every step of the way.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
