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
    type: "Case Studies",
    title: "Horseshoe Ridge",
    subtitle: "Taking Control of Inbound Freight",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 2,
    type: "Events",
    title: "Global Supply Chain Summit",
    subtitle: "Connecting the Brightest Minds in Logistics",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 3,
    type: "Guides",
    title: "2026 Freight Manual",
    subtitle: "Strategic Roadmap for Logistics",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 4,
    type: "Demo",
    title: "AI Integration Demo",
    subtitle: "The Future of Automated Warehousing",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 5,
    type: "Case Studies",
    title: "Scaling Support Teams",
    subtitle: "Global Logistics Customer Service",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 6,
    type: "Reports",
    title: "Market Trends Report",
    subtitle: "Q1 2026 Global Trade Outlook",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
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

      <div className="container mx-auto px-6 pt-32 mb-5">
        <nav className="flex items-center justify-start gap-3">
          <Link 
            href="/" 
            className="text-[15px] font-black uppercase tracking-[0.1em] hover:text-[#a10000] transition-colors no-underline" 
            style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}
          >
            Home
          </Link>
          <HiChevronRight className="w-4 h-4 text-gray-400" />
          <Link 
            href="/resources" 
            className="text-[15px] font-black uppercase tracking-[0.1em] hover:text-[#a10000] transition-colors no-underline" 
            style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}
          >
            Resources
          </Link>
          <HiChevronRight className="w-4 h-4 text-gray-400" />
          <span 
            className="text-[15px] font-black uppercase tracking-[0.1em]" 
            style={{ fontFamily: FONTS.openSans, color: targetMaroon }}
          >
            {data.title}
          </span>
        </nav>
      </div>

      <div className="relative w-full h-[220px] md:h-[260px] bg-white overflow-hidden flex items-center">
        
        <div className="absolute inset-0 flex justify-end z-0">
          <div 
            className="relative w-full md:w-[75%] h-full"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.8) 30%, black 35%)',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.8) 30%, black 35%)'
            }}
          >
            <img 
              key={data.id} 
              src={data.image} 
              className="w-full h-full object-cover" 
              style={{ objectPosition: 'center' }}
              alt={data.title} 
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12">
          <div className="max-w-xl lg:max-w-2xl">
            <div className="mb-1">
              <span
                className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black"
                style={{ 
                  fontFamily: FONTS.openSans,
                  color: targetMaroon
                }}
              >
                — {data.type}
              </span>
            </div>

            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-black text-[#111] mb-1 leading-[1.1] tracking-tighter"
              style={{ fontFamily: FONTS.openSans }}
            >
              {data.title.split(' ').slice(0, -1).join(' ')}
              <br />
              <span style={{ color: targetMaroon }}>
                {data.title.split(' ').slice(-1)}
              </span>
            </h1>

            <p
              className="text-sm md:text-lg text-gray-900 font-bold max-w-md"
              style={{ 
                fontFamily: FONTS.openSans,
                lineHeight: 1.2
              }}
            >
              {data.subtitle}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}