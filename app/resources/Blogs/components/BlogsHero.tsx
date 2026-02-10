"use client";

import React from "react";
import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";

export default function BlogsHero() {
  return (
    <section
      className="relative pt-40 pb-10 overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[85%]
                   text-[5rem] md:text-[7rem] lg:text-[8rem]
                   opacity-15 select-none pointer-events-none
                   leading-none z-0 whitespace-nowrap uppercase"
        style={{
          fontFamily: TYPOGRAPHY.heading.fontFamily,
          fontWeight: TYPOGRAPHY.heading.fontWeight,
        }}
      >
        <span
          style={{
            WebkitTextStroke: `1px ${COLORS.dark}`,
            WebkitTextFillColor: "transparent",
            opacity: 0.85,
          }}
        >
          OUR BLOGS
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
            Blogs & Insights
          </h1>

          <p
            className="text-md md:text-lg max-w-2xl mx-auto mb-8 font-normal"
            style={{
              fontFamily: FONTS.rubik,
              color: getColorWithOpacity("dark", 0.7),
            }}
          >
            Discover latest industry news, expert opinions, and comprehensive 
            guides to help you navigate the evolving landscape of business 
            process outsourcing and technology.
          </p>

          <div
            className="text-sm uppercase tracking-widest"
            style={{
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.medium,
              color: getColorWithOpacity("dark", 0.7),
            }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: getColorWithOpacity("dark", 0.7) }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = getColorWithOpacity("dark", 0.7))
              }
            >
              Home
            </Link>
            <span className="mx-2">&gt;&gt;</span>
            <Link
              href="/resources"
              className="transition-colors"
              style={{ color: getColorWithOpacity("dark", 0.7) }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = getColorWithOpacity("dark", 0.7))
              }
            >
              Resources
            </Link>
            <span className="mx-2">&gt;&gt;</span>
            <span style={{ color: COLORS.primary }}>Blogs</span>
          </div>
        </div>
      </div>
    </section>
  );
}