"use client";

import React from "react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { 
  MessageSquare, 
  Cpu, 
  UserCheck, 
  ShieldCheck, 
  Star, 
  Zap, 
  Clock, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp 
} from "lucide-react";

const UseCaseScenario = () => {
  const steps = [
    {
      id: 1,
      title: "Engagement Initiation",
      subtitle: "Omnichannel Entry Point",
      desc: "A customer starts a chat about a complex billing discrepancy. Our system recognizes the account instantly.",
      details: ["Instant Identity", "History Retrieval", "Sentiment Analysis"],
      icon: MessageSquare,
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800",
      metric: "40% AHT Reduction"
    },
    {
      id: 2,
      title: "Intelligent Routing",
      subtitle: "Priority-Based Distribution",
      desc: "AI identifies priority and routes to a senior specialist with full interaction history pre-loaded.",
      details: ["Skill-Based", "Zero-Wait Queue", "Frustration Scoring"],
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      metric: "25% Higher CSAT"
    },
    {
      id: 3,
      title: "Agent Empowerment",
      subtitle: "AI Co-Pilot Guidance",
      desc: "AI co-pilot suggests adjustments and pulls invoice data automatically, cutting research time.",
      details: ["Live Suggestion", "Policy Checks", "Automated Retrieval"],
      icon: UserCheck,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      metric: "15% Cost Savings"
    },
    {
      id: 4,
      title: "Automated Compliance",
      subtitle: "System Synchronization",
      desc: "Resolution is documented across all CRM platforms. System sends itemized summary to customer.",
      details: ["Real-time CRM", "Audit-Ready Logs", "Auto-Recaps"],
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      metric: "99.9% Data Accuracy"
    },
    {
      id: 5,
      title: "Success Feedback",
      subtitle: "Improvement Loop",
      desc: "Automatic follow-up triggered. CSAT data is used to further train the AI for similar future cases.",
      details: ["Predictive CSAT", "ML Training", "Retention Analytics"],
      icon: Star,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      metric: "Continuous ML Training"
    }
  ];

  return (
    <section className="py-20 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="mb-16">
          <div className="flex flex-col items-start text-left">
            <span
              className={`${FONT_CLASSES.openSansBold} text-[11px] uppercase tracking-[0.25em] mb-4`}
              style={{ color: COLORS.primary }}
            >
              — Use Case Scenario
            </span>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-6 uppercase tracking-tighter leading-none`}
              style={{ color: COLORS.black }}
            >
              A Day In The
              <br />
              <span style={{ color: COLORS.primary }}>Life Of Success.</span>
            </h2>

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Clock, label: "50% Faster Resolution" },
                { icon: Zap, label: "99% Data Accuracy" }
              ].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-md border border-gray-100 shadow-sm">
                  <pill.icon size={12} style={{ color: COLORS.primary }} />
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{pill.label}</span>
                </div>
              ))}
            </div>

            <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 max-w-2xl font-normal leading-relaxed`}>
              Experience the synergy of human expertise and machine intelligence in a unified ecosystem designed for peak efficiency and friction-less delivery.
            </p>
          </div>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 z-0 opacity-10 bg-gray-900 hidden md:block"></div>

          <div className="relative z-10 space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className={`flex flex-col md:flex-row items-stretch gap-6 md:gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 w-full flex">
                  <div className={`bg-white p-8 md:p-10 rounded-xl border border-gray-100 shadow-lg w-full flex flex-col justify-center ${i % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`flex flex-col ${i % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1 block">Stage 0{step.id}</span>
                      <h4 className={`${FONT_CLASSES.openSansBold} text-xl md:text-2xl text-gray-900 mb-1 uppercase tracking-tight`}>{step.title}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: COLORS.primary }}>{step.subtitle}</p>
                      
                      <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 font-normal">
                        {step.desc}
                      </p>

                      <div className={`flex flex-wrap gap-x-5 gap-y-3 pt-6 border-t border-gray-50 w-full ${i % 2 !== 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        {step.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} style={{ color: COLORS.primary }} className="flex-shrink-0" />
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center h-full">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border-[3px] border-white z-20 bg-white"
                    style={{ backgroundColor: COLORS.primary, color: 'white' }}
                  >
                    <step.icon size={16} />
                  </div>
                </div>

                <div className="flex-1 w-full flex">
                  <div className="relative group overflow-hidden rounded-xl shadow-lg w-full min-h-[300px]">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                    
                    <div className={`absolute bottom-6 ${i % 2 !== 0 ? 'left-6' : 'right-6'}`}>
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-md flex items-center gap-3 border border-white shadow-xl">
                        <TrendingUp size={14} style={{ color: COLORS.primary }} />
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{step.metric}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 relative rounded-2xl p-1 bg-gray-50 shadow-inner">
          <div className="relative z-10 bg-white rounded-2xl p-10 md:p-16 overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <Database size={20} style={{ color: COLORS.primary }} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400">Outcome Summary</span>
                </div>
                <h3 className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl text-gray-900 mb-6 uppercase tracking-tighter leading-tight`}>
                  Seamless Resolution 
                  <br />
                  <span style={{ color: COLORS.primary }}>Achieved In Minutes.</span>
                </h3>
                
                <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-lg font-normal">
                  Our orchestration layer ensures that neither the agent nor the customer experiences friction, leading to a <span className="text-gray-900 font-bold uppercase text-[11px]">superior service delivery model</span>.
                </p>
                
                <button 
                  className="group flex items-center gap-4 px-10 py-5 rounded-md text-white font-bold uppercase tracking-widest text-[11px] transition-all hover:shadow-2xl active:scale-95 shadow-lg"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Get Full Case Study
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              <div className="flex flex-row lg:flex-col gap-6 w-full lg:w-auto">
                {[
                  { label: "Efficiency", value: "+85%" },
                  { label: "Cost Saving", value: "40%" }
                ].map((stat, sIdx) => (
                  <div key={sIdx} className="flex-1 lg:flex-none bg-white border border-gray-100 p-8 md:p-10 rounded-xl text-center lg:min-w-[220px] shadow-sm">
                    <p className={`${FONT_CLASSES.openSansBold} text-4xl md:text-5xl text-gray-900 mb-2 tracking-tighter`}>{stat.value}</p>
                    <div className="h-1 w-10 mx-auto mb-4 rounded-full" style={{ backgroundColor: `${COLORS.primary}20` }}></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UseCaseScenario;