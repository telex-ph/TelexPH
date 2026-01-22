"use client";

import React from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";

export default function JobDetails() {
  return (
    <div className="w-full relative min-h-screen bg-white">
      <div 
        className="fixed inset-0 z-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
        }}
      ></div>
      <div 
        className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-20">
        <div className="-mt-16 relative z-20 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10 items-start overflow-visible">
            <div className="lg:col-span-5 flex flex-col justify-start pt-10 order-first">
              <div className="relative mb-6">
                <h3 className="text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  Summary
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
              
              <div className="w-[140%]"> 
                <p 
                  className="text-[15px] leading-relaxed text-gray-600 text-justify" 
                  style={{ 
                    textJustify: "inter-character",
                    wordBreak: "break-word",
                    hyphens: "none"
                  }}
                >
                  is simply dummy text of the printing and typesetting industry. lorem ipsum has been the 
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a 
                  galley of type and scrambled it to make a type specimen book. it has survived not only 
                  five centuries, but also the leap into electronic typesetting, remaining essentially 
                  unchanged. it was popularised in the 1960s with the release of letraset sheets containing 
                  lorem ipsum passages, and more recently with desktop publishing software like aldus 
                  pagemaker including versions of lorem ipsum.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 relative min-h-[450px] hidden md:block overflow-visible order-last">
              <div className="absolute top-0 left-64 w-[360px] h-[250px] z-10">
                <img 
                  src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg" 
                  alt="team work" 
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-gray-50"
                />
              </div>
              <div className="absolute top-[130px] left-[320px] w-[360px] h-[250px] z-20">
                <img 
                  src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg" 
                  alt="office discussion" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-gray-200 pt-8 -mt-4">
            
            <div className="lg:col-span-4 space-y-40">
              <div>
                <h3 className="text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  Description
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>

              <div className="pt-2">
                <h3 className="text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  Requirements
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>

              <div className="pt-24">
                <h3 className="text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  Benefits & Perks
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>

              <div className="pt-40">
                <h3 className="text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  Salary Range
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
            </div>

            <div className="lg:col-span-8 relative pl-16">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#800000] opacity-30"></div>

              <div className="mb-16">
                <p className="text-[15px] leading-relaxed text-gray-600 text-justify" style={{ textJustify: "inter-character" }}>
                  is simply dummy text of the printing and typesetting industry. lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. it has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              <div className="mb-20">
                <p className="text-[15px] leading-relaxed text-gray-800 font-semibold text-justify mb-8" style={{ textJustify: "inter-character" }}>
                  the front-end developer shall be responsible for creating responsive, user-friendly web interfaces that ensure a smooth and visually appealing user experience while working closely with designers and back-end developers.
                </p>
                <ul className="space-y-4">
                  {["develop responsive web pages using html, css, and javascript", "implement ui designs based on provided mockups or wireframes", "ensure cross-browser and cross-device compatibility", "optimize applications for performance and usability", "collaborate with back-end developers to integrate apis"].map((item, index) => (
                    <li key={index} className="flex items-start gap-5 italic text-gray-600 text-[14px]">
                      <Check size={22} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-20">
                <p className="text-[15px] leading-relaxed text-gray-600 text-justify mb-8" style={{ textJustify: "inter-character" }}>
                  the company offers a supportive and flexible work environment that values professional growth, work-life balance, and employee well-being.
                </p>
                <ul className="space-y-4">
                  {["competitive salary based on skills and experience", "flexible working hours or remote work options", "opportunities for learning, training, and career growth", "health insurance and paid leave benefits", "collaborative and inclusive team culture"].map((item, index) => (
                    <li key={index} className="flex items-start gap-5 italic text-gray-600 text-[14px]">
                      <Check size={22} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-16">
                <p className="text-[15px] leading-relaxed text-gray-600 text-justify mb-8" style={{ textJustify: "inter-character" }}>
                  the salary range refers to the minimum to maximum compensation offered for a specific position, based on factors such as role responsibilities, experience level, skills, and company budget. it provides applicants with a clear expectation of potential earnings while allowing flexibility for negotiation depending on qualifications and performance.
                </p>
                <ul className="space-y-4">
                  {["defines the lowest and highest possible salary for the position", "based on experience, skills, education, and job responsibilities", "may vary depending on performance, tenure, or internal policies", "helps applicants understand earning potential before applying", "supports fair and transparent compensation decisions"].map((item, index) => (
                    <li key={index} className="flex items-start gap-5 italic text-gray-600 text-[14px]">
                      <Check size={22} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-4 mt-12 relative z-30">
                <Link 
                  href="/apply"
                  className="group flex items-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-8 py-2.5 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 transition-all duration-300"
                  style={{ 
                    fontFamily: "'open sans', sans-serif", 
                    fontWeight: 600 
                  }}
                >
                  <span className="text-[13px] tracking-wide uppercase">apply now</span>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </Link>
                
                <button 
                  className="group flex items-center gap-2 bg-white border-2 border-[#a10000] text-[#a10000] px-8 py-2.5 rounded-2xl hover:bg-gradient-to-r hover:from-[#a10000] hover:to-[#ce1212] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  style={{ 
                    fontFamily: "'open sans', sans-serif", 
                    fontWeight: 600 
                  }}
                >
                  <span className="text-[13px] tracking-wide uppercase">book now</span>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}