// page.tsx

"use client";

import React from "react";
import Footer from "@/components/Footer/Footer";
import ContactHero from "./ContactHero";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import ContactSection from "./ContactSection";
import OfficeLocationHeader from "./OfficeLocationHeader";

const COLORS = {
  white: '#ffffff',
};
const FONTS = {
  rubik: 'system-ui, -apple-system, sans-serif',
};


const ContactPage = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.white,
        fontFamily: FONTS.rubik,
      }}
    >
      <ContactHero />

      <ContactSection />

      <section className="py-16" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfo />

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ backgroundColor: COLORS.white }}>
        <OfficeLocationHeader />
      </section>
      
      <Footer />
    </div>
  );
};

export default ContactPage;