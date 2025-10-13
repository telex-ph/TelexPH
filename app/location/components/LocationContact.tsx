import React from 'react';
import { COLORS } from "@/constant/styles"; 

const LocationContact = () => {
  const GRAY_TEXT_COLOR = 'rgb(75 85 99)'; 

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-8">
          We're here to help. Visit us at our office or reach out through any of the channels below.
        </p>
      </div>

      {/* Address */}
      <div className="flex items-start space-x-4">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Office</h3>
          <p className="text-gray-600">
            Unit 208, Telecomp Building, San Roque, Guimba, Nueva Ecija
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start space-x-4">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
          <a 
            href="mailto:partnerships@telexph.com" 
            className="text-gray-600 transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = GRAY_TEXT_COLOR} 
          >
            partnerships@telexph.com
          </a>
        </div>
      </div>

      {/* Business Hours */}
      <div className="flex items-start space-x-4">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Hours</h3>
          <p className="text-gray-600">
            Mon - Fri: 9:00 AM - 5:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationContact;