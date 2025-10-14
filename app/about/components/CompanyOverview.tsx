"use client";

import React from "react";
import Image from "next/image";
import { Check, PhoneCall } from "lucide-react";
import { COLORS, SEMANTIC_COLORS, FONT_CLASSES } from "@/constant/styles"; // ✅ central design tokens

export default function CompanyOverview() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: SEMANTIC_COLORS.background.primary }}
    >
      <div className="w-[90%] mx-auto max-w-[1300px]">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* ====================== IMAGE SIDE ====================== */}
          <div className="relative h-[450px] md:h-[600px] lg:h-[700px] order-1 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/images/about2.png"
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
          </div>

          {/* ====================== TEXT SIDE ====================== */}
          <div className="order-2">
            <span
              className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
              style={{ color: COLORS.primary }}
            >
              — ABOUT COMPANY
            </span>

            <h2
              className={`${FONT_CLASSES.openSansBold} text-gray-900 text-3xl sm:text-4xl lg:text-5xl mt-3 mb-6 leading-tight`}
            >
              Powering Your Business <br className="hidden lg:inline" /> the
              Smart Way
            </h2>

            <p
              className={`${FONT_CLASSES.rubikRegular} mb-5 leading-relaxed`}
              style={{ color: SEMANTIC_COLORS.text.secondary }}
            >
              At Telex Philippines, we provide innovative and cost-efficient
              outsourcing solutions that help businesses thrive in today's
              competitive world. With years of experience in the BPO industry,
              we are committed to excellence, reliability, and smart growth.
            </p>

            {/* ====================== FEATURES + IMAGE GRID ====================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-6">
              {/* FEATURE LIST */}
              <div className="mt-6 md:mt-0">
                <h3
                  className={`${FONT_CLASSES.openSansBold} text-xl mb-6`}
                  style={{ color: SEMANTIC_COLORS.text.primary }}
                >
                  Best Feature List <br /> About Us
                </h3>

                <div className="grid grid-cols-1 gap-y-5">
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
                    src="/images/about3.jpg"
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

            {/* ====================== CTA BUTTON ====================== */}
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
