"use client";

import React from "react";
import { FaLinkedin } from "react-icons/fa"; // Import the LinkedIn icon

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

// --------------------------------------------
// Define TypeScript interfaces
// --------------------------------------------
interface MemberCardProps {
  img: string;
  name: string;
  title: string;
  linkedinUrl: string;
  imagePositionClass?: string;
}

// --------------------------------------------
// Member Card Component (with background image)
// --------------------------------------------
const MemberCard = ({
  img,
  name,
  title,
  linkedinUrl,
  imagePositionClass = "object-center",
}: MemberCardProps) => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm mx-auto">
      {/* Image Section - now with background image */}
      <div
        className="relative pt-[120%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('images/bgmeet.png')",
        }}
      >
        <img
          src={img}
          alt={`Portrait of ${name}`}
          className={`absolute inset-0 w-full h-full object-contain ${imagePositionClass}`}
          loading="lazy"
        />
        {/* Slanted Red Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#a10000] transform skew-y-[-3deg] origin-bottom-left -mb-4 z-10"></div>
      </div>

      {/* Text Section */}
      <div
        className="relative bg-gray-100 p-6 text-center z-20 border-t border-gray-200"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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

// --------------------------------------------
// Main Team Section
// --------------------------------------------
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

          <h1
            className="mt-4 mb-4 text-4xl md:text-5xl leading-tight"
            style={{
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.black,
              color: SEMANTIC_COLORS.text.primary,
            }}
          >
            The Team That Helps You Scale Smarter
          </h1>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl">
            <MemberCard
              img="images/jena_01.png"
              name="Jenalyn M. Valler"
              title="President & Chief Executive Officer (CEO)"
              linkedinUrl="https://www.linkedin.com/in/jenalyn-valler"
              imagePositionClass="object-center translate-y-16 scale-130"
            />
            <MemberCard
              img="images/Arturo_01.png"
              name="Arturo D. Valler Jr."
              title="Corporate Secretary"
              linkedinUrl="https://www.linkedin.com/in/arturo-valler"
              imagePositionClass="object-center translate-y-7 scale-130"
            />
          </div>
        </div>

        {/* Executive Office */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MemberCard
                img="images/fatima_01.png"
                name="Fatima M. Guzman"
                title="Executive Director for Admin/HR"
                linkedinUrl="https://www.linkedin.com/in/fatima-guzman"
                imagePositionClass="object-center translate-y-7 scale-130"
              />
              <MemberCard
                img="images/anjeaneth_01.png"
                name="Anjanneth P. Bilas"
                title="Head of Finance"
                linkedinUrl="https://www.linkedin.com/in/anjanneth-bilas"
                imagePositionClass="object-center translate-y-3 scale-150"
              />
            </div>
          </div>

          {/* Operations Division */}
          <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MemberCard
                img="images/joanne_01.png"
                name="Joanne P. Corpuz"
                title="Operations and Talent Acquisition Manager"
                linkedinUrl="https://www.linkedin.com/in/joanne-corpuz"
                imagePositionClass="object-center translate-y-16 scale-130"
              />
              <MemberCard
                img="images/mitch_01.png"
                name="Michelle D. Soliman"
                title="Client Relations Manager"
                linkedinUrl="https://www.linkedin.com/in/michelle-soliman"
                imagePositionClass="object-center translate-y-6 scale-130"
              />
            </div>
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
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <MemberCard
              img="images/mark_01.png"
              name="Mark Jayson G. Robes"
              title="Information Technology Head"
              linkedinUrl="https://www.linkedin.com/in/mark-robes"
              imagePositionClass="object-center translate-y-15 scale-125"
            />
            <MemberCard
              img="images/maybelle_01.png"
              name="Maybelle A. Cabalar"
              title="Head of Audit and Compliance"
              linkedinUrl="https://www.linkedin.com/in/maybelle-cabalar"
              imagePositionClass="object-center translate-y-15 scale-125"
            />
            <MemberCard
              img="images/jayro_01.png"
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
