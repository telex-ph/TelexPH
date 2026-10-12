import { motion } from "framer-motion";
import { Target, Users, Award, TrendingUp, Heart } from "lucide-react";
import { Rubik } from "next/font/google";
import { COLORS, FONT_CLASSES, getColorWithOpacity } from "@/constant/styles";
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"]
});
const CORE_VALUES = [
  {
    title: "Provide",
    desc: "Jobs and to give employee a friendly work environment where they can hone their skills.",
    Icon: Users
  },
  {
    title: "Contribute",
    desc: "To the continued worldwide development of service industry through management.",
    Icon: Award
  },
  {
    title: "Pursue",
    desc: "Total Quality and Customer Satisfaction allowing Company, Employees, and Community to grow.",
    Icon: TrendingUp
  },
  {
    title: "Grow & Prosper",
    desc: "With an appreciative feeling of mutual pride & trust.",
    Icon: Heart
  }
];
const MOBILE_ORDER = ["order-1", "order-2", "order-3", "order-4"];
function ValueCard({ title, desc, Icon, index, side }) {
  const fromLeft = side === "left";
  return <motion.div
    initial={{ opacity: 0, x: fromLeft ? -40 : 40, y: 16 }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className={`relative ${MOBILE_ORDER[index]}`}
  >
      <span
    aria-hidden
    className={`pointer-events-none absolute top-1/2 hidden h-[3px] w-10 -translate-y-1/2 bg-gradient-to-r lg:block ${fromLeft ? "-right-10 from-[#a10000] to-[#a10000]/20" : "-left-10 from-[#a10000]/20 to-[#a10000]"}`}
  />
      <div className="group relative h-full overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-gray-900/5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_36px_-16px_rgba(16,24,40,0.28)] transition-all duration-500 hover:-translate-y-1.5 hover:ring-[#a10000]/20 hover:shadow-[0_30px_56px_-20px_rgba(161,0,0,0.45)]">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.2] bg-gradient-to-r from-[#c40000] to-[#6f0000] transition-transform duration-500 group-hover:scale-x-100" />
        <span
    aria-hidden
    className={`${FONT_CLASSES.poppinsBlack} pointer-events-none absolute -right-2 -top-4 select-none text-[6rem] leading-none text-transparent`}
    style={{ WebkitTextStroke: "1.5px rgba(161,0,0,0.16)" }}
  >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative flex items-center gap-4">
          <div
    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-[#a10000] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#c40000] group-hover:to-[#6f0000] group-hover:text-white group-hover:shadow-[0_14px_28px_-10px_rgba(161,0,0,0.6)]"
    style={{ backgroundColor: COLORS.primaryLight }}
  >
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`${FONT_CLASSES.openSansBold} text-sm text-[#a10000]`}>To</span>
            <h3 className={`${FONT_CLASSES.poppinsBlack} text-xl leading-tight transition-colors duration-300 group-hover:text-[#a10000] sm:text-2xl`} style={{ color: COLORS.dark }}>{title}</h3>
          </div>
        </div>
        <span className="relative mt-4 block h-0.5 w-8 rounded-full bg-[#a10000]/30 transition-all duration-500 group-hover:w-20 group-hover:bg-[#a10000]" />
        <p className={`${rubik.className} relative mt-4 text-[14px] leading-relaxed text-gray-700`}>{desc}</p>
      </div>
    </motion.div>;
}
function CoreValuePanels() {
  return <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-20">
      <div className="contents lg:order-1 lg:grid lg:gap-8">
        <ValueCard {...CORE_VALUES[0]} index={0} side="left" />
        <ValueCard {...CORE_VALUES[2]} index={2} side="left" />
      </div>

      <motion.div
    initial={{ opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ type: "spring", stiffness: 140, damping: 16 }}
    className="order-first mx-auto lg:order-2"
  >
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <motion.span
    aria-hidden
    className="absolute inset-0 rounded-full border-2 border-dashed border-[#a10000]/40"
    animate={{ rotate: 360 }}
    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
  />
          <motion.span
    aria-hidden
    className="absolute inset-5 rounded-full border border-[#a10000]/25"
    animate={{ rotate: -360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
  >
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#a10000] shadow-[0_0_14px_rgba(161,0,0,0.8)]" />
          </motion.span>
          <motion.span
    aria-hidden
    className="absolute inset-10 rounded-full bg-[#a10000]/10"
    animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.25, 0.7] }}
    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
  />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full text-white ring-8 ring-gray-50 shadow-[0_26px_50px_-14px_rgba(161,0,0,0.7)] sm:h-36 sm:w-36" style={{ background: "linear-gradient(145deg,#c40000 0%,#8a0000 55%,#4d0a0a 100%)" }}>
            <svg className="h-14 w-14 sm:h-16 sm:w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 9l10 13 10-13-10-7z" />
              <path d="M2 9h20" />
              <path d="M12 2l4 7-4 13-4-13 4-7z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="contents lg:order-3 lg:grid lg:gap-8">
        <ValueCard {...CORE_VALUES[1]} index={1} side="right" />
        <ValueCard {...CORE_VALUES[3]} index={3} side="right" />
      </div>
    </div>;
}
function MissionVision() {
  return <div className="bg-gray-50">
      {
    /* Mission & Vision Section */
  }
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div
    aria-hidden
    className="pointer-events-none absolute inset-0"
    style={{
    backgroundImage: "repeating-linear-gradient(135deg, rgba(161,0,0,0.05) 0, rgba(161,0,0,0.05) 1px, transparent 1px, transparent 22px)",
    maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)"
  }}
  />
        <svg aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] text-[#a10000]" viewBox="0 0 400 400" fill="none" stroke="currentColor">
          {[60, 100, 140, 180].map((r, i) => <circle key={r} cx="200" cy="200" r={r} strokeWidth="1.2" opacity={0.18 - i * 0.03} strokeDasharray={i % 2 ? "6 8" : "none"} />)}
          <circle cx="200" cy="200" r="22" fill="currentColor" opacity="0.08" stroke="none" />
        </svg>
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#a10000]/[0.07] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#a10000]/[0.06] blur-3xl" />
        {
    /* Header */
  }
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 sm:mb-16 text-left">
          <span
    className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
    style={{ color: COLORS.primary }}
  >
            — WHAT DRIVES US FORWARD
          </span>
          <h2
    className={`${FONT_CLASSES.poppinsBold} text-3xl sm:text-4xl lg:text-5xl mt-3 leading-tight`}
    style={{ color: "#282828" }}
  >
            Our Purpose &amp; Values <br className="hidden lg:inline" />
            <span style={{ color: COLORS.primary }}>That Guide Us</span>
          </h2>
          <p className={`${rubik.className} mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600`}>
            A clear mission and a shared set of values that guide every decision we make and every client we serve.
          </p>
        </div>

        {
    /* Mission and Vision Cards */
  }
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-black/20 md:p-14"
            style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#282828 55%,#4d0a0a 100%)" }}
          >
            <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
            <motion.div aria-hidden className="absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full opacity-30 blur-3xl" style={{ background: COLORS.primary }}
              animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-10 select-none text-[9rem] leading-none md:text-[16rem]"
              style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 900, opacity: 0.12 }}
            >
              <span style={{ WebkitTextStroke: "1.5px #fff", WebkitTextFillColor: "transparent" }}>MTP</span>
            </div>

            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-14">
              {/* target */}
              <div className="relative mx-auto h-36 w-36 md:h-44 md:w-44">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="absolute inset-0 rounded-full border-2" style={{ borderColor: COLORS.primary }}
                    initial={{ opacity: 0.4 }} animate={{ scale: [0.7, 1.35], opacity: [0.6, 0] }} transition={{ duration: 3.6, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }} />
                ))}
                <div className="absolute inset-3 flex items-center justify-center rounded-full border-4" style={{ borderColor: COLORS.primary, background: "rgba(255,255,255,0.05)" }}>
                  <Target className="h-16 w-16 stroke-[2] md:h-20 md:w-20" style={{ color: "#fff" }} />
                </div>
              </div>

              {/* text */}
              <div>
                <h2 className={`${FONT_CLASSES.poppinsBlack} text-5xl tracking-tight md:text-7xl`}>MTP</h2>
                <div className="mt-4 h-1 w-16" style={{ backgroundColor: COLORS.primary }} />
                <div className="relative mt-8">
                  <span aria-hidden className="absolute -left-2 -top-8 select-none text-8xl leading-none md:-left-6 md:text-9xl" style={{ color: COLORS.primary, fontFamily: "Georgia, serif", opacity: 0.55 }}>&ldquo;</span>
                  <p className={`${rubik.className} relative max-w-4xl text-xl leading-relaxed text-gray-200 md:text-3xl md:leading-snug`}>
                    Creating <strong className="font-semibold" style={{ color: "#e25555" }}>Abundant Opportunities</strong> and{" "}
                    <strong className="font-semibold" style={{ color: "#e25555" }}>Innovative Pathways</strong> that set the{" "}
                    <strong className="font-semibold" style={{ color: "#e25555" }}>Global Benchmark</strong> for every{" "}
                    <strong className="font-semibold" style={{ color: "#e25555" }}>Filipino</strong>.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {
    /* Core Values Section */
  }
      <section className="relative overflow-hidden bg-gray-50 py-12 sm:py-20 -mt-4 sm:-mt-5">
        <div
    aria-hidden
    className="pointer-events-none absolute inset-0 opacity-[0.35]"
    style={{
    backgroundImage: "radial-gradient(rgba(16,24,40,0.10) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)"
  }}
  />
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#a10000]/[0.07] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#a10000]/[0.07] blur-3xl" />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8">
          {
    /* Header */
  }
          <div className="mb-12 sm:mb-16 text-right">
            <span
    className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
    style={{ color: COLORS.primary }}
  >
              — WHAT WE STAND FOR
            </span>
            <h2
    className={`${FONT_CLASSES.poppinsBold} text-3xl sm:text-4xl lg:text-5xl mt-3 leading-tight`}
    style={{ color: "#282828" }}
  >
              The Principles Behind <br className="hidden lg:inline" />
              <span style={{ color: COLORS.primary }}>Our Core Values</span>
            </h2>
            <p className={`${rubik.className} ml-auto mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600`}>
              Four commitments that shape how we treat our people, serve our clients, and grow together as one company.
            </p>
          </div>

          {
    /* Core Values Cards */
  }
          <CoreValuePanels />
        </div>
      </section>
    </div>;
}
export {
  MissionVision as default
};
