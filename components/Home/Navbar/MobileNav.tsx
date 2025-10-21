"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { navLinks } from "@/constant/constant";
import { RiCloseFill } from "react-icons/ri";
import { HiChevronDown } from "react-icons/hi";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

const FONT_WEIGHTS = {
  regular: 400,
  bold: 700,
  black: 900,
} as const;

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
  weight: ["400"],
  variable: "--font-rubik",
  display: "swap",
});

type NavLinkType = {
  id: number;
  label: string;
  url: string;
  dropdown?: NavLinkType[];
};

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollClick = (
    e: React.MouseEvent<HTMLAnchorElement> | { preventDefault: () => void },
    url: string
  ) => {
    closeNav();
    setOpenDropdownId(null);

    if (url.startsWith("#")) {
      e.preventDefault();

      const isHomepage = pathname === "/";

      if (isHomepage) {
        scrollToSection(url);
      } else {
        router.push("/" + url);

        setTimeout(() => {
          scrollToSection(url);
        }, 150);
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div
      className={`lg:hidden ${poppins.variable} ${openSans.variable} ${rubik.variable}`}
    >
      {showNav && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm w-full h-screen z-[1000] transition-opacity duration-500"
          onClick={closeNav}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 flex flex-col h-full w-[85%] sm:w-[75%] max-w-sm z-[1050] transform transition-all duration-500 ease-out 
          ${showNav ? "translate-x-0" : "-translate-x-full"} 
          bg-white shadow-2xl overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex-shrink-0 px-6 py-5 flex justify-between items-center bg-gray-800">
            <div className="relative w-[180px] h-[35px]">
              <Image
                src="/images/Weblogo.webp"
                alt="TELEXPH Delivery & Transport Logo"
                fill
                sizes="(max-width: 640px) 180px"
                className="object-contain object-left drop-shadow-md"
                priority
              />
            </div>

            <button
              onClick={closeNav}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:text-[#a10000] hover:bg-white transition-all duration-300"
              aria-label="Close mobile navigation"
            >
              <RiCloseFill className="w-6 h-6 transition-colors" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar-light divide-y divide-gray-100">
            {navLinks.map((link: NavLinkType) => (
              <div key={link.id} className="w-full">
                <div className="flex items-stretch">
                  <Link
                    href={link.url}
                    onClick={(e) => {
                      handleScrollClick(e, link.url);
                    }}
                    className={`flex-1 flex items-center py-4 px-6 text-gray-700 font-open-sans-bold text-sm uppercase tracking-wide transition-colors hover:bg-gray-50 hover:text-[#a10000]`}
                  >
                    {link.label}
                  </Link>

                  {link.dropdown && link.dropdown.length > 0 && (
                    <button
                      onClick={() => handleToggleDropdown(link.id)}
                      className={`flex-shrink-0 w-14 flex items-center justify-center border-l border-gray-100 transition-colors duration-300 ${
                        openDropdownId === link.id
                          ? "bg-gray-100 text-[#a10000]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#a10000]"
                      }`}
                      aria-expanded={openDropdownId === link.id}
                      aria-controls={`dropdown-${link.id}`}
                    >
                      <HiChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openDropdownId === link.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {link.dropdown && link.dropdown.length > 0 && (
                  <div
                    id={`dropdown-${link.id}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 ${
                      openDropdownId === link.id ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="py-2 pl-6 pr-4 border-l-4 border-[#a10000] space-y-1">
                      {link.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.id}
                          href={dropdownItem.url}
                          onClick={(e) =>
                            handleScrollClick(e, dropdownItem.url)
                          }
                          className="group flex items-center py-2 px-4 text-sm text-gray-700 font-rubik-regular transition-colors duration-200 hover:bg-white hover:text-[#a10000] rounded-md"
                        >
                          <span className="w-1 h-1 rounded-full bg-red-400 group-hover:bg-[#a10000] mr-3 transition-colors"></span>
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-gray-200 bg-white">
            <div className="mb-4">
              <Link
                href="/contact"
                onClick={closeNav}
                className="block w-full bg-[#a10000] hover:bg-red-700 text-white px-6 py-3 text-sm font-open-sans-bold transition-colors rounded cursor-pointer uppercase shadow-lg text-center"
              >
                CONTACT US
              </Link>
            </div>

            <p className="text-xs text-gray-500 font-rubik-regular text-center">
              &copy; {currentYear} TELEX. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-open-sans-bold {
          font-family: var(--font-open-sans), sans-serif;
          font-weight: ${FONT_WEIGHTS.bold};
        }

        .font-rubik-regular {
          font-family: var(--font-rubik), sans-serif;
          font-weight: ${FONT_WEIGHTS.regular};
        }
      `}</style>
      <style jsx>{`
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 3px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background-color: #a10000;
        }
      `}</style>
    </div>
  );
};

export default MobileNav