
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";
const CONTACT_ITEMS = [
  { Icon: Phone, label: "Call Us Directly?", value: "0443252836", href: "tel:+63443252836" },
  { Icon: Mail, label: "For Support?", value: "careers@telexph.com", href: "mailto:careers@telexph.com" },
  { Icon: MapPin, label: "Our Location", value: "Guimba, Nueva Ecija, Philippines" }
];
const ContactSupport = () => {
  const CARD_INNER_WIDTH_CLASS = DEFAULT_MAX_WIDTH_CLASS.replace(
    "max-w-[1400px]",
    "max-w-[1200px]"
  );
  return <div className="w-full py-3 sm:py-5 md:py-7 bg-gray-50">
      <div
    className={`flex justify-center w-full mx-auto px-4 sm:px-6 ${CARD_INNER_WIDTH_CLASS}`}
  >
        <div
    className={`relative bg-gray-50 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_10px_20px_-2px_rgba(0,0,0,0.1)] overflow-hidden w-full`}
  >
          <div className="flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6 gap-4 md:gap-6">
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

            <div className="flex-1 md:pl-4 lg:pl-6 text-center md:text-left w-full">
              <h2
    className={`text-2xl md:text-[30px] ${FONT_CLASSES.poppinsBold} text-[${COLORS.dark}] mb-2 sm:mb-3 md:mb-4`}
  >
                Have Any Questions? Call Us
              </h2>

              <div className="flex flex-col sm:flex-row sm:flex-wrap md:flex-col lg:flex-row items-center md:items-start sm:justify-center md:justify-start gap-3 sm:gap-x-8 sm:gap-y-3 mb-3 sm:mb-4">
                {CONTACT_ITEMS.map(({ Icon, label, value, href }) => {
                  const valueClass = `block text-sm sm:text-base ${FONT_CLASSES.openSansBold} whitespace-nowrap ${href ? "text-[#a10000] hover:text-[#282828] transition-colors" : "text-[#282828]"}`;
                  return <div key={label} className="flex items-center gap-3 text-left">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fce5e5] text-[#a10000]">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className={`${FONT_CLASSES.rubikRegular} block text-xs text-gray-500 leading-tight`}>
                      {label}
                      {href ? <a href={href} className={valueClass}>{value}</a> : <span className={valueClass}>{value}</span>}
                    </span>
                  </div>;
                })}
              </div>

              <p
    className={`${FONT_CLASSES.rubikRegular} text-gray-500 text-base leading-relaxed max-w-full sm:max-w-xl md:max-w-lg mx-auto md:mx-0 mt-1`}
  >
                Start scaling your business the smarter way with Telex
                Philippines, your partner in smart support services.
              </p>

              <div className="mt-2 sm:mt-4">
                <button
    type="button"
    onClick={() => window.open(
      "https://hiretelex.com/scale-with-telex",
      "_blank"
    )}
    className="bg-[#a10000] hover:bg-red-700 text-white px-6 py-2.5 text-sm sm:text-base font-open-sans-bold rounded transition-colors cursor-pointer"
  >
                  Contact Us
                </button>
              </div>
            </div>

            <div className={`hidden xl:block absolute -right-10 -bottom-8`}>
              <div
    className={`w-28 h-28 bg-[${COLORS.primary}] rounded-full`}
  />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
var stdin_default = ContactSupport;
export {
  stdin_default as default
};
