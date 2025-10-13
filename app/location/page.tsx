"use client";

import React from 'react';
import LocationHero from './components/LocationHero';
import LocationContactInfo from './components/LocationContactInfo';
import LocationContactForm from './components/LocationContactForm';
import LocationMap from './components/LocationMap';
import Footer from '@/components/Footer/Footer';
import { COLORS, FONTS, TYPOGRAPHY } from '@/constant/styles';

const LocationPage = () => {
  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: COLORS.white,
        fontFamily: FONTS.rubik 
      }}
    >
      {/* Hero Section */}
      <LocationHero />

      {/* Contact Section - Two Columns */}
      <section className="py-16" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <LocationContactInfo />

            {/* Right: Contact Form */}
            <LocationContactForm />
          </div>
        </div>
      </section>

      {/* Map Section - Full Width Bottom */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <LocationMap />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LocationPage;