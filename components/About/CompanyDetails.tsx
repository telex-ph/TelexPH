import React from 'react';
import { FaFire, FaArrowRight } from 'react-icons/fa'; // Icons for the fire and arrow

const CompanyDetails = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      
      {/* Col 1: Awards Box (Best Performer Awards) */}
      <div className="relative bg-white shadow-xl p-6 rounded-xl border-t-4 border-red-500 transform transition duration-300 hover:scale-[1.02] min-h-[250px] flex flex-col justify-between">
        <div className="flex items-start mb-4">
          <FaFire className="text-4xl text-orange-500 mr-3 mt-1" />
          {/* Star rating placeholder */}
          <div className="text-2xl text-yellow-400">★★★★★</div>
        </div>
        
        <div>
            <p className="text-5xl font-bold text-red-500 my-2">2024</p>
            <p className="text-xl font-semibold text-gray-800">
                Best Performer <br /> Awards
            </p>
        </div>
        
        {/* Small red circle/arrow placeholder from image */}
        <div className="absolute bottom-[-15px] right-[-15px] bg-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <FaArrowRight className="text-white text-base rotate-[-45deg]" />
        </div>
      </div>

      {/* Col 2: Text Content (Solution Company & Feature List) */}
      <div className="space-y-8">
        {/* Best Construction Solution Company */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Best Construction <br /> Solution Company
          </h3>
          <p className="text-gray-600 mb-2">
            As one of the largest dedicated residential solar the best solar.
          </p>
          <p className="text-gray-600">
            As one of the largest dedicated residential solar companies
          </p>
        </div>

        {/* Best Feature List About Us */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Best Feature List <br /> About Us
          </h3>
          <ul className="space-y-2 text-gray-600">
            {['Innovation and Continuous', 'Customer-Centric Approach', 'Integrity and Transparency', 'Our Journey to a Brighter'].map((feature) => (
              <li key={feature} className="flex items-center">
                {/* Red checkmark/bullet placeholder */}
                <span className="text-red-500 text-lg mr-3 font-bold">✓</span> 
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Col 3: Large Image/Placeholder Section */}
      <div className="relative col-span-1 min-h-[400px] mt-10 lg:mt-0">
        {/* Gray Image Placeholder (mimicking the image layout) */}
        <div className="absolute top-0 left-0 w-[80%] h-[300px] bg-gray-300 rounded-xl z-0 shadow-lg"></div>
        {/* Second gray box for layered effect */}
        <div className="absolute bottom-0 right-0 w-[70%] h-[200px] bg-gray-400 rounded-xl z-10 shadow-xl"></div>
      </div>
      
      {/* Mobile-only "View About Us" button */}
      <div className="lg:hidden mt-8 col-span-full flex justify-center">
          <button className="flex items-center text-gray-900 font-semibold">
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mr-3 transform transition duration-300 hover:scale-110 shadow-xl">
                  <FaArrowRight className="text-white text-xl" />
              </div>
              View About Us
          </button>
      </div>

    </div>
  );
};

export default CompanyDetails;