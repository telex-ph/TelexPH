"use client";

import React, { useState } from "react";
import { X, Calendar, Upload, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Open_Sans, Poppins } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });
const poppinsFont = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"] 
});

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
    "personal info",
    "curriculum vitae",
    "cover letter",
    "portfolio",
    "screening"
  ];

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="mb-2 shrink-0">
            <p className={`text-[#800000] text-[13px] tracking-widest uppercase ${poppinsFont.className}`}>
              <b>step 1 of 5 :</b>
            </p>
          </div>
          <div className="bg-[#f3f3f3] p-2.5 mb-2 rounded-t-sm border-l-4 border-[#800000] shrink-0">
            <h4 className={`text-[#1a1a1a] tracking-widest uppercase text-sm ${poppinsFont.className}`}>
              <b>personal information applicant <span className="text-red-600">*</span></b>
            </h4>
          </div>
          <div className="px-3 mb-4 shrink-0">
            <p className={`text-gray-500 text-[11px] italic tracking-wider leading-relaxed ${poppinsFont.className}`}>
              reminder: ensure all details are accurate, complete, and match your official documents.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar pr-2">
            <div className="space-y-8 pt-4 pb-8">
              <section>
                <div className="relative inline-block mb-6">
                  <h4 className="text-lg text-[#1a1a1a] tracking-tight uppercase leading-none"><b>personal details</b></h4>
                  <div className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-[#800000]"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#333]"><b>first name *</b></label>
                    <input type="text" placeholder="Enter your First Name" className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm italic outline-none focus:border-[#800000]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#333]"><b>middle name *</b></label>
                    <input type="text" placeholder="Enter your Middle Name" className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm italic outline-none focus:border-[#800000]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#333]"><b>last name *</b></label>
                    <input type="text" placeholder="Enter your Last Name" className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm italic outline-none focus:border-[#800000]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#333]"><b>date of birth *</b></label>
                    <div className="relative">
                      <input type="text" placeholder="DD/MM/YY" className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm italic outline-none focus:border-[#800000]" />
                      <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#333]"><b>place of birth *</b></label>
                    <select className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm italic text-gray-400 bg-white outline-none focus:border-[#800000]">
                      <option>Enter your Birth Place</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#333]"><b>gender *</b></label>
                    <select className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm italic text-gray-400 bg-white outline-none focus:border-[#800000]">
                      <option>Male / Female</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
            <button onClick={() => setStep(0)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors"><b>back</b></button>
            <button onClick={() => setStep(2)} className="px-10 py-2.5 bg-[#800000] text-white rounded uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors"><b>next</b></button>
          </div>
        </div>
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
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="mb-2 shrink-0">
            <p className={`text-[#800000] text-[13px] tracking-widest uppercase ${poppinsFont.className}`}>
              <b>step {step} of 5 :</b>
            </p>
          </div>
          <div className="bg-[#f3f3f3] p-2.5 mb-2 rounded-t-sm border-l-4 border-[#800000] shrink-0">
            <h4 className={`text-[#1a1a1a] tracking-widest uppercase text-sm ${poppinsFont.className}`}>
              <b>{config.title} <span className="text-red-600">*</span></b>
            </h4>
          </div>
          <div className="px-3 mb-4 shrink-0">
            <p className={`text-gray-500 text-[11px] italic tracking-wider leading-relaxed ${poppinsFont.className}`}>
              {config.reminder}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar pt-4 px-1">
            <div className="relative inline-block mb-8">
              <h5 className="text-lg text-[#1a1a1a] tracking-tight uppercase leading-none"><b>{config.uploadLabel} *</b></h5>
              <div className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-[#800000]"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center space-y-5 bg-gray-50/30">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <Upload className="text-[#800000]" size={28} />
                </div>
                <div className="space-y-1">
                  <p className="text-[#1a1a1a] font-bold text-xs uppercase tracking-widest">choose a file or drag & drop it here</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">jpeg, png, pdf, and mp4 formats, up to 50mb</p>
                </div>
                <button className="mt-2 px-10 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-sm">
                  browse file
                </button>
              </div>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-5 bg-[#fffafa] p-5 rounded-[24px] border border-[#f5eeee] relative group shadow-sm">
                    <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                      <FileText className="text-[#800000]" size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1a1a1a] font-bold text-sm truncate uppercase tracking-tight">{config.fileName}</p>
                      <p className="text-gray-400 text-[10px] uppercase font-medium">1.4mb</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-300 hover:text-red-500">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
            <button onClick={() => setStep(step - 1)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors"><b>back</b></button>
            <button onClick={() => setStep(step + 1)} className="px-10 py-2.5 bg-[#800000] text-white rounded uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors"><b>next</b></button>
          </div>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="mb-2 shrink-0">
            <p className={`text-[#800000] text-[13px] tracking-widest uppercase ${poppinsFont.className}`}>
              <b>step 5 of 5 :</b>
            </p>
          </div>
          <div className="bg-[#f3f3f3] p-2.5 mb-2 rounded-t-sm border-l-4 border-[#800000] shrink-0">
            <h4 className={`text-[#1a1a1a] tracking-widest uppercase text-sm ${poppinsFont.className}`}>
              <b>screening question <span className="text-red-600">*</span></b>
            </h4>
          </div>
          <div className="px-3 mb-4 shrink-0">
            <p className={`text-gray-500 text-[11px] italic tracking-wider leading-relaxed ${poppinsFont.className}`}>
              reminder: answer all questions honestly and thoughtfully, as they are used to assess your qualifications and fit for the position.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar pt-4 px-1">
            <div className="relative inline-block mb-8">
              <h5 className="text-lg text-[#1a1a1a] tracking-tight uppercase leading-none"><b>screening questions *</b></h5>
              <div className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-[#800000]"></div>
            </div>
            
            <div className="space-y-8 max-w-4xl pb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest">do you have prior experience related to this position?</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest">what is your highest level of education completed?</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest">are you willing to undergo background checks or assessments?</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#800000]" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 py-4 shrink-0 mt-auto border-t border-gray-100">
            <button onClick={() => setStep(4)} className="px-8 py-2.5 bg-[#b5b5b5] text-black rounded uppercase text-[10px] tracking-widest shadow-sm hover:bg-gray-300 transition-colors"><b>back</b></button>
            <button onClick={() => setShowConfirm(true)} className="px-10 py-2.5 bg-[#800000] text-white rounded uppercase text-[10px] tracking-widest shadow-md hover:bg-[#600000] transition-colors"><b>submit</b></button>
          </div>
        </div>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${openSans.className}`}>
          <style jsx global>{`
            .thin-scrollbar::-webkit-scrollbar { width: 3px; }
            .thin-scrollbar::-webkit-scrollbar-track { background: transparent; margin-block: 20px; }
            .thin-scrollbar::-webkit-scrollbar-thumb { background: #80000020; border-radius: 20px; }
            .thin-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
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
                  <img src="/images/logo.png" alt="telex logo" className="hidden sm:block h-14 w-auto object-contain" />
                )}
              </div>

              {step === 0 ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    <div className="space-y-4 mb-8">
                      <div className="inline-block bg-[#800000] text-white text-[10px] px-4 py-1 rounded-full uppercase tracking-widest">
                        <b>technology</b>
                      </div>
                      <h2 className="text-3xl md:text-4xl text-[#1a1a1a] tracking-tighter">
                        <b>FRONT-END <span className="text-[#800000]">DEVELOPER</span></b>
                      </h2>
                      <div className="flex items-center gap-2 text-[#282828] text-sm italic">
                        <span className="text-[#800000]">📍</span>
                        cawayan bugtong, guimba, nueva ecija
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="text-center mb-10">
                        <h3 className="text-3xl md:text-4xl text-[#1a1a1a] tracking-tighter uppercase leading-none"><b>application</b></h3>
                        <h3 className="text-3xl md:text-4xl text-[#800000] tracking-tighter uppercase"><b>form</b></h3>
                        <p className="max-w-2xl mx-auto text-[#282828] text-xs italic mt-6 leading-relaxed">
                          please complete the application form below by providing accurate and up-to-date personal and contact information. all submitted details will be used solely for reviewing your application and contacting you regarding the next steps.
                        </p>
                      </div>

                      <div className="relative max-w-5xl mx-auto mb-12 px-4">
                        <div className="absolute top-[12px] left-10 right-10 h-[1px] bg-[#800000] opacity-10 z-0"></div>
                        <div className="relative flex justify-between gap-2 z-10">
                          {steps.map((s, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 flex-1">
                              <div className="w-7 h-7 rounded-full bg-[#800000] shadow-[0_0_0_4px_white] flex items-center justify-center text-white text-[12px]">
                                <b>{i + 1}</b>
                              </div>
                              <span className="text-[11px] text-[#1a1a1a] uppercase text-center leading-tight tracking-tight"><b>{s}</b></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 py-4 shrink-0 mt-auto">
                    <button onClick={handleClose} className="px-10 py-2.5 bg-[#b5b5b5] text-black rounded-lg uppercase text-xs tracking-widest transition-all hover:bg-gray-300"><b>cancel</b></button>
                    <button onClick={() => setStep(1)} className="px-12 py-2.5 bg-[#800000] text-white rounded-lg uppercase text-xs tracking-widest shadow-lg transition-all hover:bg-[#600000]"><b>start</b></button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="relative max-w-5xl mx-auto mb-10 w-full px-4 shrink-0">
                    <div className="absolute top-[16px] left-14 right-14 h-[1px] bg-[#800000] opacity-10 z-0"></div>
                    <div className="relative flex justify-between gap-2 z-10">
                      {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] border-[3px] border-white shadow-sm transition-colors ${i < step ? "bg-[#800000] text-white" : i === (step - 1) ? "bg-[#800000] text-white ring-4 ring-[#800000]/10" : "bg-[#b5b5b5] text-white"}`}>
                            <b>{i + 1}</b>
                          </div>
                          <span className={`text-[11px] uppercase text-center leading-tight tracking-tight ${i === (step - 1) ? "text-[#1a1a1a]" : "text-gray-400"}`}><b>{s}</b></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {renderStepContent()}
                </div>
              )}
            </div>

            {/* overlays confirmation & success */}
            <AnimatePresence>
              {showConfirm && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center">
                    <div className="mb-2"><img src="/images/logo.png" alt="telex logo" className="h-[70px] w-auto object-contain" /></div>
                    <div className="w-[85%] h-[1px] bg-[#80000010] mb-8"></div>
                    <h3 className="text-[32px] text-[#1a1a1a] mb-2 leading-tight tracking-tight"><b>confirm submission</b></h3>
                    <p className="text-gray-400 text-[16px] mb-12 px-4 italic">once submitted, your application will be sent for review.</p>
                    <div className="flex w-full gap-4 px-2">
                      <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-[#d4d4d4] text-black uppercase text-[13px] tracking-widest rounded-[18px] hover:bg-gray-300 transition-all active:scale-95"><b>cancel</b></button>
                      <button onClick={handleFinalSubmit} className="flex-1 py-4 bg-[#800000] text-white uppercase text-[13px] tracking-widest rounded-[18px] shadow-lg hover:bg-[#600000] transition-all active:scale-95"><b>submit</b></button>
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
                    <div className="w-20 h-20 bg-[#800000] rounded-full flex items-center justify-center shadow-lg shadow-[#800000]/30 mb-6">
                      <Check className="text-white" size={48} strokeWidth={4} />
                    </div>
                    <div className="w-[85%] h-[1px] bg-[#80000010] mb-8"></div>
                    <h3 className="text-[32px] text-[#1a1a1a] mb-2 leading-tight tracking-tight"><b>we&apos;ve received your application!</b></h3>
                    <p className="text-gray-400 text-[16px] mb-12 px-4 italic">we will process it and reach out to you in a days.</p>
                    <div className="flex w-full px-2">
                      <button onClick={handleClose} className="flex-1 py-4 bg-[#800000] text-white uppercase text-[13px] tracking-widest rounded-[18px] shadow-lg hover:bg-[#600000] transition-all active:scale-95"><b>done</b></button>
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