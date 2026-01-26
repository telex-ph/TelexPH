"use client";

import React from "react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { 
  Clock,
  Unplug,
  TrendingDown,
  Siren
} from "lucide-react";

const UseCaseChallenges = () => {

  const challenges = [
    { 
      title: "The 'After-Hours' Void", 
      desc: "Your business stops when your staff sleeps. Leads go cold, patients can't book, and tickets pile up during off-peak hours.",
      impact: "70% of leads buy from the vendor who responds first. You are missing them.",
      risk: "Lost Revenue",
      img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=400&auto=format&fit=crop",
      icon: Clock
    },
    { 
      title: "Tech Stack Chaos", 
      desc: "Agents juggle 5+ different tabs (CRM, Email, Slack, Dialer). Data gets lost in the copy-paste fatigue.",
      impact: "Increases Average Handle Time (AHT) by 40% due to manual navigation.",
      risk: "Operational Drag",
      img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop",
      icon: Unplug
    },
    { 
      title: "Silent Profit Erosion", 
      desc: "Manual follow-ups are inconsistent. High-value opportunities slip through the cracks because no one tracked the conversation.",
      impact: "Lower conversion rates and wasted marketing ad spend.",
      risk: "Inefficiency",
      img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop",
      icon: TrendingDown
    },
    { 
      title: "Regulatory Blind Spots", 
      desc: "Human error in handling sensitive data (HIPAA, credit cards) creates massive liability that automation could prevent.",
      impact: "Exposes the company to fines, lawsuits, and reputation damage.",
      risk: "Compliance Failure",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
      icon: Siren
    }
  ];

  return (
    <section className="py-24 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-20">
          <div className="flex flex-col items-start">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] py-2 inline-block`}
                style={{ color: COLORS.primary }}
              >
                — The Reality Check
              </span>
            </div>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tighter leading-none text-left`}
              style={{ color: COLORS.black }}
            >
              Where Traditional
              <br />
              <span style={{ color: COLORS.primary }}>Models Break.</span>
            </h2>

            <p
              className={`${FONT_CLASSES.rubikRegular} text-base max-w-2xl leading-relaxed text-left`}
              style={{ color: COLORS.dark }}
            >
              Growth exposes the cracks in manual operations. These are the critical bottlenecks that are silently costing your business money right now.
            </p>
          </div>
        </div>

        {/* --- CHALLENGES GRID (2x2) --- */}
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((c, i) => (
            <div 
              key={i}
              className="group relative bg-white p-6 rounded-xl border border-gray-100 hover:border-[#a10000] transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a10000]/0 to-[#a10000]/0 group-hover:from-[#a10000]/5 group-hover:to-transparent rounded-xl transition-all duration-500" />
              
              <div className="relative z-10">
                {/* Top Section: Icon + Risk Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-gray-100 bg-white group-hover:border-[#a10000] group-hover:bg-[#a10000] group-hover:scale-110 transition-all duration-500 shadow-sm"
                  >
                    <c.icon 
                      size={24} 
                      strokeWidth={1.8}
                      className="group-hover:!text-white transition-colors duration-500"
                      style={{ color: COLORS.primary }}
                    />
                  </div>

                  <div 
                    className="px-3 py-1.5 rounded-lg border" 
                    style={{ backgroundColor: '#fff5f5', borderColor: '#ffe0e0' }} 
                  >
                    <p 
                      className={`${FONT_CLASSES.openSansBold} uppercase tracking-tighter text-[10px] whitespace-nowrap`}
                      style={{ color: COLORS.primary }}
                    >
                      {c.risk}
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div className="mb-5 relative overflow-hidden rounded-lg h-40 border border-gray-100">
                  <img 
                    src={c.img} 
                    alt={c.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h4 
                    className={`${FONT_CLASSES.openSansBold} text-lg uppercase tracking-tight transition-colors duration-300 group-hover:text-[#a10000]`}
                    style={{ color: COLORS.dark }}
                  >
                    {c.title}
                  </h4>
                  
                  <p 
                    className={`${FONT_CLASSES.rubikRegular} text-base leading-relaxed`}
                    style={{ color: '#6B7280' }} 
                  >
                    {c.desc}
                  </p>

                  {/* Impact */}
                  <div className="pt-3 border-t border-gray-50">
                    <p 
                      className={`${FONT_CLASSES.rubikRegular} text-sm italic leading-relaxed`}
                      style={{ color: '#9CA3AF' }}
                    >
                      {c.impact}
                    </p>
                  </div>
                </div>

                {/* Number Indicator */}
                <div className="absolute top-3 right-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className={`${FONT_CLASSES.poppinsBlack} text-5xl`} style={{ color: COLORS.primary }}>
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UseCaseChallenges;