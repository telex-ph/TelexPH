import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { COLORS, FONTS, FONT_WEIGHTS } from "@/constant/styles";

const ITEMS = [
  { Icon: MapPin, label: "Our Office", text: "Guimba, Nueva Ecija, Philippines" },
  { Icon: Phone, label: "Call Us", text: "0443252836", href: "tel:+63443252836" },
  { Icon: Mail, label: "Email Us", text: "careers@telexph.com", href: "mailto:careers@telexph.com" },
  { Icon: Clock, label: "Business Hours", text: "Open 24 Hours" }
];

/* Centered heading + a single row of contact details. */
const ContactInfo = () => {
  return <div style={{ fontFamily: FONTS.rubik }}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: COLORS.primary }}>— Contact</p>
        <h2 className="mt-3 text-3xl leading-tight sm:text-5xl" style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: COLORS.black }}>
          Get in <span style={{ color: COLORS.primary }}>Touch</span>
        </h2>
        <div className="mx-auto mt-5 h-1 w-14 rounded-full" style={{ backgroundColor: COLORS.primary }} />
        <p className="mt-5 text-base text-gray-600 sm:text-lg">
          We help you streamline operations, enhance productivity, and scale your business with smart outsourcing solutions.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ Icon, label, text, href }) => (
          <div key={label} className="group flex flex-col items-center gap-3 border-b border-gray-200 p-7 text-center transition-colors last:border-b-0 hover:bg-red-50/50 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 transition-colors group-hover:bg-[#a10000]">
              <Icon className="h-5 w-5 transition-colors group-hover:text-white" style={{ color: COLORS.primary }} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
            {href ? (
              <a href={href} className="break-words text-sm font-semibold text-gray-800 transition-colors hover:text-[#a10000]">{text}</a>
            ) : (
              <span className="text-sm font-semibold text-gray-800">{text}</span>
            )}
          </div>
        ))}
      </div>
    </div>;
};
var stdin_default = ContactInfo;
export {
  stdin_default as default
};
