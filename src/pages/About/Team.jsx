
import { FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { Crown, ShieldCheck, Cpu, Landmark } from "lucide-react";
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
  imagePositionClass = "object-center",
  hoverImg,
  index = 0,
  large = false
}) => {
  return <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className={large ? "w-full max-w-[19rem] mx-auto" : "w-64 max-w-full flex-shrink-0"}
  >
    <div className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-14px_rgba(16,24,40,0.28)] transition-all duration-500 ease-out hover:-translate-y-2 hover:ring-[#a10000]/20 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_28px_48px_-16px_rgba(161,0,0,0.40)]">
      <div className="relative aspect-square overflow-hidden">
        <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('images/bgteam.webp')" }}
  />
        <div
    className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat [clip-path:circle(0%_at_50%_42%)] transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:circle(100%_at_50%_42%)]"
    style={{ backgroundImage: "url('images/bgteam_red2.webp')" }}
  />
        <img
    src={img}
    alt={`Portrait of ${name}`}
    className={`absolute inset-0 w-full h-full object-contain ${imagePositionClass}`}
    loading="lazy"
  />
        {hoverImg && <img
    src={hoverImg}
    alt=""
    aria-hidden
    className={`absolute inset-0 w-full h-full object-contain ${imagePositionClass} [clip-path:circle(0%_at_50%_42%)] transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:circle(100%_at_50%_42%)]`}
    loading="lazy"
  />}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_42%,transparent_55%,rgba(161,0,0,0.18)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-[#a10000] to-[#7a0000] transform skew-y-[-3deg] origin-bottom-left -mb-4 z-10 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-full" />
      </div>

      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 p-6 pt-7 text-center z-20 flex flex-col justify-center items-center">
        <h3
    className={`${FONT_CLASSES.poppinsBlack} text-lg leading-snug mb-1 transition-colors duration-300 group-hover:text-[#a10000]`}
    style={{
      color: SEMANTIC_COLORS.text.primary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%"
    }}
  >
          {name}
        </h3>
        <p
    className={`${rubik.className} text-xs mt-0`}
    style={{
      color: "rgba(40, 40, 40, 0.75)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%"
    }}
  >
          {title}
        </p>

        <a
    href={linkedinUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={`${FONT_CLASSES.openSansBold} mt-3 inline-flex items-center gap-2 rounded-full bg-[#a10000]/10 px-4 py-1.5 text-xs text-[#a10000] transition-all duration-300 hover:bg-[#a10000] hover:text-white hover:scale-105 hover:shadow-lg`}
    aria-label={`LinkedIn profile of ${name}`}
  >
          <FaLinkedin size={16} />
          LinkedIn
        </a>
        <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#c40000] to-[#6f0000] transition-all duration-500 group-hover:w-full" />
      </div>
    </div>
  </motion.div>;
};
const DEPARTMENTS = [
  {
    id: "executive",
    title: "Executive Leadership",
    blurb: "Vision, direction, and corporate governance.",
    members: [
      { img: "images/jena_01.webp", name: "Jenalyn M. Valler", title: "President & Chief Executive Officer (CEO)", linkedinUrl: "https://www.linkedin.com/in/jenavaller/", imagePositionClass: "object-center translate-y-13 scale-130" },
      { img: "images/Arturo_01.webp", name: "Arturo D. Valler Jr.", title: "Corporate Secretary", linkedinUrl: "https://www.linkedin.com/in/arturo-jr-valler-11b600197/", imagePositionClass: "object-center translate-y-6 scale-130" },
      { img: "images/michelle_01.webp", hoverImg: "images/michelle_01_hover3.webp", name: "Michelle D. Soliman", title: "Executive Coordination Officer", linkedinUrl: "https://www.linkedin.com/in/michelle-soliman-a8a825426/", imagePositionClass: "object-center" }
    ]
  },
  {
    id: "administration",
    title: "Administration & Governance",
    headerTitle: "Administration &\nGovernance",
    blurb: "People, compliance, and governance.",
    members: [
      { img: "images/fatima_01.webp", name: "Fatima M. Guzman", title: "Head of People and Administration", linkedinUrl: "https://www.linkedin.com/in/fatima-guzman-b28b9637b/", imagePositionClass: "object-center translate-y-5 scale-130" },
      { img: "images/trixia_02.webp", hoverImg: "images/trixia_02_hover3.webp", name: "Trixia Anne Nagaño", title: "Head of People and Administration", linkedinUrl: "https://www.linkedin.com/in/trixia-anne-nagano-7a96483a0/", imagePositionClass: "object-center" },
      { img: "images/maybelle_01.webp", hoverImg: "images/maybelle_01_hover3.webp", name: "Maybelle A. Cabalar", title: "Head of Audit and Compliance", linkedinUrl: "https://www.linkedin.com/in/maybelle-cabalar/", imagePositionClass: "object-center" }
    ]
  },
  {
    id: "technology",
    title: "Technology, Innovation & Digital Growth",
    headerTitle: "Technology, Innovation &\nDigital Growth",
    blurb: "Systems, innovation, and growth.",
    members: [
      { img: "images/mark_01.webp", name: "Mark Jayson G. Robes", title: "Head of Information Technology", linkedinUrl: "https://www.linkedin.com/in/mark-jayson-robes-7747b3441/", imagePositionClass: "object-center translate-y-12 scale-125" },
      { img: "images/HJ.png", name: "Hannah Joy D. Reyes", title: "Head of Digital Innovation", linkedinUrl: "https://www.linkedin.com/in/hannah-joy-reyes/", imagePositionClass: "object-center translate-y-5 scale-130" },
      { img: "images/rj_01.webp", hoverImg: "images/rj_01_hover3.webp", name: "Rocel J. Fernandez", title: "Head of Growth", linkedinUrl: "https://www.linkedin.com/in/rj-fernandez-610469398/", imagePositionClass: "object-center" }
    ]
  },
  {
    id: "finance",
    title: "Finance & Operations",
    headerTitle: "Finance &\nOperations",
    blurb: "Finance and day-to-day operations.",
    members: [
      { img: "images/eloi_02.webp", hoverImg: "images/eloi_02_hover3.webp", name: "Eloisa Mae Dacayo", title: "Head of Finance", linkedinUrl: "https://www.linkedin.com/in/eloisa-mae-dacayo-a447a6264/", imagePositionClass: "object-top" },
      { img: "images/joanne_01.webp", hoverImg: "images/joanne_01_hover3.webp", name: "Joanne P. Corpuz", title: "Senior Operations / Head of Operations", linkedinUrl: "https://www.linkedin.com/in/joanne-papua-corpuz-776587358/", imagePositionClass: "object-center" },
      { img: "images/marj_01.webp", hoverImg: "images/marj_01_hover3.webp", name: "Marjorie Curamen", title: "Senior Operations / Head of Operations", linkedinUrl: "https://www.linkedin.com/in/marjorie-curamen-a24b79380/", imagePositionClass: "object-center" }
    ]
  }
];
const DEPT_ICONS = { executive: Crown, administration: ShieldCheck, technology: Cpu, finance: Landmark };
const EXECUTIVES = DEPARTMENTS[0];
const TEAM_DEPARTMENTS = DEPARTMENTS.slice(1);
const DepartmentColumn = ({ department, index }) => {
  const Icon = DEPT_ICONS[department.id];
  return <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.05 }}
    transition={{ duration: 0.6, delay: (index - 1) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    className="relative flex flex-col gap-14"
  >
    <span className="pointer-events-none absolute left-1/2 top-[9.75rem] bottom-14 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#a10000] via-[#a10000]/60 to-[#a10000]/10" aria-hidden />
    <div className="group relative z-10 flex min-h-[9.75rem] flex-col justify-start overflow-hidden rounded-2xl bg-gradient-to-br from-[#a10000] to-[#5c0000] px-5 py-5 text-left text-white ring-1 ring-white/10 shadow-[0_18px_36px_-16px_rgba(161,0,0,0.6)] transition-transform duration-500 hover:-translate-y-1">
      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-150" aria-hidden />
      <div className="absolute -top-10 -left-8 h-24 w-24 rounded-full bg-white/[0.06]" aria-hidden />
      <div className="relative flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className={`${FONT_CLASSES.openSansBold} text-[11px] uppercase tracking-[0.25em] text-white/70`}>
            {String(index + 1).padStart(2, "0")} · {department.members.length} members
          </p>
          <h2 className={`${FONT_CLASSES.poppinsBlack} mt-1 min-h-[3.25rem] whitespace-pre text-[1.0625rem] leading-snug`}>{department.headerTitle || department.title}</h2>
        </div>
      </div>
      <p className={`${rubik.className} relative mt-3 border-t border-white/15 pt-3 text-xs leading-relaxed text-white/80`}>{department.blurb}</p>
    </div>
    {department.members.map((member, i) => <div key={member.name} className="relative z-10">
      <MemberCard {...member} index={i} large />
    </div>)}
  </motion.div>;
};
const OrgConnector = () => <div className="relative mx-auto hidden h-16 w-full max-w-6xl lg:block" aria-hidden>
    <motion.span
    initial={{ scaleY: 0 }}
    whileInView={{ scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="absolute left-1/2 top-0 h-8 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[#a10000] to-[#a10000]/80"
  />
    <motion.span
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
    className="absolute left-[calc(16.666%-1.333rem)] right-[calc(16.666%-1.333rem)] top-8 h-[3px] origin-center rounded-full bg-[#a10000]/80"
  />
    <span className="absolute left-1/2 top-8 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a10000] ring-4 ring-[#a10000]/15" />
    <span className="absolute left-1/2 top-8 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#a10000]/60" />
    {["left-[calc(16.666%-1.333rem)]", "left-1/2", "left-[calc(83.333%+1.333rem)]"].map((pos, i) => <motion.span
    key={pos}
    initial={{ scaleY: 0 }}
    whileInView={{ scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
    className={`absolute ${pos} top-8 h-8 w-[3px] origin-top -translate-x-1/2 rounded-full bg-[#a10000]/80`}
  />)}
  </div>;
function Team() {
  return <section
    className="relative py-20 overflow-x-clip"
    style={{ backgroundColor: SEMANTIC_COLORS.background.primary }}
  >
      <div
    className="pointer-events-none absolute inset-0 opacity-[0.35]"
    style={{
    backgroundImage: "radial-gradient(rgba(16,24,40,0.10) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)"
  }}
    aria-hidden
  />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#a10000]/[0.07] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#a10000]/[0.07] blur-3xl" aria-hidden />
      <div className="relative w-[90%] mx-auto max-w-[1300px] text-center">
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

        <div className="mb-2">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c40000] to-[#6f0000] text-white shadow-[0_14px_28px_-10px_rgba(161,0,0,0.6)]">
            <Crown className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <h2 className={`${FONT_CLASSES.poppinsBlack} text-2xl sm:text-3xl`} style={{ color: SEMANTIC_COLORS.text.primary }}>
            {EXECUTIVES.title}
          </h2>
          <p className={`${rubik.className} mx-auto mt-2 max-w-md text-sm text-gray-500`}>{EXECUTIVES.blurb}</p>
          <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-[#c40000] to-[#6f0000]" />
        </div>
        <div className="relative mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a10000]/[0.06] blur-3xl" aria-hidden />
          {EXECUTIVES.members.map((member, i) => <MemberCard key={member.name} {...member} index={i} large />)}
        </div>

        <OrgConnector />

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-x-8 gap-y-14 text-left md:grid-cols-2 lg:mt-0 lg:grid-cols-3 lg:gap-x-16">
          {TEAM_DEPARTMENTS.map((department, i) => <DepartmentColumn key={department.id} department={department} index={i + 1} />)}
        </div>
      </div>
    </section>;
}
export {
  Team as default
};
