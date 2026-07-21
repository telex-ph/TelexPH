import Link from "next/link";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";
function WhatWeOfferHero() {
  return <section
    className="relative pt-40 pb-10 overflow-hidden"
    style={{ backgroundColor: COLORS.white }}
  >
      <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[85%]
                   text-[4rem] sm:text-[4.75rem] md:text-[7rem] lg:text-[8rem]
                   opacity-15 select-none pointer-events-none
                   leading-none z-0 whitespace-nowrap"
    style={{
      fontFamily: TYPOGRAPHY.heading.fontFamily,
      fontWeight: TYPOGRAPHY.heading.fontWeight
    }}
  >
        <span
    style={{
      WebkitTextStroke: `1px ${COLORS.dark}`,
      WebkitTextFillColor: "transparent",
      opacity: 0.85
    }}
  >
          OUR SERVICES
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
    className="text-[48px] md:text-6xl mb-6 tracking-tight"
    style={{
      fontFamily: TYPOGRAPHY.heading.fontFamily,
      fontWeight: TYPOGRAPHY.heading.fontWeight,
      color: COLORS.dark
    }}
  >
            OUR SERVICES
          </h1>

          <p
    className="max-w-1xl mx-auto mb-8 text-[14px] md:text-[16px]"
    style={{
      fontFamily: FONTS.rubik,
      fontWeight: FONT_WEIGHTS.regular,
      color: getColorWithOpacity("dark", 0.7)
    }}
  >
            At Telex Philippines, we deliver end-to-end business support designed to help companies operate 
            smarter, faster, and more efficiently. Our services are tailored to meet every client's unique needs—ensuring
            scalable growth, seamless operations, and exceptional results.
          </p>

          <div
    className="text-xs uppercase"
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.bold,
      color: getColorWithOpacity("dark", 0.7)
    }}
  >
            <Link
    href="/"
    className="transition-colors"
    style={{ color: getColorWithOpacity("dark", 0.7) }}
    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
    onMouseLeave={(e) => e.currentTarget.style.color = getColorWithOpacity("dark", 0.7)}
  >
              Home
            </Link>
            <span className="mx-2">&gt;&gt;</span>
            <span style={{ color: COLORS.primary }}>Services</span>
          </div>
        </div>
      </div>
    </section>;
}
export {
  WhatWeOfferHero as default
};
