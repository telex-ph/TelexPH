"use client";

import React, { useState } from "react";
import Image from "next/image";
import { COLORS, FONTS, FONT_WEIGHTS } from "@/constant/styles";

const LocationContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here (e.g., API call)
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-8 lg:p-10"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Logo / Brand */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/images/Tlxlogo.png"
              alt="TELEX Philippines Logo"
              fill
              className="object-contain"
              sizes="40px"
              priority
            />
          </div>
          <span
            className="text-xl"
            style={{
              fontFamily: FONTS.poppins,
              fontWeight: FONT_WEIGHTS.bold,
              color: COLORS.black,
            }}
          >
            TELEX PHILIPPINES
          </span>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="
    w-full px-4 py-3 bg-gray-50 border border-gray-200 
    rounded-lg focus:outline-none focus:border-transparent 
    focus:ring-2 focus:ring-[#a10000] transition-all
  "
            style={{
              fontFamily: FONTS.rubik,
            }}
          />
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="
              w-full px-4 py-3 bg-gray-50 border border-gray-200 
              rounded-lg focus:outline-none focus:border-transparent 
              focus:ring-2 transition-all
            "
            style={{
              fontFamily: FONTS.rubik,
            }}
          />
        </div>

        {/* Message Textarea */}
        <div>
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="
              w-full px-4 py-3 bg-gray-50 border border-gray-200 
              rounded-lg focus:outline-none focus:border-transparent 
              focus:ring-2 transition-all resize-none
            "
            style={{
              fontFamily: FONTS.rubik,
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full text-white py-3 px-6 rounded-lg transition-colors duration-300
            bg-[#a10000] hover:bg-[#8a0000]
          "
          style={{
            fontFamily: FONTS.poppins,
            fontWeight: FONT_WEIGHTS.semibold,
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LocationContactForm;