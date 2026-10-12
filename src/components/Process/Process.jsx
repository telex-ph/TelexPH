
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquareText, ClipboardList, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const SECTION_HEIGHT = "min-h-[90vh]";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"]
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"]
});
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"]
});
const processSteps = [
  {
    number: "01",
    title: "Understand Your Needs",
    description: "We discuss your workload, current challenges, systems, service hours, and priorities.",
    imageUrl: "/images/process1.webp",
    Icon: MessageSquareText
  },
  {
    number: "02",
    title: "Define the Support Model",
    description: "We agree on scope, team structure, responsibilities, performance measures, and pricing.",
    imageUrl: "/images/process2.webp",
    Icon: ClipboardList
  },
  {
    number: "03",
    title: "Prepare for Delivery",
    description: "We align training, system access, escalation rules, and readiness before launch.",
    imageUrl: "/images/process3.webp",
    Icon: Rocket
  },
  {
    number: "04",
    title: "Review and Improve",
    description: "We review performance together and address gaps through coaching and process improvements.",
    imageUrl: "/images/process4.webp",
    Icon: TrendingUp
  }
];
const ProcessStepItem = ({ step, index = 0 }) => {
  return <motion.div
    key={step.number}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.6, delay: (index % 2) * 0.12, ease: "easeOut" }}
    className="group relative flex flex-col items-center h-full pb-6"
  >
      <div className="relative w-full md:w-[65%] md:ml-auto overflow-hidden rounded-lg ring-1 ring-gray-900/10 shadow-[0_18px_40px_-18px_rgba(16,24,40,0.45)] group-hover:shadow-[0_28px_56px_-18px_rgba(161,0,0,0.45)] transition-shadow duration-500">
        <Image
    src={step.imageUrl}
    alt={step.title}
    width={500}
    height={400}
    className="w-full h-80 sm:h-96 md:h-56 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
    priority={true}
  />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1623]/55 via-transparent to-[#0f1623]/10" />
        <div className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-[#a10000] group-hover:rotate-12 group-hover:scale-110">
          <step.Icon size={18} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#a10000]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div
    className="
                    absolute top-60 sm:top-72 left-8 right-8
                    md:static md:w-[85%] md:mt-[-30px] md:top-auto md:left-auto md:right-auto md:self-start
                    lg:absolute lg:top-auto lg:bottom-[-20px] lg:left-2 lg:w-[75%]
                    bg-white rounded-lg p-4 pl-5 z-10 overflow-visible ring-1 ring-gray-900/5
                    shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_36px_-14px_rgba(16,24,40,0.30)]
                    transition-all duration-500 lg:group-hover:-translate-y-2 group-hover:ring-[#a10000]/20 group-hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_26px_48px_-16px_rgba(161,0,0,0.35)]
                    flex items-start gap-3
                "
  >
        <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-gradient-to-b from-[#c40000] to-[#6f0000]" />
        <span className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-[#c40000] to-[#6f0000] rounded-b-lg transition-all duration-500" />
        <p
    className={`${openSans.className}
                        text-[48px] leading-none select-none text-transparent flex-shrink-0
                        transition-colors duration-300 group-hover:text-[#a10000]/15
                        lg:absolute lg:top-[-40px] lg:left-6 lg:text-[64px]`}
    style={{ WebkitTextStroke: "1.5px #a10000", filter: "drop-shadow(0 6px 10px rgba(161,0,0,0.18))" }}
  >
          {step.number}
        </p>
        <div className="flex-1">
          <p
    className={`${openSans.className}
                          text-base md:text-lg font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-[#a10000]`}
  >
            {step.title}
          </p>
          <span className="mb-2 block h-0.5 w-8 rounded-full bg-[#a10000]/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#a10000]" />
          <p
    className={`${rubik.className}
                      text-gray-600 text-xs md:text-sm`}
  >
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>;
};
const CarouselPagination = ({ steps, activeIndex, scrollTo }) => {
  return <div className="flex justify-center mt-4 space-x-2">
      {steps.map((_, index) => <button
    key={index}
    onClick={() => scrollTo(index)}
    className={`
                        h-2 rounded-full transition-all duration-300 ease-in-out
                        ${index === activeIndex ? "bg-[#a10000] w-6" : "bg-gray-300 w-2"}
                    `}
    aria-label={`Go to process step ${index + 1}`}
  />)}
    </div>;
};
const ProcessCarousel = ({
  steps
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.querySelector(":scope > div")?.clientWidth || 1;
      const newIndex = Math.round(scrollLeft / (itemWidth + 16));
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };
  const scrollTo = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.querySelector(":scope > div")?.clientWidth || 1;
      scrollRef.current.scrollTo({
        left: index * (itemWidth + 16),
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
  }, []);
  return <>
      <div
    ref={scrollRef}
    onScroll={handleScroll}
    className="
                    relative 
                    flex snap-x overflow-x-scroll overflow-y-visible
                    space-x-4 px-4 pb-4
                    scrollbar-hide
                "
  >
        {steps.map((step) => <div key={step.number} className="flex-shrink-0 w-full snap-start">
            <ProcessStepItem step={step} />
          </div>)}
      </div>
      <CarouselPagination
    steps={steps}
    activeIndex={activeIndex}
    scrollTo={scrollTo}
  />
    </>;
};
const Process = () => {
  return <section
    id="process"
    className={`py-10 sm:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden scroll-mt-[100px]`}
  >
      <div
    className="pointer-events-none absolute inset-0 opacity-[0.35]"
    style={{
    backgroundImage: "radial-gradient(rgba(16,24,40,0.10) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)"
  }}
  />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#a10000]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#a10000]/[0.07] blur-3xl" />
      <div className={`${DEFAULT_MAX_WIDTH_CLASS}`}>
        <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative text-center mb-10 sm:mb-14"
  >
          <p
    className={`${openSans.className} text-[#a10000] uppercase text-sm tracking-widest font-semibold relative inline-block
                            before:content-[''] before:absolute before:top-1/2 before:-left-8 before:w-6 before:h-px before:bg-[#a10000]
                            after:content-[''] after:absolute after:top-1/2 after:-right-8 after:w-6 after:h-px after:bg-[#a10000]`}
  >
            HOW WE START
          </p>
          <h2
    className={`${openSans.className} text-4xl md:text-5xl font-black text-gray-900 mt-2 tracking-tight`}
  >
            Built Around Your Operations
          </h2>
          <motion.span
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay: 0.3 }}
    className="mx-auto mt-4 block h-1 w-20 origin-center rounded-full bg-gradient-to-r from-[#c40000] to-[#6f0000]"
  />
        </motion.div>

        <div className="lg:hidden pb-2 overflow-visible">
          <ProcessCarousel steps={processSteps} />
        </div>

        <div
    className="
                        hidden lg:grid lg:grid-cols-2 max-w-4xl mx-auto
                        gap-x-10 gap-y-20
                        px-4
                        pb-10 lg:pb-16 
                    "
  >
          {processSteps.map((step, i) => <ProcessStepItem key={step.number} step={step} index={i} />)}
        </div>

        <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative mt-4 flex justify-center"
  >
          <a
    href="https://intl.telexph.com"
    target="_blank"
    rel="noopener noreferrer"
    className={`${openSans.className} group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#c40000] to-[#8a0000] px-8 py-3.5 text-sm sm:text-base text-white shadow-[0_14px_30px_-10px_rgba(161,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(161,0,0,0.75)]`}
  >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Start Your Setup</span>
            <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>;
};
var stdin_default = Process;
export {
  stdin_default as default
};
