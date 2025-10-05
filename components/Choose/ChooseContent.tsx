import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import FeaturesSection from "./FeaturesSection";
import CenterGrid from "./CenterGrid";

const ChooseHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
      <div>
        <p className="text-red-500 text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2">
          <span className="w-8 h-[2px] bg-red-500"></span>
          WHY CHOOSE US
        </p>
        <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-bold text-gray-900 leading-[1.1]">
          We Use Proven Technologies<br />
          to Foster a Clean Energy
        </h2>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <button className="flex items-center justify-center gap-2 bg-red-500 text-white w-14 h-14 rounded-full hover:bg-red-600 transition-all hover:scale-105 shadow-lg">
          <ArrowUpRight className="w-6 h-6" />
        </button>
        <p className="text-gray-900 font-semibold text-lg hidden md:block">Contact Us</p>
      </div>
    </div>
  );
};

const ChooseGrid = () => {
  const leftFeatures = [
    {
      id: 1,
      title: "Innovative Solutions",
      description: "In addition to residential services, we specialize in commercial.",
      icon: "layers",
    },
    {
      id: 2,
      title: "Construction Expertise",
      description: "For those looking to enhance their energy independence.",
      icon: "building",
    },
    {
      id: 3,
      title: "Comprehensive Service",
      description: "Our wide network of equipment and technology suppliers.",
      icon: "wrench",
    },
  ];

  const rightFeatures = [
    {
      id: 4,
      title: "Innovative Solutions",
      description: "Understanding the financial aspects of solar installation.",
      icon: "shield",
    },
    {
      id: 5,
      title: "Powered by Trust",
      description: "Our wide network of equipment and technology suppliers.",
      icon: "network",
    },
    {
      id: 6,
      title: "Eco-Friendly",
      description: "To ensure your construction system operates at peak performance.",
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