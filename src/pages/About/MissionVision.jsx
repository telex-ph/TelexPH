import { motion } from "framer-motion";
import { Target, Users, Award, TrendingUp, Heart } from "lucide-react";
import { Rubik } from "next/font/google";
import { COLORS, FONT_CLASSES, getColorWithOpacity } from "@/constant/styles";
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"]
});
function MissionVision() {
  return <div className="bg-gray-50">
      {
    /* Mission & Vision Section */
  }
      <section className="py-12 sm:py-16 relative overflow-hidden">
        {
    /* Header */
  }
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" />
            <span
    className={`${FONT_CLASSES.openSansBold} text-base uppercase tracking-[0.2em]`}
    style={{ color: COLORS.primary }}
  >
              — WHAT DRIVES US FORWARD
            </span>
          </div>
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
      <section className="py-12 sm:py-16 bg-gray-50 -mt-4 sm:-mt-5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
          {
    /* Header with Diamond Icon */
  }
          <div className="mb-10 sm:mb-16">
            {
    /* Mobile & Mid Screen Layout */
  }
            <div className="flex items-center gap-4 sm:gap-6 lg:hidden">
              <div className="flex-shrink-0">
                <div
    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
    style={{ borderColor: COLORS.primary }}
  >
                  <svg
    className="w-8 h-8 sm:w-10 sm:h-10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: COLORS.primary }}
  >
                    <path d="M12 2L2 9l10 13 10-13-10-7z" />
                    <path d="M2 9h20" />
                    <path d="M12 2l4 7-4 13-4-13 4-7z" />
                  </svg>
                  <div
    className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
    style={{ borderColor: COLORS.primary }}
  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl tracking-tight translate-y-1`}
    style={{ color: COLORS.dark }}
  >
                  CORE VALUES
                </h2>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((i) => <div
    key={i}
    className="w-8 h-1 rounded-full"
    style={{ backgroundColor: COLORS.primary }}
  />)}
                </div>
              </div>
            </div>

            {
    /* Desktop Layout */
  }
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div
    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center bg-white relative"
    style={{ borderColor: COLORS.primary }}
  >
                  <svg
    className="w-8 h-8 sm:w-10 sm:h-10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: COLORS.primary }}
  >
                    <path d="M12 2L2 9l10 13 10-13-10-7z" />
                    <path d="M2 9h20" />
                    <path d="M12 2l4 7-4 13-4-13 4-7z" />
                  </svg>
                  <div
    className="absolute inset-0 rounded-full border-2 animate-ping opacity-20"
    style={{ borderColor: COLORS.primary }}
  />
                </div>
              </div>

              <h2
    className={`${FONT_CLASSES.poppinsBlack} text-3xl sm:text-5xl tracking-tight text-center sm:text-left`}
    style={{ color: COLORS.dark }}
  >
                CORE VALUES
              </h2>
            </div>
          </div>

          {
    /* Core Values Cards */
  }
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
    {
      title: "Provide",
      desc: "Jobs and to give employee a friendly work environment where they can hone their skills.",
      icon: <Users className="w-6 h-6 sm:w-7 sm:h-7" />
    },
    {
      title: "Contribute",
      desc: "To the continued worldwide development of service industry through management.",
      icon: <Award className="w-6 h-6 sm:w-7 sm:h-7" />
    },
    {
      title: "Pursue",
      desc: "Total Quality and Customer Satisfaction allowing Company, Employees, and Community to grow.",
      icon: <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
    },
    {
      title: "Grow & Prosper",
      desc: "With an appreciative feeling of mutual pride & trust.",
      icon: <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
    }
  ].map((item, index) => <div
    key={index}
    className="bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
  >
                {
    /* Top section */
  }
                <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:block">
                  <div
    className="sm:flex md:flex lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
    style={{ backgroundColor: COLORS.primaryLight }}
  >
                    <div style={{ color: COLORS.primary }}>{item.icon}</div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span
    className={`${FONT_CLASSES.openSansBold} text-xs sm:text-sm`}
    style={{ color: COLORS.dark }}
  >
                      To
                    </span>
                    <h3
    className={`${FONT_CLASSES.poppinsBlack} text-lg sm:text-2xl leading-tight`}
    style={{ color: COLORS.dark }}
  >
                      {item.title}
                    </h3>
                  </div>
                </div>

                {
    /* ✅ Description (normal weight, not bold) */
  }
                <p
    className={`${rubik.className} text-[13px] sm:text-[14px] leading-relaxed mb-3 sm:mb-4`}
    style={{ color: COLORS.dark }}
  >
                  {item.desc}
                </p>

                <div
    className="hidden lg:flex w-14 h-14 rounded-full items-center justify-center absolute bottom-4 right-4"
    style={{ backgroundColor: COLORS.primaryLight }}
  >
                  <div style={{ color: COLORS.primary }}>{item.icon}</div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
}
export {
  MissionVision as default
};
