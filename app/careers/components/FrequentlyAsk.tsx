"use client";

import React, { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";

// ============================================
// 1. CONSTANTS (Inilagay ko na dito para gumana agad)
// ============================================

const COLORS = {
  primary: '#a10000',
  dark: '#282828',
  white: '#ffffff',
  black: '#000000',
  primaryLight: '#fce5e5',
  primaryLightBorder: '#f0c4c4',
};

const FONTS = {
  poppins: 'var(--font-poppins), sans-serif',
  openSans: 'var(--font-open-sans), sans-serif',
  rubik: 'var(--font-rubik), sans-serif',
};

const TYPOGRAPHY = {
  heading: { fontFamily: FONTS.poppins, fontWeight: 900 },
  subheading: { fontFamily: FONTS.poppins, fontWeight: 700 },
  emphasis: { fontFamily: FONTS.openSans, fontWeight: 700 },
  body: { fontFamily: FONTS.rubik, fontWeight: 400 },
};

// ============================================
// 2. MAIN COMPONENT
// ============================================

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    {
      question: "Where is your office located?",
      answer: "Our state-of-the-art facility is located in the heart of Clark, Pampanga. We are easily accessible via public transport and situated near major landmarks like SM City Clark and Clark International Airport."
    },
    {
      question: "Do you offer work-from-home options?",
      answer: "Yes, we offer flexibility. While most roles operate on a hybrid model to balance team synergy with personal comfort, specific tech and specialized roles may offer full remote options."
    },
    {
      question: "What is the recruitment process timeline?",
      answer: "We respect your time. Typically, our process takes 1-2 weeks from application to job offer. This includes an initial screening, a technical or role-specific assessment, and a final culture-fit interview."
    },
    {
      question: "Do you accept fresh graduates?",
      answer: "Absolutely! We believe in nurturing talent. Our 'Fresh Talent' program is designed specifically to mentor fresh graduates, focusing on potential, logic, and attitude rather than just years of experience."
    },
    {
      question: "What benefits do you provide?",
      answer: "Beyond the competitive salary, we provide HMO coverage from Day 1, performance bonuses, rice allowances, and mental health leave credits. We also have a dedicated budget for employee upskilling."
    },
    {
      question: "Are there opportunities for career growth?",
      answer: "Growth is a core value here. We prioritize internal promotions and offer leadership training pathways. 80% of our current leads started with us in entry-level positions."
    },
    {
      question: "Do you provide equipment for employees?",
      answer: "Yes. Whether you are working on-site or under a hybrid setup, we provide high-performance laptops (Mac or Windows), noise-cancelling headsets, and necessary peripherals."
    },
    {
      question: "What are the shift schedules?",
      answer: "Since we serve global clients, we have various shifts available including day, mid, and night shifts. Shift preferences are discussed during the interview."
    }
  ];

  return (
    <section 
      className="w-full py-20" 
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* --- LEFT SIDE: HEADER --- */}
          <div className="lg:col-span-5 text-left space-y-6">
            
            {/* Tagline */}
            <div 
              className="flex items-center gap-3 tracking-[0.2em] text-sm uppercase"
              style={{ 
                color: COLORS.primary, 
                fontFamily: FONTS.openSans, 
                fontWeight: 700 
              }}
            >
              <span 
                className="h-[2px] w-6" 
                style={{ backgroundColor: COLORS.primary }}
              ></span>
              <span>Help Center</span>
            </div>

            {/* Main Title */}
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{ 
                fontFamily: FONTS.poppins, 
                fontWeight: 900,
                color: COLORS.dark 
              }}
            >
              Frequently Asked <br />
              <span style={{ color: COLORS.primary }}>Questions.</span>
            </h2>

            {/* Subtext */}
            <p 
              className="text-lg leading-relaxed max-w-md opacity-80"
              style={{ 
                fontFamily: FONTS.rubik, 
                color: COLORS.dark 
              }}
            >
              We don't just answer queries; we build <strong>understanding</strong>. 
              Here is everything you need to know about our culture, process, and operations.
            </p>

            {/* CTA Button */}
            <div className="pt-4 hidden lg:block">
              <button 
                className="group flex items-center gap-2 transition-colors"
                style={{ 
                  fontFamily: TYPOGRAPHY.subheading.fontFamily,
                  fontWeight: 600,
                  color: COLORS.dark
                }}
              >
                <span className="group-hover:text-[#a10000] transition-colors">Contact Support</span>
                <ArrowRight 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                  style={{ color: COLORS.primary }}
                />
              </button>
            </div>
          </div>

          {/* --- RIGHT SIDE: FAQ LIST --- */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`group rounded-xl border transition-all duration-300 ${
                    isOpen ? "shadow-lg" : "hover:shadow-md border-transparent"
                  }`}
                  style={{
                    backgroundColor: COLORS.white,
                    borderColor: isOpen ? COLORS.primary : '#e5e7eb',
                    // Custom shadow using primary color
                    boxShadow: isOpen ? `0 10px 15px -3px ${COLORS.primary}10` : undefined
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span 
                      className="text-lg transition-colors"
                      style={{ 
                        fontFamily: FONTS.poppins, 
                        fontWeight: 600,
                        color: isOpen ? COLORS.primary : COLORS.dark
                      }}
                    >
                      {faq.question}
                    </span>
                    
                    {/* Icon Container */}
                    <span 
                      className="p-2 rounded-full transition-colors flex items-center justify-center"
                      style={{
                        backgroundColor: isOpen ? COLORS.primary : COLORS.primaryLight,
                        color: isOpen ? COLORS.white : COLORS.primary
                      }}
                    >
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div 
                        className="p-6 pt-0 text-base leading-relaxed border-t border-dashed"
                        style={{ 
                          fontFamily: FONTS.rubik,
                          color: COLORS.dark,
                          opacity: 0.7,
                          borderColor: COLORS.primaryLightBorder 
                        }}
                      >
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}