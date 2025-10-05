import React from "react";
import { Poppins, Open_Sans, Rubik } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rubik",
  display: "swap",
});

const FooterCTA = () => {
  return (
    <div className={`relative z-20 ${poppins.variable} ${openSans.variable} ${rubik.variable}`}>
      <div className="w-full bg-red-600 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] rounded-lg h-40 sm:h-48 overflow-hidden relative flex items-center px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Text Content - Left Side */}
        <div className="z-10 flex-1 max-w-lg">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-poppins-black mb-1 sm:mb-2">
            Ready to Scale Smarter?
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-rubik">
            Partner with Telex Philippines and discover smarter
            outsourcing solutions for your business.
          </p>
        </div>

        {/* Image - Right Side - Hidden on mobile */}
        <div className="hidden md:block absolute inset-0 h-full w-full pointer-events-none">
          <img
            src="/images/footer.png"
            alt="Delivery man on scooter"
            className="
              absolute bottom-0 
              right-[33%] md:right-[28%] lg:right-[23%] xl:right-[18%]
              h-full w-auto
              max-w-[200px] md:max-w-[280px] lg:max-w-[350px] xl:max-w-[400px]
              object-cover object-right-bottom
            "
          />
          <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
        </div>

        {/* Button - Right Side - Medyo mas malaki */}
        <button className="z-20 ml-auto bg-white text-red-600 font-open-sans-bold px-4 sm:px-5 md:px-6 lg:px-7 py-2.5 sm:py-3 md:py-3.5 rounded shadow hover:bg-gray-100 transition whitespace-nowrap text-xs sm:text-sm md:text-base">
          CONTACT US NOW
        </button>

      </div>
    </div>
  );
};

export default FooterCTA;