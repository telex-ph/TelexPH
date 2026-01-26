"use client";

import React from "react";
// Make sure this path is correct based on your project structure
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
      title: "Instant Capture", // Was: Engagement Initiation
      subtitle: "Zero-Latency Response",
      desc: "A high-value lead messages at 2 AM. Our AI instantly responds, qualifies their needs, and books a slot on your calendar.",
      details: ["24/7 Availability", "Instant Qualification", "Auto-Booking"],
      icon: MessageSquare,
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800",
      metric: "0 Missed Leads"
    },
    {
      id: 2,
      title: "Smart Triage", // Was: Intelligent Routing
      subtitle: "Filter & Prioritize",
      desc: "The system checks the lead's budget and urgency. High-priority clients are routed directly to your top closers.",
      details: ["Budget Filtering", "Urgency Scoring", "VIP Routing"],
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      metric: "3x Conversion Rate"
    },
    {
      id: 3,
      title: "The 'Perfect' Handoff", // Was: Agent Empowerment
      subtitle: "Context-Rich Dashboard",
      desc: "Your agent picks up the phone. They already know the client's name, problem, and budget before saying 'Hello'.",
      details: ["Pre-Call Briefing", "Script Suggestions", "One-Click Dialing"],
      icon: UserCheck,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      metric: "50% Less Talk Time"
    },
    {
      id: 4,
      title: "Safety Protocols", // Was: Automated Compliance
      subtitle: "Risk-Free Operations",
      desc: "While they talk, AI monitors for compliance keywords. Sensitive data (credit cards) is automatically redacted from recordings.",
      details: ["Live Redaction", "Compliance Flags", "Secure Storage"],
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      metric: "100% Audit Ready"
    },
    {
      id: 5,
      title: "Growth Loop", // Was: Success Feedback
      subtitle: "Retention Automation",
      desc: "Deal closed. The system automatically sends the contract, thanks the client, and schedules a 30-day follow-up.",
      details: ["Auto-Invoicing", "Review Requests", "Referral Nudges"],
      icon: Star,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      metric: "Higher LTV"
    }
  ];

  return (
    <section className="py-20 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-16">
          <div className="flex flex-col items-start text-left">
            <span
              className={`${FONT_CLASSES.openSansBold} text-[14px] uppercase tracking-[0.25em] mb-4`}
              style={{ color: COLORS.primary }}
            >
              — The Workflow
            </span>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-5xl mb-6 tracking-tighter leading-none`}
              style={{ color: COLORS.black }}
            >
              A Day in the Life
              <br />
              <span style={{ color: COLORS.primary }}>of a Scaled Business.</span>
            </h2>

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Clock, label: "60% Faster Cycles" },
                { icon: Zap, label: "Zero Friction" }
              ].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-md border border-gray-100 shadow-sm">
                  <pill.icon size={12} style={{ color: COLORS.primary }} />
                  <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-600 uppercase tracking-wider`}>{pill.label}</span>
                </div>
              ))}
            </div>

            <p className={`${FONT_CLASSES.rubikRegular} text-base max-w-2xl leading-relaxed`} style={{ color: COLORS.dark }}>
              From the first hello to the final handshake, see how our orchestration layer removes the chaos and delivers a perfect customer experience every time.
            </p>
          </div>
        </div>

        {/* --- STEPS TIMELINE --- */}
        <div className="relative mt-20">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 z-0 opacity-10 bg-gray-900 hidden md:block"></div>

          <div className="relative z-10 space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className={`flex flex-col md:flex-row items-stretch gap-6 md:gap-12 relative ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className="flex-1 w-full flex md:w-[calc(50%-3rem)]">
                  <div className={`bg-white p-8 md:p-10 rounded-xl border border-gray-100 shadow-lg w-full flex flex-col justify-center ${i % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`flex flex-col ${i % 2 !== 0 ? 'md:items-end' : 'md:items-start'}`}>
                      <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-300 uppercase tracking-[0.2em] mb-1 block`}>Step 0{step.id}</span>
                      <h4 className={`${FONT_CLASSES.openSansBold} text-xl md:text-2xl text-gray-900 mb-1 uppercase tracking-tight`}>{step.title}</h4>
                      <p className={`${FONT_CLASSES.openSansBold} text-[10px] uppercase tracking-widest mb-6`} style={{ color: COLORS.primary }}>{step.subtitle}</p>
                      
                      <p className={`${FONT_CLASSES.rubikRegular} text-sm md:text-base text-gray-500 leading-relaxed mb-8`}>
                        {step.desc}
                      </p>

                      <div className={`flex flex-wrap gap-x-5 gap-y-3 pt-6 border-t border-gray-50 w-full ${i % 2 !== 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        {step.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} style={{ color: COLORS.primary }} className="flex-shrink-0" />
                            <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-700 uppercase tracking-wide`}>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-30">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border-[3px] border-white bg-white"
                    style={{ backgroundColor: COLORS.primary, color: 'white' }}
                  >
                    <step.icon size={16} />
                  </div>
                </div>

                {/* Image Side */}
                <div className="flex-1 w-full flex md:w-[calc(50%-3rem)]">
                  <div className="relative group overflow-hidden rounded-xl shadow-lg w-full min-h-[300px]">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                    
                    <div className={`absolute bottom-6 ${i % 2 !== 0 ? 'left-6' : 'right-6'}`}>
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-md flex items-center gap-3 border border-white shadow-xl">
                        <TrendingUp size={14} style={{ color: COLORS.primary }} />
                        <span className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-900 uppercase tracking-tight`}>{step.metric}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- OUTCOME SUMMARY --- */}
        <div className="mt-32 relative rounded-2xl p-1 bg-gray-50 shadow-inner">
          <div className="relative z-10 bg-white rounded-2xl p-10 md:p-16 overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <Database size={20} style={{ color: COLORS.primary }} />
                  </div>
                  <span className={`${FONT_CLASSES.openSansBold} text-[11px] uppercase tracking-[0.4em] text-gray-400`}>Outcome Summary</span>
                </div>
                
                <h3 className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl text-gray-900 mb-6 tracking-tighter leading-tight`}>
                  Seamless Operations 
                  <br />
                  <span style={{ color: COLORS.primary }}>Achieved in Days.</span>
                </h3>
                
                <p className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 leading-relaxed mb-10 max-w-lg`}>
                  Our orchestration layer ensures that neither the agent nor the customer experiences friction, leading to a <span className="text-gray-900 font-bold uppercase text-[11px]">superior service delivery model</span>.
                </p>
                
                <button 
                  className={`${FONT_CLASSES.openSansBold} group flex items-center gap-4 px-10 py-5 rounded-md text-white uppercase tracking-widest text-[11px] transition-all hover:shadow-2xl active:scale-95 shadow-lg`}
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Get Full Case Study
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              {/* Stats Block */}
              <div className="flex flex-row lg:flex-col gap-6 w-full lg:w-auto">
                {[
                  { label: "Efficiency", value: "+85%" },
                  { label: "Cost Saving", value: "40%" }
                ].map((stat, sIdx) => (
                  <div key={sIdx} className="flex-1 lg:flex-none bg-white border border-gray-100 p-8 md:p-10 rounded-xl text-center lg:min-w-[220px] shadow-sm">
                    <p className={`${FONT_CLASSES.poppinsBlack} text-4xl md:text-5xl text-gray-900 mb-2 tracking-tighter`}>{stat.value}</p>
                    <div className="h-1 w-10 mx-auto mb-4 rounded-full" style={{ backgroundColor: `${COLORS.primary}20` }}></div>
                    <p className={`${FONT_CLASSES.openSansBold} text-[10px] text-gray-400 uppercase tracking-[0.2em]`}>{stat.label}</p>
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