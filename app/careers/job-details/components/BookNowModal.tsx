"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Open_Sans, Poppins } from "next/font/google";

const opensans = Open_Sans({ subsets: ["latin"] });
const poppinsfont = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"] 
});

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookNowModal({ isOpen, onClose }: BookNowModalProps) {
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDay, setSelectedDay] = useState(22);
  
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("44");
  const [period, setPeriod] = useState("PM");

  const handleClose = () => {
    setStep(0);
    setShowConfirm(false);
    setIsSuccess(false);
    onClose();
  };

  const handleOpenConfirm = () => {
    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    setShowConfirm(false);
    setIsSuccess(true);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ["AM", "PM"];

  const ScrollColumn = ({
    items,
    current,
    onChange,
    label,
  }: {
    items: string[];
    current: string;
    onChange: (val: string) => void;
    label: string;
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemHeight = 44;

    useEffect(() => {
      if (scrollRef.current) {
        const index = items.indexOf(current);
        if (index !== -1) {
          const offset = index * itemHeight;
          scrollRef.current.scrollTo({ top: offset, behavior: "instant" });
        }
      }
    }, [current, items]);

    const handleScroll = () => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      if (items[index] && items[index] !== current) {
        onChange(items[index]);
      }
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <span className={`text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-none h-4 flex items-center ${poppinsfont.className}`}>{label}</span>
        <div className="relative h-[132px] w-16 overflow-hidden bg-white rounded-lg border border-gray-100">
          <div className="absolute top-[44px] left-1 right-1 h-[44px] bg-[#800000] rounded-md z-0"></div>
          <div
            className="absolute inset-0 overflow-y-auto snap-y snap-mandatory scrollbar-hide z-10"
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ 
              paddingTop: `${itemHeight}px`, 
              paddingBottom: `${itemHeight}px`, 
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {items.map((item) => (
              <div
                key={item}
                onClick={() => {
                  const container = scrollRef.current;
                  if (container) {
                    const index = items.indexOf(item);
                    container.scrollTo({ top: index * itemHeight, behavior: "smooth" });
                  }
                  onChange(item);
                }}
                className={`h-[44px] flex items-center justify-center snap-center cursor-pointer transition-all duration-200 text-sm relative z-10 ${
                  item === current ? "text-white font-semibold" : "text-gray-400"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const steps = ["Time & date", "Contact info"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${opensans.className}`}>
          <style jsx global>{`
            .thin-scrollbar::-webkit-scrollbar {
              width: 3px;
            }
            .thin-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              margin-block: 20px;
            }
            .thin-scrollbar::-webkit-scrollbar-thumb {
              background: #80000020;
              border-radius: 20px;
            }
            .thin-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #800000;
            }
          `}</style>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 80 }}
            animate={{ opacity: 1, scale: 1, y: 60 }}
            exit={{ opacity: 0, scale: 0.9, y: 80 }}
            className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden z-[110] flex flex-col"
          >
            <div className="w-full h-1.5 bg-[#800000] shrink-0"></div>
            
            <div className="p-8 md:p-10 flex-1 flex flex-col overflow-hidden relative">
              <div className="absolute top-5 right-8 flex flex-col items-end gap-3 z-20">
                <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={28} />
                </button>
                {step === 0 && (
                  <img src="/images/logo.png" alt="Telex logo" className="h-14 w-auto object-contain" />
                )}
              </div>

              {step === 0 ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    <div className="space-y-4 mb-8">
                      <div className="inline-block bg-[#800000] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                        Consultation
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] tracking-tighter">
                        Discovery <span className="text-[#800000]">call</span>
                      </h2>
                      <div className="flex items-center gap-2 text-[#282828] text-sm italic">
                        <span className="text-[#800000]">📍</span>
                        Cawayan bugtong, guimba, nueva ecija
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="text-center mb-10">
                        <h3 className="text-3xl md:text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase leading-none">
                          Booking
                        </h3>
                        <h3 className="text-3xl md:text-4xl font-black text-[#800000] tracking-tighter uppercase">
                          Schedule
                        </h3>
                        <p className="max-w-2xl mx-auto text-[#282828] text-xs italic mt-6 leading-relaxed">
                          Please choose your preferred date and time for our discovery call. This session will help us understand your requirements and how we can best assist you with your project.
                        </p>
                      </div>

                      <div className="relative max-w-md mx-auto mb-12 px-4">
                        <div className="absolute top-[12px] left-10 right-10 h-[1.5px] bg-[#800000] opacity-20 z-0"></div>
                        <div className="relative flex justify-between gap-2 z-10">
                          {steps.map((s, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 flex-1">
                              <div className="w-7 h-7 rounded-full bg-[#800000] shadow-[0_0_0_4px_white] flex items-center justify-center text-white text-[12px] font-bold">
                                {i + 1}
                              </div>
                              <span className="text-[13px] font-normal text-[#1a1a1a] uppercase text-center leading-tight tracking-tight">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 py-4 shrink-0 mt-auto">
                    <button onClick={handleClose} className="px-10 py-2.5 bg-[#b5b5b5] text-black rounded-lg font-medium uppercase text-xs tracking-widest transition-all hover:bg-gray-300">Cancel</button>
                    <button onClick={() => setStep(1)} className="px-12 py-2.5 bg-[#800000] text-white rounded-lg font-medium uppercase text-xs tracking-widest shadow-lg transition-all hover:bg-[#600000]">Start</button>
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="relative max-w-md mx-auto mb-6 w-full px-4 shrink-0">
                    <div className="absolute top-[16px] left-14 right-14 h-[1.5px] bg-[#800000] opacity-20 z-0"></div>
                    <div className="relative flex justify-between gap-2 z-10">
                      {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] border-[3px] border-white shadow-sm transition-colors ${i < step ? "bg-[#800000] text-white" : i === (step - 1) ? "bg-[#800000] text-white ring-4 ring-[#800000]/10" : "bg-[#b5b5b5] text-white"}`}>
                            {i + 1}
                          </div>
                          <span className={`text-[12px] uppercase text-center leading-tight tracking-tight ${i === (step - 1) ? "font-bold text-[#1a1a1a]" : "font-normal text-gray-400"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2 shrink-0">
                    <p className={`text-[#1a1a1a] font-black text-[13px] tracking-widest uppercase ${poppinsfont.className}`}>
                      Step 1 of 2 :
                    </p>
                  </div>
                  <div className="bg-[#f3f3f3] p-3 mb-1 rounded-t-sm border-l-4 border-[#800000] shrink-0">
                    <h4 className={`text-[#1a1a1a] font-black tracking-widest uppercase text-sm ${poppinsfont.className}`}>
                      Time & date selection <span className="text-red-600 font-bold">*</span>
                    </h4>
                  </div>
                  <div className="px-3 mb-2 shrink-0">
                    <p className={`text-gray-500 text-[12px] italic tracking-wider leading-relaxed ${poppinsfont.className}`}>
                      Please select your preferred date and time slot below to proceed.
                    </p>
                  </div>

                  <div className="flex-1 flex flex-row gap-0 overflow-hidden pt-4 px-1">
                    <div className="flex-[1.2] overflow-visible pr-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-lg text-[#1a1a1a] tracking-tight uppercase h-5 flex items-center">January 2026</span>
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded border border-gray-200 text-gray-400"><ChevronLeft size={16} /></button>
                          <button className="p-1 hover:bg-gray-100 rounded border border-gray-200 text-gray-400"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 uppercase mb-3 tracking-widest">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                      </div>
                      <div className="grid grid-cols-7 text-center gap-y-1">
                        {Array.from({ length: 4 }).map((_, i) => <span key={i}></span>)}
                        {days.map((d) => (
                          <button key={d} onClick={() => setSelectedDay(d)} className={`text-sm w-9 h-9 flex items-center justify-center rounded transition-all mx-auto ${selectedDay === d ? "bg-[#800000] text-white shadow-md font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-px bg-gray-100 h-full"></div>

                    <div className="flex-1 flex flex-col pl-10">
                      <div className="flex flex-col gap-4 w-full h-full">
                        <div className="mb-0">
                          <span className="font-bold text-lg text-[#1a1a1a] tracking-tight uppercase h-5 flex items-center">Pick a time</span>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <ScrollColumn items={hours} current={hour} onChange={setHour} label="Hour" />
                          <div className="flex flex-col items-center">
                            <div className="h-4 mb-4"></div>
                            <div className="h-[132px] flex items-center">
                              <span className="text-[#800000] text-2xl font-bold">:</span>
                            </div>
                          </div>
                          <ScrollColumn items={minutes} current={minute} onChange={setMinute} label="Min" />
                          <div className="w-1" />
                          <ScrollColumn items={periods} current={period} onChange={setPeriod} label="Period" />
                        </div>

                        <div className="mt-auto pb-4 pt-4 border-t border-dashed border-gray-200">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-center w-full">
                              <span className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Selected date:</span>
                              <span className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">Selected time:</span>
                            </div>
                            <div className="flex justify-between items-baseline w-full">
                              <span className="text-[#800000] font-black text-[14px] tracking-tight uppercase leading-none">
                                January {selectedDay}, 2026
                              </span>
                              <span className="text-[#1a1a1a] font-black text-[14px] tracking-tight leading-none">
                                {hour}:{minute} {period}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
                    <button onClick={() => setStep(0)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors">Back</button>
                    <button onClick={() => setStep(2)} className="px-10 py-2.5 bg-[#800000] text-white rounded font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors">Next</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="relative max-w-md mx-auto mb-4 w-full px-4 shrink-0">
                    <div className="absolute top-[16px] left-14 right-14 h-[1.5px] bg-[#800000] opacity-20 z-0"></div>
                    <div className="relative flex justify-between gap-2 z-10">
                      {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] border-[3px] border-white shadow-sm transition-colors ${i < step ? "bg-[#800000] text-white" : i === (step - 1) ? "bg-[#800000] text-white ring-4 ring-[#800000]/10" : "bg-[#b5b5b5] text-white"}`}>
                            {i + 1}
                          </div>
                          <span className={`text-[12px] uppercase text-center leading-tight tracking-tight ${i === (step - 1) ? "font-bold text-[#1a1a1a]" : "font-normal text-gray-400"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto thin-scrollbar pr-3">
                      <div className="space-y-6">
                        <section>
                          <div className="relative inline-block mb-5">
                            <h4 className="font-black text-lg text-[#1a1a1a] tracking-tight uppercase leading-none">Contact information</h4>
                            <div className="absolute -bottom-1.5 left-0 w-[100%] h-[2px] bg-[#800000]"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Full name<span className="text-[#800000]">*</span></label>
                              <input type="text" placeholder="Enter your full name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Email address<span className="text-[#800000]">*</span></label>
                              <input type="email" placeholder="Enter your email address" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Phone number<span className="text-[#800000]">*</span></label>
                              <input type="tel" placeholder="Enter your phone number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                          </div>
                        </section>

                        <section className="pt-2">
                          <div className="relative inline-block mb-5">
                            <h4 className="font-black text-lg text-[#1a1a1a] tracking-tight uppercase leading-none">Professional background</h4>
                            <div className="absolute -bottom-1.5 left-0 w-[45%] h-[2px] bg-[#800000]"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Current role<span className="text-[#800000]">*</span></label>
                              <input type="text" placeholder="Enter your current role or position" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Years of experience<span className="text-[#800000]">*</span></label>
                              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white italic text-gray-400 outline-none"><option>Select an option</option></select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Positions of interest<span className="text-[#800000]">*</span></label>
                              <input type="text" placeholder="Enter your positions of interest" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Availability<span className="text-[#800000]">*</span></label>
                              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white italic text-gray-400 outline-none"><option>Select an option</option></select>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                              <label className="text-[12px] font-black uppercase tracking-wider text-[#333]">Additional questions or comments<span className="text-[#800000]">*</span></label>
                              <textarea placeholder="Are there any topics you want us to discuss with?" rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-y min-h-[60px] outline-none focus:border-[#800000]" />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
                      <button onClick={() => setStep(1)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors">Back</button>
                      <button onClick={handleOpenConfirm} className="px-10 py-2.5 bg-[#800000] text-white rounded font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors">Submit</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm submission modal */}
            <AnimatePresence>
              {showConfirm && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center"
                  >
                    <div className="mb-2">
                      <img src="/images/logo.png" alt="Telex logo" className="h-[70px] w-auto object-contain" />
                    </div>
                    
                    <div className="w-[85%] h-[1px] bg-[#80000020] mb-8"></div>

                    <h3 className="text-[32px] font-black text-[#1a1a1a] mb-2 leading-tight tracking-tight">Confirm submission</h3>
                    <p className="text-gray-400 italic text-[16px] mb-12 leading-relaxed px-4">
                      Once submitted, your application will be sent for review.
                    </p>

                    <div className="flex w-full gap-4 px-2">
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-4 bg-[#d4d4d4] text-black font-black uppercase text-[13px] tracking-widest rounded-[18px] hover:bg-gray-300 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleFinalSubmit}
                        className="flex-1 py-4 bg-[#800000] text-white font-black uppercase text-[13px] tracking-widest rounded-[18px] shadow-lg hover:bg-[#600000] transition-all active:scale-95"
                      >
                        Submit
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Success state modal */}
            <AnimatePresence>
              {isSuccess && (
                <div className="absolute inset-0 z-[130] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center"
                  >
                    <div className="mb-6 flex items-center justify-center">
                      <div className="w-20 h-20 bg-[#800000] rounded-full flex items-center justify-center shadow-lg">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="w-[85%] h-[1px] bg-[#80000020] mb-8"></div>

                    <h3 className="text-[32px] font-black text-[#1a1a1a] mb-2 leading-tight tracking-tight">We've received your application!</h3>
                    <p className="text-gray-400 italic text-[16px] mb-12 leading-relaxed px-4">
                      We will process it and reach out to you in a few days.
                    </p>

                    <div className="flex w-full px-2">
                      <button 
                        onClick={handleClose}
                        className="flex-1 py-4 bg-[#800000] text-white font-black uppercase text-[13px] tracking-widest rounded-[18px] shadow-lg hover:bg-[#600000] transition-all active:scale-95"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}