
import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity, FONT_CLASSES } from "@/constant/styles";
function CaseStudiesHero() {
  return <section className="relative pt-16 pb-10 overflow-hidden" style={{ backgroundColor: COLORS.white }}>
      <div
    className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[8rem] opacity-15 select-none pointer-events-none leading-none z-0 whitespace-nowrap"
    style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight }}
  >
        <span style={{ WebkitTextStroke: `1px ${COLORS.dark}`, WebkitTextFillColor: "transparent", opacity: 0.85 }}>
          INDUSTRY USE CASE
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
    className={`${FONT_CLASSES.poppinsBlack} text-4xl md:text-5xl lg:text-6xl leading-[0.9] uppercase tracking-tighter mb-8`}
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.black, color: COLORS.dark }}
  >
            Industry <span style={{ color: COLORS.primary }}>Use Case</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-8 text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, color: "#4B5563" }}>
            Explore how our integrated outsourcing solutions empower different industries to achieve operational excellence and sustainable growth through data-driven strategies.
          </p>

          <div className="uppercase tracking-widest text-[10px] md:text-[12px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: getColorWithOpacity("dark", 0.7) }}>
            <Link href="/" className="transition-colors" style={{ color: getColorWithOpacity("dark", 0.7) }}>Home</Link>
            <span className="mx-2">&gt;&gt;</span>
            <span style={{ color: COLORS.primary }}>Industry Use Case</span>
          </div>
        </div>
      </div>
    </section>;
}
export {
  CaseStudiesHero as default
};
