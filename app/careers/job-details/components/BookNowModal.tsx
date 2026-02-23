"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, ArrowRight, User, Mail, Phone, Briefcase, MessageSquare, Layers, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookNowModal({ isOpen, onClose }: BookNowModalProps) {
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 20));
  const [selectedDay, setSelectedDay] = useState(20);

  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleClose = () => {
    setStep(0);
    setShowConfirm(false);
    setIsSuccess(false);
    onClose();
  };

  const hours = ["08", "09", "10", "11", "12", "01", "02", "03", "04", "05"];
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  const TimeSlotButton = ({ item, current, onChange }: { item: string, current: string, onChange: (v: string) => void }) => (
    <button
      onClick={() => onChange(item)}
      className={`py-1 px-3 rounded-md border text-[12px] transition-all tracking-normal ${
        current === item 
          ? "bg-[#800000] border-[#800000] text-white" 
          : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200"
      }`}
    >
      {item}
    </button>
  );

  const steps = ["Schedule", "Information"];

  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="relative max-w-xs mx-auto mb-6 w-full shrink-0">
      <div className="absolute top-[11px] left-[40px] right-[40px] h-px bg-slate-200 z-0"></div>
      <div className="relative flex justify-between z-10">
        {steps.map((s, i) => {
          const isActive = i + 1 <= currentStep || (currentStep === 0 && i === 0);
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                isActive ? "bg-[#800000] border-[#800000] text-white" : "bg-white border-slate-300 text-slate-400"
              }`}>
                {i + 1}
              </div>
              <span className={`text-[11px] tracking-normal ${isActive ? "text-[#800000]" : "text-slate-400"}`}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const inputClass = "w-full border-b border-slate-200 bg-transparent px-0 py-1 text-[13px] text-slate-800 outline-none focus:border-slate-400 transition-all placeholder:text-slate-300 tracking-normal";
  const labelClass = "text-[11px] text-slate-500 flex items-center gap-2 tracking-normal";
  const sectionHeader = "text-[12px] text-slate-900 border-l-2 border-slate-900 pl-2 mb-4 mt-2 tracking-normal";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm px-4 pb-6 ${poppins.className}`}>
          <style jsx global>{`
            .custom-thin-scroll::-webkit-scrollbar {
              width: 3px;
            }
            .custom-thin-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-thin-scroll::-webkit-scrollbar-thumb {
              background-color: #e2e8f0;
              border-radius: 20px;
            }
            .custom-thin-scroll {
              scrollbar-width: thin;
              scrollbar-color: #e2e8f0 transparent;
            }
          `}</style>
          
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row h-[600px] overflow-hidden rounded-xl"
          >
            {/* sidebar section */}
            <div className="w-full md:w-[280px] bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-between shrink-0 z-10">
              <div>
                <img src="/images/logo.png" alt="logo" className="h-7 w-auto mb-8 object-contain" />
                <h2 className="text-xl text-slate-800 leading-tight tracking-normal">
                  Strategic <br />
                  <span className="text-slate-950">Consultation</span>
                </h2>
                <p className="text-slate-400 text-[12px] mt-3 leading-relaxed tracking-normal">Book a session to discuss your projects or career growth.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Location</h4>
                  <div className="flex items-start gap-2 text-slate-600 text-[12px] tracking-normal">
                    <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span>Cawayan Bugtong, Guimba, Nueva Ecija</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[12px] text-slate-400 italic leading-relaxed tracking-normal">
                    "Excellence is a habit."
                  </p>
                </div>
              </div>
            </div>

            {/* main section */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              <button onClick={handleClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors z-[140]">
                <X size={24} />
              </button>

              <div className="flex-1 p-8 md:p-12 overflow-hidden">
                {step === 0 ? (
                  <div className="flex flex-col h-full items-center justify-center text-center">
                    <div className="space-y-3 mb-10">
                      <span className="text-slate-400 text-[12px] tracking-widest uppercase">Private Session</span>
                      <h1 className="text-4xl text-slate-900 tracking-tight">Discovery Call</h1>
                      <p className="max-w-sm mx-auto text-slate-500 text-[13px] leading-relaxed tracking-normal">
                        Start your journey with us. Choose your preferred slot and provide your details.
                      </p>
                    </div>
                    
                    <div className="w-full mb-12">
                      <StepIndicator currentStep={0} />
                    </div>

                    <button onClick={() => setStep(1)} className="px-10 py-3.5 bg-[#800000] text-white text-[12px] uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-[#600000] active:scale-95 rounded-md">
                      Begin Booking <ArrowRight size={14} />
                    </button>
                  </div>
                ) : step === 1 ? (
                  <div className="flex flex-col h-full">
                    <StepIndicator currentStep={1} />
                    <div className="mb-6">
                      <h1 className="text-xl text-slate-900 tracking-normal">Select Schedule</h1>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-slate-800 text-[14px] tracking-normal">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
                          <div className="flex gap-3">
                            <button onClick={handlePrevMonth} className="text-slate-400 hover:text-slate-800 transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={handleNextMonth} className="text-slate-400 hover:text-slate-800 transition-colors"><ChevronRight size={20} /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-2 text-center h-auto overflow-visible">
                          {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                            <span key={d} className="text-[12px] text-slate-300 mb-3">{d}</span>
                          ))}
                          {emptySlots.map((_, i) => <span key={`e-${i}`} />)}
                          {daysArray.map((d) => (
                            <button
                              key={d}
                              onClick={() => setSelectedDay(d)}
                              className={`text-[12px] w-9 h-9 mx-auto flex items-center justify-center rounded-md transition-all ${
                                selectedDay === d 
                                  ? "bg-[#800000] text-white shadow-md shadow-maroon-900/30" 
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="text-[11px] text-slate-400 uppercase tracking-widest mb-4">Time Slots</h4>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-slate-400 text-center">Hour</span>
                            <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto custom-thin-scroll pr-1">
                              {hours.map(h => <TimeSlotButton key={h} item={h} current={hour} onChange={setHour} />)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-slate-400 text-center">Min</span>
                            <div className="flex flex-col gap-1.5">
                              {minutes.map(m => <TimeSlotButton key={m} item={m} current={minute} onChange={setMinute} />)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-slate-400 text-center">AM/PM</span>
                            <div className="flex flex-col gap-1.5">
                              {periods.map(p => <TimeSlotButton key={p} item={p} current={period} onChange={setPeriod} />)}
                            </div>
                          </div>
                        </div>
                        <div className="p-5 rounded-md border border-slate-100 bg-slate-50 flex items-center gap-3">
                          <Clock size={16} className="text-slate-400" />
                          <p className="text-[13px] text-slate-700">
                            {monthNames[currentDate.getMonth()]} {selectedDay}, {hour}:{minute} {period}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full overflow-y-auto custom-thin-scroll pr-2">
                    <StepIndicator currentStep={2} />
                    <div className="mb-6">
                      <h1 className="text-xl text-slate-900 tracking-normal">Contact Information *</h1>
                    </div>

                    <div className="max-w-4xl">
                      <h3 className={sectionHeader}>Basic Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-12">
                        <div className="md:col-span-2 space-y-2">
                          <label className={labelClass}><User size={12} /> Full Name</label>
                          <input type="text" placeholder="Juan Dela Cruz" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}><Mail size={12} /> Email</label>
                          <input type="email" placeholder="juan@example.com" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}><Phone size={12} /> Phone</label>
                          <input type="tel" placeholder="+63 900 000 0000" className={inputClass} />
                        </div>
                      </div>

                      <h3 className={sectionHeader}>Professional Info</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="space-y-2">
                          <label className={labelClass}><Briefcase size={12} /> Current Role</label>
                          <input type="text" placeholder="e.g. Developer" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}><Layers size={12} /> Experience</label>
                          <select className={inputClass}>
                            <option value="">Select Level</option>
                            <option value="entry">Entry (1-2 yrs)</option>
                            <option value="mid">Mid (3-5 yrs)</option>
                            <option value="senior">Senior (6+ yrs)</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className={labelClass}><MessageSquare size={12} /> Message</label>
                          <textarea rows={2} placeholder="Tell us more about your needs..." className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* bottom actions */}
              {step > 0 && !showConfirm && !isSuccess && (
                <div className="p-8 mt-auto border-t border-slate-100 flex items-center justify-end gap-6 bg-white shrink-0">
                  {step === 1 ? (
                    <>
                      <button onClick={handleClose} className="text-[12px] text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Cancel</button>
                      <button onClick={() => setStep(2)} className="bg-[#800000] text-white px-8 py-3 text-[12px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#600000] transition-all rounded-md">
                        Next <ArrowRight size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setStep(1)} className="text-[12px] text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Back</button>
                      <button onClick={() => setShowConfirm(true)} className="bg-[#800000] text-white px-8 py-3 text-[12px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#600000] transition-all rounded-md">
                        Confirm Booking
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* final overlays */}
              <AnimatePresence>
                {(showConfirm || isSuccess) && (
                  <div className="absolute inset-0 z-[130] flex items-center justify-center p-8 bg-white/95 backdrop-blur-md">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-[340px]">
                      {isSuccess ? (
                        <div className="bg-white border border-slate-100 shadow-xl p-8 text-center rounded-md">
                          <div className="w-10 h-10 bg-[#800000] text-white rounded-md flex items-center justify-center mx-auto mb-5">
                            <Calendar size={20} />
                          </div>
                          <h3 className="text-xl text-slate-900 mb-2 tracking-tight">Confirmed</h3>
                          <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">Check your email for the session details.</p>
                          <button onClick={handleClose} className="w-full py-3.5 bg-[#800000] text-white text-[12px] uppercase tracking-widest hover:bg-[#600000] transition-all rounded-md">Close</button>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-100 shadow-2xl p-8 rounded-md overflow-hidden relative">
                          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="w-9 h-9 bg-slate-50 rounded-md flex items-center justify-center">
                              <AlertCircle size={18} className="text-[#800000]" />
                            </div>
                            <h3 className="text-lg text-slate-900 tracking-tight">Finalize?</h3>
                          </div>
                          
                          <div className="mb-8 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Scheduled Date & Time</p>
                            <p className="text-[14px] text-slate-800 tracking-normal leading-relaxed">
                              {monthNames[currentDate.getMonth()]} {selectedDay}, {hour}:{minute} {period}.
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border border-slate-200 text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors rounded-md">
                              Review
                            </button>
                            <button onClick={() => { setShowConfirm(false); setIsSuccess(true); }} className="flex-1 py-3 bg-[#800000] text-white text-[11px] uppercase tracking-widest hover:bg-[#600000] shadow-lg shadow-maroon-900/20 transition-all rounded-md">
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}