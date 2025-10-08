import React from "react";
import Image from "next/image"; 
import { Phone } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";

const ContactSupport = () => {

    const CARD_INNER_WIDTH_CLASS = DEFAULT_MAX_WIDTH_CLASS.replace("max-w-[1400px]", "max-w-[1200px]");

    return (
        <div className="w-full py-8 bg-gray-50">
            <div
                className={`flex justify-center w-full mx-auto ${CARD_INNER_WIDTH_CLASS}`}
            >
                <div
                    className={`relative bg-gray-50 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_10px_20px_-2px_rgba(0,0,0,0.1)] overflow-hidden w-full`}
                >
                    <div className="flex flex-col md:flex-row items-center px-4 md:px-6 py-6 gap-4 md:gap-0">
                        
                        <div className="relative flex-shrink-0 md:mr-2 flex justify-center w-full md:w-auto">
                            <Image
                                src="/images/handshake.jpg"
                                alt="Business Handshake"
                                width={256} 
                                height={176} 
                                className="w-40 h-28 md:w-64 md:h-44 object-cover rounded-md shadow-md md:rounded-r-lg"
                                loading="lazy"
                            />
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 -right-2 md:-right-6 bg-[${COLORS.primary}] rounded-full p-2 md:p-3 shadow-lg animate-pulse`}
                            >
                                <Phone
                                    className="w-5 h-5 md:w-7 md:h-7 text-white animate-wiggle"
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>

                        <div className="flex-1 md:pl-6 text-center pt-4 pb-0 md:py-0 md:text-left">
                            <h2 className={`text-lg md:text-2xl lg:text-3xl ${FONT_CLASSES.openSansBold} text-gray-900 mb-2 md:mb-4`}>
                                Have Any Questions? Call Us
                            </h2>
                            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 md:gap-4 mb-3">
                                <a
                                    href="tel:+630443315040"
                                    className={`text-lg md:text-xl lg:text-2xl ${FONT_CLASSES.openSansBold} text-[${COLORS.primary}] hover:text-[${COLORS.dark}] transition-colors`}
                                >
                                    +63 (44) 331 - 5040
                                </a>
                                <a
                                    href="mailto:partnerships@telexph.com"
                                    className={`text-base md:text-lg lg:text-xl ${FONT_CLASSES.openSansBold} text-gray-500 hover:text-gray-700 transition-colors`}
                                >
                                    partnerships@telexph.com
                                </a>
                            </div>
                            <p className={`${FONT_CLASSES.rubikRegular} text-gray-500 text-xs md:text-sm leading-snug max-w-lg mx-auto md:mx-0 mt-2`}>
                                Start scaling your business the smarter way with Telex
                                Philippines, your partner in smart support services.
                            </p>
                        </div>

                        <div className={`hidden lg:block absolute -right-10 -bottom-8`}>
                            <div className={`w-28 h-28 bg-[${COLORS.primary}] rounded-full`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;