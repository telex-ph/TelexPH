import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, Filter, LayoutTemplate, Workflow, Boxes, Tag, ClipboardList, CalendarCheck, Code2, PenTool, Users, ShieldCheck, Cog, TrendingUp, UserCog } from "lucide-react";
import { COLORS, FONTS, TYPOGRAPHY } from "@/constant/styles";
import AssistantRobot from "./AssistantRobot";

/* "What We Offer" section, content taken from the company presentation slide. */
const RED = COLORS.primary;
const headingStyle = { fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight };
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };
const GRID = "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)";

const SERVICES = [
  { demo: "ai", Icon: Bot, title: "AI Builder", text: "Custom AI solutions and automations tailored to your business needs." },
  { demo: "funnel", Icon: Filter, title: "Funnel Builder", text: "High-converting funnels that turn visitors into customers." },
  { demo: "website", Icon: LayoutTemplate, title: "Website Builder", text: "Modern, responsive websites built to represent your brand and drive results." },
  { demo: "automation", Icon: Workflow, title: "Automation", text: "Streamline workflows, save time, and scale with powerful automation." },
  { demo: "internal", Icon: Boxes, title: "Internal Systems", text: "We build custom internal systems that improve efficiency and productivity." },
];

const MORE = [
  { demo: "label", Icon: Tag, title: "White / Gray Label", text: "Rebrand and resell as your own." },
  { demo: "surveys", Icon: ClipboardList, title: "Surveys", text: "Create smart surveys and collect real insights." },
  { demo: "booking", Icon: CalendarCheck, title: "Booking", text: "Simplify scheduling and appointment management." },
  { demo: "webdev", Icon: Code2, title: "Web Dev", text: "Custom web development that performs." },
  { demo: "design", Icon: PenTool, title: "Design", text: "Eye-catching designs that communicate your brand." },
  { demo: "crm", Icon: Users, title: "CRM", text: "Manage leads, clients, and relationships in one place." },
];

const PILLARS = [
  { Icon: ShieldCheck, title: "Smarter Systems.", text: "Built to work for you." },
  { Icon: Cog, title: "Better Automation.", text: "Save time and scale faster." },
  { Icon: TrendingUp, title: "Stronger Businesses.", text: "Drive growth with confidence." },
];

/* Icons that float around the assistant. */
const ORBIT = [
  { Icon: Workflow, pos: "left-0 top-[18%]", delay: 0 },
  { Icon: Filter, pos: "right-0 top-[10%]", delay: 0.6 },
  { Icon: Code2, pos: "left-[2%] bottom-[22%]", delay: 1.2 },
  { Icon: Users, pos: "right-[2%] bottom-[28%]", delay: 1.8 },
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay },
});

const Label = ({ children }) => (
  <p className="mb-4 inline-block rounded-sm px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white" style={{ background: RED, fontFamily: FONTS.openSans }}>{children}</p>
);

const WhatWeOffer = () => {
  const reduce = useReducedMotion();
  // the card under the pointer decides what the assistant demonstrates
  const [demo, setDemo] = useState(null);
  const hover = (d) => ({ onMouseEnter: () => setDemo(d), onMouseLeave: () => setDemo(null), onFocus: () => setDemo(d), onBlur: () => setDemo(null) });
  return (
    <div className="relative overflow-hidden pb-14 pt-14 lg:pb-24 lg:pt-24">
      <div className="absolute inset-0 h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/choosebg.webp')" }} />
      <div className="absolute inset-0 bg-white/90" />
      <motion.div aria-hidden className="absolute -left-32 top-24 h-[26rem] w-[26rem] rounded-full opacity-[0.12] blur-3xl" style={{ background: RED }}
        animate={reduce ? {} : { x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* heading + assistant */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <motion.div {...rise()}>
            <p className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: RED, fontFamily: FONTS.openSans }}>
              <span aria-hidden className="h-0.5 w-8" style={{ background: RED }} />What We Offer
            </p>
            <h2 className="text-5xl uppercase leading-[0.98] text-[#282828] md:text-7xl" style={headingStyle}>
              We Are<br /><span style={{ color: RED }}>AI-Assisted.</span>
            </h2>
            <div className="mt-5 h-1 w-16" style={{ background: RED }} />
            <p className="mt-6 max-w-xl text-base text-gray-700 md:text-lg" style={{ fontFamily: FONTS.rubik }}>
              We combine human expertise with intelligent automation to build smart systems that drive your business forward.
            </p>
            <div {...hover("admin")} className="mt-6 inline-flex items-center gap-4 rounded-xl bg-[#1c1c1c] px-5 py-4 text-white shadow-xl shadow-black/20">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                {!reduce && <motion.span aria-hidden className="absolute inset-0 rounded-full border-2" style={{ borderColor: RED }} animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />}
                <UserCog className="relative h-6 w-6" strokeWidth={1.6} />
              </span>
              <p className="text-sm md:text-base" style={{ fontFamily: FONTS.rubik }}>We have a <strong style={{ color: "#e25555" }}>GoHighLevel Admin</strong> managing and optimizing your systems.</p>
            </div>
            <p className="mt-7 max-w-2xl rounded-2xl border-l-4 bg-white/85 p-5 text-[15px] leading-relaxed text-gray-700 shadow-sm md:p-6 md:text-base" style={{ borderColor: RED, fontFamily: FONTS.rubik }}>
              From customer support to technical assistance, we provide AI-assisted solutions and smart business systems that help streamline operations, improve customer experience, and drive your business forward through automation, CRM, web development, funnels, and scalable digital solutions.
            </p>
          </motion.div>

          <motion.div {...rise(0.1)} className="relative mx-auto w-full max-w-[460px]">
            <div aria-hidden className="absolute inset-6 rounded-full opacity-30 blur-3xl" style={{ background: RED }} />
            <div className="relative overflow-hidden rounded-[2rem] px-6 pb-4 pt-8 shadow-2xl shadow-black/25" style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#282828 55%,#4d0a0a 100%)" }}>
              <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRID }} />
              {ORBIT.map(({ Icon, pos, delay }) => (
                <motion.span key={pos} className={`absolute ${pos} z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur`}
                  animate={reduce ? {} : { y: [0, -9, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay }}>
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </motion.span>
              ))}
              <div className="relative mx-auto max-w-[330px]"><AssistantRobot demo={demo} /></div>
            </div>
          </motion.div>
        </div>

        {/* AI-powered services */}
        <div className="mt-16">
          <motion.div {...rise()}><Label>Our AI-Powered Services</Label></motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map(({ demo: d, Icon, title, text }, i) => (
              <motion.div key={title} {...rise(i * 0.07)} {...hover(d)}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#282828] hover:shadow-2xl hover:shadow-[#a10000]/25">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: RED }} />
                <span aria-hidden className="pointer-events-none absolute -right-2 -top-4 select-none text-8xl font-bold leading-none text-black/[0.05] transition-colors group-hover:text-white/[0.07]" style={display}>{String(i + 1).padStart(2, "0")}</span>
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-[#a10000]/30 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110" style={{ background: RED }}><Icon className="h-7 w-7" strokeWidth={1.6} /></span>
                <h3 className="relative mt-5 text-sm font-black uppercase tracking-wide text-[#282828] transition-colors group-hover:text-white" style={{ fontFamily: FONTS.poppins }}>{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-gray-600 transition-colors group-hover:text-gray-300" style={{ fontFamily: FONTS.rubik }}>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* more solutions */}
        <div className="mt-12">
          <motion.div {...rise()}><Label>More Solutions We Provide</Label></motion.div>
          <motion.div {...rise(0.05)} className="relative overflow-hidden rounded-3xl bg-[#1c1c1c] p-4 text-white shadow-2xl shadow-black/20 md:p-6">
            <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRID }} />
            <div aria-hidden className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ background: RED }} />
            <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {MORE.map(({ demo: d, Icon, title, text }) => (
                <div key={title} {...hover(d)} className="group flex items-start gap-3 rounded-2xl p-4 transition-colors duration-300 hover:bg-white/[0.07]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg]" style={{ background: RED }}><Icon className="h-5 w-5" strokeWidth={1.7} /></span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wide" style={{ fontFamily: FONTS.poppins }}>{title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-300" style={{ fontFamily: FONTS.rubik }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* pillars */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map(({ Icon, title, text }, i) => (
            <motion.div key={title} {...rise(i * 0.08)} className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white/95 px-6 py-5 shadow-md transition-all hover:-translate-y-1 hover:border-[#a10000]/40 hover:shadow-xl">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fce5e5] transition-colors group-hover:bg-[#a10000]">
                <Icon className="h-7 w-7 transition-colors group-hover:text-white" style={{ color: RED }} strokeWidth={1.6} />
              </span>
              <p style={{ fontFamily: FONTS.rubik }}>
                <span className="block text-lg font-bold text-[#282828]">{title}</span>
                <span className="block text-sm text-gray-600">{text}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
