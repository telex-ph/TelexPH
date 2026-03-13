"use client";

import React, { useState } from "react";
import { Check, Plus, MapPin, Calendar, Clock, Banknote } from "lucide-react";
import ApplyNowModal from "./ApplyNowModal";
import BookNowModal from "./BookNowModal";

export default function TeamLeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleBookModal = () => setIsBookModalOpen(!isBookModalOpen);

  return (
    <div className="w-full relative min-h-screen bg-white">
      {/* dot background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pb-20">
        <div className="w-full text-left pt-10 pb-10">
          {/* Department pill */}
          <div className="mb-4">
            <span
              className="px-5 py-1.5 rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ backgroundColor: "#800000" }}
            >
              operations
            </span>
          </div>

          {/* Title row + badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Left: title + location */}
            <div className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl md:text-[2.6rem] tracking-tight uppercase whitespace-nowrap"
                style={{
                  color: "#1a1a1a",
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                team <span style={{ color: "#800000" }}>leader</span>
              </h2>

              <div className="flex items-center gap-2 text-gray-600 italic">
                <MapPin size={15} className="text-[#800000] flex-shrink-0" />
                <span className="text-sm font-light">Cawayan Bugtong, Guimba, Nueva Ecija</span>
              </div>
            </div>

            {/* Right: all 3 badges on one row */}
            <div className="flex flex-row items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
                <Calendar size={16} className="text-[#800000] flex-shrink-0" />
                <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  <p className="text-[11px] text-gray-500 uppercase font-extrabold leading-none tracking-widest">posted</p>
                  <p className="text-[13px] font-extrabold text-gray-800 uppercase mt-0.5">feb 18, 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
                <Clock size={16} className="text-[#800000] flex-shrink-0" />
                <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  <p className="text-[11px] text-gray-500 uppercase font-extrabold leading-none tracking-widest">type</p>
                  <p className="text-[13px] font-extrabold text-gray-800 uppercase mt-0.5">full-time</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
                <Banknote size={16} className="text-[#800000] flex-shrink-0" />
                <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  <p className="text-[11px] text-gray-500 uppercase font-extrabold leading-none tracking-widest">salary</p>
                  <p className="text-[13px] font-extrabold text-gray-800 uppercase mt-0.5">competitive</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[2px]" style={{ backgroundColor: "#800000", opacity: 0.2 }}></div>
        </div>

        <div className="mt-0 relative z-20 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 items-start overflow-visible">
            <div className="lg:col-span-5 flex flex-col justify-start pt-0 lg:pt-10 order-first">
              <div className="relative mb-6">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  SUMMARY
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>

              <div className="w-full lg:w-[140%]">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify"
                  style={{
                    textJustify: "inter-character",
                    wordBreak: "break-word",
                    hyphens: "none",
                    textIndent: "40px",
                  }}
                >
                  The Team Leader, Operations is a frontline people manager responsible for the 
                  day-to-day supervision, coaching, and performance management of a group of call center 
                  associates. This role is pivotal in ensuring that service level agreements are consistently 
                  met, team morale remains high, and each associate has the guidance they need to succeed. 
                  The ideal candidate leads by example, communicates with clarity and empathy, and 
                  possesses the operational acumen to make real-time decisions that keep the team running 
                  at peak efficiency while delivering outstanding service to clients and customers alike.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[450px] hidden md:block overflow-visible order-last mt-10 lg:mt-0">
              <div className="absolute top-0 left-10 lg:left-64 w-[280px] lg:w-[360px] h-[200px] lg:h-[250px] z-10">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"
                  alt="team leader"
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-gray-50"
                />
              </div>
              <div className="absolute top-[100px] lg:top-[130px] left-[80px] lg:left-[320px] w-[280px] lg:w-[360px] h-[200px] lg:h-[250px] z-20">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop"
                  alt="call center operations"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-4 relative">
            <div className="absolute left-[33.333%] top-0 bottom-0 w-[2px] bg-[#800000] opacity-30 hidden lg:block"></div>

            {/* description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-16 items-start gap-4 lg:gap-0 relative">
              <div className="lg:col-span-4 lg:pr-8 relative">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider relative z-10" style={{ color: "#1a1a1a" }}>
                  DESCRIPTION
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1 relative z-10"></div>
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  The Team Leader, Operations is responsible for the daily supervision of a group of 
                  call center associates, ensuring adherence to schedules, quality standards, and 
                  client-specific processes. The TL monitors real-time performance metrics, conducts 
                  one-on-one coaching sessions, facilitates team huddles, and serves as the primary 
                  escalation point for complex customer interactions. This role also collaborates closely 
                  with workforce management, quality assurance, and training teams to drive continuous 
                  improvement across the floor.
                </p>
              </div>
            </div>

            {/* requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-20 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8 relative">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  REQUIREMENTS
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  Candidates must have prior experience in a BPO or call center environment with a 
                  demonstrated ability to lead, mentor, and develop front-line agents toward consistent 
                  performance excellence and client satisfaction targets.
                </p>
                <ul className="space-y-5 lg:pl-10 mt-5">
                  {[
                    "At least 1–2 years of experience as a Team Leader or Senior Agent in a BPO or call center setting",
                    "Strong understanding of call center KPIs including AHT, CSAT, FCR, and service level metrics",
                    "Excellent verbal and written communication skills with the ability to give clear, constructive feedback",
                    "Ability to manage performance issues, conduct disciplinary actions, and implement improvement plans",
                    "Amenable to work on shifting schedules including weekends and holidays",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 lg:gap-5 text-gray-700 text-[14px] sm:text-[15px] py-1">
                      <Check size={18} className="text-[#800000] mt-1 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

                        {/* benefits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-20 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  BENEFITS & PERKS
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify mb-6 lg:mb-8"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  The company offers a supportive and flexible work environment that values professional growth, work-life balance, and employee well-being.
                </p>
                <ul className="space-y-5 lg:pl-10 mt-5">
                  {[
                    "Competitive salary based on skills and experience",
                    "Flexible working hours or remote work options",
                    "Opportunities for learning, training, and career growth",
                    "Health insurance and paid leave benefits",
                    "Collaborative and inclusive team culture",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 lg:gap-5 text-gray-700 text-[14px] sm:text-[15px] py-1">
                      <Check size={18} className="text-[#800000] mt-1 flex-shrink-0" strokeWidth={2.5} />
                      <span className="italic text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

                        {/* salary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-10 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  SALARY RANGE
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify mb-6 lg:mb-8"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  The salary range refers to the minimum to maximum compensation offered for a specific position, based on factors such as role responsibilities, experience level, skills, and company budget. It provides applicants with a clear expectation of potential earnings while allowing flexibility for negotiation depending on qualifications and performance.
                </p>
                <ul className="space-y-5 lg:pl-10 mt-5">
                  {[
                    "Defines the lowest and highest possible salary for the position",
                    "Based on experience, skills, education, and job responsibilities",
                    "May vary depending on performance, tenure, or internal policies",
                    "Helps applicants understand earning potential before applying",
                    "Supports fair and transparent compensation decisions",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 lg:gap-5 text-gray-700 text-[14px] sm:text-[15px] py-1">
                      <Check size={18} className="text-[#800000] mt-1 flex-shrink-0" strokeWidth={2.5} />
                      <span className="italic text-justify">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* buttons section */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12 relative z-30">
                  <div
                    onClick={toggleModal}
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-8 py-3 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "'open sans', sans-serif", fontWeight: 600 }}
                  >
                    <span className="text-[12px] sm:text-[13px] tracking-wide uppercase">apply now</span>
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>

                  <button
                    onClick={toggleBookModal}
                    className="group flex items-center justify-center gap-2 bg-white border-2 border-[#a10000] text-[#a10000] px-8 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#a10000] hover:to-[#ce1212] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                    style={{ fontFamily: "'open sans', sans-serif", fontWeight: 600 }}
                  >
                    <span className="text-[12px] sm:text-[13px] tracking-wide uppercase">book now</span>
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyNowModal isOpen={isModalOpen} onClose={toggleModal} jobTitle="Team Leader" jobDept="Operations" />
      <BookNowModal isOpen={isBookModalOpen} onClose={toggleBookModal} />
    </div>
  );
}
