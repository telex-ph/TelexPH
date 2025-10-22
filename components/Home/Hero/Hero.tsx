"use client";

import React from "react";
import { motion } from "framer-motion";
import { RESPONSIVE_HEIGHT } from "@/constant/layout";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import { FONT_CLASSES, COLORS } from "@/constant/styles";

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

// 🤖 PEEKING ROBOT COMPONENT
const PeekingRobot = () => {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: -50 }}
      transition={{ duration: 1, delay: 2, ease: "easeOut" }}
      className="absolute bottom-0 left-0 z-50 cursor-pointer hidden md:block" 
      whileHover={{ x: 0 }}
    >
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 3, ease: "easeOut" }}
      className="absolute left-[180px] bottom-[120px] bg-white px-7 py-3 rounded-2xl shadow-2xl min-w-[330px] border-2 border-gray-200 flex items-center gap-3"
    >
      {/* Bubble Tail */}
      <div className="absolute left-[-12px] bottom-[25px] w-0 h-0 border-r-[15px] border-r-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent" />

      {/* Logo with rounded corners */}
      <img
        src="/images/unnamed.png"
        alt="HighLevel Admins Logo"
        className="w-15 h-15 object-contain mr-2 flex-shrink-0 rounded-xl" // ✅ added rounded corners
        loading="lazy"
      />

      {/* Text Section */}
      <div className="flex flex-col leading-tight whitespace-nowrap">
        {/* Powered by */}
        <span
          className={`text-sm ${FONT_CLASSES.openSansBold}`}
          style={{ color: COLORS.primary }}
        >
          Powered by
        </span>

        {/* HighLevel Certified Admins */}
        <span
          className={`text-base ${FONT_CLASSES.poppinsBlack}`}
          style={{ color: "#7a0000" }}
        >
          HighLevel Certified Admins
        </span>

        {/* Description */}
        <p
          className={`text-xs mt-1 whitespace-normal ${FONT_CLASSES.rubikRegular}`}
          style={{ color: "#6b7280" }} // gray-500
        >
          We build, automate, and optimize your CRM, funnels, and workflows.
        </p>
      </div>
    </motion.div>

      {/* Robot Container */}
      <div className="relative w-[180px] h-[220px]">
        {/* Floating Animation Container */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          {/* Robot Head */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[75px]">
            {/* Head Top Curve */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[14px] bg-gradient-to-b from-[#dde5ef] to-[#c8d3e0] rounded-t-[25px] border-[3px] border-[#2d3e52] border-b-0"
              style={{ boxShadow: "inset 0 2px 5px rgba(255,255,255,0.5)" }}
            />

            {/* Antenna */}
            <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 w-[7px] h-[22px] bg-gradient-to-b from-[#c8d3e0] to-[#b5c2d1] border-[3px] border-[#2d3e52] rounded-t-full">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.7, 1],
                  boxShadow: [
                    "0 0 15px rgba(255, 68, 68, 0.9)",
                    "0 0 25px rgba(255, 68, 68, 1)",
                    "0 0 15px rgba(255, 68, 68, 0.9)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] bg-gradient-to-b from-[#ff4444] to-[#dd2222] rounded-full border-[3px] border-[#2d3e52]"
              />
            </div>

            {/* Main Head/Visor - Dark Red */}
            <div
              className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[110px] h-[61px] bg-gradient-to-b from-[#5a1515] via-[#3d0d0d] to-[#2a0808] rounded-[28px] border-[3px] border-[#2d3e52] overflow-hidden"
              style={{
                boxShadow:
                  "inset 0 -15px 25px rgba(0,0,0,0.6), inset 0 2px 10px rgba(255,255,255,0.05)",
              }}
            >
              {/* Visor Top Shine */}
              <div className="absolute top-2 left-6 w-20 h-8 bg-gradient-to-br from-white/8 to-transparent rounded-full blur-sm" />

              {/* Eyes Container */}
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex gap-10 items-center">
                {[0, 1].map((i) => (
                  <div key={i} className="relative">
                    {/* Eye Outer Glow */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-[#ff3333] rounded-full blur-lg"
                    />

                    {/* Eye Main */}
                    <motion.div
                      animate={{
                        scale: [1, 0.95, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                      className="relative w-[22px] h-[22px] bg-gradient-to-b from-[#ff5555] via-[#ff3333] to-[#dd1111] rounded-full border-[2px] border-[#ff6666]"
                      style={{
                        boxShadow:
                          "0 0 20px rgba(255, 68, 68, 1), inset 0 3px 8px rgba(255,100,100,0.5), inset 0 -2px 5px rgba(139,0,0,0.8)",
                      }}
                    >
                      {/* Eye Highlight */}
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Red Accent Line */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[75px] h-[2px] bg-gradient-to-r from-transparent via-[#ff3333] to-transparent"
                style={{ boxShadow: "0 0 10px rgba(255, 51, 51, 0.9)" }}
              />
            </div>

            {/* Ear Pieces with Detail */}
            <div
              className="absolute top-[32px] -left-[14px] w-[20px] h-[28px] bg-gradient-to-br from-[#dde5ef] via-[#c8d3e0] to-[#b5c2d1] rounded-[10px] border-[3px] border-[#2d3e52]"
              style={{
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)",
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-[#34495e] rounded-full border border-[#2d3e52]" />
            </div>
            <div
              className="absolute top-[32px] -right-[14px] w-[20px] h-[28px] bg-gradient-to-br from-[#dde5ef] via-[#c8d3e0] to-[#b5c2d1] rounded-[10px] border-[3px] border-[#2d3e52]"
              style={{
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)",
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-[#34495e] rounded-full border border-[#2d3e52]" />
            </div>
          </div>

          {/* Neck with Detail */}
          <div
            className="absolute top-[73px] left-1/2 -translate-x-1/2 w-[34px] h-[14px] bg-gradient-to-b from-[#c8d3e0] to-[#b5c2d1] border-[3px] border-[#2d3e52] border-t-0 rounded-b-xl"
            style={{ boxShadow: "inset 0 -2px 5px rgba(0,0,0,0.2)" }}
          />

          {/* Robot Body */}
          <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-[105px] h-[95px]">
            {/* Main Body */}
            <div
              className="relative w-full h-full bg-gradient-to-b from-[#dde5ef] via-[#c8d3e0] to-[#b5c2d1] rounded-[35px] border-[3px] border-[#2d3e52]"
              style={{
                boxShadow:
                  "0 5px 15px rgba(0,0,0,0.25), inset 0 3px 10px rgba(255,255,255,0.5), inset 0 -5px 15px rgba(0,0,0,0.1)",
              }}
            >
              {/* Chest Panel */}
              <div
                className="absolute top-5 left-1/2 -translate-x-1/2 w-[75px] h-[55px] bg-gradient-to-b from-[#5a1515]/15 via-[#3d0d0d]/20 to-[#2a0808]/25 rounded-2xl border-[2px] border-[#34495e]/40"
                style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)" }}
              >
                {/* Red Power Line */}
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      "0 0 8px rgba(255, 51, 51, 0.6)",
                      "0 0 15px rgba(255, 51, 51, 1)",
                      "0 0 8px rgba(255, 51, 51, 0.6)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-[55px] h-[3px] bg-gradient-to-r from-transparent via-[#ff3333] to-transparent rounded-full"
                />

                {/* Status Lights */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-[7px] h-[7px] bg-[#00ff00] rounded-full border-[2px] border-[#2d3e52]"
                    style={{ boxShadow: "0 0 8px rgba(0, 255, 0, 0.9)" }}
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="w-[7px] h-[7px] bg-[#ffaa00] rounded-full border-[2px] border-[#2d3e52]"
                    style={{ boxShadow: "0 0 8px rgba(255, 170, 0, 0.9)" }}
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                    className="w-[7px] h-[7px] bg-[#ff3333] rounded-full border-[2px] border-[#2d3e52]"
                    style={{ boxShadow: "0 0 8px rgba(255, 51, 51, 0.9)" }}
                  />
                </div>
              </div>

              {/* Body Detail Panels */}
              <div
                className="absolute top-3 right-3 w-[16px] h-[16px] bg-[#34495e]/25 rounded border-[2px] border-[#2d3e52]/40"
                style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)" }}
              />
              <div
                className="absolute bottom-3 left-3 w-[16px] h-[16px] bg-[#34495e]/25 rounded border-[2px] border-[#2d3e52]/40"
                style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)" }}
              />
            </div>
          </div>

          {/* Left Arm (Waving) */}
          <motion.div
            animate={{ rotate: [0, -28, 3, -28, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
            className="absolute top-[98px] left-[14px] w-[24px] h-[65px]"
          >
            <div
              className="w-full h-full bg-gradient-to-b from-[#c8d3e0] via-[#b5c2d1] to-[#a3b3c5] rounded-[18px] border-[3px] border-[#2d3e52] relative"
              style={{
                boxShadow:
                  "0 3px 8px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,255,255,0.3)",
              }}
            >
              {/* Shoulder Joint */}
              <div
                className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[16px] h-[16px] bg-[#34495e] rounded-full border-[3px] border-[#2d3e52]"
                style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" }}
              />
              {/* Elbow Joint */}
              <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[12px] h-[12px] bg-[#34495e] rounded-full border-[2px] border-[#2d3e52]" />
              {/* Hand */}
              <div
                className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] bg-gradient-to-b from-[#c8d3e0] to-[#a3b3c5] rounded-full border-[3px] border-[#2d3e52]"
                style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
              />
            </div>
          </motion.div>

          {/* Right Arm */}
          <div className="absolute top-[98px] right-[14px] w-[24px] h-[65px]">
            <div
              className="w-full h-full bg-gradient-to-b from-[#c8d3e0] via-[#b5c2d1] to-[#a3b3c5] rounded-[18px] border-[3px] border-[#2d3e52] relative"
              style={{
                boxShadow:
                  "0 3px 8px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,255,255,0.3)",
              }}
            >
              {/* Shoulder Joint */}
              <div
                className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[16px] h-[16px] bg-[#34495e] rounded-full border-[3px] border-[#2d3e52]"
                style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" }}
              />
              {/* Elbow Joint */}
              <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[12px] h-[12px] bg-[#34495e] rounded-full border-[2px] border-[#2d3e52]" />
              {/* Hand */}
              <div
                className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] bg-gradient-to-b from-[#c8d3e0] to-[#a3b3c5] rounded-full border-[3px] border-[#2d3e52]"
                style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
              />
            </div>
          </div>

          {/* Shadow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.25, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-[18px] bg-black/30 rounded-full blur-lg"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900 to-red-950 opacity-45"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-end sm:items-center pb-12 sm:pb-0 pt-0 sm:pt-20 lg:pt-0">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Side */}
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

              {/* Avatars & Reviews */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center relative z-[10]"
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
                        loading="lazy"
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

            {/* Right Side - Floating Image & Cards */}
            <div className="lg:col-span-7 relative hidden xl:flex items-end justify-start h-full">
              <div
                className="absolute left-0 right-0 flex items-end justify-start"
                style={{ bottom: "-260px" }}
              >
                <img
                  src="/images/hpic.webp"
                  alt="Customer Service Representatives"
                  loading="lazy"
                  className="w-auto h-auto object-contain object-bottom"
                  style={{
                    display: "block",
                    marginLeft: "-100px",
                    maxHeight: "100vh",
                  }}
                />
              </div>

              {/* Floating Cards */}
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

      {/* 🤖 PEEKING ROBOT - BOTTOM LEFT CORNER */}
      <PeekingRobot />
    </div>
  );
};

export default Hero;