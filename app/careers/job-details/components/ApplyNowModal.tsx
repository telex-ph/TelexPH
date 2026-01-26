"use client";

import React, { useState } from "react";
import { X, Calendar, Upload, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });

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

  const handleFinalSubmit = () => {
    setShowConfirm(false);
    setIsSuccess(true);
  };

  const steps = [
    "personal information",
    "curriculum vitae",
    "cover letter",
    "portfolio",
    "screening question"
  ];

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <div className="mb-4 shrink-0">
            <p className={`text-[#1a1a1a] font-extrabold text-[12px] tracking-widest uppercase ${openSans.className}`}>
              step 1 of 5 :
            </p>
          </div>

          <div className="bg-[#f3f3f3] p-3 mb-1 rounded-t-sm border-l-4 border-[#800000] shrink-0">
            <h4 className="text-[#1a1a1a] font-black tracking-widest uppercase text-sm">personal information applicant <span className="text-red-600">*</span></h4>
          </div>
          <div className="bg-white p-2 mb-4 border-b border-gray-100 shrink-0">
            <p className="text-gray-400 text-[9px] italic uppercase leading-none">reminder: ensure all details are accurate, complete, and match your official documents.</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div className="space-y-6 pt-2 pb-6">
              <h5 className="text-[#1a1a1a] font-bold border-b-2 border-[#800000] inline-block pr-6 pb-0.5 text-[11px] tracking-widest uppercase">personal details</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#1a1a1a]">first name <span className="text-red-600">*</span></label>
                  <input type="text" placeholder="Enter your First Name" className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#800000] text-xs italic" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#1a1a1a]">middle name <span className="text-red-600">*</span></label>
                  <input type="text" placeholder="Enter your Middle Name" className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#800000] text-xs italic" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#1a1a1a]">last name <span className="text-red-600">*</span></label>
                  <input type="text" placeholder="Enter your Last Name" className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#800000] text-xs italic" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#1a1a1a]">date of birth <span className="text-red-600">*</span></label>
                  <div className="relative">
                    <input type="text" placeholder="DD/MM/YY" className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#800000] text-xs italic" />
                    <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#1a1a1a]">place of birth <span className="text-red-600">*</span></label>
                  <select className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#800000] text-xs italic text-gray-400 bg-white">
                    <option>Enter your Birth Place</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#1a1a1a]">gender <span className="text-red-600">*</span></label>
                  <select className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#800000] text-xs italic text-gray-400 bg-white">
                    <option>Male / Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto">
            <button onClick={() => setStep(0)} className="px-8 py-2 bg-[#b5b5b5] text-black rounded font-medium uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors">back</button>
            <button onClick={() => setStep(2)} className="px-10 py-2 bg-[#800000] text-white rounded font-medium uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors">next</button>
          </div>
        </>
      );
    }

    if (step === 2 || step === 3 || step === 4) {
      const stepConfigs = {
        2: { title: "resume / curriculum vitae", uploadLabel: "upload curriculum vitae", reminder: "reminder: attach a link to your most recent cv, making sure it includes updated work experience, skills, and contact details.", fileName: "my-cv.pdf" },
        3: { title: "cover letter", uploadLabel: "upload cover letter", reminder: "reminder: provide a clear and updated link to your cover letter that highlights your interest and suitability for the position.", fileName: "my-coverletter.pdf" },
        4: { title: "portfolio", uploadLabel: "upload portfolio", reminder: "reminder: please provide a link to your portfolio or work samples that demonstrate your skills and experience relevant to this position.", fileName: "my-portfolio.pdf" }
      };
      const config = stepConfigs[step as 2 | 3 | 4];

      return (
        <>
          <div className="mb-4 shrink-0">
            <p className={`text-[#1a1a1a] font-extrabold text-[12px] tracking-widest uppercase ${openSans.className}`}>
              step {step} of 5 :
            </p>
          </div>

          <div className="bg-[#f3f3f3] p-3 mb-1 rounded-t-sm border-l-4 border-[#800000] shrink-0">
            <h4 className="text-[#1a1a1a] font-black tracking-widest uppercase text-sm">{config.title} <span className="text-red-600">*</span></h4>
          </div>
          <div className="bg-white p-2 mb-4 border-b border-gray-100 shrink-0">
            <p className="text-gray-400 text-[9px] italic uppercase leading-none">{config.reminder}</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 px-1" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <h5 className="text-[#1a1a1a] font-bold border-b-2 border-[#800000] inline-block pr-6 pb-0.5 text-[11px] tracking-widest uppercase mb-8">{config.uploadLabel} <span className="text-red-600 ml-1">*</span></h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <Upload className="text-gray-400" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[#1a1a1a] font-bold text-xs uppercase tracking-tight">choose a file or drag & drop it here</p>
                  <p className="text-gray-400 text-[10px] uppercase">jpeg, png, pdf, and mp4 formats, up to 50mb</p>
                </div>
                <button className="mt-2 px-8 py-2 border border-gray-300 rounded-lg text-gray-600 font-bold text-[11px] uppercase tracking-wider hover:bg-gray-50 transition-colors">
                  browse file
                </button>
              </div>

              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#fff8f8] p-4 rounded-2xl border border-[#f0e0e0] relative group">
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                      <FileText className="text-[#800000]" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1a1a1a] font-bold text-xs truncate uppercase tracking-tight">{config.fileName}</p>
                      <p className="text-gray-400 text-[10px] uppercase">1.4mb</p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto">
            <button onClick={() => setStep(step - 1)} className="px-8 py-2 bg-[#b5b5b5] text-black rounded font-medium uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors">back</button>
            <button onClick={() => setStep(step + 1)} className="px-10 py-2 bg-[#800000] text-white rounded font-medium uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors">next</button>
          </div>
        </>
      );
    }

    if (step === 5) {
      return (
        <>
          <div className="mb-4 shrink-0">
            <p className={`text-[#1a1a1a] font-extrabold text-[12px] tracking-widest uppercase ${openSans.className}`}>
              step 5 of 5 :
            </p>
          </div>

          <div className="bg-[#f3f3f3] p-3 mb-1 rounded-t-sm border-l-4 border-[#800000] shrink-0">
            <h4 className="text-[#1a1a1a] font-black tracking-widest uppercase text-sm">screening question <span className="text-red-600">*</span></h4>
          </div>
          <div className="bg-white p-2 mb-4 border-b border-gray-100 shrink-0">
            <p className="text-gray-400 text-[9px] italic uppercase leading-none">reminder: answer all questions honestly and thoughtfully, as they are used to assess your qualifications and fit for the position.</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 px-1" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <h5 className="text-[#1a1a1a] font-bold border-b-2 border-[#800000] inline-block pr-6 pb-0.5 text-[11px] tracking-widest uppercase mb-8">screening question <span className="text-red-600 ml-1">*</span></h5>
            
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-tight">do you have prior experience related to this position?</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#800000] text-sm" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-tight">what is your highest level of education completed?</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#800000] text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-tight">are you willing to undergo background checks or assessments?</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#800000] text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto">
            <button onClick={() => setStep(4)} className="px-8 py-2 bg-[#b5b5b5] text-black rounded font-medium uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors">back</button>
            <button onClick={() => setShowConfirm(true)} className="px-10 py-2 bg-[#800000] text-white rounded font-medium uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors">submit</button>
          </div>
        </>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${openSans.className}`}>
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
            {/* overlays: confirmation & success */}
            <AnimatePresence>
              {showConfirm && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6"
                  >
                    <img src="/images/logo.png" alt="telex logo" className="h-16 w-auto object-contain" />
                    <div className="w-full h-px bg-[#800000] opacity-20"></div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight">confirm submission</h3>
                      <p className="text-gray-500 text-sm italic leading-relaxed">once submitted, your application will be sent for review.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full pt-4">
                      <button onClick={() => setShowConfirm(false)} className="py-3 bg-[#d4d4d4] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-gray-300 transition-colors">cancel</button>
                      <button onClick={handleFinalSubmit} className="py-3 bg-[#800000] text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-colors">submit</button>
                    </div>
                  </motion.div>
                </div>
              )}

              {isSuccess && (
                <div className="absolute inset-0 z-[130] flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-[#800000] rounded-full flex items-center justify-center shadow-lg shadow-[#800000]/30">
                      <Check className="text-white" size={48} strokeWidth={4} />
                    </div>
                    
                    <div className="w-full h-px bg-[#800000] opacity-20"></div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight">we&apos;ve received your application!</h3>
                      <p className="text-gray-500 text-sm italic leading-relaxed">we will process it and reach out to you in a days.</p>
                    </div>

                    <button 
                      onClick={handleClose}
                      className="w-full py-4 bg-[#800000] text-white font-black uppercase text-sm tracking-[0.2em] rounded-xl shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-colors"
                    >
                      done
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="w-full h-1.5 bg-[#800000] shrink-0"></div>
            
            <div className="p-8 md:p-10 flex-1 flex flex-col overflow-hidden relative">
              <div className="absolute top-5 right-8 flex flex-col items-end gap-3 z-20">
                <button 
                  onClick={handleClose}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X size={28} />
                </button>
                {step === 0 && (
                  <img src="/images/logo.png" alt="telex logo" className="h-14 w-auto object-contain" />
                )}
              </div>

              {step === 0 ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    <div className="space-y-4 mb-8">
                      <div className="inline-block bg-[#800000] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                        technology
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] tracking-tighter">
                        FRONT-END <span className="text-[#800000]">DEVELOPER</span>
                      </h2>
                      <div className="flex items-center gap-2 text-[#282828] text-sm italic">
                        <span className="text-[#800000]">📍</span>
                        cawayan bugtong, guimba, nueva ecija
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="text-center mb-10">
                        <h3 className="text-3xl md:text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase leading-none">
                          application
                        </h3>
                        <h3 className="text-3xl md:text-4xl font-black text-[#800000] tracking-tighter uppercase">
                          form
                        </h3>
                        <p className="max-w-2xl mx-auto text-[#282828] text-xs italic mt-6 leading-relaxed">
                          please complete the application form below by providing accurate and up-to-date personal and contact information. all submitted details will be used solely for reviewing your application and contacting you regarding the next steps.
                        </p>
                      </div>

                      <div className="relative max-w-4xl mx-auto mb-12 px-4">
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
                    <button onClick={handleClose} className="px-10 py-2.5 bg-[#b5b5b5] text-black rounded-lg font-medium uppercase text-xs tracking-widest transition-all hover:bg-gray-300">cancel</button>
                    <button onClick={() => setStep(1)} className="px-12 py-2.5 bg-[#800000] text-white rounded-lg font-medium uppercase text-xs tracking-widest shadow-lg transition-all hover:bg-[#600000]">start</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="relative max-w-4xl mx-auto mb-10 w-full px-4 shrink-0">
                    <div className="absolute top-[16px] left-14 right-14 h-[1.5px] bg-[#800000] opacity-20 z-0"></div>
                    <div className="relative flex justify-between gap-2 z-10">
                      {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] border-[3px] border-white shadow-sm transition-colors ${i < step ? "bg-[#800000] text-white" : i === (step - 1) ? "bg-[#800000] text-white ring-4 ring-[#800000]/10" : "bg-[#b5b5b5] text-white"}`}>
                            {i + 1}
                          </div>
                          <span className={`text-[13px] uppercase text-center leading-tight tracking-tight ${i === (step - 1) ? "font-bold text-[#1a1a1a]" : "font-normal text-gray-400"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {renderStepContent()}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}