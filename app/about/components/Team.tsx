"use client";

import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FONT_CLASSES } from "@/constant/styles";

const COLORS = {
  primary: "#a10000",
};

const SEMANTIC_COLORS = {
  text: {
    primary: "#282828",
    secondary: "#6b7280",
  },
  background: {
    primary: "#f9fafb",
  },
};

const FONTS = {
  openSans: "'Open Sans', sans-serif",
  rubik: "'Rubik', sans-serif",
  poppins: "'Poppins', sans-serif",
};

const FONT_WEIGHTS = {
  regular: "400",
  bold: "700",
  black: "900",
};

interface MemberCardProps {
  img: string;
  name: string;
  title: string;
  linkedinUrl: string;
  imagePositionClass?: string;
}

const MemberCard = ({
  img,
  name,
  title,
  linkedinUrl,
  imagePositionClass = "object-center",
}: MemberCardProps) => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-64 flex-shrink-0">
      <div
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('images/bgteam.webp')" }}
      >
        <img
          src={img}
          alt={`Portrait of ${name}`}
          className={`absolute inset-0 w-full h-full object-contain ${imagePositionClass}`}
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#a10000] transform skew-y-[-3deg] origin-bottom-left -mb-4 z-10"></div>
      </div>

      <div className="relative bg-gray-100 p-6 text-center z-20 border-t border-gray-200 flex flex-col justify-center items-center">
        <h3
          className="text-lg leading-snug mb-1"
          style={{
            fontFamily: FONTS.openSans,
            fontWeight: FONT_WEIGHTS.bold,
            color: SEMANTIC_COLORS.text.primary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </h3>
        <p
          className="text-xs mt-0"
          style={{
            fontFamily: FONTS.rubik,
            fontWeight: FONT_WEIGHTS.regular,
            color: SEMANTIC_COLORS.text.secondary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </p>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2"
          aria-label={`LinkedIn profile of ${name}`}
          style={{ color: COLORS.primary }}
        >
          <FaLinkedin size={24} />
        </a>
      </div>
    </div>
  );
};

export default function Team() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: SEMANTIC_COLORS.background.primary }}
    >
      <div className="w-[90%] mx-auto max-w-[1300px] text-center">
        {/* Header */}
        <div className="mb-16">
          <span
            className="text-base uppercase tracking-[0.2em]"
            style={{
              color: COLORS.primary,
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.bold,
            }}
          >
            — MEET OUR TEAM
          </span>

          <h2
            className={`${FONT_CLASSES.openSansBold} text-3xl sm:text-4xl lg:text-5xl mt-3 mb-6 leading-tight`}
            style={{ color: SEMANTIC_COLORS.text.primary }}
          >
            The Team That Helps You <br className="hidden lg:inline" />
            <span style={{ color: COLORS.primary }}>Scale Smarter</span>
          </h2>

          <p
            className="max-w-3xl mx-auto"
            style={{
              color: SEMANTIC_COLORS.text.secondary,
              fontFamily: FONTS.rubik,
              fontWeight: FONT_WEIGHTS.regular,
            }}
          >
            Behind Telix Philippines is a team of dedicated professionals
            passionate about delivering world-class support services. Our people
            are the backbone of our success—highly skilled, diverse, and
            committed to your business growth.
          </p>
        </div>

        {/* Executive Committee */}
        <h2
          className="text-3xl mb-8"
          style={{
            fontFamily: FONTS.poppins,
            fontWeight: FONT_WEIGHTS.bold,
            color: SEMANTIC_COLORS.text.primary,
          }}
        >
          Executive Committee
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-2 md:gap-8 md:max-w-xl md:justify-center md:overflow-x-visible">
            <MemberCard
              img="images/jena_01.webp"
              name="Jenalyn M. Valler"
              title="President & Chief Executive Officer (CEO)"
              linkedinUrl="https://www.linkedin.com/in/jenalyn-valler"
              imagePositionClass="object-center translate-y-13 scale-130"
            />
            <MemberCard
              img="images/Arturo_01.webp"
              name="Arturo D. Valler Jr."
              title="Corporate Secretary"
              linkedinUrl="https://www.linkedin.com/in/arturo-valler"
              imagePositionClass="object-center translate-y-6 scale-130"
            />
          </div>
        </div>

        {/* Executive Office */}
        <h2
          className="text-3xl mb-8"
          style={{
            fontFamily: FONTS.poppins,
            fontWeight: FONT_WEIGHTS.bold,
            color: SEMANTIC_COLORS.text.primary,
          }}
        >
          Executive Office
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-2 md:gap-8 md:max-w-xl md:justify-center md:overflow-x-visible">
            <MemberCard
              img="images/fatima_01.webp"
              name="Fatima M. Guzman"
              title="Executive Director for Admin/HR"
              linkedinUrl="https://www.linkedin.com/in/fatima-guzman"
              imagePositionClass="object-center translate-y-5 scale-130"
            />
            <MemberCard
              img="images/anjeaneth_01.webp"
              name="Anjanneth P. Bilas"
              title="Head of Finance"
              linkedinUrl="https://www.linkedin.com/in/anjanneth-bilas"
              imagePositionClass="object-center translate-y-3 scale-150"
            />
          </div>
        </div>

        {/* Operations Division */}
        <h2
          className="text-3xl mb-8"
          style={{
            fontFamily: FONTS.poppins,
            fontWeight: FONT_WEIGHTS.bold,
            color: SEMANTIC_COLORS.text.primary,
          }}
        >
          Operations Division
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-2 md:gap-8 md:max-w-xl md:justify-center md:overflow-x-visible">
            <MemberCard
              img="images/joanne_01.webp"
              name="Joanne P. Corpuz"
              title="Operations and Talent Acquisition Manager"
              linkedinUrl="https://www.linkedin.com/in/joanne-corpuz"
              imagePositionClass="object-center translate-y-13 scale-130"
            />
            <MemberCard
              img="images/mitch_01.webp"
              name="Michelle D. Soliman"
              title="Client Relations Manager"
              linkedinUrl="https://www.linkedin.com/in/michelle-soliman"
              imagePositionClass="object-center translate-y-5 scale-130"
            />
          </div>
        </div>

        {/* Governance & Technology Division */}
        <h2
          className="text-3xl mb-8"
          style={{
            fontFamily: FONTS.poppins,
            fontWeight: FONT_WEIGHTS.bold,
            color: SEMANTIC_COLORS.text.primary,
          }}
        >
          Governance & Technology Division
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-3 md:gap-8 md:max-w-4xl md:justify-center md:overflow-x-visible">
            <MemberCard
              img="images/mark_01.webp"
              name="Mark Jayson G. Robes"
              title="Information Technology Head"
              linkedinUrl="https://www.linkedin.com/in/mark-robes"
              imagePositionClass="object-center translate-y-12 scale-125"
            />
            <MemberCard
              img="images/maybelle_01.webp"
              name="Maybelle A. Cabalar"
              title="Head of Audit and Compliance"
              linkedinUrl="https://www.linkedin.com/in/maybelle-cabalar"
              imagePositionClass="object-center translate-y-12 scale-125"
            />
            <MemberCard
              img="images/jayro_01.webp"
              name="Jayro DG. Gabriel"
              title="Innovation and Digital Development Manager"
              linkedinUrl="https://www.linkedin.com/in/jayro-gabriel"
              imagePositionClass="object-center -translate-y-2 scale-125"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
