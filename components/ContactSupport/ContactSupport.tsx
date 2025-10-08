import React from "react";
import { Phone } from "lucide-react";

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#800000";
const CARD_INNER_MAX_WIDTH_CLASS = "max-w-[1200px] px-3 sm:px-6 lg:px-8";

const SECTION_HEIGHT = {
  hero: "min-h-[90vh] max-h-[850px]",
  standard: "min-h-[600px] max-h-[800px]",
  compact: "",
  full: "min-h-screen max-h-[1150px]",
} as const;

const ContactSupport = () => {
  return (
    <div className={`w-full py-8 ${SECTION_HEIGHT.compact} bg-gray-50`}>
      <div
        className={`flex justify-center w-full mx-auto ${CARD_INNER_MAX_WIDTH_CLASS}`}
      >
        <div
          className={`relative bg-gray-50 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_10px_20px_-2px_rgba(0,0,0,0.1)] overflow-hidden w-full`}
        >
          <div className="flex flex-col md:flex-row items-center px-4 md:px-6 py-6 gap-4 md:gap-0">
            <div className="relative flex-shrink-0 md:mr-2 flex justify-center w-full md:w-auto">
              <img
                src="images/handshake.jpg"
                alt="Business Handshake"
                className="w-40 h-28 md:w-64 md:h-44 object-cover rounded-md shadow-md md:rounded-r-lg"
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 -right-2 md:-right-6 bg-[${DARK_RED}] rounded-full p-2 md:p-3 shadow-lg animate-pulse`}
              >
                <Phone
                  className="w-5 h-5 md:w-7 md:h-7 text-white animate-wiggle"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <div className="flex-1 md:pl-6 text-center pt-4 pb-0 md:py-0 md:text-left">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-open-sans-bold text-gray-900 mb-2 md:mb-4">
                Have Any Questions? Call Us
              </h2>
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 md:gap-4 mb-3">
                <a
                  href="tel:+630443315040"
                  className={`text-lg md:text-xl lg:text-2xl font-open-sans-bold text-[${DARK_RED}] hover:text-[${HOVER_DARK_RED}] transition-colors`}
                >
                  +63 (44) 331 - 5040
                </a>
                <a
                  href="mailto:partnerships@telexph.com"
                  className="text-base md:text-lg lg:text-xl font-open-sans-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  partnerships@telexph.com
                </a>
              </div>
              <p className="font-rubik-regular text-gray-500 text-xs md:text-sm leading-snug max-w-lg mx-auto md:mx-0 mt-2">
                Start scaling your business the smarter way with Telex
                Philippines, your partner in smart support services.
              </p>
            </div>

            <div className={`hidden lg:block absolute -right-10 -bottom-8`}>
              <div className={`w-28 h-28 bg-[${DARK_RED}] rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
