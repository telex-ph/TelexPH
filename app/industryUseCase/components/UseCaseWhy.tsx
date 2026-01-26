"use client";

import React from "react";
// Make sure this path is correct based on your project structure
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { 
  Users,          // For Human Mastery
  BrainCircuit,   // For AI
  ShieldCheck,    // For Security
  Rocket,         // For Speed/Deployment
  BarChart, 
  HardDrive, 
  Search 
} from "lucide-react";

const UseCaseWhy = () => {
  return (
    <section className="py-24 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-20">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] py-2 inline-block`}
                style={{ color: COLORS.primary }}
              >
                — The Value Proposition
              </span>
            </div>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tighter leading-none`}
              style={{ color: COLORS.black }}
            >
              Your Unfair
              <br />
              <span style={{ color: COLORS.primary }}>Operational Advantage.</span>
            </h2>

            <p
              className={`${FONT_CLASSES.rubikRegular} text-base max-w-2xl leading-relaxed`}
              style={{ color: COLORS.dark }}
            >
              Why settle for a standard BPO when you can have an intelligent ecosystem? We combine <strong>battle-tested human talent</strong> with <strong>autonomous AI agents</strong> to deliver results that traditional models can't match.
            </p>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch mb-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Industry Mastery -> Battle-Tested Teams */}
            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <Users size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight`}>Battle-Tested Teams</h3>
              <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 leading-relaxed mb-4`}>
                Our agents aren't just staff; they are industry specialists trained to handle high-stakes interactions.
              </p>
              <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-400 uppercase tracking-widest`}>Top 1% Talent</span>
            </div>

            {/* AI Excellence -> Cognitive Engine */}
            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <BrainCircuit size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight`}>Cognitive Engine</h3>
              <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 leading-relaxed mb-4`}>
                Proprietary AI that learns from every call, constantly improving script adherence and conversion rates.
              </p>
              <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-400 uppercase tracking-widest`}>Self-Learning Models</span>
            </div>
          </div>

          {/* MIDDLE COLUMN (Large Image) */}
          <div className="lg:col-span-2">
            <div className="relative h-full min-h-[450px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white group">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop" 
                alt="Strategic Partnership"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-0 right-0 text-center px-10">
                <p className={`${FONT_CLASSES.openSansBold} text-2xl text-white mb-4 uppercase tracking-tighter`}>
                  The Human + AI Synergy
                </p>
                <div className="flex justify-center gap-3">
                  <span className={`${FONT_CLASSES.openSansBold} px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] uppercase tracking-[0.2em] border border-white/20`}>
                    Scalable
                  </span>
                  <span className={`${FONT_CLASSES.openSansBold} px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] uppercase tracking-[0.2em] border border-white/20`}>
                    Secure
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Compliance -> Bank-Grade Security */}
            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight`}>Bank-Grade Security</h3>
              <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 leading-relaxed mb-4`}>
                We operate under strict SOC2 Type II & HIPAA standards. Your data is encrypted at rest and in transit.
              </p>
              <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-400 uppercase tracking-widest`}>Zero-Trust Architecture</span>
            </div>

            {/* Orchestration -> Rapid Deployment */}
            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <Rocket size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight`}>Rapid Deployment</h3>
              <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 leading-relaxed mb-4`}>
                Don't wait months. Our modular GHL infrastructure allows us to launch fully optimized campaigns in days.
              </p>
              <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-400 uppercase tracking-widest`}>Go Live in 7 Days</span>
            </div>
          </div>
        </div>

        {/* --- BOTTOM GRID FEATURES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 px-12 rounded-[3rem] bg-white border border-gray-100 shadow-xl mb-20">
            {[
              { 
                icon: <BarChart size={20} />, 
                title: "Profit-First", 
                text: "We optimize for revenue, not just busy work." 
              },
              { 
                icon: <HardDrive size={20} />, 
                title: "Seamless Sync", 
                text: "We plug into your existing CRM without breaking it." 
              },
              { 
                icon: <Search size={20} />, 
                title: "Total Clarity", 
                text: "Real-time dashboards show you exactly what's happening." 
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-md" style={{ backgroundColor: COLORS.primary }}>
                  {item.icon}
                </div>
                <div>
                  <h5 className={`${FONT_CLASSES.openSansBold} text-[11px] text-gray-900 uppercase tracking-widest mb-1`}>
                    {item.title}
                  </h5>
                  <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 leading-relaxed`}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* --- BOTTOM QUOTE --- */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-gray-100 text-center">
          <p className={`${FONT_CLASSES.rubikRegular} text-xl md:text-2xl text-gray-400 italic leading-relaxed`}>
            "We don't just want to be a vendor. We want to be the{" "}
            <span style={{ color: COLORS.primary }} className="font-bold">secret weapon</span>{" "}
            behind your next{" "}
            <span style={{ color: COLORS.primary }} className="font-bold">breakthrough year</span>."
          </p>
        </div>

      </div>
    </section>
  );
};

export default UseCaseWhy;