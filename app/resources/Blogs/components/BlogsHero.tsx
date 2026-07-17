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
      {/* Background Stroke Text */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[85%]
                   text-[4rem] sm:text-[4.75rem] md:text-[7rem] lg:text-[8rem]
                   opacity-15 select-none pointer-events-none
                   leading-none z-0 whitespace-nowrap"
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

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1
            className="text-[48px] md:text-6xl mb-6 tracking-tight"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              fontWeight: TYPOGRAPHY.heading.fontWeight,
              color: COLORS.dark,
            }}
          >
            OUR BLOGS
          </h1>

          {/* Description */}
          <p
            className="max-w-1xl mx-auto mb-8 text-[14px] md:text-[16px]"
            style={{
              fontFamily: FONTS.rubik,
              color: getColorWithOpacity("dark", 0.7),
            }}
          >
            Exploring the intersection of global logistics, business intelligence,
            and human-centric outsourcing.
          </p>

          {/* Breadcrumbs */}
          <div
            className="uppercase tracking-wide"
            style={{
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.bold,
              fontSize: "10px",
              color: COLORS.dark,
            }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: COLORS.dark }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = COLORS.dark)
              }
            >
              Home
            </Link>
            <span className="mx-2">&gt;&gt;</span>
            <span style={{ color: COLORS.primary }}>Blogs</span>
          </div>
        </div>
      </div>
    </section>
  );
}