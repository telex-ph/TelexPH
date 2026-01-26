"use client";

import React, { useState } from "react";
import { 
  Clock,
  TrendingUp,
  ShieldCheck,
  LayoutTemplate,
  ChevronRight, 
  ChevronLeft, 
  Activity 
} from "lucide-react";

// Make sure this path is correct based on your project structure
import { COLORS, FONT_CLASSES } from "@/constant/styles";

const UseCaseOverview = () => {
  const [activeStep, setActiveStep] = useState(0);

  const strategies = [
    { 
      icon: Clock, 
      title: "24/7 Operational Continuity", 
      desc: "Whether you run a global BPO or a local clinic, our infrastructure ensures zero downtime, keeping your booking and support systems running around the clock." 
    },
    { 
      icon: TrendingUp, 
      title: "Profit-Driven Intelligence", 
      desc: "We turn your data into revenue. From predicting staffing needs to identifying high-value leads, our AI anticipates opportunities before you miss them." 
    },
    { 
      icon: ShieldCheck, 
      title: "Strict Compliance & Security", 
      desc: "Built to meet rigorous standards (HIPAA, GDPR, PCI). We safeguard sensitive patient, client, and financial data with enterprise-grade encryption." 
    },
    { 
      icon: LayoutTemplate, 
      title: "Unified Workflow", 
      desc: "Eliminate silos. We integrate your CRM, communication channels, and support teams into one seamless dashboard for total visibility." 
    }
  ];

  const benchmarks = [
    { 
      label: "System Reliability", 
      val: "99.9%", 
      desc: "Consistent uptime availability across 140+ countries, ensuring your business never stops serving clients." 
    },
    { 
      label: "Efficiency Uplift", 
      val: "40%", 
      desc: "Average reduction in administrative workload and manual entry across all industry sectors." 
    },
    { 
      label: "Compliance Score", 
      val: "100%", 
      desc: "Audit-ready data handling for Healthcare and Finance partners, meeting global regulatory standards." 
    }
  ];

  const handleNext = () => {
    setActiveStep((prev) => (prev === benchmarks.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev === 0 ? benchmarks.length - 1 : prev - 1));
  };

  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-20 text-left">
          <div className="inline-block mb-4">
            <span
              className={`${FONT_CLASSES.openSansBold} text-[14px] uppercase tracking-[0.25em] py-2 inline-block`}
              style={{ color: COLORS.primary }}
            >
              — Strategic Overview
            </span>
          </div>
          
          <h2
            className={`${FONT_CLASSES.openSansBold} text-3xl md:text-5xl mb-6 tracking-tighter leading-none`}
            style={{ color: COLORS.black }}
          >
            Engineered for
            <br />
            <span style={{ color: COLORS.primary }}>Your Industry.</span>
          </h2>
          
          <p
            className={`${FONT_CLASSES.rubikRegular} text-base max-w-2xl leading-relaxed`}
            style={{ color: COLORS.dark }}
          >
            We don't just deploy technology; we build <strong>ecosystems</strong> that adapt to the specific compliance, speed, and operational demands of your sector.
          </p>
        </div>

        {/* --- IMAGE & BENCHMARK SECTION --- */}
        <div className="grid lg:grid-cols-12 gap-6 mb-24">
          {/* LEFT: Single Large Image - EVEN WIDER */}
          <div className="lg:col-span-8 overflow-hidden bg-gray-50 border border-gray-100 h-[500px] rounded-xl shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
              alt="Operations Command Center"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
            />
          </div>

          {/* RIGHT: Benchmark Card - EVEN NARROWER */}
          <div className="lg:col-span-4 h-[500px]">
            <div 
              className="h-full p-1 rounded-2xl border border-gray-100 shadow-sm"
              style={{ backgroundColor: COLORS.white }} 
            >
              <div className="bg-white rounded-xl p-10 m-1 h-full flex flex-col justify-between shadow-inner border border-gray-50">
                
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-2">
                      <Activity size={16} style={{ color: COLORS.primary }} />
                      <span className={`${FONT_CLASSES.openSansBold} text-[10px] uppercase tracking-widest text-gray-400`}>
                        Benchmark {activeStep + 1} of 3
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {benchmarks.map((_, i) => (
                        <div 
                          key={i} 
                          className="h-1 w-5 rounded-full transition-all duration-300"
                          style={{ backgroundColor: i === activeStep ? COLORS.primary : "#E5E7EB" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <p className={`${FONT_CLASSES.openSansBold} text-[11px] text-gray-400 uppercase tracking-[0.2em] mb-4`}>
                      {benchmarks[activeStep].label}
                    </p>
                    
                    <h3 
                      className={`${FONT_CLASSES.poppinsBlack} text-6xl tracking-tighter mb-6`}
                      style={{ color: COLORS.primary }}
                    >
                      {benchmarks[activeStep].val}
                    </h3>
                    
                    <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-600 leading-relaxed`}>
                      {benchmarks[activeStep].desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-gray-50">
                  <button 
                    onClick={handlePrev}
                    className={`${FONT_CLASSES.openSansBold} flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors`}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  
                  <button 
                    onClick={handleNext}
                    className={`${FONT_CLASSES.openSansBold} group flex items-center gap-3 py-3 px-6 rounded-md transition-all hover:brightness-110 active:scale-95 shadow-md`}
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <span className="text-white text-[10px] uppercase tracking-widest pl-1">Next Metric</span>
                    <ChevronRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* --- STRATEGIES GRID (NOW FULL WIDTH - 2 COLUMNS) --- */}
        <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-gray-200">
          {strategies.map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col group relative bg-white p-5 rounded-xl border border-gray-100 hover:border-[#a10000] transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Animated Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#a10000]/0 to-[#a10000]/0 group-hover:from-[#a10000]/5 group-hover:to-transparent rounded-xl transition-all duration-500" />
              
              <div className="relative z-10">
                <div 
                  className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-[#a10000] group-hover:scale-110 group-hover:rotate-3 border-2 border-gray-100 group-hover:border-[#a10000] bg-gradient-to-br from-white to-gray-50 shadow-md group-hover:shadow-2xl"
                >
                  <item.icon 
                    size={24} 
                    strokeWidth={1.8} 
                    className="group-hover:text-white transition-all duration-500 group-hover:scale-110" 
                    style={{ color: COLORS.primary }}
                  />
                </div>
                
                <div>
                  <h4 
                    className={`${FONT_CLASSES.openSansBold} text-lg uppercase tracking-tight mb-2 transition-colors group-hover:text-[#a10000]`}
                    style={{ color: COLORS.dark }}
                  >
                    {item.title}
                  </h4>
                  <p 
                    className={`${FONT_CLASSES.rubikRegular} text-sm md:text-base leading-relaxed transition-colors group-hover:text-gray-700`}
                    style={{ color: '#6B7280' }} 
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Subtle Number Indicator */}
                <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className={`${FONT_CLASSES.poppinsBlack} text-4xl`} style={{ color: COLORS.primary }}>
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

export default UseCaseOverview;