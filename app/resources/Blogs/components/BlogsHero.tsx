"use client";

import React from "react";
import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";

export default function BlogsHero() {
  return (
    <section
      className="relative pt-44 pb-20 overflow-hidden bg-white"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Background Text Decor */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[90%]
                   text-[6rem] md:text-[10rem] lg:text-[12rem]
                   opacity-[0.03] select-none pointer-events-none
                   leading-none z-0 whitespace-nowrap uppercase italic"
        style={{
          fontFamily: TYPOGRAPHY.heading.fontFamily,
          fontWeight: 900,
        }}
      >
        <span
          style={{
            WebkitTextStroke: `2px ${COLORS.dark}`,
            WebkitTextFillColor: "transparent",
          }}
        >
          TELEXPH JOURNAL
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              color: COLORS.black,
            }}
          >
            The <span style={{ color: "#800000" }}>Journal</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
            style={{
              fontFamily: FONTS.rubik,
              color: getColorWithOpacity("dark", 0.6),
            }}
          >
            Exploring the intersection of global logistics, business intelligence, 
            and human-centric outsourcing.
          </p>

          <div
            className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em]"
            style={{
              fontFamily: FONTS.openSans,
            }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: getColorWithOpacity("dark", 0.4) }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#800000")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = getColorWithOpacity("dark", 0.4))
              }
            >
              Home
            </Link>
            <span className="opacity-30" style={{ color: COLORS.dark }}>/</span>
            <span style={{ color: "#800000" }}>Blogs</span>
          </div>
        </div>
      </div>
    </section>
  );
}