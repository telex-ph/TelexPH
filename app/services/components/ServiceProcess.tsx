"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  COLORS,
  SEMANTIC_COLORS,
  FONTS,
  FONT_CLASSES,
  getColorWithOpacity,
} from "@/constant/styles";

const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We begin with a thorough consultation to understand your business goals, pain points, and operational needs. Our team takes the time to study your current processes and challenges so we can design an outsourcing approach that perfectly aligns with your objectives.",
    image: "/images/process1.webp",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "After assessing your requirements, we create a customized strategy tailored to your business model. This includes identifying key service areas, defining workflows, setting KPIs, and determining the right team structure. Every plan we build is data-driven and focused on delivering measurable results.",
    image: "/images/process2.webp",
  },
  {
    number: "03",
    title: "Onboarding",
    description:
      "Once the strategy is finalized, we move to a smooth onboarding phase. We set up your dedicated team, integrate communication channels, and provide specialized training to ensure seamless collaboration. Our onboarding process minimizes downtime and ensures your operations start strong from day one.",
    image: "/images/process3.webp",
  },
  {
    number: "04",
    title: "Execution",
    description:
      "This is where strategy turns into action. Your assigned team begins delivering services according to the agreed workflow and KPIs. We ensure consistency, quality, and professionalism in every task—backed by advanced tools, supervision, and continuous performance monitoring.",
    image: "/images/process4.webp",
  },
  {
    number: "05",
    title: "Customer Support",
    description:
      "Communication and collaboration are at the heart of what we do. We provide consistent updates, reports, and open support channels so you stay informed about progress and performance at all times. Our customer service team ensures your satisfaction and promptly addresses any concerns.",
    image: "/images/process5.webp",
  },
  {
    number: "06",
    title: "Optimization",
    description:
      "Our partnership doesn't stop at delivery. We continuously evaluate performance metrics, gather feedback, and apply process improvements to enhance efficiency and outcomes. Through innovation and proactive management, we help you scale smarter and stay ahead in an ever-changing market.",
    image: "/images/process6.webp",
  },
];

const ProcessTabs: React.FC<{
  activeIndex: number;
  onSelect: (index: number) => void;
}> = ({ activeIndex, onSelect }) => {
  return (
    <div>
      <div
        className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {processSteps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={step.number}
              onClick={() => onSelect(index)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 md:px-5 py-2.5 md:py-3 transition-all duration-300 border ${
                isActive
                  ? "shadow-lg"
                  : "bg-white border-gray-200 text-gray-500 hover:text-[#a10000] hover:border-[#a10000]/30 hover:bg-red-50/50"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: COLORS.primary,
                      borderColor: COLORS.primary,
                      color: COLORS.white,
                      boxShadow: "0 10px 24px -8px rgba(161,0,0,0.45)",
                    }
                  : undefined
              }
            >
              <span className={`text-sm ${FONT_CLASSES.poppinsBold}`}>
                {step.number}
              </span>
              <span
                className={`hidden sm:inline text-sm ${FONT_CLASSES.openSansBold}`}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((activeIndex + 1) / processSteps.length) * 100}%`,
            backgroundColor: COLORS.primary,
          }}
        />
      </div>
    </div>
  );
};

export default function ServiceProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const step = processSteps[activeIndex];

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setActiveIndex((i) => Math.min(processSteps.length - 1, i + 1));

  return (
    <section
      className="py-20 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-20" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-50 rounded-full filter blur-3xl opacity-20" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mb-16 text-center md:text-left">
          <div className="inline-block mb-4">
            <span
              className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-full inline-block`}
              style={{ color: COLORS.primary }}
            >
              — OUR WORKS
            </span>
          </div>
          <h2
            className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-4`}
            style={{ color: SEMANTIC_COLORS.text.primary }}
          >
            Our Work <span style={{ color: COLORS.primary }}>Process</span>
          </h2>
          <p
            className={`${FONT_CLASSES.rubikRegular} text-lg mt-4 max-w-2xl mx-auto md:mx-0`}
            style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.7) }}
          >
            From consultation to optimization, we follow a proven methodology
            that ensures exceptional results every step of the way
          </p>
        </div>

        <ProcessTabs activeIndex={activeIndex} onSelect={setActiveIndex} />

        <div
          key={activeIndex}
          className="animate-fade-in-up mt-10 bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="order-2 lg:order-1 flex-1 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              <span
                className={`${FONT_CLASSES.poppinsBold} text-4xl sm:text-5xl md:text-7xl leading-none mb-2 select-none`}
                style={{ color: COLORS.primary, opacity: 0.15 }}
              >
                {step.number}
              </span>
              <h3
                className={`${FONT_CLASSES.openSansBold} text-xl sm:text-2xl md:text-3xl mb-4`}
                style={{ color: SEMANTIC_COLORS.text.primary }}
              >
                {step.title}
              </h3>
              <p
                className={`${FONT_CLASSES.rubikRegular} text-base leading-relaxed`}
                style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.7) }}
              >
                {step.description}
              </p>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  aria-label="Previous step"
                  className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:border-[#a10000] hover:text-[#a10000] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
                >
                  <ChevronLeft size={18} />
                </button>
                <span
                  className={`${FONT_CLASSES.rubikRegular} text-sm text-gray-400`}
                >
                  {activeIndex + 1} / {processSteps.length}
                </span>
                <button
                  onClick={goNext}
                  disabled={activeIndex === processSteps.length - 1}
                  aria-label="Next step"
                  className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-colors duration-200 hover:border-[#a10000] hover:text-[#a10000] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative w-full lg:w-[440px] h-64 lg:h-auto flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent z-10 lg:bg-gradient-to-l" />
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 440px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
