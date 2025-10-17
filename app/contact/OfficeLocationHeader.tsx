"use client";

import React from "react";
import { ContactInfoCard } from "./ContactInfoCard";
import ContactMap from "./ContactMap";
import {
  COLORS,
  SEMANTIC_COLORS,
  FONTS,
  FONT_CLASSES,
  FONT_WEIGHTS,
} from "@/constant/styles";

const OfficeLocationHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-16 right-0 w-80 h-80 bg-red-50 rounded-full filter blur-3xl opacity-30" />
      <div className="absolute bottom-16 left-0 w-80 h-80 bg-red-100 rounded-full filter blur-3xl opacity-20" />

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block mb-3">
            <span
              className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-full inline-block`}
              style={{
                color: COLORS.primary,
                fontFamily: FONTS.openSans,
                fontWeight: FONT_WEIGHTS.bold,
              }}
            >
              — OUR OFFICES
            </span>
          </div>

          <h2
            className={`${FONT_CLASSES.poppinsBlack} text-3xl md:text-4xl lg:text-5xl mb-3`}
            style={{
              color: SEMANTIC_COLORS.text.primary,
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.black,
            }}
          >
            Visit Our{" "}
            <span style={{ color: COLORS.primary }}>Office Locations</span>
          </h2>

          <p
            className={`${FONT_CLASSES.rubikRegular} text-lg text-gray-600 mt-3 max-w-2xl mx-auto md:mx-0`}
            style={{ fontFamily: FONTS.rubik }}
          >
            Find us at our key offices across the region. Get in touch with our
            experts and experience seamless logistics solutions built for your
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactInfoCard />
          <ContactMap />
        </div>
      </div>
    </div>
  );
};

export default OfficeLocationHeader;
