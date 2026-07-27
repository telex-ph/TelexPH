
import { FaLinkedin } from "react-icons/fa";
import { Rubik } from "next/font/google";
import { FONT_CLASSES } from "@/constant/styles";
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"]
});
const COLORS = {
  primary: "#a10000"
};
const SEMANTIC_COLORS = {
  text: {
    primary: "#282828",
    secondary: "#282828"
  },
  background: {
    primary: "#f9fafb"
  }
};
const MemberCard = ({
  img,
  name,
  title,
  linkedinUrl,
  imagePositionClass = "object-center"
}) => {
  return <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-64 flex-shrink-0">
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
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#a10000] transform skew-y-[-3deg] origin-bottom-left -mb-4 z-10" />
      </div>

      <div className="relative bg-gray-100 p-6 text-center z-20 border-t border-gray-200 flex flex-col justify-center items-center">
        <h3
    className={`${FONT_CLASSES.poppinsBlack} text-lg leading-snug mb-1`}
    style={{
      color: SEMANTIC_COLORS.text.primary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
          {name}
        </h3>
        <p
    className={`${rubik.className} text-xs mt-0`}
    style={{
      color: SEMANTIC_COLORS.text.secondary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
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
    </div>;
};
function Team() {
  return <section
    className="py-20"
    style={{ backgroundColor: SEMANTIC_COLORS.background.primary }}
  >
      <div className="w-[90%] mx-auto max-w-[1300px] text-center">
        {
    /* Header */
  }
        <div className="mb-16">
          <span
    className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
    style={{ color: COLORS.primary }}
  >
            — MEET OUR TEAM
          </span>

          <h2
    className={`${FONT_CLASSES.poppinsBold} text-3xl sm:text-4xl lg:text-5xl mt-3 mb-6 leading-tight`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
            The Team That Helps You <br className="hidden lg:inline" />
            <span style={{ color: COLORS.primary }}>Scale Smarter</span>
          </h2>

          <p
    className={`${rubik.className} max-w-3xl mx-auto`}
    style={{ color: "rgba(40, 40, 40, 0.7)" }}
  >
            Behind Telix Philippines is a team of dedicated professionals
            passionate about delivering world-class support services. Our people
            are the backbone of our success—highly skilled, diverse, and
            committed to your business growth.
          </p>
        </div>

        {
    /* Executive Leadership */
  }
        <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl mb-8`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
          Executive Leadership
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

        {
    /* Executive Assistant Office */
  }
        <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl mb-8`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
          Executive Coordination Office
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-1 md:gap-8 md:max-w-xs md:justify-center md:overflow-x-visible">
            <MemberCard
    img="images/Michelle.png"
    name="Michelle D. Soliman"
    title="Executive Coordination Officer"
    linkedinUrl="https://www.linkedin.com/in/michelle-soliman"
    imagePositionClass="object-center translate-y-5 scale-130"
  />
          </div>
        </div>

        {
    /* Administration & Governance */
  }
        <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl mb-8`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
          Administration & Governance
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-2 md:gap-8 md:max-w-xl md:justify-center md:overflow-x-visible">
            <MemberCard
    img="images/fatima_01.webp"
    name="Fatima M. Guzman"
    title="Head of People and Administration"
    linkedinUrl="https://www.linkedin.com/in/fatima-guzman"
    imagePositionClass="object-center translate-y-5 scale-130"
  />
            <MemberCard
    img="images/maybelle_01.webp"
    name="Maybelle A. Cabalar"
    title="Head of Audit and Compliance"
    linkedinUrl="https://www.linkedin.com/in/maybelle-cabalar"
    imagePositionClass="object-center translate-y-12 scale-125"
  />
          </div>
        </div>

        {
    /* Finance & Operations */
  }
        <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl mb-8`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
          Finance & Operations
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-3 md:gap-8 md:max-w-4xl md:justify-center md:overflow-x-visible">
            <MemberCard
    img="images/anjeaneth_01.webp"
    name="Anjanneth P. Bilas"
    title="Head of Finance"
    linkedinUrl="https://www.linkedin.com/in/anjanneth-bilas"
    imagePositionClass="object-center translate-y-3 scale-150"
  />
            <MemberCard
    img="images/joanne_01.webp"
    name="Joanne P. Corpuz"
    title="Senior Operations / Head of Operations"
    linkedinUrl="https://www.linkedin.com/in/joanne-corpuz"
    imagePositionClass="object-center translate-y-13 scale-130"
  />
            <MemberCard
    img="images/Marj.png"
    name="Marjorie Curamen"
    title="Senior Operations"
    linkedinUrl="https://www.linkedin.com/in/marjorie-curamen"
    imagePositionClass="object-center translate-y-5 scale-130"
  />
          </div>
        </div>

        {
    /* Technology & Innovation */
  }
        <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl mb-8`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
          Technology & Digital Innovation
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-2 md:gap-8 md:max-w-xl md:justify-center md:overflow-x-visible">
            <MemberCard
    img="images/mark_01.webp"
    name="Mark Jayson G. Robes"
    title="Information Technology Head"
    linkedinUrl="https://www.linkedin.com/in/mark-robes"
    imagePositionClass="object-center translate-y-12 scale-125"
  />
            <MemberCard
    img="images/HJ.png"
    name="Hannah D. Joy Reyes"
    title="Head of Innovation"
    linkedinUrl="https://www.linkedin.com/in/hannah-reyes"
    imagePositionClass="object-center translate-y-5 scale-130"
  />
          </div>
        </div>

        {
    /* Creatives & Marketing */
  }
        <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl mb-8`}
    style={{ color: SEMANTIC_COLORS.text.primary }}
  >
          Creatives & Marketing
        </h2>
        <div className="flex justify-center mb-16">
          <div className="flex flex-row overflow-x-auto justify-start gap-4 sm:gap-6 md:grid md:grid-cols-1 md:gap-8 md:max-w-xs md:justify-center md:overflow-x-visible">
            <MemberCard
    img="images/RJ.png"
    name="Rocel J. Fernandez"
    title="Head of Growth"
    linkedinUrl="https://www.linkedin.com/in/rocel-fernandez"
    imagePositionClass="object-center translate-y-5 scale-130"
  />
          </div>
        </div>
      </div>
    </section>;
}
export {
  Team as default
};
