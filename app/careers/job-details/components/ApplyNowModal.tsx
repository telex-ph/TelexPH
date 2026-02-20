"use client";

import React, { useState } from "react";
import { X, ArrowRight, User, Mail, Phone, Briefcase, MessageSquare, Layers, AlertCircle, MapPin, Upload, FileText, Check, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyNowModal({ isOpen, onClose }: ApplyNowModalProps) {
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    setStep(0);
    setShowConfirm(false);
    setIsSuccess(false);
    onClose();
  };

  const steps = [
    "Personal Info", 
    "Curriculum Vitae", 
    "Cover Letter", 
    "Portfolio", 
    "Screening"
  ];

  const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="relative max-w-2xl mx-auto mb-10 w-full shrink-0">
      <div className="absolute top-[11px] left-[20px] right-[20px] h-px bg-slate-200 z-0"></div>
      <div className="relative flex justify-between z-10">
        {steps.map((s, i) => {
          const isActive = i + 1 <= currentStep || (currentStep === 0 && i === 0);
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-[10px] lg:text-xs border transition-all duration-300 ${
                isActive ? "bg-[#800000] border-[#800000] text-white shadow-lg shadow-red-900/20" : "bg-white border-slate-300 text-slate-400"
              }`}>
                {i + 1}
              </div>
              <span className={`hidden md:block text-[10px] lg:text-[11px] tracking-wide uppercase ${isActive ? "text-[#800000]" : "text-slate-400"}`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const inputClass = "w-full border-b border-slate-200 bg-transparent px-0 py-2 text-[14px] lg:text-[16px] text-slate-800 outline-none focus:border-[#800000] transition-all placeholder:text-slate-300 tracking-normal font-normal";
  const labelClass = "text-[11px] lg:text-[12px] text-slate-500 flex items-center gap-2 tracking-widest uppercase font-normal";
  const sectionHeader = "text-[13px] lg:text-[15px] text-slate-900 border-l-4 border-[#800000] pl-3 mb-6 mt-2 tracking-normal font-normal";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-0 md:p-6 lg:p-12 ${poppins.className}`}>
          <style jsx global>{`
            .custom-thin-scroll::-webkit-scrollbar { width: 4px; }
            .custom-thin-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-thin-scroll::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
            .custom-thin-scroll { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
          `}</style>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full h-full md:h-[90vh] max-w-[100vw] md:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[1200px] bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden md:rounded-2xl"
          >
            {/* sidebar section */}
            <div className="w-full md:w-[300px] lg:w-[350px] bg-slate-50 p-6 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-row md:flex-col justify-between shrink-0 z-10">
              <div className="flex flex-col gap-4 md:gap-8">
                <div className="bg-white p-3 rounded-xl shadow-sm self-start">
                  <img src="/images/logo.png" alt="logo" className="h-8 md:h-10 w-auto object-contain" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-800 leading-tight tracking-tight font-normal">
                    Front-End <br className="hidden md:block" />
                    <span className="text-[#800000]">Developer</span>
                  </h2>
                  <p className="hidden md:block text-slate-400 text-sm mt-4 leading-relaxed font-normal">
                    Professional application gateway. Please ensure all data provided is current and verifiable.
                  </p>
                </div>
              </div>

              <div className="hidden md:block space-y-6">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                    <MapPin size={18} className="text-[#800000]" />
                  </div>
                  <div className="text-[12px] lg:text-[13px] leading-snug">
                    <p className="text-slate-400 uppercase text-[10px] tracking-widest">Office</p>
                    <p>Cawayan Bugtong, Guimba, Nueva Ecija</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-400 italic font-normal">
                    "Excellence is a habit."
                  </p>
                </div>
              </div>

              <button onClick={handleClose} className="md:hidden text-slate-400 p-2">
                <X size={28} />
              </button>
            </div>

            {/* main section */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              <button onClick={handleClose} className="hidden md:flex absolute top-8 right-8 text-slate-300 hover:text-[#800000] transition-colors z-[140] w-10 h-10 items-center justify-center rounded-full hover:bg-slate-50">
                <X size={28} />
              </button>

              <div className="flex-1 p-6 md:p-12 lg:p-16 overflow-hidden flex flex-col">
                {step === 0 ? (
                  <div className="flex flex-col h-full items-center justify-center text-center max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-12">
                      <span className="inline-block px-4 py-1.5 bg-red-50 text-[#800000] text-[11px] lg:text-[12px] tracking-[0.2em] uppercase rounded-full font-normal">
                        Career Opportunity
                      </span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight font-normal">
                        Application Form
                      </h1>
                      <p className="text-slate-500 text-base md:text-lg leading-relaxed font-normal">
                        We are looking for talented individuals to join our growing team. Start your journey by completing the multi-step form.
                      </p>
                    </motion.div>
                    
                    <StepIndicator currentStep={0} />

                    <button onClick={() => setStep(1)} className="group w-full md:w-auto px-12 py-4 bg-[#800000] text-white text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-[#600000] hover:shadow-2xl hover:shadow-red-900/30 rounded-xl font-normal">
                      Begin Application <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <StepIndicator currentStep={step} />
                    
                    <div className="mb-10 shrink-0">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 tracking-tight font-normal">
                        {steps[step - 1]}
                      </h1>
                      <p className="text-slate-400 text-sm mt-2 font-normal">Please fill in the required fields marked with an asterisk.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-thin-scroll pr-4 lg:pr-10">
                      {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                          <div className="space-y-2"><label className={labelClass}>First Name *</label><input type="text" placeholder="e.g. Juan" className={inputClass} /></div>
                          <div className="space-y-2"><label className={labelClass}>Middle Name *</label><input type="text" placeholder="e.g. Santos" className={inputClass} /></div>
                          <div className="space-y-2"><label className={labelClass}>Last Name *</label><input type="text" placeholder="e.g. Dela Cruz" className={inputClass} /></div>
                          <div className="space-y-2"><label className={labelClass}>Date of Birth *</label><input type="date" className={inputClass} /></div>
                          <div className="space-y-2"><label className={labelClass}>Place of Birth *</label><input type="text" placeholder="City / Province" className={inputClass} /></div>
                          <div className="space-y-2">
                            <label className={labelClass}>Gender *</label>
                            <select className={inputClass}>
                              <option value="">Select Option</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {(step >= 2 && step <= 4) && (
                        <div className="max-w-5xl space-y-10">
                           <h3 className={sectionHeader}>Document Upload</h3>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                              <div className="relative p-12 lg:p-20 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-red-50/30 hover:border-[#800000]/30 transition-all cursor-pointer group">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                                  <Upload className="text-[#800000]" size={32} />
                                </div>
                                <p className="text-sm uppercase tracking-widest text-slate-500 font-normal">Drag files here or click to browse</p>
                                <p className="text-xs text-slate-400 mt-2">Support: PDF, DOCX (Max 10MB)</p>
                              </div>
                              <div className="space-y-4">
                                <p className={labelClass}>Uploaded Files</p>
                                <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-between border-l-4 border-l-[#800000]">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><FileText size={20} className="text-[#800000]" /></div>
                                    <div>
                                      <p className="text-sm text-slate-700 font-normal">application-file.pdf</p>
                                      <p className="text-[10px] text-slate-400 uppercase">2.4 MB • Ready</p>
                                    </div>
                                  </div>
                                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-red-500"><X size={18} /></button>
                                </div>
                              </div>
                           </div>
                        </div>
                      )}

                      {step === 5 && (
                        <div className="max-w-4xl space-y-12">
                          <h3 className={sectionHeader}>Screening Questionnaire</h3>
                          <div className="space-y-10">
                            <div className="space-y-4">
                              <label className="text-sm lg:text-base text-slate-700 font-normal block">1. Can you describe your relevant experience for this role? *</label>
                              <textarea rows={4} className={`${inputClass} border border-slate-100 rounded-xl p-4 focus:bg-slate-50`} placeholder="Describe your background..." />
                            </div>
                            <div className="space-y-4">
                              <label className="text-sm lg:text-base text-slate-700 font-normal block">2. What is your primary motivation for joining us? *</label>
                              <textarea rows={4} className={`${inputClass} border border-slate-100 rounded-xl p-4 focus:bg-slate-50`} placeholder="Tell us why..." />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* actions */}
                    <div className="pt-8 mt-auto border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
                      <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-sm text-slate-400 uppercase tracking-widest font-normal hover:text-slate-800 transition-colors">
                        Back
                      </button>
                      <button 
                        onClick={() => step === 5 ? setShowConfirm(true) : setStep(step + 1)} 
                        className="bg-[#800000] text-white px-10 py-4 text-sm uppercase tracking-[0.2em] flex items-center gap-4 rounded-xl font-normal hover:bg-[#600000] hover:shadow-xl transition-all active:scale-95"
                      >
                        {step === 5 ? "Submit Application" : "Continue"} <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlays */}
              <AnimatePresence>
                {(showConfirm || isSuccess) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl p-10 text-center">
                      {isSuccess ? (
                        <div className="space-y-6">
                          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
                            <Check size={40} />
                          </div>
                          <h3 className="text-3xl text-slate-900 font-normal tracking-tight">Success!</h3>
                          <p className="text-slate-500 leading-relaxed font-normal">
                            Your application has been received. Our HR team will review your profile and contact you within 3-5 business days.
                          </p>
                          <button onClick={handleClose} className="w-full py-4 bg-[#800000] text-white text-sm uppercase tracking-widest rounded-xl font-normal hover:bg-[#600000] transition-all">
                            Finish
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="w-16 h-16 bg-red-50 text-[#800000] rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                          </div>
                          <h3 className="text-2xl text-slate-900 font-normal tracking-tight">Confirm Submission?</h3>
                          <p className="text-slate-500 font-normal">Please double-check all information. You won't be able to edit your application once submitted.</p>
                          <div className="flex flex-col gap-3">
                            <button onClick={() => { setShowConfirm(false); setIsSuccess(true); }} className="w-full py-4 bg-[#800000] text-white text-sm uppercase tracking-widest rounded-xl font-normal hover:bg-[#600000] transition-all shadow-lg shadow-red-900/20">
                              Yes, Submit Now
                            </button>
                            <button onClick={() => setShowConfirm(false)} className="w-full py-4 bg-white border border-slate-200 text-slate-400 text-sm uppercase tracking-widest rounded-xl font-normal hover:bg-slate-50 transition-all">
                              Review Again
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}