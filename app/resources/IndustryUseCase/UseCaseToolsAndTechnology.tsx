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
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 font-bold">
          {techStack.map((tech, i) => (
            <div key={i} className="flex flex-col group relative transition-all duration-500 hover:-translate-y-3 font-bold">
              
              <div className="flex items-end">
                <div 
                  className="w-32 h-24 rounded-t-2xl rounded-bl-2xl p-5 text-white flex flex-col justify-between shadow-[0_20px_40px_rgba(128,0,0,0.25)] relative z-10"
                  style={{ backgroundColor: MAROON }}
                >
                  <span className="text-3xl font-black leading-none font-bold">{tech.id}</span>
                  <span className="text-[8px] font-bold tracking-widest uppercase opacity-70 font-bold">UNIT</span>
                </div>
                <div className="ml-6 mb-4 text-gray-300 group-hover:text-[#800000] transition-all duration-500 group-hover:scale-110 font-bold">
                  {tech.icon}
                </div>
              </div>

              <div 
                className="rounded-b-2xl rounded-tr-2xl px-8 py-9 shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-gray-100 relative z-0 -mt-[1px] group-hover:border-gray-300 transition-all duration-500 font-bold"
                style={{ backgroundColor: CARD_BG }}
              >
                <div className="flex items-center gap-2 mb-4" style={{ color: MAROON }}>
                  <PlusCircle size={18} fill={MAROON} className="text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest font-bold">{tech.tag}</span>
                </div>

                <h4 className={`${FONT_CLASSES.openSansBold} text-2xl text-gray-900 uppercase tracking-tight mb-3 font-bold`}>
                  {tech.name}
                </h4>

                <p className="text-sm text-gray-500 font-normal leading-relaxed mb-8">
                  {tech.desc}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-bold">
                  <div className="flex flex-wrap gap-2">
                    {tech.specs.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className="text-[9px] font-black text-[#800000] uppercase tracking-wider px-3 py-1 rounded-md border border-red-200 bg-red-50/50 font-bold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-200 font-bold shadow-sm shrink-0">
                    <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black text-gray-700 uppercase font-bold tracking-tight">{tech.metric}</span>
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