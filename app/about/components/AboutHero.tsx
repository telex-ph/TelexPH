import React from "react";
import Link from "next/link";

export default function AboutHero() {
  // Ang color palette base sa bagong design ay puting background, 
  // dark gray/black text, at red accent.

  return (
    // Binawasan ang padding sa ibaba mula pb-20 papuntang pb-16.
    <section className="relative bg-white text-gray-900 pt-40 pb-16 overflow-hidden">
      
      {/* Background Outline Text - "Our About" (Black Outline) */}
      <div 
          // Binawasan pa ang font size (mula 10rem ginawang 8rem sa large screen)
          // at inangat para mas mataas ang kalahati ng text.
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[85%] 
                     text-[5rem] md:text-[7rem] lg:text-[8rem] 
                     opacity-10 font-extrabold select-none pointer-events-none 
                     leading-none z-0 whitespace-nowrap" 
                     // Ginamit ang -translate-y-[85%] para mas maangat at lumiit ang text.
                     
      >
          <span 
            // Custom CSS for outline text with black stroke and transparent fill
            style={{
              // Ginawang itim (black) ang stroke at ginawang mas makapal (2.5px)
              WebkitTextStroke: '2.5px #333333', 
              WebkitTextFillColor: 'transparent', 
              opacity: 0.9, 
            }}
          >
            Our About
          </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900">
            Our About
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Our team designs and constructs attractive and functional retail spaces that draw customers and support business growth.
          </p>
          
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 font-medium">
              <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
              <span className="mx-2">&gt;&gt;</span>
              <span className="text-red-600">About</span>
          </div>
        </div>
      </div>
    </section>
  );
}