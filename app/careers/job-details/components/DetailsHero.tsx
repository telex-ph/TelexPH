"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Calendar, Clock, Banknote } from "lucide-react";
import { COLORS, FONTS, TYPOGRAPHY, getColorWithOpacity } from "@/constant/styles";

export default function CareerHero() {
  return (
    <section 
      className="relative pt-12 md:pt-20 pb-10 overflow-hidden" 
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
        className="absolute top-[10%] md:top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[8rem] opacity-15 select-none pointer-events-none leading-none z-0 whitespace-nowrap"
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

          <div className="w-full text-left border-t border-gray-100 pt-10 pb-10">
            <div className="mb-6 ml-0 md:ml-10 flex justify-center md:justify-start">
              <span 
                className="px-6 md:px-8 py-2 md:py-2.5 rounded-full text-white text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ backgroundColor: "#800000" }}
              >
                technology
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 px-0 md:px-0">
              <div className="space-y-3 ml-0 md:ml-10 text-center md:text-left">
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight uppercase"
                  style={{ 
                    color: "#1a1a1a",
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontWeight: 700
                  }}
                >
                  front-end <span style={{ color: "#800000" }}>developer</span>
                </h2>
                
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 italic">
                  <MapPin size={18} className="text-[#800000] flex-shrink-0" />
                  <span className="text-sm sm:text-base md:text-lg font-light">
                    Cawayan Bugtong, Guimba, Nueva Ecija
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 mr-0 md:mr-10">
                <div className="flex items-center gap-3 bg-white px-3 sm:px-4 py-2 rounded-xl border border-gray-100 shadow-sm min-w-[110px]">
                  <Calendar size={14} className="text-[#800000]" />
                  <div className="text-left" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    <p className="text-[14px] text-gray-400 uppercase font-extrabold leading-none">posted</p>
                    <p className="text-[15px] sm:text-[13px] font-bold text-gray-700 uppercase">oct 24, 2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-3 sm:px-4 py-2 rounded-xl border border-gray-100 shadow-sm min-w-[110px]">
                  <Clock size={14} className="text-[#800000]" />
                  <div className="text-left" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    <p className="text-[14px] text-gray-400 uppercase font-extrabold leading-none">type</p>
                    <p className="text-[15px] sm:text-[13px] font-bold text-gray-700 uppercase">full-time</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-3 sm:px-4 py-2 rounded-xl border border-gray-100 shadow-sm min-w-[110px]">
                  <Banknote size={14} className="text-[#800000]" />
                  <div className="text-left" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    <p className="text-[14px] text-gray-400 uppercase font-extrabold leading-none">salary</p>
                    <p className="text-[15px] sm:text-[13px] font-bold text-gray-700 uppercase">competitive</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[2px]" style={{ backgroundColor: "#800000", opacity: 0.2 }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}