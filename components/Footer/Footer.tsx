"use client";

import React, { useState, useEffect, useCallback } from "react";
import FooterLogo from "./FooterLogo";
import FooterPosts from "./FooterPosts";
import FooterLinks from "./FooterLinks";
import FooterSubscribe from "./FooterSubscribe";
import FooterBottom from "./FooterBottom";
import FooterCTA from "./FooterCTA";
import ChatbaseWidget from "@/components/Chatbot/ChatbaseWidget";

const DEFAULT_MAX_WIDTH_CLASS =
  "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";

const SCROLL_THRESHOLD = 300;

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = useCallback(() => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <footer className="relative bg-[#282828] text-white pt-10 sm:pt-16 md:pt-20 mt-16 sm:mt-20">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-20">
        <div className={DEFAULT_MAX_WIDTH_CLASS}>
          <FooterCTA />
        </div>
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 p-3 bg-[#a10000] hover:bg-[#8a0000] rounded-full shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-[#a10000] focus:ring-offset-2 focus:ring-offset-[#282828] hover:scale-110"
        >
          {/* Arrow Up Icon */}
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Main Footer Content Grid */}
      <div
        className={`${DEFAULT_MAX_WIDTH_CLASS} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-20 relative z-10`}
      >

        {/* ✅ Chatbase Chatbot Integration */}
      <ChatbaseWidget />
      
        {/* Logo + About */}
        <FooterLogo />

        {/* Popular Posts */}
        <FooterPosts />

        {/* Need Help / Contact */}
        <FooterLinks />

        {/* Subscribe */}
        <FooterSubscribe />
      </div>

      {/* Bottom Bar */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
