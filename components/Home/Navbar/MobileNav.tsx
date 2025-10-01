"use client"; // I-assume na mayroon nang "use client" dito kung wala pa

import React, { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/constant/constant"; // Siguraduhin na imported ang navLinks
import { CgClose } from "react-icons/cg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Para sa dropdown icon

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  // State para i-track kung aling dropdown ang bukas
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleLinkClick = () => {
    // Isara ang navigation at i-reset ang dropdown kapag may link na pinindot
    closeNav(); 
    setOpenDropdownId(null); 
  };

  return (
    <div className="lg:hidden">
      {/* Overlay */}
      {showNav && (
        <div
          className="fixed inset-0 bg-black opacity-70 w-full h-screen z-[1000] transition-opacity duration-300"
          onClick={closeNav}
        ></div>
      )}

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 flex flex-col justify-start overflow-y-auto h-full w-[80%] sm:w-[60%] bg-red-800 space-y-2 p-8 pt-20 z-[1050] transform transition-transform duration-500 ease-in-out ${
          showNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CgClose
          onClick={closeNav}
          className="absolute top-4 right-4 sm:w-8 sm:h-8 w-7 h-7 cursor-pointer text-white hover:text-red-300 transition-colors z-[1100]"
        />

        {navLinks.map((link) => (
          <div key={link.id}>
            {/* Main Link (with or without dropdown) */}
            <div className="flex items-center justify-between">
              <Link 
                href={link.url} 
                onClick={link.dropdown ? () => toggleDropdown(link.id) : handleLinkClick}
                className="text-white text-2xl sm:text-3xl font-semibold hover:text-red-300 transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
              
              {/* Dropdown Toggle Button */}
              {link.dropdown && (
                <button 
                  onClick={() => toggleDropdown(link.id)}
                  className="p-2 text-white hover:text-red-300 transition-colors"
                >
                  {openDropdownId === link.id ? (
                    <FaChevronUp className="w-4 h-4" />
                  ) : (
                    <FaChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Dropdown Menu (Sub-links) */}
            {link.dropdown && openDropdownId === link.id && (
              <div className="ml-4 mt-2 bg-red-700 rounded-lg py-2">
                {link.dropdown.map((subLink) => (
                  <Link
                    key={subLink.id}
                    href={subLink.url}
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-white text-base hover:bg-red-600 transition-colors"
                  >
                    {subLink.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;