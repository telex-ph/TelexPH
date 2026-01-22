"use client";

import React from "react";
import { Check } from "lucide-react";

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
                  SUMMARY
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
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the 
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a 
                  galley of type and scrambled it to make a type specimen book. It has survived not only 
                  five centuries, but also the leap into electronic typesetting, remaining essentially 
                  unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                  Lorem Ipsum passages, and more recently with desktop publishing software like Aldus 
                  PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 relative min-h-[450px] hidden md:block overflow-visible order-last">
              <div className="absolute top-0 left-64 w-[360px] h-[250px] z-10">
                <img 
                  src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg" 
                  alt="Team work" 
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-gray-50"
                />
              </div>
              <div className="absolute top-[130px] left-[320px] w-[360px] h-[250px] z-20">
                <img 
                  src="https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg" 
                  alt="Office discussion" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-gray-200 pt-8 -mt-4">
            
            {/* LEFT SIDE TITLES */}
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

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-8 relative pl-16">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#800000] opacity-30"></div>

              {/* DESCRIPTION */}
              <div className="mb-16">
                <p className="text-[15px] leading-relaxed text-gray-600 text-justify" style={{ textJustify: "inter-character" }}>
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {/* REQUIREMENTS */}
              <div className="mb-20">
                <p className="text-[15px] leading-relaxed text-gray-800 font-semibold text-justify mb-8" style={{ textJustify: "inter-character" }}>
                  The Front-End Developer shall be responsible for creating responsive, user-friendly web interfaces that ensure a smooth and visually appealing user experience while working closely with designers and back-end developers.
                </p>
                <ul className="space-y-4">
                  {["Develop responsive web pages using HTML, CSS, and JavaScript", "Implement UI designs based on provided mockups or wireframes", "Ensure cross-browser and cross-device compatibility", "Optimize applications for performance and usability", "Collaborate with back-end developers to integrate APIs"].map((item, index) => (
                    <li key={index} className="flex items-start gap-5 italic text-gray-600 text-[14px]">
                      <Check size={22} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BENEFITS & PERKS */}
              <div className="mb-20">
                <p className="text-[15px] leading-relaxed text-gray-600 text-justify mb-8" style={{ textJustify: "inter-character" }}>
                  The company offers a supportive and flexible work environment that values professional growth, work-life balance, and employee well-being.
                </p>
                <ul className="space-y-4">
                  {["Competitive salary based on skills and experience", "Flexible working hours or remote work options", "Opportunities for learning, training, and career growth", "Health insurance and paid leave benefits", "Collaborative and inclusive team culture"].map((item, index) => (
                    <li key={index} className="flex items-start gap-5 italic text-gray-600 text-[14px]">
                      <Check size={22} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SALARY RANGE */}
              <div className="mb-16">
                <p className="text-[15px] leading-relaxed text-gray-600 text-justify mb-8" style={{ textJustify: "inter-character" }}>
                  The salary range refers to the minimum to maximum compensation offered for a specific position, based on factors such as role responsibilities, experience level, skills, and company budget. It provides applicants with a clear expectation of potential earnings while allowing flexibility for negotiation depending on qualifications and performance.
                </p>
                <ul className="space-y-4">
                  {["Defines the lowest and highest possible salary for the position", "Based on experience, skills, education, and job responsibilities", "May vary depending on performance, tenure, or internal policies", "Helps applicants understand earning potential before applying", "Supports fair and transparent compensation decisions"].map((item, index) => (
                    <li key={index} className="flex items-start gap-5 italic text-gray-600 text-[14px]">
                      <Check size={22} className="text-[#800000] mt-0.5 flex-shrink-0" strokeWidth={3} />
                      <span className="text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-4 mt-12 relative z-30">
                <button className="px-8 py-3 bg-[#800000] text-white font-bold rounded-md hover:bg-[#600000] transition-colors uppercase tracking-widest text-sm shadow-lg">
                  Apply Now
                </button>
                <button className="px-8 py-3 bg-[#800000] text-white font-bold rounded-md hover:bg-[#600000] transition-colors uppercase tracking-widest text-sm shadow-lg">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}