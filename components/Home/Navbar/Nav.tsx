"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "./TopBar";
import { navLinks } from "@/constant/constant";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

// Icons
import { HiBars3BottomRight } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

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
      {" "}
      <TopBar />
      <div
        className={`relative bg-white transition-all duration-300 ${
          navBg ? "shadow-md" : ""
        }`}
      >
        <div className="relative h-[80px] flex items-stretch">
          {/* Logo Section */}
          <div
            className="bg-[#282828] flex items-center justify-center h-full relative z-10 
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

          {/* Red Diagonal Strip */}
          <div className="h-full z-30 w-10 -ml-5 sm:w-16 sm:-ml-8 lg:w-[60px] lg:-ml-[30px] relative">
            <div
              className="absolute top-0 left-0 w-full h-full bg-[#a10000]"
              style={{ clipPath: "polygon(50% 0, 100% 0, 50% 100%, 0 100%)" }}
            />
          </div>

          {/* Links & Buttons Section */}
          <div className="flex flex-grow items-center justify-end h-full pl-4 pr-4 sm:pl-6 sm:pr-8">
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative h-full flex items-center group"
                >
                  <Link
                    href={link.url}
                    className="relative py-[30px] scroll-smooth"
                  >
                    <span className="text-gray-700 font-open-sans-bold text-sm uppercase tracking-wide transition-colors group-hover:text-[#a10000]">
                      {link.label}
                    </span>
                  </Link>

                  {/* DROPDOWN COMMENTED OUT */}
                  {/*
                    {link.dropdown && (
                      <div
                        className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 
                              group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50"
                      >
                        <div className="bg-white shadow-xl min-w-[200px] border-t-2 border-[#a10000] py-2 rounded-b-md">
                          {link.dropdown.map((subLink) => (
                            <Link
                              key={subLink.id}
                              href={subLink.url}
                              className="block px-4 py-2 text-sm font-rubik text-gray-700 hover:bg-gray-100 hover:text-[#a10000] transition-colors duration-200"
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  */}
                </div>
              ))}
            </div>

            {/* Right Icons & Hamburger */}
            <div className="flex items-center space-x-8 ml-auto">
              <div className="hidden lg:flex items-center space-x-3">
                <button className="text-[#a10000] hover:text-red-700 transition">
                  <FaRegUser className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-[#a10000] transition">
                  <IoSearchOutline className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-[#a10000] transition">
                  <BsThreeDotsVertical className="w-4 h-4" />
                </button>
              </div>

              <button className="hidden lg:block bg-[#a10000] hover:bg-red-700 text-white px-6 py-2.5 text-sm font-open-sans-bold transition-colors rounded">
                Contact Us
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