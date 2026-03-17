"use client";

import React from "react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { 
  Award, Zap, ShieldCheck, Cpu, 
  BarChart, HardDrive, Search 
} from "lucide-react";

const UseCaseWhy = () => {
  return (
    <section className="py-24 bg-white relative border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-20">
          <div className="flex flex-col items-start text-left">
            <div className="inline-block mb-4">
              <span
                className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] py-2 inline-block font-bold`}
                style={{ color: COLORS.primary }}
              >
                — Why Choose Us
              </span>
            </div>
            
            <h2
              className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-6 uppercase tracking-tighter leading-none font-bold`}
              style={{ color: COLORS.black }}
            >
              Expertise That
              <br />
              <span style={{ color: COLORS.primary }}>Redefines BPO</span>
            </h2>

            <p
              className={`${FONT_CLASSES.rubikRegular} text-base text-gray-500 max-w-2xl font-normal leading-relaxed`}
            >
              We combine deep industry knowledge with next-generation AI orchestration to solve the most complex friction points in modern business operations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch mb-12">
          
          <div className="lg:col-span-1 flex flex-col gap-8">

            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <Award size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight font-bold`}>Industry Mastery</h3>
              <p className="text-base text-gray-500 leading-relaxed mb-4 font-light">Specialized in BPO friction points and workflow optimization.</p>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bold">10+ Years Experience</span>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <Cpu size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight font-bold`}>AI Excellence</h3>
              <p className="text-base text-gray-500 leading-relaxed mb-4 font-light">Advanced orchestration layer for complex legacy systems.</p>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bold">State-of-the-art tech</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative h-full min-h-[450px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white group">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
                alt="Tech Infrastructure"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-0 right-0 text-center px-10">
                <p className={`${FONT_CLASSES.openSansBold} text-2xl text-white mb-4 uppercase tracking-tighter font-bold`}>Intelligent Infrastructure</p>
                <div className="flex justify-center gap-3">
                  <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 font-bold">High Speed</span>
                  <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 font-bold">Global Scalable</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-8">

            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <ShieldCheck size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight font-bold`}>Compliance</h3>
              <p className="text-base text-gray-500 leading-relaxed mb-4 font-light">Global SOC2 Type II and ISO 27001 certifications.</p>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bold">Military-Grade Security</span>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center min-h-[260px] group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: COLORS.primary }}>
                <Zap size={24} />
              </div>
              <h3 className={`${FONT_CLASSES.openSansBold} text-lg text-gray-900 mb-2 uppercase tracking-tight font-bold`}>Orchestration</h3>
              <p className="text-base text-gray-500 leading-relaxed mb-4 font-light">Seamless bridge between LLMs and enterprise legacy data.</p>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bold">{"< 200ms Latency"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 px-12 rounded-[3rem] bg-white border border-gray-100 shadow-xl mb-20">
            {[
              { 
                icon: <BarChart size={20} />, 
                title: "Growth Optm.", 
                text: "ROI-driven daily tuning protocols." 
              },
              { 
                icon: <HardDrive size={20} />, 
                title: "Legacy Support", 
                text: "Zero data loss middleware connectors." 
              },
              { 
                icon: <Search size={20} />, 
                title: "Semantic Insights", 
                text: "True intent analytics for customers." 
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-md" style={{ backgroundColor: COLORS.primary }}>
                  {item.icon}
                </div>
                <div>
                  <h5 className={`${FONT_CLASSES.openSansBold} text-[11px] text-gray-900 uppercase tracking-widest mb-1 font-bold`}>
                    {item.title}
                  </h5>
                  <p className="text-base text-gray-500 leading-relaxed font-light">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="max-w-4xl mx-auto pt-12 border-t border-gray-100 text-center">
          <p className={`${FONT_CLASSES.rubikRegular} text-xl md:text-2xl text-gray-400 italic leading-relaxed`}>
            "Strategic partnership means your{" "}
            <span style={{ color: COLORS.primary }} className="font-bold">growth</span>{" "}
            is our primary benchmark. We build the future, so you can{" "}
            <span style={{ color: COLORS.primary }} className="font-bold">lead it</span>."
          </p>
        </div>

      </div>
    </section>
  );
};

export default UseCaseWhy;