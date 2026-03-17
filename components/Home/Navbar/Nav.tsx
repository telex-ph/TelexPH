"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import TopBar from "./TopBar";
import { navLinks } from "@/constant/constant";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import { HiBars3BottomRight, HiChevronRight } from "react-icons/hi2";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-rubik",
  display: "swap",
});

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [navBg, setNavBg] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);  
  
  const [activeServicesTab, setActiveServicesTab] = useState("offer");
  const [activeAboutTab, setActiveAboutTab] = useState("company");
  const [activeResourcesTab, setActiveResourcesTab] = useState("learning");
  const [activeCareersTab, setActiveCareersTab] = useState("careers-center");

  const router = useRouter();
  const pathname = usePathname();

  const handleMouseEnter = (id: number) => setOpenDropdownId(id);
  const handleMouseLeave = () => setOpenDropdownId(null);

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url.startsWith("#")) {
      e.preventDefault();
      if (pathname === "/") {
        scrollToSection(url);
      } else {
        router.push("/" + url);
        setTimeout(() => scrollToSection(url), 100);
      }
    }
  };

  const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => setNavBg(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const servicesMegaData = [
    { id: "offer", label: "What We Offer", items: ["Customer Support", "Technical Helpdesk", "Sales & Lead Generation"] },
  ];

  const aboutMegaData = [
    { id: "company", label: "Company", items: ["Company Overview", "Our Mission", "Our Vision", "Core Values"] },
  ];

  const resourcesMegaData = [
    { id: "learning", label: "Resource Center", items: ["Case Studies", "Events", "Guides", "Videos", "Webinars", "White Papers"] },
    { 
      id: "news", 
      label: "Industry Use Cases", 
      items: [
        { label: "Industry Overview", url: "/resources/IndustryUseCase#overview" }, 
        { label: "Challenges & Pain Points", url: "/resources/IndustryUseCase#challenges" },
        { label: "Solutions Applied", url: "/resources/IndustryUseCase#solutions" },
        { label: "Scenarios", url: "/resources/IndustryUseCase#scenarios" },
        { label: "Benefits & Results", url: "/resources/IndustryUseCase#results" },
        { label: "Tools & Technology", url: "/resources/IndustryUseCase#tools" },
        { label: "Why Telex", url: "/resources/IndustryUseCase#why-telex" }
      ]
    },
    { 
      id: "blogs", 
      label: "Blogs", 
      items: [{ label: "Blogs Overview", url: "/resources/Blogs" }] 
    },
  ];

  const careersMegaData = [
    { id: "careers-center", label: "Careers Center", items: [{ label: "Careers Home", url: "/careers" }] },
    { id: "job-details", label: "Job Details", items: [{ label: "Full Job Details", url: "/careers/job-details" }] },
  ];

  const getMegaConfig = (label: string) => {
    if (label === "Services") return { data: servicesMegaData, active: activeServicesTab, setter: setActiveServicesTab, path: "/services" };
    if (label === "About") return { data: aboutMegaData, active: activeAboutTab, setter: setActiveAboutTab, path: "/about" };
    if (label === "Resources") return { data: resourcesMegaData, active: activeResourcesTab, setter: setActiveResourcesTab, path: "/resources" };
    if (label === "Careers") return { data: careersMegaData, active: activeCareersTab, setter: setActiveCareersTab, path: "/careers" };
    return null;
  };

  return (
    <nav className={`fixed w-full z-[1000] top-0 ${poppins.variable} ${openSans.variable} ${rubik.variable}`}>
      <TopBar />
      <div className={`relative bg-white transition-all duration-300 ${navBg ? "shadow-md" : ""}`}>
        <div className="relative h-[80px] flex items-stretch">
          <div className="bg-gray-800 flex items-center justify-center h-full relative z-10 px-4 sm:px-8 w-auto lg:w-[350px]">
            <Image src="/images/Weblogo.webp" alt="Logo" width={250} height={50} className="object-contain" priority />
          </div>
          <div className="h-full z-30 w-[60px] -ml-[30px] relative hidden lg:block">
            <div className="absolute top-0 left-0 w-full h-full bg-[#a10000]" style={{ clipPath: "polygon(50% 0, 100% 0, 50% 100%, 0 100%)" }} />
          </div>
          <div className="flex flex-grow items-center justify-end h-full pl-4 pr-4 sm:pl-6 sm:pr-8">
            <div className="hidden lg:flex items-center space-x-6 h-full">
              {navLinks.map((link) => {
                const megaConfig = getMegaConfig(link.label);
                return (
                  <div key={link.id} className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter(link.id)} onMouseLeave={handleMouseLeave}>
                    <Link href={link.url} onClick={(e) => handleScrollClick(e, link.url)} className="relative py-[30px] flex items-center group">
                      <span className="text-gray-700 font-open-sans-bold text-sm uppercase tracking-wide transition-colors hover:text-[#a10000]">
                        {link.label}
                      </span>
                    </Link>
                    {megaConfig && openDropdownId === link.id && (
                      <div className="absolute top-full left-0 mt-[-2px] bg-white border-t-2 border-[#a10000] shadow-xl min-w-[550px] z-20 rounded-b-lg flex overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="w-[40%] bg-[#f8fafc] px-6 py-6 border-r border-gray-200 flex flex-col font-poppins">
                          <h3 className="text-[#a10000] font-bold text-[11px] uppercase tracking-widest border-b border-[#a10000]/20 pb-2 mb-4">
                            Explore {link.label}
                          </h3>
                          <div className="flex flex-col space-y-2">
                            {megaConfig.data.map((cat) => (
                              <div key={cat.id} onMouseEnter={() => megaConfig.setter(cat.id)} className={`cursor-pointer transition-all duration-200 text-[13px] flex items-center justify-between py-1.5 px-2 rounded ${megaConfig.active === cat.id ? "text-[#a10000] bg-white shadow-sm font-medium" : "text-gray-500 hover:text-[#a10000]"}`}>
                                <span>{cat.label}</span>
                                <HiChevronRight className={`w-3.5 h-3.5 transition-transform ${megaConfig.active === cat.id ? "translate-x-1" : "opacity-0"}`} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-[60%] px-8 py-6 bg-white flex flex-col font-poppins">
                          <h3 className="text-[#a10000] font-bold text-[11px] uppercase tracking-widest border-b border-[#a10000]/20 pb-2">
                            {megaConfig.data.find(c => c.id === megaConfig.active)?.label}
                          </h3>
                          <div className="flex flex-col space-y-3 mt-4">
                            {megaConfig.data.find(c => c.id === megaConfig.active)?.items.map((item, i) => {
                              const label = typeof item === 'string' ? item : item.label;
                              const url = typeof item === 'string' ? megaConfig.path : item.url;
                              
                              return (
                                <Link key={i} href={url} className="text-[13px] transition-colors py-0.5 w-fit text-gray-500 hover:text-[#a10000] font-normal">
                                  {label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-8 ml-auto">
              <button onClick={() => router.push("/contact")} className="hidden lg:block bg-[#a10000] hover:bg-red-700 text-white px-6 py-2.5 text-sm font-open-sans-bold transition-colors rounded">
                CONTACT US
              </button>
              <button onClick={openNav} className="lg:hidden text-gray-700 p-2"><HiBars3BottomRight className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;