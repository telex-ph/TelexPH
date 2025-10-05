import React from "react";

export default function MissionVision() {
  return (
    <section className="py-20 bg-white">
      
      {/* Background Outline Text - OUR SERVICES */}
      <div 
          className="absolute top-[-10%] left-0 right-0 text-[10rem] md:text-[14rem] lg:text-[18rem] 
                     text-red-500 opacity-10 font-extrabold select-none pointer-events-none 
                     leading-none z-0"
      >
          <span 
            // Custom CSS class for outline text
            style={{
              WebkitTextStroke: '1px #ff0000', // Red stroke
              WebkitTextFillColor: 'transparent', // Transparent fill
              opacity: 0.1, 
            }}
          >
            OUR SERVICES
          </span>
      </div>

      <div className="w-[90%] mx-auto max-w-[1300px] relative z-10">
        <div className="text-center mb-12">
          <span className="text-red-600 font-bold text-base uppercase tracking-[0.2em]">
            — OUR PURPOSE
          </span>
          <h2 className="text-5xl font-extrabold text-gray-900 mt-4">
            Mission & Vision
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-xl shadow-lg border-t-8 border-red-600 hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
              {/* Mission Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To provide innovative and reliable delivery and transport solutions that 
              empower businesses to thrive in a competitive market. We are committed to 
              excellence, sustainability, and customer satisfaction in everything we do.
            </p>
          </div>
          <div className="bg-white p-10 rounded-xl shadow-lg border-t-8 border-gray-900 hover:shadow-2xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
              {/* Vision Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To be the leading provider of smart business solutions, recognized for 
              our innovation, reliability, and commitment to helping businesses achieve 
              their full potential through cutting-edge technology and exceptional service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}