"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/constant/constant"; 
import { RiCloseFill } from "react-icons/ri";
import { PiArrowUpRightBold } from "react-icons/pi";
import { Poppins, Open_Sans, Rubik } from "next/font/google";


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


type Props = {
    showNav: boolean;
    closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
    // ----------------------------------------------------
    // NOTE: Drodown states and logic are commented out or removed.
    // const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    // ----------------------------------------------------

    const handleLinkClick = () => {
        closeNav(); 
        // setOpenDropdownId(null); // State for dropdown is not needed/used
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className={`lg:hidden ${poppins.variable} ${openSans.variable} ${rubik.variable}`}>
            {/* 1. GLASSMORHPIC OVERLAY - Light & Clean */}
            {showNav && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm w-full h-screen z-[1000] transition-opacity duration-500"
                    onClick={closeNav}
                ></div>
            )}

            {/* 2. SLIDING PANEL - MODERN LIGHT GLASS */}
            <div
                className={`fixed top-0 left-0 flex flex-col h-full w-[85%] sm:w-[75%] max-w-md z-[1050] transform transition-all duration-700 ease-out 
                    ${showNav ? "translate-x-0" : "-translate-x-full"} 
                    rounded-r-3xl overflow-hidden shadow-2xl`}
            >
                {/* Light Glassmorphic Background - Soft White */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl backdrop-saturate-150 border-r border-gray-100"></div>
                
                {/* Animated Background Elements - Subtle and vibrant */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-spin-slow"></div>
                <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl animate-spin-slow-delay"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    
                    {/* HEADER - High-Contrast Dark Header for Logo and Close */}
                    <div className="px-6 py-6 flex justify-between items-center bg-[#282828] border-b border-white/20">
                        <div className="relative w-40 h-16">
                            <Image 
                                src="/images/Weblogo.png" // Assumed white/light logo works here
                                alt="TELEX Logo" 
                                fill
                                className="object-contain object-left drop-shadow-md"
                                priority
                            />
                        </div>
                        
                        <button
                            onClick={closeNav}
                            // Close Button - Modern dark-to-red transition
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white hover:bg-red-600 hover:border-red-600 shadow-xl transition-all duration-300 group"
                        >
                            <RiCloseFill className="w-6 h-6 transition-colors" />
                        </button>
                    </div>

                    {/* NAVIGATION - FLAT LINKS, Modern Light Cards */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar-light"> 
                        {navLinks.map((link) => {
                            return (
                                <div key={link.id}>
                                    {/* Main Link - Sleek White/Red Card */}
                                    <Link 
                                        href={link.url} 
                                        onClick={handleLinkClick} // Always close the nav on link click
                                        className={`relative flex items-center justify-between py-4 px-5 rounded-xl border transition-all duration-300 group 
                                            bg-white/80 border-gray-100 shadow-lg hover:bg-red-50 hover:border-red-300`
                                        }
                                    >
                                        <span className={`text-[16px] font-open-sans-bold tracking-tight transition-colors duration-300
                                            text-gray-900 group-hover:text-red-600`
                                        }>
                                            {link.label}
                                        </span>
                                        
                                        {/* Indicator Icon - Arrow up right for modern touch */}
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300
                                            bg-red-100/50 group-hover:bg-red-600`
                                        }>
                                            <PiArrowUpRightBold className={`w-5 h-5 transition-colors
                                                text-red-500 group-hover:text-white`} 
                                            />
                                        </div>
                                    </Link>

                                    {/* DROPDOWN SECTION COMMENTED OUT - Removed rendering logic for brevity */}
                                </div>
                            );
                        })}
                    </nav>
                    
                    {/* FOOTER - Simple Copyright Section */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-200 bg-white/95 text-center">
                        <p className="text-xs text-gray-500 font-rubik-regular">
                            &copy; {currentYear} TELEX. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Custom Scrollbar for light-mode aesthetics */
                .custom-scrollbar-light::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar-light::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar-light::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.15);
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0, 0, 0, 0.3);
                }

                /* Animated Blobs (Spinning) */
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 25s linear infinite;
                }
                .animate-spin-slow-delay {
                    animation: spin-slow 25s linear infinite 5s;
                }
            `}</style>
        </div>
    );
};

export default MobileNav;