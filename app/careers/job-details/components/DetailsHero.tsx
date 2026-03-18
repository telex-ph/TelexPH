"use client";

import React from "react";
import Link from "next/link";

import { COLORS, FONTS, TYPOGRAPHY, getColorWithOpacity } from "@/constant/styles";

export default function CareerHero() {
  return (
    <section 
      className="relative pt-12 md:pt-25 pb-5 overflow-hidden" 
      style={{ 
        backgroundColor: COLORS.white,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070')`,
        backgroundSize: "100% 565px",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        width: "100%"
      }}
    >

      <div
        className="absolute top-[10%] md:top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[8rem] opacity-15 select-none pointer-events-none leading-none z-0 whitespace-nowrap"
        style={{ 
          fontFamily: "var(--font-poppins), sans-serif", 
          fontWeight: 900 
        }}
      >
        <span style={{ WebkitTextStroke: `1px ${COLORS.dark}`, WebkitTextFillColor: "transparent", opacity: 0.85 }}>
          DESCRIPTION
        </span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center mt-4 md:-mt-4">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl mb-6 tracking-tight uppercase"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              fontWeight: TYPOGRAPHY.heading.fontWeight,
              color: COLORS.black,
            }}
          >
            JOB DESCRIPTION
          </h1>

          <p className="text-sm sm:text-md md:text-lg max-w-2xl mx-auto mb-8 font-normal" style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.7) }}>
            join our elite team of experts and build the future of integrated logistics and outsourcing solutions. we are looking for the top 1% of talent to lead our global operations.
          </p>

          <div 
            className="text-[10px] sm:text-sm uppercase tracking-[0.15em] flex flex-wrap items-center justify-center mb-12" 
            style={{ 
              fontFamily: "var(--font-poppins), sans-serif", 
              fontWeight: 600 
            }}
          >
            <Link 
              href="/" 
              className="transition-colors hover:text-[#800000]" 
              style={{ color: getColorWithOpacity("dark", 0.7), fontWeight: 600 }}
            >
              home
            </Link>
            
            <span className="mx-2" style={{ color: getColorWithOpacity("dark", 0.4), fontWeight: 600 }}>
              &gt;&gt;
            </span>
            
            <Link 
              href="./#career" 
              className="transition-colors hover:text-[#800000]" 
              style={{ color: getColorWithOpacity("dark", 0.7), fontWeight: 600 }}
            >
              career
            </Link>
            
            <span className="mx-2" style={{ color: getColorWithOpacity("dark", 0.4), fontWeight: 600 }}>
              &gt;&gt;
            </span>
            
            <span style={{ color: "#800000", fontWeight: 600 }}>
              overview
            </span>
            
          </div>
        </div>
      </div>
    </section>
  );
}