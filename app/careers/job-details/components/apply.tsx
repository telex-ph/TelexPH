"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Upload, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ChevronLeft 
} from "lucide-react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";

export default function ApplyPage() {
  const [showNav, setShowNav] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputStyles = `
    w-full bg-white border border-gray-200 py-4 px-12 rounded-2xl
    text-[14px] text-gray-700 outline-none transition-all duration-300
    focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5
  `;

  const labelStyles = `
    block text-[11px] font-extrabold text-[#800000] uppercase tracking-[0.15em] mb-2.5 ml-1
  `;

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main className="pt-[120px] pb-24">
        {/* HEADER */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <Link 
            href="/careers" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#800000] mb-6 transition-colors text-sm font-bold"
          >
            <ChevronLeft size={16} />
            BACK TO CAREERS
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a191c] uppercase tracking-tighter">
            Application Form
          </h1>
          <div className="h-1.5 w-20 bg-[#800000] mt-4"></div>
        </div>

        {/* FORM CARD */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.08)] p-8 md:p-16 border border-gray-50">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className={labelStyles}>Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#800000]" />
                    <input type="text" placeholder="Juan Dela Cruz" className={inputStyles} required />
                  </div>
                </div>
                <div className="relative">
                  <label className={labelStyles}>Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#800000]" />
                    <input type="email" placeholder="juan@example.com" className={inputStyles} required />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className={labelStyles}>Upload Resume / CV</label>
                <div 
                  className={`
                    border-2 border-dashed rounded-[30px] p-16 text-center transition-all cursor-pointer
                    ${dragActive ? "border-[#800000] bg-[#800000]/5" : "border-gray-100 bg-gray-50 hover:border-[#800000]/30"}
                  `}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
                >
                  <Upload size={32} className="text-[#800000] mx-auto mb-4" />
                  <p className="text-[16px] text-gray-700 font-bold">Drag and drop your file here</p>
                  <p className="text-[12px] text-gray-400 uppercase mt-1">PDF or DOCX (Max 5MB)</p>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button 
                  type="submit"
                  className="bg-[#800000] text-white px-20 py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl hover:bg-[#600000] transition-all active:scale-95"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}