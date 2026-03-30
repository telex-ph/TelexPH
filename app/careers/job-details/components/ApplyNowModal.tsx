"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, User, Mail, Phone, Briefcase, MessageSquare, Layers, AlertCircle, MapPin, Upload, FileText, Check, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  jobDept?: string;
}

export default function ApplyNowModal({ isOpen, onClose, jobTitle, jobDept }: ApplyNowModalProps) {
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
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all duration-300 ${
                isActive ? "bg-[#800000] border-[#800000] text-white shadow-lg shadow-red-900/20" : "bg-white border-slate-300 text-slate-400"
              }`}>
                {i + 1}
              </div>
              <span className={`hidden md:block text-[11px] tracking-normal uppercase ${isActive ? "text-[#800000]" : "text-slate-400"}`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const inputClass = "w-full border-b border-slate-200 bg-transparent px-0 py-1 text-[13px] text-slate-800 outline-none focus:border-[#800000] transition-all placeholder:text-slate-300 tracking-normal font-normal";
  const labelClass = "text-[11px] text-slate-500 flex items-center gap-2 tracking-normal font-normal";
  const sectionHeader = "text-[12px] text-slate-900 border-l-2 border-[#800000] pl-2 mb-4 mt-2 tracking-normal font-normal";

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-x-0 bottom-0 top-[130px] z-[9999] flex items-start justify-center px-4 pt-0 pb-4 ${poppins.className}`}>
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
            className="relative w-full max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-xl"
            style={{ height: "700px", maxHeight: "calc(100vh - 130px - 20px)" }}
          >
            {/* sidebar section */}
            <div className="w-full md:w-[280px] bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-row md:flex-col justify-between shrink-0 z-10">
              <div className="flex flex-col gap-4 md:gap-8">
                <div className="bg-white p-3 rounded-xl shadow-sm self-start">
                  <img src="/images/logo.png" alt="logo" className="h-7 w-auto object-contain" />
                </div>
                <div>
                  <span className="inline-block text-[#800000] text-[10px] font-bold tracking-[0.2em] uppercase underline underline-offset-2 mb-2">
                    {jobDept}
                  </span>
                  <h2 className="text-xl text-slate-800 leading-tight tracking-normal font-normal">
                    {(jobTitle ?? "").split(" ").slice(0, -1).join(" ")}{" "}
                    <br className="hidden md:block" />
                    <span className="text-[#800000]">{(jobTitle ?? "").split(" ").slice(-1)[0]}</span>
                  </h2>
                  <p className="hidden md:block text-slate-400 text-[12px] mt-3 leading-relaxed font-normal tracking-normal">
                    Professional application gateway. Please ensure all data provided is current and verifiable.
                  </p>
                </div>
              </div>

              <div className="hidden md:block space-y-4">
                <div>
                  <h4 className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Office</h4>
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

              <button onClick={handleClose} className="md:hidden text-slate-400 p-2">
                <X size={28} />
              </button>
            </div>

            {/* main section */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              <button onClick={handleClose} className="hidden md:flex absolute top-6 right-6 text-slate-300 hover:text-[#800000] transition-colors z-[140] w-8 h-8 items-center justify-center rounded-full hover:bg-slate-50">
                <X size={20} />
              </button>

              <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col">
                {step === 0 ? (
                  <div className="flex flex-col h-full items-center justify-center text-center max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-8">
                      <span className="inline-block px-4 py-1.5 bg-red-50 text-[#800000] text-[11px] tracking-[0.2em] uppercase rounded-full font-normal">
                        Career Opportunity
                      </span>
                      <h1 className="text-2xl md:text-3xl text-slate-900 tracking-tight font-normal">
                        Application Form
                      </h1>
                      <p className="text-slate-500 text-[13px] leading-relaxed font-normal">
                        We are looking for talented individuals to join our growing team. Start your journey by completing the multi-step form.
                      </p>
                    </motion.div>
                    
                    <StepIndicator currentStep={0} />

                    <button onClick={() => setStep(1)} className="group w-full md:w-auto px-8 py-3 bg-[#800000] text-white text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-[#600000] hover:shadow-xl hover:shadow-red-900/30 rounded-md font-normal">
                      Begin Application <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <StepIndicator currentStep={step} />
                    
                    <div className="mb-6 shrink-0">
                      <h1 className="text-xl text-slate-900 tracking-normal font-normal">
                        {steps[step - 1]}
                      </h1>
                      <p className="text-slate-400 text-[12px] mt-1 font-normal tracking-normal">Please fill in the required fields marked with an asterisk.</p>
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
                              <div className="relative p-8 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-red-50/30 hover:border-[#800000]/30 transition-all cursor-pointer group">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                                  <Upload className="text-[#800000]" size={22} />
                                </div>
                                <p className="text-[12px] uppercase tracking-widest text-slate-500 font-normal">Drag files here or click to browse</p>
                                <p className="text-[11px] text-slate-400 mt-1">Support: PDF, DOCX (Max 10MB)</p>
                              </div>
                              <div className="space-y-4">
                                <p className={labelClass}>Uploaded Files</p>
                                <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-between border-l-4 border-l-[#800000]">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><FileText size={20} className="text-[#800000]" /></div>
                                    <div>
                                      <p className="text-[13px] text-slate-700 font-normal">application-file.pdf</p>
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
                              <label className="text-[13px] text-slate-700 font-normal block">1. Can you describe your relevant experience for this role? *</label>
                              <textarea rows={4} className={`${inputClass} border border-slate-100 rounded-xl p-4 focus:bg-slate-50`} placeholder="Describe your background..." />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[13px] text-slate-700 font-normal block">2. What is your primary motivation for joining us? *</label>
                              <textarea rows={4} className={`${inputClass} border border-slate-100 rounded-xl p-4 focus:bg-slate-50`} placeholder="Tell us why..." />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* actions */}
                    <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
                      <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-[12px] text-slate-400 uppercase tracking-widest font-normal hover:text-slate-800 transition-colors">
                        Back
                      </button>
                      <button 
                        onClick={() => step === 5 ? setShowConfirm(true) : setStep(step + 1)} 
                        className="bg-[#800000] text-white px-8 py-3 text-[12px] uppercase tracking-widest flex items-center gap-3 rounded-md font-normal hover:bg-[#600000] hover:shadow-xl transition-all active:scale-95"
                      >
                        {step === 5 ? "Submit Application" : "Continue"} <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlays */}
              <AnimatePresence>
                {(showConfirm || isSuccess) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[150] flex items-center justify-center p-8 bg-white/95 backdrop-blur-md">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-[340px]">
                      {isSuccess ? (
                        <div className="bg-white border border-slate-100 shadow-xl p-8 text-center rounded-md">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-md flex items-center justify-center mx-auto mb-5 border border-green-100">
                            <Check size={20} />
                          </div>
                          <h3 className="text-xl text-slate-900 font-normal tracking-tight mb-2">Success!</h3>
                          <p className="text-[13px] text-slate-500 mb-8 leading-relaxed font-normal">
                            Your application has been received. Our HR team will review your profile and contact you within 3-5 business days.
                          </p>
                          <button onClick={handleClose} className="w-full py-3.5 bg-[#800000] text-white text-[12px] uppercase tracking-widest rounded-md font-normal hover:bg-[#600000] transition-all">
                            Finish
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-100 shadow-2xl p-8 rounded-md overflow-hidden relative">
                          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="w-9 h-9 bg-red-50 rounded-md flex items-center justify-center">
                              <AlertCircle size={18} className="text-[#800000]" />
                            </div>
                            <h3 className="text-lg text-slate-900 font-normal tracking-tight">Confirm Submission?</h3>
                          </div>
                          <p className="text-[13px] text-slate-500 font-normal mb-8">Please double-check all information. You won't be able to edit your application once submitted.</p>
                          <div className="flex gap-3">
                            <button onClick={() => { setShowConfirm(false); setIsSuccess(true); }} className="flex-1 py-3 bg-[#800000] text-white text-[11px] uppercase tracking-widest rounded-md font-normal hover:bg-[#600000] transition-all shadow-lg shadow-red-900/20">
                              Yes, Submit Now
                            </button>
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-white border border-slate-200 text-[11px] uppercase tracking-widest text-slate-400 rounded-md font-normal hover:bg-slate-50 transition-all">
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

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}