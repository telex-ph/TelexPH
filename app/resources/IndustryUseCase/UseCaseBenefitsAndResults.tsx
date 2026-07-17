"use client";

import React from "react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { 
  Zap, 
  Cpu, 
  Layout, 
  BarChart3, 
  Cloud,
  PlusCircle,
  CheckCircle2
} from "lucide-react";


const UseCaseToolsAndTechnology = () => {
  const MAROON = "#800000";
  const CARD_BG = "#F8F9FB"; 

  const techStack = [
    {
      id: "01",
      name: "NLP Engines",
      desc: "Advanced intent recognition and sentiment analysis utilizing Transformer-based models across 40+ global languages.",
      tag: "STEP ONE",
      metric: "Latency < 200ms",
      specs: ["GPT-4 Integration", "Neural Tokenization"],
      icon: <Cpu size={40} />
    },
    {
      id: "02",
      name: "Omnichannel CRM",
      desc: "Unified data synchronization layer bridging voice, chat, and email sources into a single customer truth.",
      tag: "STEP TWO",
      metric: "Real-time Sync",
      specs: ["Bi-directional API", "Event Webhooks"],
      icon: <Layout size={40} />
    },
    {
      id: "03",
      name: "Predictive Analytics",
      desc: "Proprietary ML models forecasting seasonal call volumes and early-warning customer churn indicators.",
      tag: "STEP THREE",
      metric: "94% Accuracy",
      specs: ["Time-series Forecasting", "Random Forest"],
      icon: <BarChart3 size={40} />
    },
    {
      id: "04",
      name: "Cloud Infrastructure",
      desc: "Global distributed edge computing architecture with auto-scaling capabilities and multi-region redundancy.",
      tag: "STEP FOUR",
      metric: "99.99% Uptime",
      specs: ["Multi-region Stack", "Auto-scaling"],
      icon: <Cloud size={40} />
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden font-bold">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-20">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-[10px] md:text-[14px] uppercase tracking-[0.25em] py-2 inline-block`}
                style={{ color: COLORS.primary }}
              >
                — Performance Report 2026
              </span>
            </div>
            
            <h2
              className={`font-poppins font-bold text-3xl md:text-[48px] mb-6 uppercase tracking-tighter leading-none`}
              style={{ color: '#282828' }}
            >
              Operational
              <br />
              <span style={{ color: '#a10000' }}>Impact Analysis.</span>
            </h2>

            <p className={`${FONT_CLASSES.rubikRegular} text-[14px] md:text-[16px] text-gray-500 max-w-2xl font-normal leading-relaxed`}>
              Comprehensive breakdown of key performance indicators and audited operational improvements post-implementation.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl flex flex-col md:flex-row overflow-hidden h-auto md:h-[240px] mb-20 relative font-bold">
          
          <div className="w-full md:w-[35%] p-6 md:p-8 flex flex-col justify-center bg-white z-30 relative font-bold">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#800000] text-[7px] md:text-[9px] font-black uppercase tracking-widest font-bold border border-red-100">
                Live Audit Active
              </span>
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight font-bold leading-tight">
              Cognitive Monitoring
            </h3>
            
            <div className="space-y-1 mb-4">
              {[
                "Real-time intent validation",
                "Automated throughput scaling"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                  <span className="text-[7px] md:text-[9px] font-bold text-gray-700 uppercase tracking-wide font-bold">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
              <div>
                <p className="text-lg md:text-xl font-black text-[#800000] font-bold">99.8%</p>
                <p className="text-[8px] text-gray-400 uppercase font-black font-bold tracking-widest">Accuracy</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div>
                <p className="text-xl font-black text-[#800000] font-bold">+34%</p>
                <p className="text-[8px] text-gray-400 uppercase font-black font-bold tracking-widest">Efficiency</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[65%] relative group h-[200px] md:h-full overflow-hidden bg-white">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=100&w=1400" 
              alt="Analytics" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 z-10 hidden md:block" 
                 style={{ 
                   background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 8%, rgba(255,255,255,0) 35%)" 
                 }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 font-bold">
          {techStack.map((tech, i) => (
            <div key={i} className="flex flex-col group relative transition-all duration-500 hover:-translate-y-3 font-bold">
              
              <div className="flex items-end">
                <div 
                  className="w-32 h-24 rounded-t-2xl rounded-bl-2xl p-5 text-white flex flex-col justify-between shadow-[0_20px_40px_rgba(128,0,0,0.25)] relative z-10"
                  style={{ backgroundColor: MAROON }}
                >
                  <span className="text-2xl md:text-3xl font-black leading-none font-bold">{tech.id}</span>
                  <span className="text-[7px] md:text-[8px] font-bold tracking-widest uppercase opacity-70 font-bold">UNIT</span>
                </div>
                <div className="ml-6 mb-4 text-gray-300 group-hover:text-[#800000] transition-all duration-500 group-hover:scale-110 font-bold">
                  {tech.icon}
                </div>
              </div>

              <div 
                className="rounded-b-2xl rounded-tr-2xl px-6 py-6 md:px-8 md:py-9 shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-gray-100 relative z-0 -mt-[1px] group-hover:border-gray-300 transition-all duration-500 font-bold"
                style={{ backgroundColor: CARD_BG }}
              >
                <div className="flex items-center gap-2 mb-4" style={{ color: MAROON }}>
                  <PlusCircle size={18} fill={MAROON} className="text-white" />
                  <span className={`${FONT_CLASSES.openSansBold} text-[10px] md:text-[12px] uppercase tracking-widest`}>{tech.tag}</span>
                </div>

                <h4 className={`font-poppins font-bold text-xl md:text-2xl uppercase tracking-tight mb-3`} style={{ color: '#282828' }}>
                  {tech.name}
                </h4>

                <p className={`${FONT_CLASSES.rubikRegular} text-[14px] md:text-[16px] text-gray-500 font-normal leading-relaxed mb-8`}>
                  {tech.desc}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-bold">
                  <div className="flex flex-wrap gap-2">
                    {tech.specs.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className={`${FONT_CLASSES.openSansBold} text-[8px] md:text-[10px] text-[#800000] uppercase tracking-wider px-3 py-1 rounded-md border border-red-200 bg-red-50/50`}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-200 font-bold shadow-sm shrink-0">
                    <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className={`${FONT_CLASSES.openSansBold} text-[8px] md:text-[10px] text-gray-700 uppercase tracking-tight`}>{tech.metric}</span>
                  </div>
                </div>

                <div 
                  className="absolute top-0 right-16 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] transform -translate-y-[1px]" 
                  style={{ borderTopColor: CARD_BG }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UseCaseToolsAndTechnology;