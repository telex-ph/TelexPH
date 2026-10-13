import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { COLORS, FONTS } from "@/constant/styles";

const ADDRESS = "Pangasinan - Nueva Ecija Rd, Guimba, Nueva Ecija, Philippines";
const MAPS_QUERY = encodeURIComponent(`7Q72MQ4C+5MX ${ADDRESS}`);
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;

const ContactMap = () => {
  return (
    <div className="h-full min-h-[480px] flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_24px_60px_-24px_rgba(40,16,16,.35)]">
      {/* header strip */}
      <div className="flex items-center gap-3 px-5 py-4 text-white" style={{ background: `linear-gradient(135deg, ${COLORS.dark}, #4a0a0a)`, fontFamily: FONTS.poppins }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.primary }}>
          <MapPin className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold leading-tight">TELEX Philippines</span>
          <span className="block truncate text-xs text-white/65">{ADDRESS}</span>
        </span>
      </div>

      {/* map */}
      <div className="relative flex-1 min-h-[340px]">
        <iframe
          title="TELEX Philippines office location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.5!2d120.756!3d15.655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMQ4C%2B5MX%2C%20Pangasinan%20-%20Nueva%20Ecija%20Rd%2C%20Guimba%2C%20Nueva%20Ecija!5e0!3m2!1sen!2sph!4v1234567890&zoom=15&disableDefaultUI=true"
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* pin with pulsing ring */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[78px] flex-col items-center">
          <div className="whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold text-white shadow-lg ring-1 ring-white/30" style={{ backgroundColor: COLORS.primary, fontFamily: FONTS.poppins }}>
            TELEX Philippines
          </div>
          <div className="h-[56px] w-[3px]" style={{ backgroundColor: COLORS.primary }} />
          <div className="relative -mt-0.5 flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full opacity-40" style={{ backgroundColor: COLORS.primary }} />
            <span className="relative h-5 w-5 rounded-full border-[3px] border-white shadow-md" style={{ backgroundColor: COLORS.primary }} />
          </div>
        </div>

        {/* soft inner edge */}
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_8px_16px_-12px_rgba(0,0,0,.35)]" />
      </div>

      {/* actions */}
      <div className="flex flex-col gap-3 border-t border-gray-100 p-4 sm:flex-row">
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(161,0,0,.8)] transition-all hover:-translate-y-0.5 hover:brightness-110"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #6e0000)`, fontFamily: FONTS.poppins }}
        >
          <Navigation className="h-4 w-4" /> Get Directions
        </a>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#a10000] hover:text-[#a10000]"
          style={{ fontFamily: FONTS.poppins }}
        >
          <ExternalLink className="h-4 w-4" /> Open in Google Maps
        </a>
      </div>
    </div>
  );
};
var stdin_default = ContactMap;
export {
  stdin_default as default
};
