"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "./TopBar";
import { navLinks } from "@/constant/constant";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import { HiBars3BottomRight } from "react-icons/hi2";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "900"],
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
  const prevScrollY = useRef(0);

  // Dropdown state (commented out)
  // const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // const handleMouseEnter = (id: number) => {
  //   setOpenDropdownId(id);
  // };

  // const handleMouseLeave = () => {
  //   setOpenDropdownId(null);
  // };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setNavBg(currentScrollY > 50);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-[1000] top-0 ${poppins.variable} ${openSans.variable} ${rubik.variable}`}
    >
      <TopBar />

      <div
        className={`relative bg-white transition-all duration-300 ${
          navBg ? "shadow-md" : ""
        }`}
      >
        <div className="relative h-[80px] flex items-stretch">
          <div
            className="bg-gray-800 flex items-center justify-center h-full relative z-10 
                px-4 sm:px-8 
                w-auto 
                lg:w-[350px]"
          >
            <Image
              src="/images/Weblogo.png"
              alt="TELEXPH Delivery & Transport Logo"
              width={250}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="h-full z-30 w-10 -ml-5 sm:w-16 sm:-ml-8 lg:w-[60px] lg:-ml-[30px] relative">
            <div
              className="absolute top-0 left-0 w-full h-full bg-[#a10000]"
              style={{ clipPath: "polygon(50% 0, 100% 0, 50% 100%, 0 100%)" }}
            />
          </div>
          <div className="flex flex-grow items-center justify-end h-full pl-4 pr-4 sm:pl-6 sm:pr-8">
            
            {/* START: NAVIGATION LINKS (Dropdown commented out) */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative h-full flex items-center"
                  // onMouseEnter={() => handleMouseEnter(link.id)}
                  // onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={link.url}
                    className="relative py-[30px] scroll-smooth"
                  >
                    <span
                      className={`text-gray-700 font-open-sans-bold text-sm uppercase tracking-wide transition-colors hover:text-[#a10000]`}
                    >
                      {link.label}
                    </span>
                  </Link>

                  {/* Dropdown menu (commented out) */}
                  {/* {link.dropdown && link.dropdown.length > 0 && openDropdownId === link.id && (
                    <div 
                      className="absolute top-full left-0 mt-[-2px] bg-white border border-gray-100 shadow-lg min-w-[180px] z-20 py-2 rounded-b-md"
                    >
                      {link.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.id}
                          href={dropdownItem.url}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f5f5] hover:text-[#a10000] whitespace-nowrap transition-colors"
                          onClick={handleMouseLeave}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )} */}
                </div>
              ))}
            </div>
            {/* END: NAVIGATION LINKS */}

            <div className="flex items-center space-x-8 ml-auto">
              <button
                type="button"
                onClick={() =>
                  window.open(
                    "https://hiretelex.com/scale-with-telex",
                    "_blank"
                  )
                }
                className="hidden lg:block bg-[#a10000] hover:bg-red-700 text-white px-6 py-2.5 text-sm font-open-sans-bold transition-colors rounded cursor-pointer"
              >
                CONTACT US
              </button>
              <button onClick={openNav} className="lg:hidden text-gray-700 p-2">
                <HiBars3BottomRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
