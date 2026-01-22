"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { COLORS, FONTS, TYPOGRAPHY, getColorWithOpacity } from "@/constant/styles";

export default function CareerHero() {
  return (
    <section 
      className="relative pt-20 pb-10 overflow-hidden" 
      style={{ 
        backgroundColor: COLORS.white,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        width: "100%"
      }}
    >

      <div
        className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[5rem] md:text-[7rem] lg:text-[8rem] opacity-15 select-none pointer-events-none leading-none z-0 whitespace-nowrap"
        style={{ 
          fontFamily: "var(--font-poppins), sans-serif", 
          fontWeight: 900 
        }}
      >
        <span style={{ WebkitTextStroke: `1px ${COLORS.dark}`, WebkitTextFillColor: "transparent", opacity: 0.85 }}>
          description
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center -mt-4">
          <h1
            className="text-5xl md:text-6xl mb-6 tracking-tight uppercase"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              fontWeight: TYPOGRAPHY.heading.fontWeight,
              color: COLORS.black,
            }}
          >
            job description
          </h1>

          <p className="text-md md:text-lg max-w-2xl mx-auto mb-8 font-normal" style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.7) }}>
            join our elite team of experts and build the future of integrated logistics and outsourcing solutions. we are looking for the top 1% of talent to lead our global operations.
          </p>

          <div 
            className="text-sm uppercase tracking-[0.15em] flex items-center justify-center mb-12" 
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

          <div className="w-full text-left border-t border-gray-100 pt-10 pb-10">
            <div className="mb-6">
              <span 
                className="px-8 py-2.5 rounded-full text-white text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ backgroundColor: "#800000" }}
              >
                technology
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
              <div className="space-y-3">
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
                  style={{ color: "#1a1a1a" }}
                >
                  front-end <span style={{ color: "#800000" }}>developer</span>
                </h2>
                
                <div className="flex items-center gap-2 text-gray-700 italic">
                  <MapPin size={22} className="text-[#800000]" />
                  <span className="text-base md:text-lg font-medium">
                    cawayan bugtong, guimba, nueva ecija
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-12 py-4 rounded-xl text-white font-bold text-sm tracking-widest uppercase transition-all hover:bg-[#600000] shadow-lg"
                  style={{ backgroundColor: "#800000" }}
                >
                  apply now
                </button>
                <button 
                  className="px-12 py-4 rounded-xl text-white font-bold text-sm tracking-widest uppercase transition-all hover:bg-[#600000] shadow-lg"
                  style={{ backgroundColor: "#800000" }}
                >
                  book now
                </button>
              </div>
            </div>

            <div className="w-full h-[2px]" style={{ backgroundColor: "#800000", opacity: 0.2 }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}