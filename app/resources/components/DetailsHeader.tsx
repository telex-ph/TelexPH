"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiChevronRight } from "react-icons/hi2";
import { FONTS, getColorWithOpacity } from "@/constant/styles";

import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";

const HEADER_DATA = [
  {
    id: 1,
    type: "case studies",
    title: "horseshoe ridge",
    subtitle: "taking control of inbound freight",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    type: "events",
    title: "global supply chain summit",
    subtitle: "connecting the brightest minds in logistics",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    type: "guides",
    title: "2026 freight manual",
    subtitle: "strategic roadmap for logistics",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    type: "demo",
    title: "ai integration demo",
    subtitle: "the future of automated warehousing",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 5,
    type: "case studies",
    title: "scaling support teams",
    subtitle: "global logistics customer service",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 6,
    type: "reports",
    title: "market trends report",
    subtitle: "q1 2026 global trade outlook",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  }
];

export default function DetailsHeader() {
  const [showNav, setShowNav] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const data = HEADER_DATA.find((item) => item.id.toString() === id) || HEADER_DATA[5];
  
  const bodyTextColor = getColorWithOpacity("dark", 0.7);
  const targetMaroon = "rgb(161, 0, 0)";

  return (
    <>
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <div className="container mx-auto px-4 sm:px-6 pt-24 md:pt-32 mb-4 md:mb-5">
        <nav className="flex items-center justify-start gap-2 md:gap-3 overflow-x-auto no-scrollbar" aria-label="breadcrumb">
          <Link 
            href="/" 
            className="text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-[0.1em] hover:text-[#a10000] transition-colors no-underline flex-shrink-0" 
            style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}
          >
            home
          </Link>
          <HiChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <Link 
            href="/resources" 
            className="text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-[0.1em] hover:text-[#a10000] transition-colors no-underline flex-shrink-0" 
            style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}
          >
            resources
          </Link>
          <HiChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <span 
            className="text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-[0.1em] truncate text-[#a10000]" 
            style={{ fontFamily: FONTS.openSans }}
          >
            {data.title}
          </span>
        </nav>
      </div>

      <section className="relative w-full h-[240px] md:h-[300px] lg:h-[380px] bg-white overflow-hidden flex items-center content-visibility-auto">
        
        <div className="absolute inset-0 flex justify-end z-0">
          <div 
            className="relative w-full md:w-[70%] h-full overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 10%, black 40%)',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 10%, black 40%)'
            }}
          >
            <img 
              src={data.image} 
              className="w-full h-full object-cover transform-gpu"
              style={{ objectPosition: '50% 50%' }}
              alt={data.title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl">
            <div className="mb-1 md:mb-2">
              <span
                className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black inline-block"
                style={{ 
                  fontFamily: FONTS.openSans,
                  color: targetMaroon
                }}
              >
                — {data.type}
              </span>
            </div>

            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-black text-[#111] mb-1 md:mb-2 leading-[1.1] tracking-tighter"
              style={{ fontFamily: FONTS.openSans }}
            >
              {data.title.split(' ').slice(0, -1).join(' ')}
              <br />
              <span className="text-[#a10000]">
                {data.title.split(' ').slice(-1)}
              </span>
            </h1>

            <p
              className="text-sm md:text-lg text-gray-900 font-bold leading-snug"
              style={{ 
                fontFamily: FONTS.openSans
              }}
            >
              {data.subtitle}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}