"use client";

import React from "react";
import Link from "next/link";
import { COLORS, FONT_WEIGHTS, FONTS } from "@/constant/styles"; 

const LocationCTA = () => {
  return (
    <div className="text-center py-12">
      <h2 
        className="text-3xl font-bold mb-6"
        style={{
          fontFamily: FONTS.poppins, 
          fontWeight: FONT_WEIGHTS.bold,
          color: COLORS.black
        }}
      >
        Ready to Get in Touch?
      </h2>
      <Link
        href="/contact"
        className="inline-block text-white px-8 py-3 rounded-lg transition-colors duration-300"
        style={{
          backgroundColor: COLORS.primary,
          fontFamily: FONTS.poppins, 
          fontWeight: FONT_WEIGHTS.semibold,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.dark)} 
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
      >
        Contact Us
      </Link>
    </div>
  );
};

export default LocationCTA;