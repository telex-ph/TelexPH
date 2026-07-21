
import { useState, useRef, useEffect } from "react";
import {
  COLORS,
  SEMANTIC_COLORS,
  FONT_CLASSES,
  getColorWithOpacity
} from "@/constant/styles";
const testimonials = [
  {
    quote: "TELEX didn't just help us outsource - they helped us scale! Their dedicated team integrated seamlessly with our operations and delivered beyond our expectations.",
    name: "Aldus A.",
    company: "CEO, RetailPro"
  },
  {
    quote: "From day one of our project, your dedication, teamwork, and positive spirit have made all the difference. The way you support applicants and keep things running smoothly shows just how much heart you put into your work \u2014 and we truly appreciate it. As we celebrate this milestone, we hope you feel proud of everything you\u2019ve accomplished. This partnership has been a game-changer.",
    name: "Cornella",
    company: "Services Manager"
  },
  {
    quote: "I wanted to take a moment to celebrate a milestone with all of you. It\u2019s been one year since we launched our support service, and the success we\u2019ve seen is the result of your dedication. You\u2019ve handled requests, solved issues, and supported applicants through stressful times. Your professionalism and positive spirit truly make the difference.",
    name: "Ramsey",
    company: "GSS Program Consultant"
  }
];
const TestimonialCard = ({ testimonial, index, isExpanded, toggleExpand }) => {
  const primaryColor = COLORS.primary;
  const needsExpansion = testimonial.quote.length > 180;
  const shortQuote = needsExpansion ? testimonial.quote.slice(0, 180) + "..." : testimonial.quote;
  return <div
    key={index}
    className="relative p-5 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl bg-white flex flex-col justify-between h-full"
  >
      <span
    className="absolute top-0 right-0 text-[5rem] sm:text-[6rem] font-black opacity-10 leading-none pointer-events-none transform translate-x-2 -translate-y-2"
    style={{ color: primaryColor, zIndex: 0 }}
    aria-hidden="true"
  >
        &ldquo;
      </span>

      <div className="flex flex-col flex-grow">
        <p
    className={`relative text-sm sm:text-base italic leading-relaxed z-10 min-h-[5rem] sm:min-h-[6rem] ${FONT_CLASSES.rubikRegular} transition-all duration-500`}
    style={{ color: COLORS.dark }}
  >
          “{isExpanded ? testimonial.quote : shortQuote}”
        </p>

        <div className="mt-1 h-5 flex items-start z-10">
          {needsExpansion && <button
    className="text-xs font-semibold hover:underline"
    style={{ color: primaryColor }}
    onClick={() => toggleExpand(index)}
  >
              {isExpanded ? "View Less" : "View More"}
            </button>}
        </div>
      </div>

      <div
    className="relative pt-4 border-t flex items-center mt-4 z-10"
    style={{ borderColor: COLORS.primaryLightBorder }}
  >
        <div
    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
    style={{ backgroundColor: primaryColor }}
  >
          {testimonial.name.charAt(0)}
        </div>
        <div className="ml-3">
          <p
    className={`text-sm sm:text-base ${FONT_CLASSES.openSansBold}`}
    style={{ color: primaryColor }}
  >
            {testimonial.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.dark }}>
            {testimonial.company}
          </p>
        </div>
      </div>
    </div>;
};
const TestimonialCarousel = ({ testimonials: testimonials2, expanded, toggleExpand }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDraggingRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const SPACE_WIDTH = 32;
  const snapToNearest = () => {
    const el = scrollRef.current;
    const item = el?.querySelector(":scope > div");
    if (!el || !item) return;
    const step = item.clientWidth + SPACE_WIDTH;
    const nearest = Math.round(el.scrollLeft / step) * step;
    el.scrollTo({ left: nearest, behavior: "smooth" });
  };
  const onPointerDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const el = scrollRef.current;
    if (!isDraggingRef.current || !el) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 5) draggedRef.current = true;
    el.scrollLeft = dragScrollLeftRef.current - delta;
  };
  const endDrag = (e) => {
    const el = scrollRef.current;
    isDraggingRef.current = false;
    el?.releasePointerCapture?.(e.pointerId);
    if (draggedRef.current) snapToNearest();
  };
  const onClickCapture = (e) => {
    if (draggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      draggedRef.current = false;
    }
  };
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.querySelector(":scope > div")?.clientWidth || 1;
      const spaceWidth = 32;
      const totalItemWidth = itemWidth + spaceWidth;
      const newIndex = Math.round(scrollLeft / totalItemWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };
  const scrollTo = (index) => {
    if (scrollRef.current) {
      const item = scrollRef.current.querySelector(":scope > div");
      if (!item) return;
      const itemWidth = item.clientWidth;
      const spaceWidth = 32;
      scrollRef.current.scrollTo({
        left: index * (itemWidth + spaceWidth),
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  };
  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);
  return <>
      <div
    ref={scrollRef}
    onScroll={handleScroll}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={endDrag}
    onPointerLeave={endDrag}
    onPointerCancel={endDrag}
    onClickCapture={onClickCapture}
    className="
          relative select-none
          flex snap-x snap-mandatory overflow-x-scroll overflow-y-visible
          space-x-8 -mx-4 px-4 pb-4
          scrollbar-hide
        "
    style={{
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      cursor: "grab",
      touchAction: "pan-y"
    }}
  >
        {testimonials2.map((testimonial, index) => <div
    key={index}
    className="flex-shrink-0 w-full md:w-[85%] snap-center"
  >
            <TestimonialCard
    testimonial={testimonial}
    index={index}
    isExpanded={expanded.includes(index)}
    toggleExpand={toggleExpand}
  />
          </div>)}
      </div>

      <div className="flex justify-center mt-8 space-x-3">
        {testimonials2.map((_, index) => <button
    key={index}
    onClick={() => scrollTo(index)}
    className={`
              h-2.5 rounded-full transition-all duration-300 ease-out
              hover:opacity-100
              ${index === activeIndex ? "w-8 opacity-100" : " w-2.5 opacity-50 hover:opacity-70"}
            `}
    style={{
      backgroundColor: index === activeIndex ? COLORS.primary : "#e2e2e2"
    }}
    aria-label={`Go to testimonial ${index + 1}`}
  />)}
      </div>
    </>;
};
function ServiceTestimonials() {
  const primaryColor = COLORS.primary;
  const [expanded, setExpanded] = useState([]);
  const toggleExpand = (index) => {
    if (expanded.includes(index)) {
      setExpanded(expanded.filter((i) => i !== index));
    } else {
      setExpanded([...expanded, index]);
    }
  };
  return <section
    id="service-testimonials"
    aria-label="Client Testimonials Section"
    className="py-16 md:py-24 scroll-mt-20"
    style={{
      backgroundColor: "#ffffff",
      color: SEMANTIC_COLORS.text.primary
    }}
  >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16 text-center">
          <div className="inline-block mb-4">
            <span
    className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-full inline-block`}
    style={{
      color: COLORS.primary
    }}
  >
              — WHAT THEY SAY
            </span>
          </div>
          <h2
    className={`${FONT_CLASSES.poppinsBold} text-3xl sm:text-4xl md:text-5xl mb-4`}
    style={{ color: COLORS.dark }}
  >
            What Our Clients <span style={{ color: COLORS.primary }}>Say</span>
          </h2>
          <p
    className={`${FONT_CLASSES.rubikRegular} text-base mt-4 max-w-3xl mx-auto`}
    style={{ color: getColorWithOpacity("dark", 0.7) }}
  >
            Hear directly from the partners who have scaled their operations and
            achieved success with our dedicated BPO teams.
          </p>
        </div>

        <div className="lg:hidden">
          <TestimonialCarousel
    testimonials={testimonials}
    expanded={expanded}
    toggleExpand={toggleExpand}
  />
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => <TestimonialCard
    key={index}
    testimonial={testimonial}
    index={index}
    isExpanded={expanded.includes(index)}
    toggleExpand={toggleExpand}
  />)}
        </div>
      </div>
    </section>;
}
export {
  ServiceTestimonials as default
};
