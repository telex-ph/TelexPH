import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center gap-2 bg-red-500 text-white w-14 h-14 rounded-full hover:bg-red-600 transition-all hover:scale-105 shadow-lg flex-shrink-0">
          <ArrowUpRight className="w-6 h-6" />
        </button>
        <p className="text-gray-900 font-semibold text-lg hidden lg:block">Contact Us</p>
      </div>
    </div>
  );
};

export default ChooseHeader;