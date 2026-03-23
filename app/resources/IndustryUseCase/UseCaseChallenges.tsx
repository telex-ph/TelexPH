"use client";

import React from "react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { AlertCircle, ZapOff, Layers, ShieldAlert, ArrowRight } from "lucide-react";

const UseCaseChallenges = () => {
  const MAROON = "#800000";

  const challenges = [
    { 
      title: "Attrition & Agent Burnout", 
      desc: "Repetitive tasks and high-pressure quotas lead to disengagement and high turnover rates across the floor.",
      impact: "Increases recruitment and training costs by up to 30% annually.",
      risk: "Operational Instability",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop",
      icon: ZapOff 
    },
    { 
      title: "Fragmented Data Systems", 
      desc: "Agents navigate multiple disconnected platforms, leading to inconsistent answers and prolonged wait times.",
      impact: "Directly causes customer frustration and significantly slows down Average Handle Time (AHT).",
      risk: "Data Inaccuracy",
      img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop",
      icon: Layers 
    },
    { 
      title: "Operational Scalability", 
      desc: "Traditional setups struggle with sudden spikes in volume. Scaling human staff is slow and capital-intensive.",
      impact: "Leads to missed Service Level Agreements (SLAs) and potential loss of high-value contracts.",
      risk: "Contractual Penalties",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
      icon: AlertCircle 
    },
    { 
      title: "Quality Monitoring Gaps", 
      desc: "Manual monitoring covers less than 2% of interactions, leaving massive blind spots in compliance and performance.",
      impact: "Hidden compliance risks and missed opportunities for targeted agent coaching.",
      risk: "Regulatory Failure",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
      icon: ShieldAlert 
    }
  ];

  return (
    <section className="py-24 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-20">
          <div className="flex flex-col items-start">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-[11px] uppercase tracking-[0.25em] py-2 inline-block`}
                style={{ color: MAROON }}
              >
                — Challenges Identification
              </span>
            </div>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-6 uppercase tracking-tighter leading-none`}
              style={{ color: COLORS.black }}
            >
              The Friction
              <br />
              <span style={{ color: MAROON }}>Points.</span>
            </h2>

            <p
              className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 max-w-2xl font-normal leading-relaxed`}
            >
              Identifying critical bottlenecks that compromise your BPO efficiency and reputation through deep operational analysis.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100">
          {challenges.map((c, i) => (
            <div key={i} className="group grid lg:grid-cols-12 gap-8 py-12 border-b border-gray-100 items-center transition-all duration-500 hover:bg-gray-50/50 px-4">
              
              <div className="lg:col-span-3 flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white bg-gray-100">
                  <img 
                    src={c.img} 
                    alt={c.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 group-hover:bg-[#800000] transition-all duration-300">
                  <c.icon 
                    size={22} 
                    strokeWidth={2} 
                    className="text-[#800000] group-hover:text-white transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <h4 className={`${FONT_CLASSES.openSansBold} text-gray-900 uppercase tracking-tight mb-2 group-hover:text-[#800000] transition-colors font-bold`}>
                  {c.title}
                </h4>
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  {c.desc}
                </p>
              </div>

              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-px" style={{ backgroundColor: MAROON }}></span>
                  <span className="uppercase tracking-[0.2em] text-[9px] text-gray-400 font-bold">Business Impact</span>
                </div>
                <p className="text-gray-700 text-base font-normal italic leading-relaxed">
                  "{c.impact}"
                </p>
              </div>

              <div className="lg:col-span-2 flex flex-col items-end text-right">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Severity Risk</span>
                <div 
                  className="px-4 py-2 rounded-lg border" 
                  style={{ backgroundColor: `${MAROON}08`, borderColor: `${MAROON}15` }}
                >
                  <p 
                    className="uppercase tracking-tighter text-sm whitespace-nowrap font-medium"
                    style={{ color: MAROON }}
                  >
                    {c.risk}
                  </p>
                </div>
                <div className="mt-4 w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#800000] group-hover:text-white transition-all duration-300 text-gray-300">
                  <ArrowRight size={16} />
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
            <p className="text-gray-300 text-[10px] uppercase tracking-[0.3em] font-bold">
              Operational Audit Report 2026
            </p>
        </div>

      </div>
    </section>
  );
};

export default UseCaseChallenges;