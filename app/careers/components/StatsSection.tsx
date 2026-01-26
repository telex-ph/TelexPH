"use client";

import React from "react";
import { Play } from "lucide-react";

export default function VideoIntro() {
  return (
    // WRAPPER: Full width gray background with padding
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl">
          {/* Background Image - Palitan mo ng actual image ng office niyo */}
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
            alt="Office Tour" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

          {/* Content Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/30">
              <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center shadow-lg pl-1">
                <Play size={24} className="text-white fill-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              See What It's Like
            </h2>
            <p className="text-gray-200 text-sm md:text-base max-w-lg">
              Take a virtual tour of our TELEX headquarters and meet the team behind the success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}