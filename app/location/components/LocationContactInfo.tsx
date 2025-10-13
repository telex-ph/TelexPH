import React from 'react';
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS } from '@/constant/styles';

const LocationContactInfo = () => {
  const secondaryTextColor = '#6b7280';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <p
          className="text-sm mb-2 uppercase tracking-wider"
          style={{
            fontFamily: FONTS.openSans,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.primary,
          }}
        >
          CONTACT
        </p>
        <h2
          className="text-3xl md:text-4xl mb-3"
          style={{
            fontFamily: FONTS.openSans,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.black,
          }}
        >
          Get in Touch
        </h2>
        <p
          className="text-lg"
          style={{
            fontFamily: FONTS.rubik,
            color: secondaryTextColor,
          }}
        >
          We help you streamline operations, enhance productivity, and scale your business with smart outsourcing solutions.
        </p>
      </div>

      {/* Our Office */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0" style={{ color: COLORS.primary }}>
            {/* Location Icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div>
            <h3
              className="text-lg mb-1"
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.black,
              }}
            >
              Our office
            </h3>
            <p
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
            >
              MQ4C+5MX, Pangasinan - Nueva Ecija Rd<br />
              Guimba, Nueva Ecija, Philippines
            </p>
          </div>
        </div>
      </div>

      {/* Get in Touch (Contact Info) */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0" style={{ color: COLORS.primary }}>
            {/* Mail Icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div>
            <h3
              className="text-lg mb-1"
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.black,
              }}
            >
              Get in touch
            </h3>
            {/* Phone Number Link */}
            <a
              href="tel:+6344331-5040"
              className="block transition-colors"
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = secondaryTextColor)}
            >
              +63 (44) 331 - 5040
            </a>
            {/* Email Link */}
            <a
              href="mailto:partnerships@telexph.com"
              className="block transition-colors"
              style={{
                fontFamily: FONTS.rubik,
                color: secondaryTextColor,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = secondaryTextColor)}
            >
              partnerships@telexph.com
            </a>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0" style={{ color: COLORS.primary }}>
            {/* ⏰ Time / Clock Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
          </div>
          <div>
            <h3
              className="text-lg mb-3"
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.black,
              }}
            >
              Business Hours
            </h3>
            <div
              className="space-y-2"
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

export default LocationContactInfo;
