"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function CareerButton() {
  return (
    <div className="w-full flex justify-center mt-12 mb-20">
      <button 
        className="group flex items-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-12 py-4 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 transition-all duration-300"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
      >
        <span className="text-[14px] tracking-wide">Show All Jobs</span>
        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
} 