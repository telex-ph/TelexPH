"use client";

import React from "react";
import { motion } from "framer-motion";
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

const HighLevelMessage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 3, ease: "easeOut" }}
      className="absolute left-[180px] bottom-[80px] bg-white px-7 py-3 rounded-2xl shadow-2xl min-w-[330px] border-2 border-gray-200 flex items-center gap-3"
    >
      {/* Bubble Tail */}
      <div className="absolute left-[-12px] bottom-[45px] w-0 h-0 border-r-[15px] border-r-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent" />

      {/* Logo with rounded corners */}
      <img
        src="/images/unnamed.png"
        alt="HighLevel Admins Logo"
        className="w-15 h-15 object-contain mr-2 flex-shrink-0 rounded-xl"
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
  );
};

export default HighLevelMessage;