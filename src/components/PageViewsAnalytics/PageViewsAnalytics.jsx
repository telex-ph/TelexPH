
import { motion } from "framer-motion";
import { BarChart3, ClipboardCheck, GraduationCap, ShieldCheck, Settings, Users } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";
const FEATURES = [
  {
    description: "Agents trained on your processes and systems",
    Icon: GraduationCap
  },
  {
    description: "Team leadership for daily coordination and coaching",
    Icon: Users
  },
  {
    description: "Quality assurance to review work and identify improvements",
    Icon: ClipboardCheck
  },
  {
    description: "Operations management for performance reviews and issue escalation",
    Icon: Settings
  },
  {
    description: "Reporting against agreed measures and service expectations",
    Icon: BarChart3
  }
];
function PageViewsAnalyticsSection() {
  return <section
    id="page-views-analytics"
    className="relative w-full px-4 sm:px-6 lg:px-16 py-14 lg:py-24 bg-gradient-to-b from-white to-gray-50/80 overflow-hidden"
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
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#a10000]/[0.06] blur-3xl" aria-hidden />
      <div
    className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-60"
    style={{ backgroundColor: COLORS.primaryLight }}
    aria-hidden
  />
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <motion.div
    initial={{ opacity: 0, x: -28 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="lg:col-span-5 lg:sticky lg:top-28"
  >
          <p
    className={`text-sm ${FONT_CLASSES.openSansBold} uppercase tracking-wide flex items-center gap-2 mb-3`}
    style={{ color: COLORS.primary }}
  >
            <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
            How the team is managed
          </p>
          <h2
    className={`text-[1.75rem] md:text-[2.5rem] lg:text-[2.75rem] ${FONT_CLASSES.openSansBold} text-gray-900 leading-tight`}
  >
            A Team with <span className="bg-gradient-to-r from-[#c40000] to-[#6f0000] bg-clip-text text-transparent">Day-to-Day Management</span>
          </h2>
          <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-[#c40000] to-[#6f0000]" />
          <p className="text-gray-500 text-sm md:text-base mt-4 leading-relaxed">
            Your support model can include:
          </p>

          <div
    className="group mt-8 rounded-2xl p-6 lg:p-7 text-white relative overflow-hidden ring-1 ring-white/10 shadow-[0_24px_48px_-16px_rgba(161,0,0,0.55)] transition-transform duration-500 hover:-translate-y-1"
    style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #5c0000 100%)` }}
  >
            <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" aria-hidden />
            <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-white/[0.06]" aria-hidden />
            <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed relative">
              We agree on responsibilities, staffing, coverage, and reporting before delivery begins. Your team retains the decisions and approvals that need to stay within your business.
            </p>
          </div>
        </motion.div>

        <ol className="lg:col-span-7 relative space-y-4">
          <motion.span
    initial={{ scaleY: 0 }}
    whileInView={{ scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
    className="hidden sm:block absolute left-[1.65rem] top-8 bottom-8 w-px origin-top bg-gradient-to-b from-[#a10000]/40 via-[#a10000]/15 to-transparent"
    aria-hidden
  />
          {FEATURES.map(({ description, Icon }, i) => <motion.li
    key={description}
    initial={{ opacity: 0, x: 36 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="group relative flex items-center gap-4 sm:gap-5 overflow-hidden rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-gray-900/5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_24px_-12px_rgba(16,24,40,0.18)] transition-all duration-500 hover:-translate-y-1 hover:ring-[#a10000]/20 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_22px_40px_-16px_rgba(161,0,0,0.30)]"
  >
              <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-[#c40000] to-[#6f0000] transition-transform duration-500 group-hover:scale-y-100" aria-hidden />
              <div
    className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ring-1 ring-[#a10000]/10 transition-all duration-300 group-hover:!bg-[#a10000] group-hover:!text-white group-hover:rotate-6 group-hover:scale-105"
    style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
  >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </div>
              <p className={`flex-1 text-sm sm:text-base ${FONT_CLASSES.openSansBold} text-gray-900 leading-snug`}>{description}</p>
              <span
    className={`${FONT_CLASSES.openSansBold} text-3xl sm:text-4xl leading-none select-none text-transparent transition-all duration-500 group-hover:text-[#a10000]/15 group-hover:scale-110`}
    style={{ WebkitTextStroke: `1.5px ${COLORS.primary}55` }}
    aria-hidden
  >
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.li>)}
        </ol>
      </div>
    </section>;
}
export {
  PageViewsAnalyticsSection as default
};
