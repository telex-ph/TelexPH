import React from "react";
import Link from "next/link";
import {
  COLORS,
  FONTS,
  TYPOGRAPHY,
  FONT_WEIGHTS,
  getColorWithOpacity,
} from "@/constant/styles";

export default function LocationHero() {
  return (
    <section
      className="relative pt-40 pb-16 overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Background Stroke Text */}
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
          CONTACT US
        </span>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl mb-6 tracking-tight"
            style={{
              fontFamily: TYPOGRAPHY.heading.fontFamily,
              fontWeight: TYPOGRAPHY.heading.fontWeight,
              color: COLORS.black,
            }}
          >
            CONTACT US
          </h1>
          <p
            className="text-md md:text-lg max-w-xl mx-auto mb-8"
            style={{
              fontFamily: FONTS.rubik,
              color: getColorWithOpacity("dark", 0.7), // soft dark gray tone
            }}
          ></p>
          Let's Start a Conversation! Whether you have questions about our
          services or want to explore partnership opportunities, our team is
          here to help. Feel free to visit our office or get in touch with us.
          {/* Breadcrumbs */}
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
            <span style={{ color: COLORS.primary }}>Location</span>
          </div>
        </div>
      </div>
    </section>
  );
}
