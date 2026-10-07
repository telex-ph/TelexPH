
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { FONT_CLASSES } from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS } from "@/constant/layout";
const CONTACT_ITEMS = [
  { Icon: Phone, label: "Call Us Directly?", value: "0443252836", href: "tel:+63443252836" },
  { Icon: Mail, label: "For Support?", value: "careers@telexph.com", href: "mailto:careers@telexph.com" },
  { Icon: MapPin, label: "Our Location", value: "Guimba, Nueva Ecija, Philippines", wide: true }
];
const ContactSupport = () => {
  const CARD_INNER_WIDTH_CLASS = DEFAULT_MAX_WIDTH_CLASS.replace(
    "max-w-[1400px]",
    "max-w-[1200px]"
  );
  return <div className="w-full py-6 sm:py-8 md:py-10 bg-gray-50">
      <div
    className={`flex justify-center w-full mx-auto px-4 sm:px-6 ${CARD_INNER_WIDTH_CLASS}`}
  >
        <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_10px_20px_-2px_rgba(0,0,0,0.1)] md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr]">
          <div className="relative h-48 sm:h-56 md:h-auto md:min-h-full">
            <Image
    src="/images/handshake.webp"
    alt="Business Handshake"
    fill
    sizes="(min-width: 1024px) 360px, (min-width: 768px) 300px, 100vw"
    className="object-cover"
    loading="lazy"
  />
            <div className="absolute inset-0 bg-gradient-to-t from-[#a10000]/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#a10000]/10" />
            <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#a10000] shadow-lg ring-4 ring-white/70 animate-pulse">
              <Phone className="h-6 w-6 text-white animate-wiggle" strokeWidth={2.5} />
            </div>
          </div>

          <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:p-10 text-center md:text-left">
            <div>
              <h2 className={`text-2xl md:text-[30px] ${FONT_CLASSES.poppinsBold} text-[#282828] mb-2`}>
                Have Any Questions? Call Us
              </h2>
              <p className={`${FONT_CLASSES.rubikRegular} text-gray-500 text-base leading-relaxed max-w-xl mx-auto md:mx-0`}>
                Start scaling your business the smarter way with Telex Philippines, your partner in smart support services.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {CONTACT_ITEMS.map(({ Icon, label, value, href, wide }) => {
                const valueClass = `block text-sm ${FONT_CLASSES.openSansBold} ${href ? "text-[#a10000] group-hover:text-[#282828] transition-colors" : "text-[#282828]"}`;
                const content = <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fce5e5] text-[#a10000] transition-colors group-hover:bg-[#a10000] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className={`${FONT_CLASSES.rubikRegular} block min-w-0 text-xs sm:text-sm text-gray-500 leading-tight text-left`}>
                    {label}
                    <span className={valueClass}>{value}</span>
                  </span>
                </>;
                const tileClass = `group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all duration-300 hover:border-[#a10000]/30 hover:bg-white hover:shadow-md ${wide ? "lg:col-span-2" : ""}`;
                return href ? <a key={label} href={href} className={tileClass}>{content}</a> : <div key={label} className={tileClass}>{content}</div>;
              })}
            </div>

            <div className="flex w-full md:justify-end md:mt-auto">
              <button
    type="button"
    onClick={() => window.open("https://intl.telexph.com", "_blank")}
    className="group inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-[#a10000] px-6 py-2.5 text-sm sm:text-base font-open-sans-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8a0000] hover:shadow-lg cursor-pointer"
  >
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
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
