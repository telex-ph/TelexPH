"use client";

import React, { useState } from "react";
import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";

export default function CareerHero() {
  return (
    <section className="relative pt-0 pb-10 overflow-hidden" style={{ backgroundColor: COLORS.white }}>
      <div
        className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[5rem] md:text-[7rem] lg:text-[8rem] opacity-15 select-none pointer-events-none leading-none z-0 whitespace-nowrap"
        style={{ 
          fontFamily: "var(--font-poppins), sans-serif", 
          fontWeight: 900 
        }}
      >
        <span style={{ WebkitTextStroke: `1px ${COLORS.dark}`, WebkitTextFillColor: "transparent", opacity: 0.85 }}>
          CAREERS
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl mb-6 tracking-tight uppercase"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              fontWeight: TYPOGRAPHY.heading.fontWeight,
              color: COLORS.black,
            }}
          >
            OUR CAREERS
          </h1>

          <p className="text-md md:text-lg max-w-2xl mx-auto mb-8 font-normal" style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.7) }}>
            Join our elite team of experts and build the future of integrated logistics and outsourcing solutions. We are looking for the top 1% of talent to lead our global operations.
          </p>

          <div 
            className="text-sm uppercase tracking-[0.15em] flex items-center justify-center mb-6" 
            style={{ 
              fontFamily: "var(--font-poppins), sans-serif", 
              fontWeight: 600 
            }}
          >
            <Link 
              href="/" 
              className="transition-colors hover:text-[#a10000]" 
              style={{ color: getColorWithOpacity("dark", 0.7), fontWeight: 600 }}
            >
              Home
            </Link>
            
            <span className="mx-1" style={{ color: getColorWithOpacity("dark", 0.4), fontWeight: 600 }}>
              &gt;&gt;
            </span>
            
            <span style={{ color: COLORS.primary, fontWeight: 600 }}>
              Careers
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-[2px] w-12 md:w-16" style={{ backgroundColor: COLORS.primary }}></div>
            
            <span 
              className="text-lg md:text-xl uppercase tracking-[0.2em]" 
              style={{ 
                fontFamily: "var(--font-poppins), sans-serif", 
                fontWeight: 800,
                color: COLORS.primary 
              }}
            >
              Join Us
            </span>

            <div className="h-[2px] w-12 md:w-16" style={{ backgroundColor: COLORS.primary }}></div>
          </div>

        </div>
      </div>
    </section>
  );
}