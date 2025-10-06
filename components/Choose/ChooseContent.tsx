import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import FeaturesSection from "./FeaturesSection";
import CenterGrid from "./CenterGrid";

const DARK_RED = '#a10000';
const HOVER_DARK_RED = '#850000'; 

const ChooseHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
      <div>
        <p className={`text-[${DARK_RED}] text-sm font-open-sans-bold mb-3 uppercase tracking-wide flex items-center gap-2`}>
          <span className={`w-8 h-[2px] bg-[${DARK_RED}]`}></span>
          WHY CHOOSE US
        </p>
        <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-open-sans-bold text-gray-900 leading-[1.1]">
          We Use Proven Technologies<br />
          to Foster a Clean Energy
        </h2>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <button className={`flex items-center justify-center gap-2 bg-[${DARK_RED}] text-white w-14 h-14 rounded-full hover:bg-[${HOVER_DARK_RED}] transition-all hover:scale-105 shadow-lg`}>
          <ArrowUpRight className="w-6 h-6" />
        </button>
        <p className="text-gray-900 font-open-sans-bold text-lg hidden md:block">Contact Us</p>
      </div>
    </div>
  );
};

const ChooseGrid = () => {
  // ... (features array remains the same)
  const leftFeatures = [
    {
      id: 1,
      title: "Process Optimization",
      description: "We streamline workflows to save time and reduce costs.",
      icon: "layers",
    },
    {
      id: 2,
      title: "Data Security",
      description: "Your sensitive information is protected with enterprise-grade security.",
      icon: "building",
    },
    {
      id: 3,
      title: "Global Scalability",
      description: "Expand operations seamlessly with flexible outsourcing models.",
      icon: "wrench",
    },
  ];

  const rightFeatures = [
    {
      id: 4,
      title: "24/7 Support",
      description: "Round-the-clock service that ensures no downtime for your business.",
      icon: "shield",
    },
    {
      id: 5,
      title: "Cost Efficiency",
      description: "Affordable solutions without compromising on quality.",
      icon: "network",
    },
    {
      id: 6,
      title: "Smart Workforce",
      description: "Trained professionals with the expertise your business deserves.",
      icon: "leaf",
    },
  ];


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <FeaturesSection features={leftFeatures} />
      <CenterGrid />
      <FeaturesSection features={rightFeatures} />
    </div>
  );
};

const ChooseContent = () => {
    return (
        <>
            <ChooseHeader />
            <ChooseGrid />
        </>
    );
}

export default ChooseContent;