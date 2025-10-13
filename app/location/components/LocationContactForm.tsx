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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("message", formData.message);

    try {
      const response = await fetch("https://getform.io/f/akkpvmva", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setStatus("✅ Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("⚠️ Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a10000] focus:outline-none"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a10000] focus:outline-none"
        />

        {/* Message */}
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a10000] focus:outline-none resize-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white py-3 px-6 rounded-lg bg-[#a10000] hover:bg-[#8a0000] transition"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>

        {/* Status Message */}
        {status && <p className="text-center text-sm mt-4">{status}</p>}
      </form>
    </div>
  );
};

export default LocationContactForm;
