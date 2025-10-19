import React from "react";
import { COLORS, FONTS, FONT_WEIGHTS, FONT_CLASSES } from "@/constant/styles";

const ContactInfo: React.FC = () => {
  const secondaryTextColor = "#6b7280";

  return (
    <div className="mt-8 space-y-10">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-block mb-4">
          <span
            className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-full inline-block`}
            style={{
              color: COLORS.primary,
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.bold,
            }}
          >
            — CONTACT
          </span>
        </div>

        <h2
          className={`${FONT_CLASSES.poppinsBlack} text-3xl md:text-4xl lg:text-5xl mb-4`}
          style={{
            color: COLORS.black,
            fontFamily: FONTS.poppins,
            fontWeight: FONT_WEIGHTS.black,
          }}
        >
          Get in <span style={{ color: COLORS.primary }}>Touch</span>
        </h2>

        <p
          className={`${FONT_CLASSES.rubikRegular} text-lg text-gray-600 mt-4 max-w-2xl mx-auto md:mx-0`}
          style={{
            fontFamily: FONTS.rubik,
          }}
        >
          We help you streamline operations, enhance productivity, and scale
          your business with smart outsourcing solutions.
        </p>
      </div>
      <div className="space-y-4 mt-8">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0" style={{ color: COLORS.primary }}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div>
            <h3
              className={`${FONT_CLASSES.poppinsBlack} text-lg mb-1`}
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.black,
              }}
            >
              Our Office
            </h3>
            <p
              className={`${FONT_CLASSES.rubikRegular}`}
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
            >
              Guimba, Nueva Ecija, 
              <br />
              Philippines
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0" style={{ color: COLORS.primary }}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <div>
            <h3
              className={`${FONT_CLASSES.poppinsBlack} text-lg mb-1`}
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.black,
              }}
            >
              Get in Touch
            </h3>

            <a
              href="tel:+6344331-5040"
              className={`${FONT_CLASSES.rubikRegular} block transition-colors`}
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = secondaryTextColor)
              }
            >
              +63 (44) 331 - 5040
            </a>

            <a
              href="mailto:partnerships@telexph.com"
              className={`${FONT_CLASSES.rubikRegular} block transition-colors`}
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.primary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = secondaryTextColor)
              }
            >
              heyjena@telexph.com
            </a>
          </div>
        </div>
      </div>
      <div className="pt-6 mt-8 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0" style={{ color: COLORS.primary }}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v5l3 2"
              />
            </svg>
          </div>
          <div>
            <h3
              className={`${FONT_CLASSES.poppinsBlack} text-lg mb-3`}
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.black,
              }}
            >
              Business Hours
            </h3>
            <div
              className={`${FONT_CLASSES.rubikRegular} space-y-2`}
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
            >
              <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p>Saturday: 8:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
