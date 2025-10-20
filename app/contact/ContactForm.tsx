"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { COLORS, FONTS, FONT_WEIGHTS } from "@/constant/styles";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // Safely read the reCAPTCHA site key
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!RECAPTCHA_SITE_KEY) {
      setStatus("⚠️ reCAPTCHA is not configured. Cannot submit form.");
      return;
    }

    if (!recaptchaToken) {
      setStatus(
        "⚠️ Please complete the reCAPTCHA challenge before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("g-recaptcha-response", recaptchaToken);

    try {
      const response = await fetch("https://getform.io/f/akkpvmva", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setStatus(
          "✅ Your message has been sent successfully! We will contact you shortly."
        );
        setFormData({ name: "", email: "", message: "" });
        setRecaptchaToken(null);
      } else {
        setStatus(
          "❌ Submission Failed. There was an issue reaching the form server. Please try again."
        );
      }
    } catch (error) {
      setStatus("⚠️ Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = `w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#a10000] focus:border-[#a10000] focus:outline-none transition placeholder-gray-500`;

  return (
    <div
      className="rounded-3xl shadow-2xl p-6 lg:p-10 transform hover:shadow-3xl transition duration-500"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="mb-8 border-b pb-4 border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src="/images/Tlxlogo.webp"
              alt="TELEX Philippines Logo"
              fill
              className="object-contain"
              sizes="48px"
              priority
            />
          </div>
          <div>
            <span
              className="text-2xl block tracking-tight"
              style={{
                fontFamily: FONTS.poppins,
                fontWeight: FONT_WEIGHTS.bold,
                color: COLORS.black,
              }}
            >
              TELEX PHILIPPINES
            </span>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: FONTS.poppins }}
            >
              Send us a message
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputStyle}
        />

        <textarea
          name="message"
          placeholder="Your Message or Inquiry"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={`${inputStyle} resize-none`}
        />

        <div className="pt-2">
          {RECAPTCHA_SITE_KEY ? (
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
            />
          ) : (
            <p className="text-red-600 text-sm">
              ⚠️ reCAPTCHA key is missing. Please contact support.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !recaptchaToken || !RECAPTCHA_SITE_KEY}
          className={`w-full text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 transform ${
            isSubmitting || !recaptchaToken || !RECAPTCHA_SITE_KEY
              ? "bg-gray-400 cursor-not-allowed shadow-none"
              : "bg-[#a10000] hover:bg-[#8a0000] hover:scale-[1.01] active:scale-[0.99]"
          }`}
          style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold }}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>

        {status && (
          <p
            className={`text-center text-sm pt-2 ${
              status.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
            style={{ fontFamily: FONTS.poppins }}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
