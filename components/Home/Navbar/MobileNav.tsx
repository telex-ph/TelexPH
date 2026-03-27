"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { navLinks } from "@/constant/constant";
import { RiCloseFill } from "react-icons/ri";
import { HiChevronDown } from "react-icons/hi";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

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
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  const [openMainId, setOpenMainId] = useState<number | null>(null);
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const servicesMegaData = [
    { 
      id: "offer", 
      label: "What We Offer", 
      items: [
        { label: "Our Services", url: "/services#our-services" },
        { label: "Contact Us", url: "/services#contact" },
        { label: "Our Works", url: "/services#our-works" },
        { label: "Testimonials", url: "/services#testimonials" }
      ] 
    },
  ];

  const aboutMegaData = [
    { 
      id: "company", 
      label: "Company", 
      items: [
        { label: "Company Overview", url: "/about#overview" },
        { label: "Mission, Vision & Values", url: "/about#mission-vision" },
        { label: "Why Choose Us", url: "/about#choose-us" },
        { label: "Our Team", url: "/about#our-team" }
      ] 
    },
    {
      id: "platforms",
      label: "Platforms",
      items: [
        { label: "Platform Overview", url: "/platform" },
      ]
    },
    {
      id: "tools",
      label: "Tools",
      items: [
        { label: "Tools Overview", url: "/about/tools" },
      ]
    },
  ];

  const resourcesMegaData = [
    { id: "learning", label: "Resource Center", items: ["Case Studies"] },
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
    { 
      id: "va-overview", 
      label: "Virtual Assistant Center", 
      items: [
        { label: "Virtual Assistant Home", url: "/virtual-assistant" },
      ] 
    },
    { 
      id: "va-details", 
      label: "Virtual Assistant Details", 
      items: [
        { label: "Become a VA", url: "/careers/job-details" },
        { label: "Hire a VA", url: "/careers/job-details" },
      ] 
    },
  ];

  const getMegaData = (label: string) => {
    if (label === "Services") return { data: servicesMegaData, path: "/services" };
    if (label === "About") return { data: aboutMegaData, path: "/about" };
    if (label === "Resources") return { data: resourcesMegaData, path: "/resources" };
    if (label === "Virtual Assistant" || label === "Virtual ") return { data: careersMegaData, path: "/virtual-assistant" };
    return null;
  };

  const handleToggleMain = (id: number) => {
    setOpenMainId(openMainId === id ? null : id);
    setOpenSubId(null);
  };

  const handleToggleSub = (e: React.MouseEvent, subId: string) => {
    e.stopPropagation();
    setOpenSubId(openSubId === subId ? null : subId);
  };

  const handleScrollClick = (e: React.MouseEvent | null, url: string) => {
    if (e) e.preventDefault();
    closeNav();
    if (url.includes("#")) {
      const [path, hash] = url.split("#");
      if (pathname === path || (path === "" && pathname === "/")) {
        const element = document.querySelector(`#${hash}`);
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      } else {
        router.push(url);
      }
    } else {
      router.push(url);
    }
  };

  return (
    <div className={`lg:hidden ${poppins.variable} ${openSans.variable} ${rubik.variable} font-poppins`}>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] transition-opacity duration-300 ${showNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        onClick={closeNav}
      ></div>
      
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[2050] transform transition-transform duration-500 ease-in-out ${showNav ? "translate-x-0" : "-translate-x-full"} flex flex-col shadow-2xl`}>
        <div className="flex items-center justify-between px-6 py-5 bg-gray-800">
          <Image src="/images/Weblogo.webp" alt="Logo" width={150} height={30} className="object-contain" priority />
          <button onClick={closeNav} className="text-white hover:text-[#a10000]">
            <RiCloseFill className="w-8 h-8" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {navLinks.map((link) => {
            const mega = getMegaData(link.label);
            const isMainOpen = openMainId === link.id;

            return (
              <div key={link.id} className="border-b border-gray-100">
                <div 
                  className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  onClick={() => mega ? handleToggleMain(link.id) : handleScrollClick(null, link.url)}
                >
                  <span className={`text-sm font-bold uppercase tracking-wider ${isMainOpen ? "text-[#a10000]" : "text-gray-700"}`}>
                    {link.label}
                  </span>
                  {mega && (
                    <HiChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMainOpen ? "rotate-180 text-[#a10000]" : "text-gray-400"}`} />
                  )}
                </div>

                {mega && isMainOpen && (
                  <div className="bg-gray-50 flex flex-col">
                    {mega.data.map((sub) => {
                      const isSubOpen = openSubId === sub.id;
                      return (
                        <div key={sub.id} className="flex flex-col border-l-4 border-[#a10000]/20">
                          <div 
                            className="flex items-center justify-between px-10 py-3 border-b border-white"
                            onClick={(e) => handleToggleSub(e, sub.id)}
                          >
                            <span className={`text-[13px] font-normal ${isSubOpen ? "text-[#a10000]" : "text-gray-600"}`}>
                              {sub.label}
                            </span>
                            <HiChevronDown className={`w-4 h-4 transition-transform ${isSubOpen ? "rotate-180 text-[#a10000]" : "text-gray-400"}`} />
                          </div>

                          {isSubOpen && (
                            <div className="bg-white py-2 pl-14 pr-6 flex flex-col space-y-3 shadow-inner">
                              {sub.items.map((item, idx) => {
                                const label = typeof item === 'string' ? item : item.label;
                                const url = typeof item === 'string' ? mega.path : item.url;
                                return (
                                  <Link 
                                    key={idx} 
                                    href={url} 
                                    onClick={(e) => handleScrollClick(e, url)}
                                    className="text-[13px] text-gray-500 hover:text-[#a10000] py-1 border-b border-gray-50 last:border-0 font-normal"
                                  >
                                    {label}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-6 bg-white border-t border-gray-100">
          <button 
            onClick={() => handleScrollClick(null, "/contact")}
            className="w-full bg-[#a10000] text-white py-3 text-center text-sm font-bold uppercase rounded"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;