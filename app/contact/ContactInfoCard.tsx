"use client";

import React from "react";
import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { COLORS, FONTS, FONT_WEIGHTS } from "@/constant/styles";

interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 border border-gray-200 bg-white text-gray-600 hover:text-[color:var(--color-primary)] hover:border-[color:var(--color-primary)]"
    style={{
      fontFamily: FONTS.rubik,
    }}
  >
    {children}
  </a>
);

export const ContactInfoCard: React.FC = () => {
  return (
    <div className="flex flex-col p-6 space-y-6 bg-white rounded-lg shadow-xl border border-gray-50 h-full">
      {/* Placeholder / Image */}
      <div
        className="w-full h-48 rounded-md bg-gray-200"
        aria-label="Placeholder Image/Content"
      />

      {/* Need Solution Section */}
      <div className="space-y-3">
        <h3
          className="text-xl font-bold"
          style={{
            color: COLORS.dark,
            fontFamily: FONTS.poppins,
          }}
        >
          Need Solution?
        </h3>
        <p
          className="text-sm text-gray-600"
          style={{
            fontFamily: FONTS.rubik,
          }}
        >
          Our experts provide thorough consultations to assess your energy needs
          and design a system that works best for you. We handle all the
          planning, permitting, and paperwork for a hassle-free experience.
        </p>
      </div>

      <hr className="border-gray-100" />

      {/* Support Center + Socials */}
      <div className="flex justify-between items-start pt-2">
        {/* Support Center */}
        <div>
          <p
            className="text-xs uppercase tracking-wider mb-1 text-gray-500"
            style={{
              fontFamily: FONTS.rubik,
              fontWeight: FONT_WEIGHTS.semibold,
            }}
          >
            Support Center
          </p>
          <a
            href="tel:+63443315040"
            className="text-lg font-semibold transition-colors duration-200 hover:underline"
            style={{
              color: COLORS.primary,
              fontFamily: FONTS.poppins,
            }}
          >
            +63 (044) 331-5040
          </a>
        </div>

        {/* Follow Us */}
        <div className="text-right">
          <p
            className="text-xs uppercase tracking-wider mb-2 text-gray-500"
            style={{
              fontFamily: FONTS.rubik,
              fontWeight: FONT_WEIGHTS.semibold,
            }}
          >
            Follow Us
          </p>
          <div className="flex space-x-2 justify-end">
            <SocialIcon href="https://facebook.com" label="Facebook">
              <Facebook size={14} />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com" label="LinkedIn">
              <Linkedin size={14} />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" label="Twitter">
              <Twitter size={14} />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" label="Instagram">
              <Instagram size={14} />
            </SocialIcon>
          </div>
        </div>
      </div>
    </div>
  );
};
