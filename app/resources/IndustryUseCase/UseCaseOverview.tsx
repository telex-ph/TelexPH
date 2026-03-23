"use client";

import React, { useState } from "react";
import { Layers, Target, ShieldCheck, Globe, ChevronRight, ChevronLeft, Activity } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

const UseCaseOverview = () => {
  const MAROON = "#800000";
  const [activeStep, setActiveStep] = useState(0);

  const strategies = [
    { 
      icon: Layers, 
      title: "Operational Resiliency", 
      desc: "Architecting a fail-safe infrastructure that ensures 24/7 service continuity across diverse geographic zones." 
    },
    { 
      icon: Target, 
      title: "Predictive Outcomes", 
      desc: "Leveraging historical data and AI to anticipate customer needs before they arise, reducing average handle time." 
    },
    { 
      icon: ShieldCheck, 
      title: "Cognitive Security", 
      desc: "Implementing multi-layered data protection protocols that safeguard sensitive client information at every touchpoint." 
    },
    { 
      icon: Globe, 
      title: "Global Synergy", 
      desc: "Unifying cross-border teams through a single digital ecosystem for seamless knowledge sharing and execution." 
    }
  ];

  const benchmarks = [
    { 
      label: "AI Integration Scale", 
      val: "85%", 
      desc: "Automation of routine ticket resolutions through advanced machine learning models and cognitive automation." 
    },
    { 
      label: "Global Reach", 
      val: "140+", 
      desc: "Strategic presence in over 140 countries with native localized support teams for cultural synergy." 
    },
    { 
      label: "Operational Uptime", 
      val: "99.9%", 
      desc: "Redundant server clusters ensuring zero downtime for critical business operations and high-velocity workflows." 
    }
  ];

  const handleNext = () => {
    setActiveStep((prev) => (prev === benchmarks.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev === 0 ? benchmarks.length - 1 : prev - 1));
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="mb-20 text-left">
          <div className="inline-block mb-4">
            <span
              className={`${FONT_CLASSES.openSansBold} text-[11px] uppercase tracking-[0.25em] py-2 inline-block font-bold`}
              style={{ color: MAROON }}
            >
              — Strategic Overview
            </span>
          </div>
          <h2
            className={`${FONT_CLASSES.openSansBold} text-3xl md:text-5xl mb-6 uppercase tracking-tighter leading-none font-bold`}
            style={{ color: COLORS.black }}
          >
            Redefining the
            <br />
            <span style={{ color: MAROON }}>Customer Ecosystem.</span>
          </h2>
          
          <p
            className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 max-w-2xl font-normal leading-relaxed`}
          >
            We transcend traditional outsourcing by integrating <strong>high-velocity technology</strong> with <strong>emotional intelligence</strong> to drive long-term brand loyalty.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 mb-24">
          <div className="lg:col-span-8 overflow-hidden bg-gray-50 border border-gray-100 h-[400px] rounded-xl shadow-sm group">
            <img 
              src="/images/usecase3.jpg" 
              alt="Operations Command Center"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
            />
          </div>
                    
          <div className="lg:col-span-4 overflow-hidden bg-gray-50 border border-gray-100 h-[400px] rounded-xl shadow-sm group">
            <img 
              src="/images/usecase5.jpg" 
              alt="Data Infrastructure"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 pt-12 border-t border-gray-100 items-start">
          
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {strategies.map((item, i) => (
              <div key={i} className="flex flex-col group">
                <div className="mb-6 w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-[#800000] border border-gray-100 group-hover:border-[#800000] bg-white shadow-sm">
                  <item.icon 
                    size={26} 
                    strokeWidth={1.5} 
                    className="text-[#800000] group-hover:text-white transition-colors duration-300" 
                  />
                </div>
                <div>
                  <h4 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 uppercase tracking-tight mb-3 font-bold group-hover:text-[#800000] transition-colors`}>
                    {item.title}
                  </h4>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div 
              className="p-1 rounded-2xl border border-gray-100 shadow-sm"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <div className="bg-white rounded-xl p-10 m-1 min-h-[420px] flex flex-col justify-between shadow-inner border border-gray-50">
                
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-2">
                      <Activity size={16} style={{ color: MAROON }} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bold">
                        Benchmark {activeStep + 1} of 3
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {benchmarks.map((_, i) => (
                        <div 
                          key={i} 
                          className="h-1 w-5 rounded-full transition-all duration-300"
                          style={{ backgroundColor: i === activeStep ? MAROON : "#E5E7EB" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">
                      {benchmarks[activeStep].label}
                    </p>
                    <h3 
                      className={`${FONT_CLASSES.openSansBold} text-6xl font-bold tracking-tighter mb-6 font-bold`}
                      style={{ color: MAROON }}
                    >
                      {benchmarks[activeStep].val}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed font-normal">
                      {benchmarks[activeStep].desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-gray-50">
                  <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors font-bold"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  
                  <button 
                    onClick={handleNext}
                    className="group flex items-center gap-3 py-3 px-6 rounded-md transition-all hover:brightness-110 active:scale-95 shadow-md"
                    style={{ backgroundColor: MAROON }}
                  >
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest pl-1 font-bold">Next Metric</span>
                    <ChevronRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UseCaseOverview;