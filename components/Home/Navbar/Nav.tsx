"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TopBar from "./TopBar";
import { navLinks } from "@/constant/constant";

// Icons
import { HiBars3BottomRight } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

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
    <nav className="fixed w-full z-[1000] top-0">
      <TopBar />

      <div
        className={`relative bg-white transition-all duration-300 ${
          navBg ? "shadow-md" : ""
        }`}
      >
        {/* MAIN NAV CONTAINER */}
        <div className="relative h-[80px] flex items-stretch">
          {/* Logo Section */}
          <div
            className="bg-gray-800 flex items-center justify-center h-full relative z-10 
                          px-4 sm:px-8 
                          w-auto 
                          lg:w-[350px]"
          >
            <div className="text-white">
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-wide">
                  TELEX<span className="text-red-500">PH</span>
                </span>
              </div>
              <div className="text-red-500 text-[10px] font-medium tracking-widest mt-1">
                DELIVERY & TRANSPORT
              </div>
            </div>
          </div>

          {/* Red Diagonal Strip */}
          <div className="h-full z-30 w-10 -ml-5 sm:w-16 sm:-ml-8 lg:w-[60px] lg:-ml-[30px] relative">
            <div
              className="absolute top-0 left-0 w-full h-full bg-red-600"
              style={{ clipPath: "polygon(50% 0, 100% 0, 50% 100%, 0 100%)" }}
            />
          </div>

          {/* Links & Buttons Section */}
          <div className="flex flex-grow items-center justify-end h-full pl-4 pr-4 sm:pl-6 sm:pr-8">
            {/* Nav Links */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link href={link.url} key={link.id} className="group relative">
                  <span className="text-gray-700 hover:text-red-600 font-medium text-sm uppercase tracking-wide transition-colors">
                    {link.label}
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>

            {/* Right Icons & Hamburger */}
            <div className="flex items-center space-x-8 ml-auto">
              {/* Desktop Icons */}
              <div className="hidden lg:flex items-center space-x-3">
                <button className="text-red-600 hover:text-red-700 transition">
                  <FaRegUser className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-red-600 transition">
                  <IoSearchOutline className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-red-600 transition">
                  <BsThreeDotsVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Us Button */}
              <button className="hidden lg:block bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm font-medium transition-colors">
                Contact Us
              </button>

              {/* Hamburger Menu Button */}
              <button
                onClick={openNav}
                className="lg:hidden text-gray-700 p-2"
              >
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