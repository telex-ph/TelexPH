"use client";

import React from "react";
// Make sure this path is correct based on your project structure
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { CheckCircle2 } from "lucide-react";

const UseCaseSolution = () => {
  const secondarySolutions = [
    {
      title: "Revenue Intelligence",
      tag: "Growth Engine",
      description: "Don't just store data—monetize it. We identify high-value leads and upsell opportunities automatically.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500",
    },
    {
      title: "Risk-Free Automation",
      tag: "Governance",
      description: "Every interaction is monitored by AI that understands context, flagging compliance risks before they become fines.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500",
    },
    {
      title: "Instant Data Sync",
      tag: "Integration",
      description: "Stop copy-pasting. Your CRM, email, and booking tools talk to each other in real-time.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=500",
    },
    {
      title: "Plug-and-Play Scaling",
      tag: "Infrastructure",
      description: "Need more agents? Our hybrid AI+Human setup allows you to handle 3x volume without hiring 3x staff.",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=500",
    }
  ];

  return (
    // UPDATED: Changed bg-white to bg-gray-50. 
    // Also updated border-gray-50 to border-gray-200 so the top border is visible against the gray background.
    <section className="py-24 bg-gray-50 relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-20">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-[14px] uppercase tracking-[0.25em] py-2 inline-block`}
                style={{ color: COLORS.primary }}
              >
                — The Solution Ecosystem
              </span>
            </div>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-5xl mb-6 tracking-tighter leading-none`}
              style={{ color: COLORS.black }}
            >
              Architecture Built for
              <br />
              <span style={{ color: COLORS.primary }}>Scale & Speed.</span>
            </h2>

            <p className={`${FONT_CLASSES.rubikRegular} text-base max-w-2xl leading-relaxed`} style={{ color: COLORS.dark }}>
              We replace fragmented tools with a single, intelligent operating system. It manages your leads, protects your data, and empowers your team to work faster.
            </p>
          </div>
        </div>

        {/* --- MAIN FEATURE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        
          {/* Main Large Card */}
          {/* Keeps bg-white so it stands out against the gray section */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden group min-h-[550px]">
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <span className={`${FONT_CLASSES.openSansBold} inline-block text-[10px] py-2 px-5 rounded-md bg-gray-50 text-gray-500 uppercase tracking-widest mb-6`}>
                  The Core System
                </span>
                <h3 className={`${FONT_CLASSES.openSansBold} text-2xl md:text-3xl text-gray-900 mb-6 leading-tight uppercase tracking-tight`}>
                  Unified Command Center
                </h3>
                <p className={`${FONT_CLASSES.rubikRegular} text-gray-500 leading-relaxed text-sm md:text-base mb-10`}>
                  No more switching tabs. We centralize all your communication channels (Voice, SMS, Email, Chat) into one intelligent dashboard powered by our Neural Engine.
                </p>
                
                <div className="space-y-4 mt-6">
                  {["Smart Lead Routing", "Automated QA Scoring", "Omnichannel History"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/80 border border-gray-100 shadow-sm transition-transform group-hover:translate-x-1">
                      <CheckCircle2 size={18} style={{ color: COLORS.primary }} />
                      <p className={`${FONT_CLASSES.openSansBold} text-[13px] md:text-sm text-gray-800 uppercase tracking-wider`}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col gap-4 bg-gray-50/30">
               <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden shadow-sm relative">
                 <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt="Dashboard Interface" 
                 />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
               </div>
               <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden shadow-sm relative">
                 <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt="Team Collaboration" 
                 />
               </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Stat 1 */}
            <div className="bg-white border border-gray-100 p-10 rounded-2xl shadow-sm flex flex-col justify-center flex-1 transition-all hover:shadow-md">
                <h4 className={`${FONT_CLASSES.openSansBold} text-5xl mb-3 tracking-tighter`} style={{ color: COLORS.primary }}>
                  80%
                </h4>
                <p className={`${FONT_CLASSES.openSansBold} text-xs text-gray-900 uppercase tracking-widest mb-3`}>
                  Auto-Resolved Inquiries
                </p>
                <div className="w-12 h-1.5 mb-5 rounded-full opacity-20" style={{ backgroundColor: COLORS.primary }}></div>
                <p className={`${FONT_CLASSES.rubikRegular} text-sm text-gray-400 leading-relaxed`}>
                  Routine tickets are handled instantly by AI, freeing your humans for complex tasks.
                </p>
            </div>
            
            {/* Stat 2 */}
            <div className="p-10 rounded-2xl text-white relative overflow-hidden flex flex-col justify-center flex-1 transition-all hover:shadow-lg" style={{ backgroundColor: COLORS.primary }}>
                <div className="relative z-10">
                    <h4 className={`${FONT_CLASSES.openSansBold} text-5xl mb-3 tracking-tighter`}>Zero</h4>
                    <p className={`${FONT_CLASSES.openSansBold} text-xs text-white uppercase tracking-widest mb-3`}>
                      Lead Leakage
                    </p>
                    <div className="w-12 h-1.5 mb-5 rounded-full bg-white/20"></div>
                    <p className={`${FONT_CLASSES.rubikRegular} text-sm text-white/70 leading-relaxed`}>
                      Never miss a potential client. Our system captures and engages leads 24/7/365.
                    </p>
                </div>
                {/* Decorative Blur */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* --- SECONDARY SOLUTIONS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {secondarySolutions.map((item, index) => (
            // Keeps bg-white for contrast
            <div key={index} className="bg-white border border-gray-100 p-7 rounded-xl hover:border-gray-200 transition-all group shadow-sm flex flex-col">
              <div className="w-full h-40 rounded-lg mb-6 overflow-hidden bg-gray-50">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                />
              </div>
              <p className={`${FONT_CLASSES.openSansBold} text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2`}>
                {item.tag}
              </p>
              <h4 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-800 mb-3 uppercase tracking-tight`}>
                {item.title}
              </h4>
              <p className={`${FONT_CLASSES.rubikRegular} text-sm text-gray-500 leading-relaxed flex-grow`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UseCaseSolution;