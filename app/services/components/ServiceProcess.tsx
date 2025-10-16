"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  COLORS,
  SEMANTIC_COLORS,
  FONTS,
  FONT_CLASSES,
  FONT_WEIGHTS,
  TYPOGRAPHY,
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
    dark: true,
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
    dark: true,
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
    dark: true,
  },
];

const ProcessCard: React.FC<{ step: typeof processSteps[0]; index: number }> = ({
  step,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative flex flex-col lg:flex-row items-center gap-4 lg:gap-6 py-8 md:py-10 px-4 md:px-8 rounded-3xl transition-all duration-500 h-full overflow-hidden ${
        step.dark
          ? "bg-[#282828] hover:bg-[#2f2f2f]"
          : "bg-white shadow-lg hover:shadow-2xl"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: step.dark
            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
            : "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, transparent 50%)",
        }}
      />

      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 transition-transform duration-500 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at top right, ${COLORS.primary} 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex-shrink-0 w-20 md:w-24 mx-auto lg:mx-0">
        <div
          className={`text-4xl md:text-5xl font-extrabold ${FONT_CLASSES.poppinsBlack} transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 relative z-10`}
          style={{
            color: step.dark
              ? SEMANTIC_COLORS.text.inverse
              : SEMANTIC_COLORS.text.primary,
          }}
        >
          {step.number}
        </div>
        <div
          className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
          style={{
            background: COLORS.primary,
            transform: "scale(1.5)",
          }}
        />
      </div>

      <div className="relative flex-shrink-0 w-full max-w-sm mx-auto text-center lg:w-32 lg:text-left lg:max-w-none">
        <h3
          className={`text-xl md:text-2xl font-bold ${FONT_CLASSES.openSansBold} relative z-10`}
          style={{
            color: step.dark
              ? SEMANTIC_COLORS.text.inverse
              : SEMANTIC_COLORS.text.primary,
          }}
        >
          {step.title}
        </h3>
      </div>

      <div className="flex-shrink-0 w-10 md:w-12 relative mx-auto lg:mx-0">
        <svg
          width="48"
          height="24"
          viewBox="0 0 48 24"
          fill="none"
          className="transition-all duration-500 group-hover:translate-x-2"
          style={{
            opacity: step.dark ? 0.6 : 0.4,
          }}
        >
          <path
            d="M2 12h40m0 0l-8-8m8 8l-8 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={step.dark ? "stroke-white" : "stroke-gray-800"}
          />
        </svg>
      </div>

      <p
        className={`text-sm md:text-base leading-relaxed flex-grow text-center lg:text-left ${FONT_CLASSES.rubikRegular} relative z-10`}
        style={{
          color: step.dark
            ? "rgba(255,255,255,0.75)"
            : SEMANTIC_COLORS.text.secondary,
          maxWidth: "38rem",
          fontFamily: FONTS.rubik,
        }}
      >
        {step.description}
      </p>

      <div className="flex-shrink-0 w-full md:w-80 h-40 md:h-32 rounded-2xl overflow-hidden relative group/image mx-auto lg:mx-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 z-10" />
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover transition-transform duration-700 group-hover/image:scale-110"
          sizes="(max-width: 768px) 100vw, 320px"
          priority={index < 2}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 transform origin-left transition-transform duration-700 scale-x-0 group-hover:scale-x-100"
        style={{ backgroundColor: COLORS.primary }}
      />
    </div>
  );
};

const CarouselPagination: React.FC<{
  steps: typeof processSteps;
  activeIndex: number;
  scrollTo: (index: number) => void;
}> = ({ steps, activeIndex, scrollTo }) => {
  return (
    <div className="flex justify-center mt-8 space-x-3">
      {steps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={`
            h-2.5 rounded-full transition-all duration-300 ease-out
            hover:opacity-100
            ${index === activeIndex ? "w-8 opacity-100" : "bg-gray-300 w-2.5 opacity-50 hover:opacity-70"}
          `}
          style={{
            backgroundColor: index === activeIndex ? COLORS.primary : undefined,
          }}
          aria-label={`Go to process step ${index + 1}`}
        />
      ))}
    </div>
  );
};

const ProcessCarousel: React.FC<{ steps: typeof processSteps }> = ({
  steps,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth =
        (scrollRef.current.querySelector(":scope > div")?.clientWidth || 1) + 16;

      const newIndex = Math.round(scrollLeft / itemWidth);

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const itemWidth =
        (scrollRef.current.querySelector(":scope > div")?.clientWidth || 1) + 16;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          relative 
          flex snap-x snap-mandatory overflow-x-scroll overflow-y-visible
          space-x-4 px-4 pb-4
          scrollbar-hide
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {steps.map((step, index) => (
          <div key={index} className="flex-shrink-0 w-full snap-start">
            <ProcessCard step={step} index={index} />
          </div>
        ))}
      </div>
      <CarouselPagination
        steps={steps}
        activeIndex={activeIndex}
        scrollTo={scrollTo}
      />
    </>
  );
};

export default function ServiceProcess() {
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
            className={`${FONT_CLASSES.poppinsBlack} text-3xl md:text-4xl lg:text-5xl mb-4`}
            style={{ color: SEMANTIC_COLORS.text.primary }}
          >
            Our Work <span style={{ color: COLORS.primary }}>Process</span>
          </h2>
          <p
            className={`${FONT_CLASSES.rubikRegular} text-lg text-gray-600 mt-4 max-w-2xl mx-auto md:mx-0`}
            style={{ fontFamily: FONTS.rubik }}
          >
            From consultation to optimization, we follow a proven methodology
            that ensures exceptional results every step of the way
          </p>
        </div>

        <div className="lg:hidden pb-2 overflow-visible">
          <ProcessCarousel steps={processSteps} />
        </div>

        <div className="hidden lg:block space-y-6">
          {processSteps.map((step, index) => (
            <ProcessCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
