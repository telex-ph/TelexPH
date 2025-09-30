import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import CompanyDetails from './CompanyDetails'; 

const About = () => {
  return (
    <div className="pt-20 pb-20 bg-white relative overflow-hidden"> 
      <div 
        className="absolute bottom-[-10%] left-[-5%] right-0 text-[10rem] md:text-[14rem] lg:text-[18rem] 
                   text-red-500 opacity-10 font-extrabold select-none pointer-events-none 
                   leading-none z-0"
      >
        <span className="text-fill-transparent text-outline-red-thin">
          GROW WITH TELEXPH
        </span> 
      </div>

      <div className="w-[85%] mx-auto relative z-10"> 
        
        {/* Subtitle */}
        <p className="text-red-500 text-sm font-semibold tracking-widest uppercase mb-2">
          — ABOUT COMPANY
        </p>
        
        <div className="flex justify-between items-start mb-12">
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Powering Your Business <br className="hidden md:block" /> the Smart Way
            </h2>

             {/* View About Us Button (Moved here for better top alignment) */}
            <button className="hidden lg:flex items-center text-gray-900 font-semibold mt-4">
                <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mr-3 transform transition duration-300 hover:scale-110 shadow-xl">
                    <FaArrowRight className="text-white text-xl" />
                </div>
                View About Us
            </button>
        </div>
        
        {/* Content Section */}
        <CompanyDetails />
      </div>
    </div>
  );
};

export default About;