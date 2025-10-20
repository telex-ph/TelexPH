"use client";

import React from "react";
import Image from "next/image";
import { Check, PhoneCall } from "lucide-react";
import { COLORS, SEMANTIC_COLORS, FONT_CLASSES } from "@/constant/styles";

export default function CompanyOverview() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: SEMANTIC_COLORS.background.primary }}
    >
      <div className="w-[90%] mx-auto max-w-[1300px]">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* ====================== IMAGE SIDE ====================== */}
          <div className="relative h-[450px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
            <Image
              src="/images/about2.webp"
              alt="Business professionals collaborating"
              fill
              priority
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
              className="transition-transform duration-500"
            />
          </div>

          {/* ====================== TEXT SIDE ====================== */}
          <div>
            {/* BADGE */}
            <span
              className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-full inline-block`}
              style={{ color: COLORS.primary }}
            >
              — ABOUT COMPANY
            </span>

            {/* HEADING */}
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl sm:text-4xl lg:text-5xl mt-3 mb-6 leading-tight`}
              style={{ color: SEMANTIC_COLORS.text.primary }}
            >
              Powering Your Business <br className="hidden lg:inline" />
              <span style={{ color: COLORS.primary }}>the Smart Way</span>
            </h2>

            {/* DESCRIPTION */}
            <p
              className={`${FONT_CLASSES.rubikRegular} mb-5 leading-relaxed text-lg`}
              style={{ color: SEMANTIC_COLORS.text.secondary }}
            >
              At Telex Philippines, we provide innovative and cost-efficient
              outsourcing solutions that help businesses thrive in today's
              competitive world. With years of experience in the BPO industry,
              we are committed to excellence, reliability, and smart growth.
            </p>

            {/* FEATURES + IMAGE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* FEATURE LIST */}
              <div>
                <h3
                  className={`${FONT_CLASSES.openSansBold} text-xl mb-6`}
                  style={{ color: SEMANTIC_COLORS.text.primary }}
                >
                  Best Feature List <br /> About Us
                </h3>
                <div className="grid grid-cols-1 gap-y-4">
                  {[
                    "Award-Winning Excellence",
                    "Scalable Solutions",
                    "Smart Technologies",
                    "Global Reach",
                    "Expert Workforce",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 ${FONT_CLASSES.rubikRegular}`}
                      style={{ color: SEMANTIC_COLORS.text.secondary }}
                    >
                      <Check
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: COLORS.primary }}
                      />
                      <span className="text-base font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IMAGE + CONTACT */}
              <div className="flex flex-col space-y-6">
                <div className="w-full h-[200px] rounded-lg overflow-hidden shadow-xl relative">
                  <Image
                    src="/images/about3.webp"
                    alt="Small team photo"
                    fill
                    priority
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>

                <div className="flex items-center space-x-3 w-full">
                  <div
                    className="p-3 border rounded-full flex-shrink-0"
                    style={{
                      borderColor: COLORS.primaryLightBorder,
                      color: COLORS.primary,
                    }}
                  >
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <p
                      className={`${FONT_CLASSES.rubikRegular} text-sm`}
                      style={{ color: SEMANTIC_COLORS.text.secondary }}
                    >
                      Have any question? Give us a call
                    </p>
                    <p
                      className={`${FONT_CLASSES.openSansBold} text-xl`}
                      style={{ color: SEMANTIC_COLORS.text.primary }}
                    >
                      (044) 331 - 5040
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA BUTTON */}
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <a
                href="#"
                className={`${FONT_CLASSES.openSansBold} py-3 px-8 rounded-lg shadow-md transition duration-300 w-full sm:w-auto text-center`}
                style={{
                  backgroundColor: COLORS.primary,
                  color: SEMANTIC_COLORS.text.inverse,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8a0000")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = COLORS.primary)
                }
              >
                Explore More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
