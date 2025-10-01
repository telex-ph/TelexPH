import React from "react";

export default function CoreValues() {
  return (
    <section className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="w-[90%] mx-auto max-w-[1300px]">
        <div className="text-center mb-12">
          <span className="text-red-600 font-bold text-base uppercase tracking-[0.2em]">
            — OUR VALUES
          </span>
          <h2 className="text-5xl font-extrabold text-gray-900 mt-4">
            What We Stand For
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Value Card 1: Innovation */}
          <div className="p-8 bg-gray-50 rounded-xl shadow-lg border-t-2 border-red-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Innovation Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We embrace change and continuously seek innovative solutions to
              meet evolving business needs.
            </p>
          </div>

          {/* Value Card 2: Customer Focus */}
          <div className="p-8 bg-gray-50 rounded-xl shadow-lg border-t-2 border-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Customer Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Focus</h3>
            <p className="text-gray-600">
              Our clients are at the heart of everything we do. We listen,
              understand, and deliver tailored solutions.
            </p>
          </div>

          {/* Value Card 3: Integrity */}
          <div className="p-8 bg-gray-50 rounded-xl shadow-lg border-t-2 border-red-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Integrity Icon */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-600">
              We operate with honesty and transparency, building trust with
              every interaction and partnership.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}