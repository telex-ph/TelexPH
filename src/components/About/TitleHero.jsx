import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";

/* Title section in the style of the About and Services pages: white ground, outlined watermark word behind a
   single-line Poppins title, short intro and a ">>" breadcrumb. `children` render under the text. */
const TitleHero = ({ ghost, title, intro, crumbs = [], meta, className = "", children }) => (
  <section className={`relative overflow-hidden bg-white ${className}`}>
    {/* the watermark is centred on this block, exactly as in the About hero, so it sits behind the title */}
    <div className="relative pb-10 pt-40">
    <div
      aria-hidden
      className="legal-noprint pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[85%] select-none whitespace-nowrap text-[5rem] leading-none opacity-15 md:text-[7rem] lg:text-[8rem]"
      style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight }}
    >
      <span style={{ WebkitTextStroke: `1px ${COLORS.dark}`, WebkitTextFillColor: "transparent", opacity: 0.85 }}>{ghost}</span>
    </div>

    <div className="container relative z-10 mx-auto px-4">
      <div className="mx-auto max-w-4xl text-center">
        <h1
          className="mb-6 text-4xl uppercase tracking-tight md:text-6xl"
          style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: "#282828" }}
        >
          {title}
        </h1>

        {intro && <p className="mx-auto mb-8 max-w-3xl text-base md:text-lg" style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.7) }}>{intro}</p>}

        {meta && <p className="mb-3 text-sm" style={{ fontFamily: FONTS.openSans, color: getColorWithOpacity("dark", 0.55) }}>{meta}</p>}

        <div className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: getColorWithOpacity("dark", 0.7) }}>
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-2">&gt;&gt;</span>}
              {c.href ? <Link href={c.href} className="transition-colors hover:text-[#a10000]">{c.label}</Link> : <span style={{ color: COLORS.primary }}>{c.label}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
    </div>

    {children && <div className="container relative z-10 mx-auto flex justify-center px-4 pb-10">{children}</div>}
  </section>
);

export default TitleHero;
