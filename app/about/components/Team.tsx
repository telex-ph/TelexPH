"use client";

import React from "react";

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

interface LinkedInLinkProps {
  name: string;
  url: string;
}

const LinkedInLink = ({ name, url }: LinkedInLinkProps) => (
  <div className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-20">
    <a
      href={url || `#linkedin-${name.replace(/\s/g, "-")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-600 hover:text-red-700 transition-colors"
      aria-label={`LinkedIn profile for ${name}`}
    >
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.2 20.45H3.66V9h3.54v11.45zM5.43 7.6C4.2 7.6 3.2 6.6 3.2 5.37c0-1.23 1-2.23 2.23-2.23 1.23 0 2.23 1 2.23 2.23 0 1.23-1 2.23-2.23 2.23zm15.15 12.85h-3.54v-5.5c0-1.32-.47-2.23-1.66-2.23-1.28 0-2.03.87-2.37 1.72-.12.3-.16.63-.16.97v5.04H10.5V9h3.54v1.54c.5-1.1 1.95-2.5 4.34-2.5 3.16 0 5.59 2.08 5.59 6.57v5.34z" />
      </svg>
    </a>
  </div>
);

const MemberCard = ({
  img,
  name,
  title,
  linkedinUrl,
  imagePositionClass = "object-center",
}: MemberCardProps) => {
  return (
    <div
      className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl
			transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm mx-auto"
    >
      {/* Image Section */}
      <div className="relative bg-gray-800 pt-[120%]">
        <img
          src={img}
          alt={`Portrait of ${name}`}
          className={`absolute inset-0 w-full h-full object-contain ${imagePositionClass}`}
          loading="lazy"
        />
        {/* Slanted Red Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#a10000] transform skew-y-[-3deg] origin-bottom-left -mb-4 z-10"></div>
      </div>

      {/* Text Content */}
      <div className="relative bg-white p-4 pt-8 text-left z-20">
        <h3
          className={`text-xl leading-snug`}
          style={{
            fontFamily: FONTS.openSans,
            fontWeight: FONT_WEIGHTS.bold,
            color: SEMANTIC_COLORS.text.primary,
          }}
        >
          {name}
        </h3>
        <p
          className="text-xs sm:text-sm mt-1"
          style={{
            fontFamily: FONTS.rubik,
            fontWeight: FONT_WEIGHTS.regular,
            color: SEMANTIC_COLORS.text.secondary,
          }}
        >
          {title}
        </p>
      </div>

      <LinkedInLink name={name} url={linkedinUrl} />
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
              linkedinUrl="#"
              imagePositionClass="object-center translate-y-16 scale-130"
            />
            <MemberCard
              img="images/Arturo_01.png"
              name="Arturo D. Valler Jr."
              title="Corporate Secretary"
              linkedinUrl="#"
              imagePositionClass="object-center translate-y-7 scale-130"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Executive Office */}
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
                linkedinUrl="#"
                imagePositionClass="object-center translate-y-7 scale-130"
              />
              <MemberCard
                img="images/anjeaneth_01.png"
                name="Anjanneth P. Bilas"
                title="Head of Finance"
                linkedinUrl="#"
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
                linkedinUrl="#"
                imagePositionClass="object-center translate-y-16 scale-130"
              />
              <MemberCard
                img="images/mitch_01.png"
                name="Michelle D. Soliman"
                title="Client Relations Manager"
                linkedinUrl="#"
                imagePositionClass="object-center translate-y-6 scale-130"
              />
            </div>
          </div>
        </div>

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
              linkedinUrl="#"
              imagePositionClass="object-center translate-y-15 scale-125"
            />
            <MemberCard
              img="images/maybelle_01.png"
              name="Maybelle A. Cabalar"
              title="Head of Audit and Compliance"
              linkedinUrl="#"
              imagePositionClass="object-center translate-y-15 scale-125"
            />
            <MemberCard
              img="images/jayro_01.png"
              name="Jayro D.G. Gabriel"
              title="Innovation and Digital Development Manager"
              linkedinUrl="#"
              imagePositionClass="object-center -translate-y-2 scale-125"
            />
          </div>
        </div>
      </div>
    </section>
  );
}