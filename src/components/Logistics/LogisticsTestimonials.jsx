import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Quote, Star, TrendingUp } from "lucide-react";
import { COLORS } from "@/constant/styles";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

// DRAFT copy (fake names and quotes, not approved client testimonials): replace before launch.
const INTRO_TITLE = "What Our Clients Say";
const INTRO_TEXT = "Hear from the teams who trust TelexPH to run their logistics support day to day.";

export const TESTIMONIALS = [
  { photo: "/images/avatar1.webp", quote: "The team plugged into our dispatch workflow within days. Updates are consistent and nothing slips through the cracks.", name: "Marco Villanueva", role: "Operations Manager", company: "Northgate Freight Co.", result: "Live in days" },
  { photo: "/images/avatar2.webp", quote: "Our shipment tracking and customer follow-ups finally have an owner. Response times dropped and our customers noticed.", name: "Angela Mendoza", role: "Logistics Director", company: "SwiftLane Logistics", result: "Faster response times" },
  { photo: "/images/avatar3.webp", quote: "They adapted to our existing systems instead of forcing us to change. Onboarding was smooth and well managed.", name: "Daniel Cruz", role: "Founder", company: "BlueHarbor Cargo", result: "Smooth onboarding" },
  { photo: "/images/avatar4.webp", quote: "Reliable, proactive and easy to work with. It feels like an extension of our own in-house team.", name: "Patricia Santos", role: "Head of Customer Service", company: "Metro Parcel Express", result: "Extension of the team" },
];

export const Photo = ({ src, name, className = "w-12 h-12", ring }) => (
  <img
    src={src}
    alt={name}
    loading="lazy"
    className={`${className} shrink-0 rounded-full object-cover object-top transition-shadow duration-300`}
    style={ring ? { boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${ring}` } : undefined}
  />
);

const LogisticsTestimonials = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[active];

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const go = (n) => setActive((n + total) % total);

  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-white overflow-hidden">
      <motion.div
        className="relative max-w-3xl mx-auto text-center mb-12 md:mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <p aria-hidden className="mb-3 text-xl font-bold italic tracking-[0.2em] leading-none" style={{ color: RED, ...display }}>///</p>
        <h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={{ ...display, color: CHARCOAL }}>{INTRO_TITLE}</h2>
        <div className="mx-auto mt-5 h-1 w-16" style={{ backgroundColor: RED }} />
        <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600">{INTRO_TEXT}</p>
      </motion.div>

      <div
        className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-8 md:gap-10 items-stretch"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(active + 1); if (e.key === "ArrowLeft") go(active - 1); }}
      >
        <style>{`@keyframes tlx-testi-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
        {/* featured quote */}
        <motion.div
          className="md:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 flex flex-col justify-between min-h-[320px]"
          style={{ background: `linear-gradient(150deg, #141414 0%, ${CHARCOAL} 55%, #3a0a0a 100%)` }}
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          onMouseMove={onMove}
        >
          {/* cursor-following glow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60" style={{ background: "radial-gradient(360px circle at var(--mx, 80%) var(--my, 90%), rgba(161,0,0,.35), transparent 70%)" }} />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 36px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 36px)" }}
          />
          <div aria-hidden className="absolute -bottom-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-40" style={{ background: RED }} />
          <Quote aria-hidden className="absolute top-6 right-8 w-24 h-24 text-white/10" strokeWidth={1.2} />

          <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-1" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#fff" }} strokeWidth={0} />)}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              <BadgeCheck className="w-4 h-4" /> Verified client
            </span>
          </div>

          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-xl md:text-3xl font-semibold leading-snug text-white">&ldquo;{current.quote}&rdquo;</p>
                <footer className="mt-8 flex flex-wrap items-center gap-4">
                  <Photo src={current.photo} name={current.name} className="w-14 h-14" ring={RED} />
                  <span>
                    <span className="block font-semibold text-white">{current.name}</span>
                    <span className="block text-sm text-white/60">{current.role}, {current.company}</span>
                  </span>
                  <span className="sm:ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white" style={{ backgroundColor: RED }}>
                    <TrendingUp className="w-4 h-4" /> {current.result}
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="relative mt-8 flex items-center justify-between">
            <span className="text-4xl font-bold leading-none text-white tabular-nums" style={display}>
              {String(active + 1).padStart(2, "0")}
              <span className="text-lg text-white/50"> / {String(total).padStart(2, "0")}</span>
            </span>
            <span className="flex gap-2">
              {[{ Icon: ChevronLeft, label: "Previous testimonial", n: active - 1 }, { Icon: ChevronRight, label: "Next testimonial", n: active + 1 }].map(({ Icon, label, n }) => (
                <button key={label} onClick={() => go(n)} aria-label={label} className="w-10 h-10 rounded-full flex items-center justify-center border border-white/30 text-white transition-colors hover:bg-white hover:text-[#282828]">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </span>
          </div>
          {/* autoplay progress */}
          {!reduce && (
            <span aria-hidden className="absolute left-0 right-0 bottom-0 h-1 bg-white/10">
              <span key={active} className="block h-full origin-left bg-white" onAnimationEnd={() => go(active + 1)} style={{ animation: "tlx-testi-progress 6s linear forwards", animationPlayState: paused ? "paused" : "running" }} />
            </span>
          )}
        </motion.div>

        {/* client list */}
        <div className="md:col-span-4 flex flex-col gap-3">
          {TESTIMONIALS.map((t, i) => {
            const open = i === active;
            return (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                aria-current={open}
                initial={reduce ? false : { opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ x: open ? 0 : 4 }}
                className="relative flex-1 flex items-center gap-4 text-left rounded-2xl bg-white overflow-hidden border px-5 py-4 transition-shadow"
                style={{ borderColor: open ? RED : "#e5e7eb", boxShadow: open ? "0 12px 32px rgba(161,0,0,.14)" : "0 1px 2px rgba(0,0,0,.04)" }}
              >
                <span aria-hidden className="absolute left-0 top-0 bottom-0 w-1.5 origin-top transition-transform duration-300" style={{ backgroundColor: RED, transform: open ? "scaleY(1)" : "scaleY(0)" }} />
                <Photo src={t.photo} name={t.name} ring={open ? RED : "#e5e7eb"} />
                <span className="min-w-0">
                  <span className="block font-semibold truncate" style={{ color: CHARCOAL }}>{t.name}</span>
                  <span className="block text-sm text-gray-500 truncate">{t.role}, {t.company}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogisticsTestimonials;
