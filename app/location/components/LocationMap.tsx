import React from "react";
import {
  COLORS,
  FONTS,
  FONT_WEIGHTS,
  getColorWithOpacity,
} from "@/constant/styles";
import { DEFAULT_MAX_WIDTH_CLASS, SECTION_HEIGHT } from "@/constant/layout";

const LocationMap = () => {
  return (
    <section
      className={`relative w-screen left-1/2 right-1/2 -mx-[50vw] py-16 md:py-20 ${SECTION_HEIGHT.standard}`}
      style={{
        backgroundColor: "#f3f4f6",
      }}
    >
      <div className={`${DEFAULT_MAX_WIDTH_CLASS} space-y-10 text-center`}>
        {/* Address */}
        <div>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: FONTS.rubik,
              fontWeight: FONT_WEIGHTS.bold,
              color: getColorWithOpacity("dark", 0.7),
            }}
          >
            Guimba, Nueva Ecija, Philippines
          </p>
        </div>

        {/* Map */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-xl border transition-transform duration-500 hover:scale-[1.01]"
          style={{
            borderColor: COLORS.primaryLightBorder,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d478.34912517522844!2d120.77153623320268!3d15.655633368301466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33912cc48bef12e3%3A0x433512b75eadf1c2!2sMQ4C%2B5R8%2C%20Pangasinan%20-%20Nueva%20Ecija%20Rd%2C%20Guimba%2C%20Nueva%20Ecija!5e1!3m2!1sfil!2sph!4v1761804948643!5m2!1sfil!2sph"
            className="w-full h-[300px] sm:h-[400px] md:h-[450px]"
            style={{
              border: 0,
              filter: "grayscale(5%) contrast(1.05)",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="TELEX Office Location"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.google.com/maps/dir//MQ4C+5MX,+Pangasinan+-+Nueva+Ecija+Rd,+Guimba,+Nueva+Ecija"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg text-center shadow-sm transition-all duration-300"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.semibold,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = getColorWithOpacity(
                "primary",
                0.85
              ))
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.primary)
            }
          >
            Get Directions
          </a>

          <a
            href="https://www.google.com/maps/place/MQ4C+5MX,+Pangasinan+-+Nueva+Ecija+Rd,+Guimba,+Nueva+Ecija"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg border-2 text-center transition-all duration-300"
            style={{
              backgroundColor: COLORS.white,
              color: COLORS.black,
              borderColor: getColorWithOpacity("dark", 0.1),
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.semibold,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primaryLight;
              e.currentTarget.style.borderColor = COLORS.primary;
              e.currentTarget.style.color = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.white;
              e.currentTarget.style.borderColor = getColorWithOpacity(
                "dark",
                0.1
              );
              e.currentTarget.style.color = COLORS.black;
            }}
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
