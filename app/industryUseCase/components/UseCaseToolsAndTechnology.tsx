"use client";

import React from "react";
// Make sure this path is correct based on your project structure
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { 
  BrainCircuit,   // For AI/LLM
  Database,       // For CRM/GHL
  Network,        // For Integrations
  Lock,           // For Security
  Zap, 
  CheckCircle2,
  PlusCircle,
  Server,
  Activity,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";

const UseCaseToolsAndTechnology = () => {
  // UPDATED: Changed from #F8F9FB (grayish) to #FFFFFF (white)
  // so the cards pop against the new gray section background.
  const CARD_BG = "#FFFFFF"; 

  const techStack = [
    {
      id: "01",
      name: "Neural Core (AI)",
      desc: "The brain of the operation. We utilize advanced LLMs (GPT-4, Claude) for intent recognition, sentiment analysis, and dynamic script generation.",
      tag: "THE BRAIN",
      metric: "Latency < 200ms",
      specs: ["Context Retention", "Fine-Tuned Models"],
      icon: <BrainCircuit size={40} />
    },
    {
      id: "02",
      name: "Enterprise CRM (GHL)",
      desc: "The muscle of execution. We leverage the robust architecture of GoHighLevel (GHL) to manage pipelines, automate follow-ups, and store customer data.",
      tag: "THE ENGINE",
      metric: "Unlimited Scale",
      specs: ["Smart Pipelines", "2-Way Sync", "Native Workflows"],
      icon: <Database size={40} />
    },
    {
      id: "03",
      name: "API Orchestration",
      desc: "The nervous system. Custom webhooks bridge the gap between AI intelligence and GHL execution, ensuring data flows instantly without manual triggers.",
      tag: "THE GLUE",
      metric: "Real-time Sync",
      specs: ["Custom Webhooks", "JSON Payload Parsing"],
      icon: <Network size={40} />
    },
    {
      id: "04",
      name: "Data Sovereignty",
      desc: "The shield. Enterprise-grade security protocols ensure that while data moves fast, it remains encrypted, compliant, and strictly governed.",
      tag: "THE SHIELD",
      metric: "99.99% Uptime",
      specs: ["SOC2 Standards", "End-to-End Encryption"],
      icon: <Lock size={40} />
    }
  ];

  return (
    // UPDATED: bg-white -> bg-gray-50
    // Added border-t border-gray-200 for separation from previous section
    <section className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-20">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] py-2 inline-block`}
                style={{ color: COLORS.primary }}
              >
                — The Tech Stack
              </span>
            </div>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tighter leading-none`}
              style={{ color: COLORS.black }}
            >
              Intelligence Meets
              <br />
              <span style={{ color: COLORS.primary }}>Infrastructure.</span>
            </h2>

            <p className={`${FONT_CLASSES.rubikRegular} text-base max-w-2xl leading-relaxed`} style={{ color: COLORS.dark }}>
              We don't just use tools; we engineer an ecosystem. By fusing <strong>Generative AI</strong> with the <strong>GoHighLevel (GHL)</strong> enterprise framework, we create a system that thinks and acts simultaneously.
            </p>
          </div>
        </div>

        {/* --- LIVE AUDIT CARD --- */}
        {/* bg-white works perfectly here against the gray-50 background */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl flex flex-col md:flex-row overflow-hidden h-auto md:h-[240px] mb-20 relative">
          
          <div className="w-full md:w-[35%] p-6 md:p-8 flex flex-col justify-center bg-white z-30 relative">
            <div className="flex items-center gap-2 mb-3">
              <span 
                className={`${FONT_CLASSES.openSansBold} px-2 py-0.5 rounded-full bg-red-50 text-[9px] uppercase tracking-widest border border-red-100`}
                style={{ color: COLORS.primary }}
              >
                System Throughput
              </span>
            </div>
            
            <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight leading-tight`}>
              Automated Execution
            </h3>
            
            <div className="space-y-1 mb-4">
              {[
                "GHL Workflow Triggers Active",
                "AI-to-CRM Data Payload Synced"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                  <span className={`${FONT_CLASSES.openSansBold} text-[9px] text-gray-700 uppercase tracking-wide`}>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
              <div>
                <p className={`${FONT_CLASSES.poppinsBlack} text-xl`} style={{ color: COLORS.primary }}>1.2s</p>
                <p className={`${FONT_CLASSES.openSansBold} text-[8px] text-gray-400 uppercase tracking-widest`}>Response Time</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div>
                <p className={`${FONT_CLASSES.poppinsBlack} text-xl`} style={{ color: COLORS.primary }}>10k+</p>
                <p className={`${FONT_CLASSES.openSansBold} text-[8px] text-gray-400 uppercase tracking-widest`}>Daily Actions</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[65%] relative group h-[200px] md:h-full overflow-hidden bg-white">
            <img 
              src="https://images.unsplash.com/photo-1558494949-ef526b01201b?auto=format&fit=crop&q=100&w=1400" 
              alt="Server Rack" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-10 hidden md:block" 
                 style={{ 
                   background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 8%, rgba(255,255,255,0) 35%)" 
                 }} 
            />
          </div>
        </div>

        {/* --- TECH STACK GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {techStack.map((tech, i) => (
            <div key={i} className="flex flex-col group relative transition-all duration-500 hover:-translate-y-3">
              
              <div className="flex items-end">
                <div 
                  className="w-32 h-24 rounded-t-2xl rounded-bl-2xl p-5 text-white flex flex-col justify-between shadow-[0_20px_40px_rgba(128,0,0,0.25)] relative z-10"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <span className={`${FONT_CLASSES.poppinsBlack} text-3xl leading-none`}>{tech.id}</span>
                  <span className={`${FONT_CLASSES.openSansBold} text-[8px] tracking-widest uppercase opacity-70`}>LAYER</span>
                </div>
                <div 
                  className="ml-6 mb-4 text-gray-300 transition-all duration-500 group-hover:scale-110"
                >
                   <div className="group-hover:text-[#800000] transition-colors duration-300">
                     {tech.icon}
                   </div>
                </div>
              </div>

              <div 
                className="rounded-b-2xl rounded-tr-2xl px-8 py-9 shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-gray-100 relative z-0 -mt-[1px] group-hover:border-gray-300 transition-all duration-500"
                // Uses the new CARD_BG (White)
                style={{ backgroundColor: CARD_BG }}
              >
                <div className="flex items-center gap-2 mb-4" style={{ color: COLORS.primary }}>
                  <PlusCircle size={18} fill={COLORS.primary} className="text-white" />
                  <span className={`${FONT_CLASSES.openSansBold} text-[10px] uppercase tracking-widest`}>{tech.tag}</span>
                </div>

                <h4 className={`${FONT_CLASSES.openSansBold} text-2xl text-gray-900 uppercase tracking-tight mb-3`}>
                  {tech.name}
                </h4>

                <p className={`${FONT_CLASSES.rubikRegular} text-sm text-gray-500 leading-relaxed mb-8`}>
                  {tech.desc}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {tech.specs.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className={`${FONT_CLASSES.openSansBold} text-[9px] uppercase tracking-wider px-3 py-1 rounded-md border border-red-200 bg-red-50/50`}
                        style={{ color: COLORS.primary }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-100 shadow-sm shrink-0">
                    <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-700 uppercase tracking-tight`}>{tech.metric}</span>
                  </div>
                </div>

                <div 
                  className="absolute top-0 right-16 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] transform -translate-y-[1px]" 
                  // Updates the triangle to match the white card body
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