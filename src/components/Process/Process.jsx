
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
    imageUrl: "/images/process1.webp"
  },
  {
    number: "02",
    title: "Define the Support Model",
    description: "We agree on scope, team structure, responsibilities, performance measures, and pricing.",
    imageUrl: "/images/process2.webp"
  },
  {
    number: "03",
    title: "Prepare for Delivery",
    description: "We align training, system access, escalation rules, and readiness before launch.",
    imageUrl: "/images/process3.webp"
  },
  {
    number: "04",
    title: "Review and Improve",
    description: "We review performance together and address gaps through coaching and process improvements.",
    imageUrl: "/images/process4.webp"
  }
];
const ProcessStepItem = ({ step }) => {
  return <div
    key={step.number}
    className="relative flex flex-col items-center h-full pb-6"
  >
      <div className="relative w-full md:w-[65%] md:ml-auto">
        <Image
    src={step.imageUrl}
    alt={step.title}
    width={500}
    height={400}
    className="w-full h-80 sm:h-96 md:h-56 object-cover rounded-md shadow-md"
    priority={true}
  />
      </div>

      <div
    className="
                    absolute top-60 sm:top-72 left-8 right-8
                    md:static md:w-[85%] md:mt-[-30px] md:top-auto md:left-auto md:right-auto md:self-start
                    lg:absolute lg:top-auto lg:bottom-[-20px] lg:left-2 lg:w-[75%]
                    bg-white shadow-xl rounded-md p-4 z-10 transition-all duration-300
                    flex items-start gap-3
                "
  >
        <p
    className={`${openSans.className}
                        text-[48px] leading-none select-none text-transparent flex-shrink-0
                        lg:absolute lg:top-[-40px] lg:left-6 lg:text-[64px]`}
    style={{ WebkitTextStroke: "1.5px #a10000" }}
  >
          {step.number}
        </p>
        <div className="flex-1">
          <p
    className={`${openSans.className}
                          text-base md:text-lg font-bold text-gray-800 mb-1`}
  >
            {step.title}
          </p>
          <p
    className={`${rubik.className}
                      text-gray-600 text-xs md:text-sm`}
  >
            {step.description}
          </p>
        </div>
      </div>
    </div>;
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
    className={`py-10 sm:py-20 bg-white relative overflow-hidden scroll-mt-[100px]`}
  >
      <div className={`${DEFAULT_MAX_WIDTH_CLASS}`}>
        <div className="text-center mb-10 sm:mb-10">
          <p
    className={`${openSans.className} text-[#a10000] uppercase text-sm tracking-widest font-semibold relative inline-block
                            before:content-[''] before:absolute before:top-1/2 before:-left-8 before:w-6 before:h-px before:bg-[#a10000]
                            after:content-[''] after:absolute after:top-1/2 after:-right-8 after:w-6 after:h-px after:bg-[#a10000]`}
  >
            HOW WE START
          </p>
          <h2
    className={`${openSans.className} text-4xl md:text-5xl font-black text-gray-800 mt-2`}
  >
            Built Around Your Operations
          </h2>
        </div>

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
          {processSteps.map((step) => <ProcessStepItem key={step.number} step={step} />)}
        </div>
      </div>
    </section>;
};
var stdin_default = Process;
export {
  stdin_default as default
};
