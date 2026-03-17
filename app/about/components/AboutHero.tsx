import React from "react";
import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";

export default function WhatWeOfferHero() {
  return (
    <section
      className="relative pt-40 pb-10 overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Background Stroke Text - Changed to OUR SERVICES */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[85%]
                   text-[5rem] md:text-[7rem] lg:text-[8rem]
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
          OUR ABOUT
        </span>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title - Changed to SERVICES WE OFFER */}
          <h1
            className="text-5xl md:text-6xl mb-6 tracking-tight"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              fontWeight: TYPOGRAPHY.heading.fontWeight,
              color: COLORS.black,
            }}
          >
            OUR ABOUT
          </h1>

          {/* Description - Changed for Services */}
          <p
            className="text-md md:text-lg max-w-1xl mx-auto mb-8"
            style={{
              fontFamily: FONTS.rubik,
              color: getColorWithOpacity("dark", 0.7),
            }}
          >
            At Telex Philippines, we provide smart, scalable outsourcing solutions designed to help businesses achieve
            efficiency, growth, and long-term success. Guided by our tagline "SCALE SMARTER", we combine innovation,
            expertise, and technology to deliver exceptional business support services worldwide.
          </p>

          {/* Breadcrumbs - Changed last link to Services */}
          <div
            className="text-sm"
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
            <span style={{ color: COLORS.primary }}>Services</span>
          </div>
        </div>
      </div>
    </section>
  );
}