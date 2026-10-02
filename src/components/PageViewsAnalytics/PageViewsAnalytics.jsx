
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
    className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-60"
    style={{ backgroundColor: COLORS.primaryLight }}
    aria-hidden
  />
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
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
            A Team with Day-to-Day Management
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-4 leading-relaxed">
            Your support model can include:
          </p>

          <div
    className="mt-8 rounded-2xl p-6 lg:p-7 text-white shadow-xl relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #5c0000 100%)` }}
  >
            <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/10" aria-hidden />
            <ShieldCheck className="w-8 h-8 mb-3 text-white/90" strokeWidth={1.75} />
            <p className="text-sm md:text-[15px] leading-relaxed relative">
              We agree on responsibilities, staffing, coverage, and reporting before delivery begins. Your team retains the decisions and approvals that need to stay within your business.
            </p>
          </div>
        </div>

        <ol className="lg:col-span-7 relative space-y-4">
          <span
    className="hidden sm:block absolute left-[1.65rem] top-8 bottom-8 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent"
    aria-hidden
  />
          {FEATURES.map(({ description, Icon }, i) => <li
    key={description}
    className="group relative flex items-center gap-4 sm:gap-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-red-100"
  >
              <div
    className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:!bg-[#a10000] group-hover:!text-white"
    style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
  >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
              </div>
              <p className={`flex-1 text-sm sm:text-base ${FONT_CLASSES.openSansBold} text-gray-900 leading-snug`}>{description}</p>
              <span
    className={`${FONT_CLASSES.openSansBold} text-3xl sm:text-4xl leading-none select-none text-transparent`}
    style={{ WebkitTextStroke: `1.5px ${COLORS.primary}55` }}
    aria-hidden
  >
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>)}
        </ol>
      </div>
    </section>;
}
export {
  PageViewsAnalyticsSection as default
};
