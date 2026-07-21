
import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  Send,
  User,
  Mail,
  Phone,
  ChevronLeft
} from "lucide-react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});
function ApplyPage() {
  const [showNav, setShowNav] = useState(false);
  const inputStyles = `
    w-full bg-white border border-gray-200 py-4 px-12 rounded-2xl
    text-[14px] text-gray-700 outline-none transition-all duration-300
    focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/5
  `;
  const labelStyles = `
    block text-[11px] font-extrabold text-[#800000] uppercase tracking-[0.15em] mb-2.5 ml-1
  `;
  return <div className={`${poppins.variable} font-sans bg-white min-h-screen pb-24`}>
      {
    /* NAVIGATION */
  }
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      {
    /* HEADER SECTION */
  }
      <div className="bg-[#262626] pt-32 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#800000]/10 rounded-full -mr-32 -mt-32" />
        
        <Link
    href="/careers"
    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors text-sm font-bold relative z-10"
  >
          <ChevronLeft size={16} />
          BACK TO CAREERS
        </Link>
        
        <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 relative z-10">
          APPLICATION FORM
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-medium relative z-10">
          Submit your professional details below to join our team.
        </p>
      </div>

      {
    /* FORM CONTAINER */
  }
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.12)] p-8 md:p-16 border border-gray-100">
          
          <form className="space-y-8">
            {
    /* NAME AND EMAIL */
  }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className={labelStyles}>FULL NAME</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#800000]" />
                  <input type="text" placeholder="Juan Dela Cruz" className={inputStyles} required />
                </div>
              </div>

              <div className="relative">
                <label className={labelStyles}>EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#800000]" />
                  <input type="email" placeholder="juan@example.com" className={inputStyles} required />
                </div>
              </div>
            </div>

            {
    /* PHONE AND POSITION */
  }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className={labelStyles}>PHONE NUMBER</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#800000]" />
                  <input type="tel" placeholder="+63 000 000 0000" className={inputStyles} required />
                </div>
              </div>

              <div className="relative">
                <label className={labelStyles}>DESIRED POSITION</label>
                <select className={`${inputStyles} appearance-none cursor-pointer px-6`}>
                  <option>Select Position</option>
                  <option>Front End Developer</option>
                  <option>Back End Developer</option>
                  <option>UI/UX Designer</option>
                </select>
              </div>
            </div>

            {
    /* UPLOAD SECTION */
  }
            <div className="relative">
              <label className={labelStyles}>UPLOAD YOUR CV</label>
              <div className="border-2 border-dashed rounded-[30px] p-16 text-center transition-all cursor-pointer border-gray-200 bg-gray-50 hover:border-[#800000]/50 relative">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-[#800000]" />
                </div>
                <p className="text-[16px] text-gray-700 font-extrabold mb-1">
                  CLICK TO UPLOAD OR DRAG FILE HERE
                </p>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                  PDF OR DOCX (MAX 5MB)
                </p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            {
    /* SUBMIT BUTTON */
  }
            <div className="pt-8 flex justify-center">
              <button
    type="submit"
    className="group flex items-center gap-4 bg-[#800000] text-white px-24 py-5 rounded-2xl shadow-xl hover:bg-[#a10000] transition-all duration-300 active:scale-95"
  >
                <span className="text-[15px] font-extrabold uppercase tracking-[0.2em]">SUBMIT APPLICATION</span>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>;
}
export {
  ApplyPage as default
};
