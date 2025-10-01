import React from "react";
import Image from "next/image";

// Tandaan: Ginagamit na ng component na ito ang full path ng image, 
// hindi na ang imported variable (imageOne/imageTwo).

export default function CompanyOverview() {
  return (
    <section className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="w-[90%] mx-auto max-w-[1300px]">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left: Text Content and Stats */}
          <div>
            <span className="text-red-600 font-bold text-base uppercase tracking-[0.2em]">
              — OUR STORY
            </span>
            <h2 className="text-5xl font-extrabold text-gray-900 mt-4 mb-8 leading-tight">
              Driving Innovation in Smart Logistics
            </h2>
            <p className="text-gray-600 mb-5 leading-relaxed border-l-4 border-red-600 pl-4">
              As one of the leading smart solution providers in the industry, 
              we pride ourselves on delivering the best **delivery and transport solutions** to our clients. Our commitment to excellence and innovation sets us apart 
              in the competitive market.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              With **over 15 years of experience** and a team of dedicated professionals, 
              we have successfully completed numerous projects, helping businesses 
              optimize their operations and achieve sustainable growth through 
              innovative and efficient strategies.
            </p>
            
            {/* Stat Boxes - Combined Design */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900 text-white rounded-lg shadow-xl text-center">
                <div className="text-3xl font-bold text-red-500">15+</div>
                <div className="text-xs mt-1 uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="p-4 bg-white text-gray-900 rounded-lg border border-red-600 text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-xs mt-1 uppercase tracking-wider">Projects Done</div>
              </div>
              <div className="p-4 bg-gray-900 text-white rounded-lg shadow-xl text-center">
                <div className="text-3xl font-bold text-red-500">98%</div>
                <div className="text-xs mt-1 uppercase tracking-wider">Client Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Right: Images - Split and Overlapping Design */}
          <div className="relative h-[600px] mt-10 md:mt-0">
              {/* Main Image (Image 1) */}
              <div className="absolute top-0 left-0 w-[80%] h-[400px] rounded-xl overflow-hidden shadow-2xl">
                  <Image 
                      src={"/assets/image_22fed6.png"} 
                      alt="Company team working" 
                      fill
                      objectFit="cover" 
                      className="transition-transform duration-500 hover:scale-105"
                  />
              </div>
              {/* Secondary Image (Image 2 - Overlap) */}
              <div className="absolute bottom-0 right-0 w-[70%] h-[350px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                      src={"/assets/image_230258.png"} 
                      alt="Logistics solutions" 
                      fill
                      objectFit="cover" 
                      className="transition-transform duration-500 hover:scale-105"
                  />
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}