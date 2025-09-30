'use client';

import React, { useState } from 'react';
import Nav from '@/components/Home/Navbar/Nav';
import MobileNav from '@/components/Home/Navbar/MobileNav';
import Footer from '@/components/Footer/Footer';

export default function AboutPage() {
  const [showNav, setShowNav] = useState(false);
  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Navbar */}
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] text-white py-20 mt-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-red-600">TELEXPH</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Powering Your Business the Smart Way
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="w-[85%] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
                — ABOUT COMPANY
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
                Best Construction Solution Company
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                As one of the largest dedicated residential solar companies in the industry, 
                we pride ourselves on delivering the best solar solutions to our clients. 
                Our commitment to excellence and innovation sets us apart in the market.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                With years of experience and a team of dedicated professionals, we have 
                successfully completed numerous projects, helping businesses optimize their 
                operations and achieve sustainable growth through innovative delivery and 
                transport solutions.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At TELEXPH, we believe in powering your business the smart way by combining 
                cutting-edge technology with personalized service. Our approach ensures that 
                every client receives tailored solutions that meet their unique needs.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-4xl font-bold">15+</div>
                  <div className="text-sm mt-1">Years Experience</div>
                </div>
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-sm mt-1">Projects Done</div>
                </div>
                <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-4xl font-bold">98%</div>
                  <div className="text-sm mt-1">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-lg">Company Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-100">
        <div className="w-[85%] mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
              — OUR PURPOSE
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">
              Mission & Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-lg shadow-lg border-t-4 border-red-600">
              <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide innovative and reliable delivery and transport solutions that 
                empower businesses to thrive in a competitive market. We are committed to 
                excellence, sustainability, and customer satisfaction in everything we do. 
                Our goal is to be the trusted partner that helps businesses grow and succeed 
                through smart, efficient solutions.
              </p>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-lg border-t-4 border-gray-900">
              <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading provider of smart business solutions, recognized for our 
                innovation, reliability, and commitment to helping businesses achieve their 
                full potential through cutting-edge technology and exceptional service. 
                We envision a future where every business has access to world-class delivery 
                and transport solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="w-[85%] mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
              — OUR VALUES
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4">
              What We Stand For
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation and Continuous Improvement</h3>
              <p className="text-gray-600">
                We embrace change and continuously seek innovative solutions to meet evolving business needs.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer-Centric Approach</h3>
              <p className="text-gray-600">
                Our clients are at the heart of everything we do. We listen, understand, and deliver.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity and Transparency</h3>
              <p className="text-gray-600">
                We operate with honesty and transparency, building trust with every interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="w-[85%] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Awards & Achievements</h2>
            <p className="text-gray-400 text-lg">
              Our commitment to excellence has been recognized by industry leaders
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-5xl font-bold text-red-600 mb-2">2024</div>
              <h3 className="text-xl font-semibold mb-3">Best Performer Awards</h3>
              <div className="flex justify-center mb-4">
                <span className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-300 text-sm">
                Recognized for outstanding performance and innovation
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <div className="text-5xl font-bold text-red-600 mb-2">2023</div>
              <h3 className="text-xl font-semibold mb-3">Customer Excellence</h3>
              <div className="flex justify-center mb-4">
                <span className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-300 text-sm">
                Awarded for exceptional customer service
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">💡</div>
              <div className="text-5xl font-bold text-red-600 mb-2">2022</div>
              <h3 className="text-xl font-semibold mb-3">Innovation Leader</h3>
              <div className="flex justify-center mb-4">
                <span className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-300 text-sm">
                Leading the industry in technological innovation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="w-[85%] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8 text-red-100">
            Let's discuss how we can help power your business the smart way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}