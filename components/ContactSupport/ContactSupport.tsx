import React from "react";
import Image from "next/image"; 
import { Phone } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

const ContactSupport = () => {

    const CARD_INNER_WIDTH_CLASS = DEFAULT_MAX_WIDTH_CLASS.replace("max-w-[1400px]", "max-w-[1200px]");

    return (
        <div className="w-full py-4 sm:py-6 md:py-8 bg-gray-50">
            <div
                className={`flex justify-center w-full mx-auto px-4 sm:px-6 ${CARD_INNER_WIDTH_CLASS}`}
            >
                <div
                    className={`relative bg-gray-50 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_10px_20px_-2px_rgba(0,0,0,0.1)] overflow-hidden w-full`}
                >
                    <div className="flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6 gap-4 md:gap-6">
                        
                        {/* Image Section with Phone Icon */}
                        <div className="relative flex-shrink-0 flex justify-center w-full md:w-auto mb-2 md:mb-0">
                            <div className="relative inline-block">
                                <Image
                                    src="/images/handshake.webp"
                                    alt="Business Handshake"
                                    width={256} 
                                    height={176} 
                                    className="w-32 h-24 sm:w-44 sm:h-32 md:w-56 md:h-40 lg:w-64 lg:h-44 object-cover rounded-md shadow-md"
                                    loading="lazy"
                                />
                                <div
                                    className={`absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-4 md:-right-8 lg:-right-10 bg-[${COLORS.primary}] rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg animate-pulse`}
                                >
                                    <Phone
                                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white animate-wiggle"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 md:pl-4 lg:pl-6 text-center md:text-left w-full">
                            <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-2 sm:mb-3 md:mb-4`}>
                                Have Any Questions? Call Us
                            </h2>
                            
                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center sm:justify-center md:justify-start md:items-start lg:items-baseline gap-2 sm:gap-3 md:gap-2 lg:gap-4 mb-2 sm:mb-3">
                                <a
                                    href="tel:+630443315040"
                                    className={`text-base sm:text-lg md:text-xl lg:text-2xl ${FONT_CLASSES.openSansBold} text-[${COLORS.primary}] hover:text-[${COLORS.dark}] transition-colors whitespace-nowrap`}
                                >
                                    +63 (44) 331 - 5040
                                </a>
                                <a
                                    href="mailto:partnerships@telexph.com"
                                    className={`text-sm sm:text-base md:text-lg lg:text-xl ${FONT_CLASSES.openSansBold} text-gray-500 hover:text-gray-700 transition-colors break-all sm:break-normal`}
                                >
                                    partnerships@telexph.com
                                </a>
                            </div>
                            
                            {/* Description */}
                            <p className={`${FONT_CLASSES.rubikRegular} text-gray-500 text-xs sm:text-sm md:text-sm leading-relaxed sm:leading-snug max-w-full sm:max-w-xl md:max-w-lg mx-auto md:mx-0 mt-2 px-2 sm:px-0`}>
                                Start scaling your business the smarter way with Telex
                                Philippines, your partner in smart support services.
                            </p>
                        </div>

                        {/* Decorative Circle - Hidden on mobile and tablet */}
                        <div className={`hidden xl:block absolute -right-10 -bottom-8`}>
                            <div className={`w-28 h-28 bg-[${COLORS.primary}] rounded-full`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;