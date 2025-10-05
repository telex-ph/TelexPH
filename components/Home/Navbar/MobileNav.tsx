"use client";

import React, { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/constant/constant"; 
import { CgClose } from "react-icons/cg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleLinkClick = () => {
    closeNav(); 
    setOpenDropdownId(null); 
  };

  return (
    <div className="lg:hidden">
      {/* 1. OVERLAY (Standard Dark Overlay) */}
      {showNav && (
        <div
          className="fixed inset-0 bg-gray-900 opacity-70 w-full h-screen z-[1000] transition-opacity duration-300"
          onClick={closeNav}
        ></div>
      )}

      {/* 2. SLIDING MENU (White Background, Slide from Left) */}
      <div
        className={`fixed top-0 left-0 flex flex-col h-full w-[90%] sm:w-[70%] bg-white shadow-2xl z-[1050] transform transition-transform duration-500 ease-in-out overflow-y-auto ${
          // Ibalik natin sa Left-Slide
          showNav ? "translate-x-0" : "-translate-x-full" 
        }`}
      >
        {/* CLOSE BUTTON AND HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b-4 border-red-600 bg-gray-900">
          {/* Logo Title (Aligned with Desktop Logo Color Scheme) */}
          <div className="text-white">
            <span className="text-xl font-bold tracking-wide">
                TELEX<span className="text-red-500">PH</span>
            </span>
          </div>
          <CgClose
            onClick={closeNav}
            className="w-7 h-7 cursor-pointer text-white hover:text-red-500 transition-colors"
          />
        </div>

        {/* 3. NAVIGATION LINKS LIST (Clean, Bordered Links) */}
        <nav className="flex flex-col mt-4">
          {navLinks.map((link) => {
            const isOpen = openDropdownId === link.id;

            return (
              <div key={link.id} className="w-full border-b border-gray-200">
                
                {/* Main Link/Toggle Area */}
                <div
                  className={`flex items-center justify-between transition-colors duration-200 cursor-pointer 
                    ${isOpen ? "bg-red-50 border-l-4 border-red-600" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                >
                  <Link 
                    href={link.url} 
                    onClick={link.dropdown ? (e) => { e.preventDefault(); toggleDropdown(link.id); } : handleLinkClick}
                    // Large Text and Padding
                    className={`py-4 px-6 text-xl font-semibold w-full transition-colors 
                        ${isOpen ? "text-red-600" : "text-gray-800 hover:text-red-600"}`}
                  >
                    {link.label}
                  </Link>
                  
                  {/* Dropdown Toggle Button */}
                  {link.dropdown && (
                    <button 
                      onClick={() => toggleDropdown(link.id)}
                      className={`p-4 transition-colors ${isOpen ? "text-red-600" : "text-gray-500 hover:text-red-600"}`}
                    >
                      {isOpen ? (
                        <FaChevronUp className="w-5 h-5" />
                      ) : (
                        <FaChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Dropdown Menu (Sub-links - Simple Indented List) */}
                {link.dropdown && isOpen && (
                  <div className="bg-gray-100 py-1">
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.id}
                        href={subLink.url}
                        onClick={handleLinkClick}
                        // Styling for sub-links
                        className="block py-3 px-10 text-base font-medium text-gray-700 hover:bg-white hover:text-red-600 transition-colors duration-200"
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* 4. Contact Us Section (CTA at the bottom) */}
        <div className="mt-auto p-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Ready to start your project?</p>
          <Link href="/contact" onClick={handleLinkClick}>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md text-base font-semibold transition-colors shadow-md">
              Contact Our Team
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;