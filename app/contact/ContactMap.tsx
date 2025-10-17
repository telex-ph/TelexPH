"use client";

import React from "react";

const ContactMap: React.FC = () => {
  return (
    <div className="pt-6">
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.5!2d120.756!3d15.655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMQ4C%2B5MX%2C%20Pangasinan%20-%20Nueva%20Ecija%20Rd%2C%20Guimba%2C%20Nueva%20Ecija!5e0!3m2!1sen!2sph!4v1234567890&zoom=15&disableDefaultUI=true"
          className="w-full h-full pointer-events-none"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80px] flex flex-col items-center pointer-events-none">
          <div className="bg-[#ff0000] text-white font-bold text-[16px] px-4 py-[6px] rounded-md shadow-md whitespace-nowrap">
            TELEX Philippines
          </div>

          <div className="w-[4px] h-[60px] bg-[#ff0000] relative z-10"></div>

          <div className="relative z-10 mt-[-2px]">
            <div className="absolute inset-0 w-[30px] h-[30px] bg-white opacity-40 rounded-full -translate-x-[8px] -translate-y-[8px] scale-150 z-0"></div>

            <div className="relative w-[20px] h-[20px] bg-[#ff0000] rounded-full shadow-md z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
