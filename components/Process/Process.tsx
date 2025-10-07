"use client";

import React from "react";
import { Poppins, Open_Sans, Rubik } from "next/font/google";
import { DEFAULT_MAX_WIDTH_CLASS, SECTION_HEIGHT } from "@/constant/layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  imageUrl: string;
}

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Consultation",
    description: "We assess your business needs and challenges.",
    imageUrl: "/images/process1.jpg",
  },
  {
    number: "02",
    title: "Strategy",
    description: "A tailored outsourcing plan designed for your goals.",
    imageUrl: "/images/process2.jpg",
  },
  {
    number: "03",
    title: "Onboarding",
    description:
      "Seamless setup with training, integration, and dedicated teams.",
    imageUrl: "/images/process3.jpg",
  },
  {
    number: "04",
    title: "Execution",
    description: "Our experts deliver results with efficiency and precision.",
    imageUrl: "/images/process4.jpg",
  },
  {
    number: "05",
    title: "Customer Support",
    description: "Continuous tracking of performance and KPIs.",
    imageUrl: "/images/process5.jpg",
  },
  {
    number: "06",
    title: "Optimization",
    description: "Regular improvements to maximize efficiency and ROI.",
    imageUrl: "/images/process6.jpg",
  },
];

const Process: React.FC = () => {
  return (
    <section
      id="process"
      className={`py-20 pb-44 bg-white relative overflow-hidden mb-24 ${SECTION_HEIGHT.standard}`}
    >
      <div className={`${DEFAULT_MAX_WIDTH_CLASS}`}>
        
        <div className="text-center mb-16">
          <p
            className={`${openSans.className} text-[#a10000] uppercase text-sm tracking-widest font-semibold relative inline-block
            before:content-[''] before:absolute before:top-1/2 before:-left-8 before:w-6 before:h-px before:bg-[#a10000]
            after:content-[''] after:absolute after:top-1/2 after:-right-8 after:w-6 after:h-px after:bg-[#a10000]`}
          >
            SERVICES PROCESS
          </p>
          <h2
            className={`${openSans.className} text-4xl md:text-5xl font-black text-gray-800 mt-2`}
          >
            Our Work Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
          {processSteps.map((step) => (
            <div key={step.number} className="relative flex flex-col md:flex-row items-center">
              <div className="relative w-full md:w-[65%] md:ml-auto">
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="w-full h-56 object-cover rounded-md shadow-md"
                />
              </div>
              <div
                className="
                  // Mobile (Stacked): Placed below the image, slightly overlapping (mt-[-30px])
                  // Adjust padding and width for a clean look on small screens
                  absolute top-40 left-4 right-4 sm:static sm:w-full 
                  sm:mt-[-30px] sm:top-auto sm:left-auto sm:right-auto sm:self-start 
                  
                  // Tablet/Desktop (Side-by-side overlap)
                  md:absolute md:top-auto md:bottom-[-40px] md:left-2 md:w-[75%] 
                  
                  // Common Styles
                  bg-white shadow-xl rounded-md p-5 z-10 transition-all duration-300
                "
              >
                <p
                  className={`${openSans.className} 
                    absolute -top-10 left-6 
                    text-[64px] leading-none select-none text-transparent 
                    // Responsive Adjustment for the number to ensure it's always visible
                    md:top-[-40px] md:left-6
                  `}
                  style={{
                    WebkitTextStroke: "1.5px #a10000",
                  }}
                >
                  {step.number}
                </p>
                <h3
                  className={`${openSans.className} text-lg md:text-xl font-bold text-gray-800 mb-2`}
                >
                  {step.title}
                </h3>
                <p className={`${rubik.className} text-gray-600 text-sm`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;