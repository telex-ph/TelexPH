import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Quote, Star } from "lucide-react";
import { COLORS } from "@/constant/styles";

const RED = COLORS.primary;
const GOLD = "#e0c08a";
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };
const poppins ={ fontFamily: "'Poppins', sans-serif" };

// DRAFT copy taken from the approved design reference: confirm names and quotes before launch.
const Stars = ({ color = "#f5a524", size = "w-3 h-3" }) => (
  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${size} fill-current`} style={{ color }} strokeWidth={0} />)}
  </div>
);

const Tile = ({ img, overlay, className = "", children, i = 0 }) => {
  const reduce = useReducedMotion();
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      whileHover={reduce ? undefined : { y: -6 }}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl text-white shadow-[0_18px_40px_-18px_rgba(40,16,16,.55)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-20px_rgba(161,0,0,.55)] ${className}`}
      style={{ ...poppins, backgroundColor: "#1a1a1a" }}
    >
      {img && <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" />}
      <div aria-hidden className="absolute inset-0" style={{ background: overlay }} />
      {/* cursor-following red glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(161,0,0,.28), transparent 70%)" }} />
      {/* inner hairline border */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 transition-shadow duration-300 group-hover:ring-white/25" />
      {children}
    </motion.div>
  );
};

const LogisticsTestimonialBento = () => (
  <section id="testimonials" className="relative px-4 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: "#fdfaf7" }}>
    <motion.div
      className="relative max-w-3xl mx-auto text-center mb-12 md:mb-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <p aria-hidden className="mb-3 text-xl font-bold italic tracking-[0.2em] leading-none" style={{ color: RED, ...display }}>///</p>
      <h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={{ ...display, color: COLORS.dark }}>What Our Clients Say</h2>
      <div className="mx-auto mt-5 h-1 w-16" style={{ backgroundColor: RED }} />
      <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600">Hear from the teams who trust TelexPH to run their logistics support day to day.</p>
    </motion.div>

    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:h-[540px]">
      {/* big featured quote */}
      <Tile
        i={0}
        img="/images/testimonial-proactive.png"
        overlay="linear-gradient(180deg, rgba(0,0,0,.05) 25%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.92) 100%)"
        className="md:col-span-5 md:row-span-2 min-h-[460px] flex flex-col justify-between p-6"
      >
        <div className="relative flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-white px-4 py-2.5 shadow-lg">
            <p className="text-base font-extrabold leading-tight" style={{ color: RED }}>Proactive</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Wants to know the business</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified client
          </span>
        </div>
        <Quote aria-hidden className="pointer-events-none absolute right-5 top-[58%] h-24 w-24 -translate-y-1/2 text-white/10" strokeWidth={1.2} />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: RED }}>
            <Stars color="#fff" size="w-2.5 h-2.5" /> Attitude
          </span>
          <p className="mt-4 text-lg font-semibold leading-snug">
            &ldquo;The attitude, like if they are proactively want to learn, they want to know the business. I think that&rsquo;s very important, like attitude matters.&rdquo;
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 text-xs font-bold" style={{ backgroundColor: RED }}>JT</span>
            <span>
              <span className="block text-sm font-bold">Jessica Tang</span>
              <span className="block text-[11px] text-white/55">Customer Service Supervisor - SpeedX</span>
            </span>
          </div>
        </div>
      </Tile>

      {/* rewards */}
      <Tile
        i={1}
        img="/images/testimonial-rewards.png"
        overlay="linear-gradient(180deg, rgba(20,20,20,.88) 0%, rgba(40,8,8,.75) 55%, rgba(120,0,0,.85) 100%)"
        className="md:col-span-3 min-h-[260px] flex flex-col justify-between p-5"
      >
        <p className="relative text-[15px] font-semibold leading-snug">
          &ldquo;That is something it&rsquo;s very surprising and it&rsquo;s in a good way again&hellip; and that is the right way to reward the agents&hellip; to inspire the agents to work harder here.&rdquo;
        </p>
        <div className="relative">
          <p className="text-xl font-extrabold leading-tight">Rewards</p>
          <p className="text-xs text-white/50">inspire the agents</p>
        </div>
      </Tile>

      {/* fast support */}
      <Tile
        i={2}
        img="/images/testimonial-fast.png"
        overlay="linear-gradient(180deg, rgba(30,30,30,.82), rgba(20,20,20,.9))"
        className="md:col-span-4 min-h-[260px] flex flex-col justify-between p-5"
      >
        <div className="relative">
          <Stars />
          <p className="mt-3 text-sm italic leading-relaxed text-white/90">
            &ldquo;One very important factor here is why is how quickly the response is from the support team&hellip; so there&rsquo;s always a respond and it&rsquo;s very quickly.&rdquo;
          </p>
        </div>
        <div className="relative border-t border-white/15 pt-4">
          <span className="inline-block rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-bold">Fast Support Response</span>
        </div>
      </Tile>

      {/* great support */}
      <Tile
        i={3}
        img="/images/testimonial-support.png"
        overlay="linear-gradient(180deg, rgba(10,30,60,.55) 0%, rgba(10,10,10,.9) 60%, rgba(10,10,10,.97) 100%)"
        className="md:col-span-3 min-h-[260px] flex flex-col justify-end p-5"
      >
        <div className="relative">
          <p className="text-4xl font-extrabold leading-none tracking-tight">Great support</p>
          <p className="mt-2 text-xs font-bold">Positive response, strong partnership</p>
          <p className="mt-2 text-xs italic leading-relaxed text-white/85">
            &ldquo;We have been receiving such good support, positive response, so I think the partnership so far is going really well.&rdquo;
          </p>
        </div>
      </Tile>

      {/* CTA */}
      <Tile
        i={4}
        img="/images/testimonial-cta.png"
        overlay="linear-gradient(160deg, rgba(60,40,35,.92), rgba(40,12,12,.95))"
        className="md:col-span-4 min-h-[260px] flex flex-col justify-center p-6"
      >
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Ready to get started?</p>
          <p className="mt-3 text-xl font-extrabold leading-snug">
            See what <em style={{ color: GOLD }}>dependable logistics support</em> looks like for your operation.
          </p>
          <a
            href="#start"
            className="group/btn mt-6 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold shadow-[0_10px_24px_-8px_rgba(161,0,0,.8)] ring-1 ring-white/15 transition-all hover:-translate-y-0.5 hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${RED}, #6e0000)` }}
          >
            Book Your 15-Minute Discovery Call <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </a>
          <p className="mt-3 text-center text-[11px] text-white/55">Booking the call doesn&rsquo;t commit you to anything.</p>
        </div>
      </Tile>
    </div>
  </section>
);

export default LogisticsTestimonialBento;
