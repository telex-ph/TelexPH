"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Sparkles, ArrowRight } from "lucide-react";

// Design System
const COLORS = {
  primary: '#a10000',
  dark: '#282828',
  white: '#ffffff',
  black: '#000000',
  primaryLight: '#fce5e5',
  primaryLightBorder: '#f0c4c4',
};

const COLORS_RGB = {
  primary: '161, 0, 0',
  dark: '40, 40, 40',
  white: '255, 255, 255',
  black: '0, 0, 0',
};

const getColorWithOpacity = (color: keyof typeof COLORS_RGB, opacity: number): string => {
  return `rgba(${COLORS_RGB[color]}, ${opacity})`;
};

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [halfScrolled, setHalfScrolled] = useState(false);

  // Reset every reload (for testing)
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // Detect if user scrolled halfway
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollTop > docHeight / 2 && !halfScrolled) {
        setHalfScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [halfScrolled]);

  // Exit intent detection (only after half scroll)
  useEffect(() => {
    const handleExitIntent = (e: MouseEvent) => {
      if (
        halfScrolled &&
        e.clientY < 10 &&
        !e.relatedTarget &&
        !sessionStorage.getItem("exitPopupShown")
      ) {
        sessionStorage.setItem("exitPopupShown", "true");
        setTimeout(() => setShowPopup(true), 300);
      }
    };

    document.addEventListener("mouseout", handleExitIntent);
    return () => document.removeEventListener("mouseout", handleExitIntent);
  }, [halfScrolled]);

  const handleClose = () => setShowPopup(false);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: getColorWithOpacity('black', 0.8), backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Main Card */}
          <motion.div
            className="relative rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full"
            style={{ 
              background: `linear-gradient(to bottom right, ${COLORS.white}, ${COLORS.primaryLight})`
            }}
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 transition-all z-20 rounded-full p-2 hover:scale-110 shadow-lg"
              style={{ 
                color: getColorWithOpacity('dark', 0.6),
                backgroundColor: getColorWithOpacity('white', 0.9)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.dark;
                e.currentTarget.style.backgroundColor = COLORS.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = getColorWithOpacity('dark', 0.6);
                e.currentTarget.style.backgroundColor = getColorWithOpacity('white', 0.9);
              }}
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left Column - Content */}
              <div className="relative z-10 px-6 py-8 md:px-12 md:py-16 flex flex-col justify-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6 w-fit"
                  style={{ backgroundColor: getColorWithOpacity('primary', 0.1) }}
                >
                  <Sparkles size={16} className="md:hidden" style={{ color: COLORS.primary }} />
                  <Sparkles size={18} className="hidden md:block" style={{ color: COLORS.primary }} />
                  <span 
                    className="text-xs md:text-sm font-bold uppercase tracking-wide"
                    style={{ 
                      color: COLORS.primary,
                      fontFamily: 'var(--font-poppins, sans-serif)'
                    }}
                  >
                    Telex Philippines
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 tracking-tight leading-[1.1]"
                  style={{ 
                    color: COLORS.dark,
                    fontFamily: 'var(--font-poppins, sans-serif)',
                    fontWeight: 900
                  }}
                >
                  Your Partner to{" "}
                  <span style={{ color: COLORS.primary }}>Scale Smarter</span>
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg mb-6 md:mb-8 leading-relaxed"
                  style={{ 
                    color: getColorWithOpacity('dark', 0.8),
                    fontFamily: 'var(--font-rubik, sans-serif)'
                  }}
                >
                  Unlock world-class BPO solutions that optimize operations,
                  reduce costs, and empower your team to focus on growth.
                </motion.p>

                {/* CTA Button */}
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  href="https://hiretelex.com/scale-with-telex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 font-bold px-6 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 text-base md:text-lg group w-full md:w-fit"
                  style={{ 
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                    fontFamily: 'var(--font-poppins, sans-serif)',
                    fontWeight: 700
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#8a0000';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${getColorWithOpacity('primary', 0.3)}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Calendar size={18} className="md:hidden" />
                  <Calendar size={22} className="hidden md:block" />
                  <span className="whitespace-nowrap">Book Free Consultation</span>
                  <ArrowRight
                    size={18}
                    className="md:hidden group-hover:translate-x-1 transition-transform"
                  />
                  <ArrowRight
                    size={20}
                    className="hidden md:block group-hover:translate-x-1 transition-transform"
                  />
                </motion.a>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 md:mt-8 flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm justify-center md:justify-start"
                  style={{ 
                    color: getColorWithOpacity('dark', 0.6),
                    fontFamily: 'var(--font-rubik, sans-serif)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Available Now</span>
                  </div>
                  <div>Free Consultation</div>
                  <div>No Commitment</div>
                </motion.div>
              </div>

              {/* Right Column - Image */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative flex items-end justify-center overflow-hidden min-h-[250px] md:min-h-[400px]"
                style={{
                  background: `linear-gradient(to bottom right, ${COLORS.primaryLight}, ${COLORS.primaryLightBorder})`
                }}
              >
                {/* Background Image with Opacity */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'url(/images/exit.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.8
                  }}
                ></div>

                {/* Overlay for better contrast */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${getColorWithOpacity('black', 0.2)}, transparent)`
                  }}
                ></div>

                {/* Team Image */}
                <div className="relative z-10 w-full px-4 md:px-8 pb-0">
                  <img
                    src="/images/footer.png"
                    alt="Telex Team"
                    className="w-full h-auto drop-shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Bottom Accent Line */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1"
              style={{
                background: `linear-gradient(to right, ${COLORS.primary}, #ff0000, ${COLORS.primary})`
              }}
            ></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;