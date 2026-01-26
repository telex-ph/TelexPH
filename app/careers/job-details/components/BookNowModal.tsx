"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Open_Sans, Poppins } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });
const poppinsFont = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"] 
});

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookNowModal({ isOpen, onClose }: BookNowModalProps) {
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedDay, setSelectedDay] = useState(23);
  
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("10");
  const [period, setPeriod] = useState("PM");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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

  const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
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
      <div className="flex flex-col items-start gap-2 flex-1 sm:flex-none">
        <span className={`text-[10px] text-gray-400 uppercase tracking-widest leading-none h-4 flex items-center ${poppinsFont.className}`}><b>{label}</b></span>
        <div className="relative h-[132px] w-full sm:w-14 overflow-hidden bg-white rounded-lg border border-gray-100">
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
                  item === current ? "text-white font-bold" : "text-gray-400"
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

  const steps = ["Time & Date", "Contact Info"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${openSans.className}`}>
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
            className="relative w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden z-[110] flex flex-col"
          >
            <div className="w-full h-1.5 bg-[#800000] shrink-0"></div>
            
            <div className="p-6 md:p-10 flex-1 flex flex-col overflow-hidden relative">
              <div className="absolute top-5 right-8 flex flex-col items-end gap-3 z-20">
                <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={28} />
                </button>
                {step === 0 && (
                  <img src="/images/logo.png" alt="Telex Logo" className="hidden sm:block h-14 w-auto object-contain" />
                )}
              </div>

              {step === 0 ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    <div className="space-y-4 mb-8">
                      <div className="inline-block bg-[#800000] text-white text-[10px] px-4 py-1 rounded-full uppercase tracking-widest">
                        <b>CONSULTATION</b>
                      </div>
                      <h2 className="text-3xl md:text-4xl text-[#1a1a1a] tracking-tighter">
                        <b>Discovery <span className="text-[#800000]">Call</span></b>
                      </h2>
                      <div className="flex items-center gap-2 text-[#282828] text-sm italic">
                        <span className="text-[#800000]">📍</span>
                        Cawayan Bugtong, Guimba, Nueva Ecija
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="text-center mb-10">
                        <h3 className="text-3xl md:text-4xl text-[#1a1a1a] tracking-tighter uppercase leading-none">
                          <b>BOOKING</b>
                        </h3>
                        <h3 className="text-3xl md:text-4xl text-[#800000] tracking-tighter uppercase">
                          <b>SCHEDULE</b>
                        </h3>
                        <p className="max-w-2xl mx-auto text-[#282828] text-xs italic mt-6 leading-relaxed">
                          Please choose your preferred date and time for our discovery call. This session will help us understand your requirements and how we can best assist you with your project.
                        </p>
                      </div>

                      <div className="relative max-w-md mx-auto mb-12 px-4">
                        <div className="absolute top-[12px] left-10 right-10 h-[1px] bg-[#800000] opacity-10 z-0"></div>
                        <div className="relative flex justify-between gap-2 z-10">
                          {steps.map((s, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 flex-1">
                              <div className="w-7 h-7 rounded-full bg-[#800000] shadow-[0_0_0_4px_white] flex items-center justify-center text-white text-[12px]">
                                <b>{i + 1}</b>
                              </div>
                              <span className="text-[13px] text-[#1a1a1a] uppercase text-center leading-tight tracking-tight"><b>{s}</b></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 py-4 shrink-0 mt-auto">
                    <button onClick={handleClose} className="px-10 py-2.5 bg-[#b5b5b5] text-black rounded-lg uppercase text-xs tracking-widest transition-all hover:bg-gray-300"><b>CANCEL</b></button>
                    <button onClick={() => setStep(1)} className="px-12 py-2.5 bg-[#800000] text-white rounded-lg uppercase text-xs tracking-widest shadow-lg transition-all hover:bg-[#600000]"><b>START</b></button>
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="relative max-w-md mx-auto mb-6 w-full px-4 shrink-0">
                    <div className="absolute top-[16px] left-14 right-14 h-[1px] bg-[#800000] opacity-10 z-0"></div>
                    <div className="relative flex justify-between gap-2 z-10">
                      {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] border-[1px] border-white shadow-sm transition-colors ${i < step ? "bg-[#800000] text-white" : i === (step - 1) ? "bg-[#800000] text-white ring-4 ring-[#800000]/5" : "bg-[#b5b5b5] text-white"}`}>
                            <b>{i + 1}</b>
                          </div>
                          <span className={`text-[12px] uppercase text-center leading-tight tracking-tight ${i === (step - 1) ? "text-[#1a1a1a]" : "text-gray-400"}`}><b>{s}</b></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2 shrink-0">
                    <p className={`text-[#800000] text-[12px] tracking-widest uppercase ${poppinsFont.className}`}>
                      <b>Step 1 of 2 :</b>
                    </p>
                  </div>
                  <div className="bg-[#f3f3f3] p-2.5 mb-2 rounded-t-sm border-l-4 border-[#800000] shrink-0">
                    <h4 className={`text-[#1a1a1a] tracking-widest uppercase text-[12px] ${poppinsFont.className}`}>
                      <b>Time & Date Selection <span className="text-red-600">*</span></b>
                    </h4>
                  </div>
                  <div className="px-3 mb-4 shrink-0">
                    <p className={`text-gray-500 text-[12px] italic tracking-wider leading-relaxed ${poppinsFont.className}`}>
                      Please select your preferred date and time slot below to proceed.
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-y-auto lg:overflow-hidden pt-4 px-1 scrollbar-hide">
                    <div className="flex-1 lg:pr-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg text-[#1a1a1a] tracking-tight uppercase h-5 flex items-center"><b>{monthNames[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}</b></span>
                        <div className="flex gap-2">
                          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded border border-gray-100 text-gray-400"><ChevronLeft size={16} /></button>
                          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded border border-gray-100 text-gray-400"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 text-center text-[10px] text-gray-400 uppercase mb-3 tracking-widest">
                        <span><b>SUN</b></span><span><b>MON</b></span><span><b>TUE</b></span><span><b>WED</b></span><span><b>THU</b></span><span><b>FRI</b></span><span><b>SAT</b></span>
                      </div>
                      <div className="grid grid-cols-7 text-center gap-y-1">
                        {emptySlots.map((_, i) => <span key={`empty-${i}`}></span>)}
                        {daysArray.map((d) => (
                          <button key={d} onClick={() => setSelectedDay(d)} className={`text-sm w-9 h-9 flex items-center justify-center rounded transition-all mx-auto ${selectedDay === d ? "bg-[#800000] text-white shadow-md font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="hidden lg:block w-px bg-gray-100 h-full"></div>

                    <div className="flex-1 flex flex-col lg:px-10">
                      <div className="flex items-start justify-center gap-2">
                        <div className="flex flex-col gap-2 flex-1 sm:flex-none">
                          <div className="mb-2">
                            <span className="text-lg text-[#1a1a1a] tracking-tight uppercase h-5 flex items-center"><b>Pick a Time</b></span>
                          </div>
                          <div className="flex items-start gap-2">
                            <ScrollColumn items={hours} current={hour} onChange={setHour} label="HOUR" />
                            <div className="flex flex-col items-center">
                              <div className="h-4 mb-2"></div>
                              <div className="h-[132px] flex items-center">
                                <span className="text-[#800000] text-2xl font-light"><b>:</b></span>
                              </div>
                            </div>
                            <ScrollColumn items={minutes} current={minute} onChange={setMinute} label="MIN" />
                            <div className="w-1" />
                            <ScrollColumn items={periods} current={period} onChange={setPeriod} label="PERIOD" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block w-px bg-gray-100 h-full"></div>

                    <div className="flex-1 flex flex-col lg:pl-8">
                      <div className="mb-4">
                        <span className="text-lg text-[#1a1a1a] tracking-tight uppercase h-5 flex items-center"><b>Selected Time</b></span>
                      </div>
                      <div className="flex-1 flex flex-col py-2 gap-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#800000]/5 rounded-md mt-1">
                            <Calendar size={18} className="text-[#800000]" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 leading-none"><b>DATE</b></p>
                            <p className="text-sm text-[#1a1a1a]">January 23, 2026</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#800000]/5 rounded-md mt-1">
                            <Clock size={18} className="text-[#800000]" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 leading-none"><b>TIME SLOT</b></p>
                            <p className="text-sm text-[#1a1a1a]">01:10 PM</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                          <Globe size={14} className="text-gray-400" />
                          <p className="text-gray-400 italic text-[11px] tracking-wide leading-none">
                            Philippine Standard Time (GMT+8)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
                    <button onClick={() => setStep(0)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors"><b>BACK</b></button>
                    <button onClick={() => setStep(2)} className="px-10 py-2.5 bg-[#800000] text-white rounded uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors"><b>NEXT</b></button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="relative max-w-md mx-auto mb-6 w-full px-4 shrink-0">
                    <div className="absolute top-[16px] left-14 right-14 h-[1px] bg-[#800000] opacity-10 z-0"></div>
                    <div className="relative flex justify-between gap-2 z-10">
                      {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] border-[1px] border-white shadow-sm transition-colors ${i < step ? "bg-[#800000] text-white" : i === (step - 1) ? "bg-[#800000] text-white ring-4 ring-[#800000]/5" : "bg-[#b5b5b5] text-white"}`}>
                            <b>{i + 1}</b>
                          </div>
                          <span className={`text-[12px] uppercase text-center leading-tight tracking-tight ${i === (step - 1) ? "text-[#1a1a1a]" : "text-gray-400"}`}><b>{s}</b></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2 shrink-0">
                    <p className={`text-[#800000] text-[12px] tracking-widest uppercase ${poppinsFont.className}`}>
                      <b>Step 2 of 2 :</b>
                    </p>
                  </div>
                  <div className="bg-[#f3f3f3] p-3 mb-1 rounded-t-sm border-l-4 border-[#800000] shrink-0">
                    <h4 className={`text-[#1a1a1a] tracking-widest uppercase text-[12px] ${poppinsFont.className}`}>
                      <b>Contact Information <span className="text-red-600">*</span></b>
                    </h4>
                  </div>
                  <div className="px-3 mb-2 shrink-0">
                    <p className={`text-gray-500 text-[12px] italic tracking-wider leading-relaxed ${poppinsFont.className}`}>
                      Please provide your contact details and professional background below to complete your booking.
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto thin-scrollbar pr-3">
                      <div className="space-y-6 pt-4">
                        <section>
                          <div className="relative inline-block mb-5">
                            <h4 className="text-lg text-[#1a1a1a] tracking-tight uppercase leading-none"><b>Basic Details</b></h4>
                            <div className="absolute -bottom-1.5 left-0 w-[100%] h-[1px] bg-[#800000]"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Full Name<span className="text-[#800000]">*</span></b></label>
                              <input type="text" placeholder="Enter your full name" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Email Address<span className="text-[#800000]">*</span></b></label>
                              <input type="email" placeholder="Enter your email address" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Phone Number<span className="text-[#800000]">*</span></b></label>
                              <input type="tel" placeholder="Enter your phone number" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                          </div>
                        </section>

                        <section className="pt-2">
                          <div className="relative inline-block mb-5">
                            <h4 className="text-lg text-[#1a1a1a] tracking-tight uppercase leading-none"><b>Professional Background</b></h4>
                            <div className="absolute -bottom-1.5 left-0 w-[45%] h-[1px] bg-[#800000]"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Current Role<span className="text-[#800000]">*</span></b></label>
                              <input type="text" placeholder="Enter your current role or position" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Years of Experience<span className="text-[#800000]">*</span></b></label>
                              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white italic text-gray-400 outline-none"><option>Select an option</option></select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Positions of Interest<span className="text-[#800000]">*</span></b></label>
                              <input type="text" placeholder="Enter your positions of interest" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-[#800000]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Availability<span className="text-[#800000]">*</span></b></label>
                              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white italic text-gray-400 outline-none"><option>Select an option</option></select>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5 pb-6">
                              <label className="text-[12px] uppercase tracking-wider text-[#333]"><b>Additional Questions or Comments<span className="text-[#800000]">*</span></b></label>
                              <textarea placeholder="Are there any topics you want us to discuss with?" rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm resize-y min-h-[60px] outline-none focus:border-[#800000]" />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
                      <button onClick={() => setStep(1)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors"><b>BACK</b></button>
                      <button onClick={handleOpenConfirm} className="px-10 py-2.5 bg-[#800000] text-white rounded uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors"><b>SUBMIT</b></button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {showConfirm && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center">
                    <div className="mb-2"><img src="/images/logo.png" alt="Telex Logo" className="h-[70px] w-auto object-contain" /></div>
                    <div className="w-[85%] h-[1px] bg-[#80000010] mb-8"></div>
                    <h3 className="text-[32px] text-[#1a1a1a] mb-2 leading-tight tracking-tight"><b>Confirm Submission</b></h3>
                    <p className="text-gray-400 text-[16px] mb-12 px-4">Once submitted, your application will be sent for review.</p>
                    <div className="flex w-full gap-4 px-2">
                      <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-[#d4d4d4] text-black uppercase text-[13px] tracking-widest rounded-[18px] hover:bg-gray-300 transition-all active:scale-95"><b>CANCEL</b></button>
                      <button onClick={handleFinalSubmit} className="flex-1 py-4 bg-[#800000] text-white uppercase text-[13px] tracking-widest rounded-[18px] shadow-lg hover:bg-[#600000] transition-all active:scale-95"><b>SUBMIT</b></button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSuccess && (
                <div className="absolute inset-0 z-[130] flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center">
                    <div className="mb-2"><img src="/images/logo.png" alt="Telex Logo" className="h-[70px] w-auto object-contain" /></div>
                    <div className="w-[85%] h-[1px] bg-[#80000010] mb-8"></div>
                    <h3 className="text-[32px] text-[#1a1a1a] mb-2 leading-tight tracking-tight"><b>We&apos;ve received your application!</b></h3>
                    <p className="text-gray-400 text-[16px] mb-12 px-4">We will process it and reach out to you in a few days.</p>
                    <div className="flex w-full px-2">
                      <button onClick={handleClose} className="flex-1 py-4 bg-[#800000] text-white uppercase text-[13px] tracking-widest rounded-[18px] shadow-lg hover:bg-[#600000] transition-all active:scale-95"><b>DONE</b></button>
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