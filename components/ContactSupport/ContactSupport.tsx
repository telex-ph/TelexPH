import React from 'react';
import { Phone } from 'lucide-react';

const DEFAULT_MAX_WIDTH_CLASS = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

const ContactSupport = () => {
  return (
    <div className="my-8">
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>

      {/* Wrapper with centered content */}
      <div className="flex justify-center w-full">
        {/* Apply background and width limit here */}
        <div
          className={`relative bg-gray-50 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_10px_20px_-2px_rgba(0,0,0,0.1)] overflow-hidden w-full ${DEFAULT_MAX_WIDTH_CLASS}`}
        >
          <div className="flex flex-col md:flex-row items-center py-6 md:py-4 px-4 md:px-6 gap-4 md:gap-0">
            <div className="relative flex-shrink-0 md:mr-4">
              <img
                src="images/handshake.jpg"
                alt="Business Handshake"
                className="w-full md:w-56 h-40 md:h-32 object-cover rounded"
              />
              <div className="absolute top-1/2 -translate-y-1/2 -right-5 md:-right-7 bg-red-600 rounded-full p-3 md:p-4 shadow-lg animate-pulse">
                <Phone
                  className="w-6 h-6 md:w-8 md:h-8 text-white animate-[wiggle_1s_ease-in-out_infinite]"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <div className="flex-1 md:pl-12 text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                Have Any Questions? Call Us
              </h2>
              <a
                href="tel:044-331-5040"
                className="text-xl md:text-2xl font-bold text-red-600 hover:text-red-700 transition-colors mb-1 md:mb-2 inline-block"
              >
                +63 (044) 331 - 5040
              </a>
              <p className="text-gray-500 text-xs md:text-sm leading-snug max-w-xl mx-auto md:mx-0">
                Start scaling your business the smarter way with Telex Philippines, your
                partner in smart support services.
              </p>
            </div>

            <div className="hidden md:block absolute -right-10 -bottom-8">
              <div className="w-28 h-28 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
