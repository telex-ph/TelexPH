"use client";

import React from "react";
import { motion } from "framer-motion";
import { RESPONSIVE_HEIGHT } from "@/constant/layout";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import PeekingRobot from "./PeekingRobot";

// ✅ Font setup
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-rubik",
  display: "swap",
});

const FONT_CLASSES = {
  openSansBold: openSans.className,
  poppinsBlack: poppins.className,
  rubikRegular: rubik.className,
};

const COLORS = {
  primary: "#a10000",
};

const HERO_BG_IMAGE = "/images/background.webp";

const AVATARS = [
  "/images/avatar1.webp",
  "/images/avatar2.webp",
  "/images/avatar3.webp",
  "/images/avatar4.webp",
];

const FLOATING_CARDS = [
  {
    title: "Seamless Transactions",
    desc: "Multi-channel support that keeps customers connected.",
    icon: (
      <svg
        className="w-4 h-4 xl:w-5 xl:h-5 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Smart Operations",
    desc: "Streamlined workflows for maximum efficiency.",
    icon: (
      <svg
        className="w-4 h-4 xl:w-5 xl:h-5 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Scalable Solutions",
    desc: "Flexible solutions that grow with your business.",
    icon: (
      <svg
        className="w-4 h-4 xl:w-5 xl:h-5 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

// ✅ HighLevelMessage (only for <1020px screens)
const HighLevelMessage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.5 }}
      className={`absolute z-[9999] left-1/2 -translate-x-1/2 
                  bottom-4 sm:bottom-6 
                  bg-white px-4 py-3 rounded-2xl shadow-2xl 
                  w-[90%] sm:w-[85%] md:w-[70%]
                  border border-gray-200 
                  flex items-center gap-3
                  transition-all duration-300
                  lg:hidden`}  
    >
      {/* Bubble Tail */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[-10px] w-0 h-0 
                   border-b-[15px] border-b-white 
                   border-l-[10px] border-l-transparent 
                   border-r-[10px] border-r-transparent"
      />

      {/* Logo */}
      <img
        src="/images/unnamed.png"
        alt="HighLevel Admins Logo"
        className="w-10 h-10 object-contain rounded-xl flex-shrink-0"
        loading="lazy"
      />

      {/* Text */}
      <div className="flex flex-col leading-tight flex-grow">
        <span
          className={`text-xs ${FONT_CLASSES.openSansBold}`}
          style={{ color: COLORS.primary }}
        >
          Powered by
        </span>
        <span
          className={`text-sm ${FONT_CLASSES.poppinsBlack}`}
          style={{ color: "#7a0000" }}
        >
          HighLevel Certified Admins
        </span>
        <p
          className={`text-[10px] mt-0.5 leading-snug ${FONT_CLASSES.rubikRegular}`}
          style={{ color: "#6b7280" }}
        >
          We build, automate, and optimize your CRM, funnels, and workflows.
        </p>
      </div>
    </motion.div>
  );
};

// ✅ HERO COMPONENT
const Hero = () => {
  return (
    <div
      id="home"
      className={`relative w-full ${RESPONSIVE_HEIGHT.hero} bg-cover bg-center overflow-hidden ${poppins.variable} ${openSans.variable} ${rubik.variable}`}
      style={{
        backgroundImage: `url(${HERO_BG_IMAGE})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900 to-red-950 opacity-45"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-end sm:items-center pb-32 sm:pb-0 pt-0 sm:pt-20 lg:pt-0">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Section */}
            <div className="lg:col-span-12 xl:col-span-5 lg:pl-20 px-4 sm:px-0">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm sm:text-base text-white mb-2 font-open-sans-bold"
              >
                Your trusted partner in Business Process Outsourcing
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[35px] sm:text-[40px] md:text-[48px] lg:text-[55px] text-white font-poppins-black leading-tight mb-4 sm:mb-5"
              >
                Your Partner to
                <br />
                Scale Smarter
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-white text-xs sm:text-sm leading-relaxed max-w-lg mb-5 sm:mb-6 font-rubik"
              >
                We deliver world-class business support services designed to
                optimize efficiency, reduce costs, and empower your growth.
                Together, let's build smarter, scalable solutions for your
                success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-5 sm:mb-6"
              >
                <a
                  href="https://hiretelex.com/scale-with-telex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded px-6 sm:px-7 py-2 sm:py-2.5 text-xs font-open-sans-bold uppercase tracking-wide bg-white text-[#a10000] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-100"
                >
                  CONTACT US NOW
                </a>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center"
              >
                <div className="flex -space-x-2 mr-4">
                  {AVATARS.map((src, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden shadow-md"
                    >
                      <img
                        src={src}
                        alt={`Avatar ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <div className="text-amber-400 text-xs sm:text-sm mb-0">
                    ★★★★★
                  </div>
                  <p className="text-[10px] sm:text-xs font-open-sans-bold">
                    5.5K Reviews
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Section - Floating Cards (Desktop Only) */}
            <div className="lg:col-span-7 relative hidden xl:flex items-end justify-start h-full">
              <div
                className="absolute left-0 right-0 flex items-end justify-start"
                style={{ bottom: "-260px" }}
              >
                <img
                  src="/images/hpic.webp"
                  alt="Customer Service Representatives"
                  className="w-auto h-auto object-contain object-bottom"
                  style={{
                    display: "block",
                    marginLeft: "-100px",
                    maxHeight: "100vh",
                  }}
                />
              </div>

              <div className="absolute -right-8 xl:-right-16 top-[65%] -translate-y-1/2 space-y-3 w-[280px] xl:w-[300px]">
                {FLOATING_CARDS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 * idx }}
                    className="bg-white p-3 xl:p-4 rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 xl:w-10 xl:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-open-sans-bold text-base xl:text-lg mb-1 whitespace-nowrap">
                          {card.title}
                        </h3>
                        <p className="text-xs xl:text-sm text-gray-600 leading-relaxed font-rubik">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🤖 Robot – only on large screens */}
      <div className="hidden lg:block">
        <PeekingRobot />
      </div>

      {/* 💬 Floating Message – visible only below 1020px */}
      <HighLevelMessage />
    </div>
  );
};

export default Hero;
