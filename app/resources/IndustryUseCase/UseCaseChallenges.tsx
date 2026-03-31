"use client";

import React, { useState } from "react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { AlertCircle, ZapOff, Layers, ShieldAlert, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const UseCaseChallenges = () => {
  const MAROON = "#800000";

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const challenges = [
    {
      title: "Attrition & Agent Burnout",
      desc: "Repetitive tasks and high-pressure quotas lead to disengagement and high turnover rates across the floor.",
      impact: "Increases recruitment and training costs by up to 30% annually.",
      risk: "Operational Instability",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop",
      icon: ZapOff,
      details: "Agent burnout is one of the most costly yet preventable issues in BPO operations. When agents are stuck in repetitive, high-volume call cycles without meaningful career development or wellness support, disengagement follows quickly. This leads to absenteeism, reduced call quality, and ultimately high attrition. The downstream effect is a constant recruitment and onboarding cycle that drains both budget and institutional knowledge. Addressing this requires both structural change—like workload balancing and AI-assisted task offloading—and cultural shifts toward recognition and growth pathways."
    },
    {
      title: "Fragmented Data Systems",
      desc: "Agents navigate multiple disconnected platforms, leading to inconsistent answers and prolonged wait times.",
      impact: "Directly causes customer frustration and significantly slows down Average Handle Time (AHT).",
      risk: "Data Inaccuracy",
      img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop",
      icon: Layers,
      details: "When agents must toggle between 4–6 different tools per interaction—CRM, ticketing, knowledge base, billing systems—the risk of human error compounds. A customer asking a simple billing question may require the agent to cross-reference three platforms, each with different data refresh rates and access controls. This fragmentation not only slows AHT but introduces inconsistencies in the answers given, eroding customer trust. Unified agent desktops and AI-powered knowledge retrieval can dramatically collapse this complexity into a single actionable view."
    },
    {
      title: "Operational Scalability",
      desc: "Traditional setups struggle with sudden spikes in volume. Scaling human staff is slow and capital-intensive.",
      impact: "Leads to missed Service Level Agreements (SLAs) and potential loss of high-value contracts.",
      risk: "Contractual Penalties",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
      icon: AlertCircle,
      details: "Campaign launches, seasonal peaks, and unexpected service disruptions can triple inbound volume overnight. Traditional BPOs rely on headcount buffers and overtime as their primary scaling tools—both expensive and slow to deploy. When SLA thresholds are breached, contractual penalties kick in and client relationships are put at risk. Intelligent automation and virtual agent deflection are critical to building elastic capacity that scales in minutes, not weeks, without proportional cost increases."
    },
    {
      title: "Quality Monitoring Gaps",
      desc: "Manual monitoring covers less than 2% of interactions, leaving massive blind spots in compliance and performance.",
      impact: "Hidden compliance risks and missed opportunities for targeted agent coaching.",
      risk: "Regulatory Failure",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
      icon: ShieldAlert,
      details: "In a traditional QA setup, a team of 5 analysts monitoring 200 agents can realistically evaluate 8–10 calls per agent per month—less than 2% of all interactions. This sampling approach misses systemic issues, compliance breaches, and individual coaching opportunities that only surface at scale. AI-powered speech analytics and sentiment scoring can evaluate 100% of interactions in real time, flagging risks immediately and generating coaching recommendations automatically. This shifts QA from a reactive audit function to a proactive performance engine."
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
          {challenges.map((c, i) => {
            const isOpen = expandedIndex === i;
            return (
              <div
                key={i}
                className={`group border-b border-gray-100 transition-all duration-500 px-4 ${isOpen ? "bg-gray-50/70" : "hover:bg-gray-50/50"}`}
              >
                {/* Main Row */}
                <div className="grid lg:grid-cols-12 gap-8 py-12 items-center">

                  {/* Image + Icon */}
                  <div className="lg:col-span-3 flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white bg-gray-100">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition-all duration-300"
                      style={isOpen ? { backgroundColor: MAROON, borderColor: MAROON } : {}}
                    >
                      <c.icon
                        size={22}
                        strokeWidth={2}
                        style={{ color: isOpen ? "white" : MAROON }}
                        className="transition-colors duration-300"
                      />
                    </div>
                  </div>

                  {/* Title + Desc */}
                  <div className="lg:col-span-4">
                    <h4
                      className={`${FONT_CLASSES.openSansBold} uppercase tracking-tight mb-2 font-bold transition-colors`}
                      style={{ color: isOpen ? MAROON : "#111827" }}
                    >
                      {c.title}
                    </h4>
                    <p className="text-base text-gray-600 leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-px" style={{ backgroundColor: MAROON }}></span>
                      <span className="uppercase tracking-[0.2em] text-[9px] text-gray-400 font-bold">Business Impact</span>
                    </div>
                    <p className="text-gray-700 text-base font-normal italic leading-relaxed">
                      "{c.impact}"
                    </p>
                  </div>

                  {/* Risk + CTA */}
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

                    {/* See More Button */}
                    <button
                      onClick={() => toggleExpand(i)}
                      className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
                      style={{ color: isOpen ? MAROON : "#9ca3af" }}
                      aria-expanded={isOpen}
                    >
                      <span>{isOpen ? "See Less" : "See More"}</span>
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                        style={
                          isOpen
                            ? { backgroundColor: MAROON, color: "white" }
                            : { backgroundColor: "#f9fafb", color: "#d1d5db" }
                        }
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ArrowRight size={16} />}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ maxHeight: isOpen ? "300px" : "0px" }}
                >
                  <div
                    className="pb-10 pt-2 border-t flex gap-6 items-start"
                    style={{ borderColor: `${MAROON}20` }}
                  >
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0"
                      style={{ backgroundColor: MAROON, opacity: 0.3 }}
                    />
                    <p className="text-gray-600 text-sm leading-relaxed max-w-4xl font-normal">
                      {c.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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