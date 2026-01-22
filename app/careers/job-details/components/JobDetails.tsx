"use client";

import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import ApplyNowModal from "./ApplyNowModal";

export default function JobDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="w-full relative min-h-screen bg-white">
      {/* dot background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pb-20">
        <div className="mt-10 lg:-mt-16 relative z-20 overflow-visible">
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
                    textIndent: "40px"
                  }}
                >
                  Is simply dummy text of the printing and typesetting industry. lorem ipsum has been the 
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a 
                  galley of type and scrambled it to make a type specimen book. it has survived not only 
                  five centuries, but also the leap into electronic typesetting, remaining essentially 
                  unchanged. it was popularised in the 1960s with the release of letraset sheets containing 
                  lorem ipsum passages, and more recently with desktop publishing software like aldus 
                  pagemaker including versions of lorem ipsum.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[450px] hidden md:block overflow-visible order-last mt-10 lg:mt-0">
              <div className="absolute top-0 left-10 lg:left-64 w-[280px] lg:w-[360px] h-[200px] lg:h-[250px] z-10">
                <img 
                  src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg" 
                  alt="team work" 
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-gray-50"
                />
              </div>
              <div className="absolute top-[100px] lg:top-[130px] left-[80px] lg:left-[320px] w-[280px] lg:w-[360px] h-[200px] lg:h-[250px] z-20">
                <img 
                  src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg" 
                  alt="office discussion" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-4 lg:-mt-4 relative">
            <div className="absolute left-[33.333%] top-0 bottom-0 w-[2px] bg-[#800000] opacity-30 hidden lg:block"></div>
            
            {/* description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-16 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  DESCRIPTION
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p 
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify" 
                  style={{ 
                    textJustify: "inter-character",
                    textIndent: "40px"
                  }}
                >
                  Is simply dummy text of the printing and typesetting industry. lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. it has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            {/* requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-20 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
                  REQUIREMENTS
                </h3>
                <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p 
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify" 
                  style={{ 
                    textJustify: "inter-character",
                    textIndent: "40px"
                  }}
                >
                  The front-end developer shall be responsible for creating responsive, user-friendly web interfaces that ensure a smooth and visually appealing user experience while working closely with designers and back-end developers.
                </p>
                <ul className="space-y-4 lg:pl-10">
                  {[
                    "Develop responsive web pages using html, css, and javascript", 
                    "Implement ui designs based on provided mockups or wireframes", 
                    "Ensure cross-browser and cross-device compatibility", 
                    "Optimize applications for performance and usability", 
                    "Collaborate with back-end developers to integrate apis"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 lg:gap-5 italic text-gray-600 text-[13px] sm:text-[14px]">
                      <Check size={20} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
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
                  style={{ 
                    textJustify: "inter-character",
                    textIndent: "40px"
                  }}
                >
                  The company offers a supportive and flexible work environment that values professional growth, work-life balance, and employee well-being.
                </p>
                <ul className="space-y-4 lg:pl-10">
                  {[
                    "Competitive salary based on skills and experience", 
                    "Flexible working hours or remote work options", 
                    "Opportunities for learning, training, and career growth", 
                    "Health insurance and paid leave benefits", 
                    "Collaborative and inclusive team culture"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 lg:gap-5 italic text-gray-600 text-[13px] sm:text-[14px]">
                      <Check size={20} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
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
                  style={{ 
                    textJustify: "inter-character",
                    textIndent: "40px"
                  }}
                >
                  The salary range refers to the minimum to maximum compensation offered for a specific position, based on factors such as role responsibilities, experience level, skills, and company budget. it provides applicants with a clear expectation of potential earnings while allowing flexibility for negotiation depending on qualifications and performance.
                </p>
                <ul className="space-y-4 lg:pl-10">
                  {[
                    "Defines the lowest and highest possible salary for the position", 
                    "Based on experience, skills, education, and job responsibilities", 
                    "May vary depending on performance, tenure, or internal policies", 
                    "Helps applicants understand earning potential before applying", 
                    "Supports fair and transparent compensation decisions"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4 lg:gap-5 italic text-gray-600 text-[13px] sm:text-[14px]">
                      <Check size={20} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* buttons section */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12 relative z-30">
                  <div 
                    onClick={toggleModal}
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-8 py-3 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{ 
                      fontFamily: "'open sans', sans-serif", 
                      fontWeight: 600 
                    }}
                  >
                    <span className="text-[12px] sm:text-[13px] tracking-wide uppercase">apply now</span>
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                  
                  <button 
                    className="group flex items-center justify-center gap-2 bg-white border-2 border-[#a10000] text-[#a10000] px-8 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#a10000] hover:to-[#ce1212] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                    style={{ 
                      fontFamily: "'open sans', sans-serif", 
                      fontWeight: 600 
                    }}
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

      <ApplyNowModal 
        isOpen={isModalOpen} 
        onClose={toggleModal} 
      />
    </div>
  );
}