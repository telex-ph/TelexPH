"use client";

import React from "react";
import { motion } from "framer-motion";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import { FONT_CLASSES, COLORS } from "@/constant/styles";
import HighLevelMessage from "./HighLevelMessage"; // Import the HighLevelMessage component

// ✅ Font setup - Need to be repeated if they are not in a global stylesheet
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

// 🤖 PEEKING ROBOT COMPONENT
const PeekingRobot: React.FC = () => {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: -50 }}
      transition={{ duration: 1, delay: 2, ease: "easeOut" }} // Robot peeking animation
      className={`absolute bottom-0 left-0 z-50 cursor-pointer hidden md:block ${poppins.variable} ${openSans.variable} ${rubik.variable}`}
      whileHover={{ x: 0 }}
    >
      {/* 🤖 Robot Container */}
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
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.3,
                    }}
                    className="w-[7px] h-[7px] bg-[#ffaa00] rounded-full border-[2px] border-[#2d3e52]"
                    style={{ boxShadow: "0 0 8px rgba(255, 170, 0, 0.9)" }}
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: 0.6,
                    }}
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

      {/* HighLevel Message - Handles the single message display */}
      <HighLevelMessage />
    </motion.div>
  );
};

export default PeekingRobot;