import React from "react";

const FooterCTA = () => {
  return (
    <div className="relative z-20">
      <div className="w-full bg-red-600 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] rounded-lg h-40 sm:h-48 overflow-hidden relative flex items-center px-6 sm:px-12">

        {/* Text Content - Left Side */}
        <div className="z-10 flex-1 max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Join the Future of Innovation:
          </h2>
          <p className="text-lg sm:text-xl">Contact Us Now</p>
        </div>

        {/* Image - Right Side */}
        <div className="absolute inset-0 h-full w-full pointer-events-none">
          <img
            src="/images/footer.png"
            alt="Delivery man on scooter"
            className="
              absolute bottom-0 right-0
              h-full max-w-[250px] sm:max-w-[350px] md:max-w-[450px]
              md:right-20 lg:right-32 xl:right-70
              object-cover
            "
            style={{ objectPosition: 'right bottom' }}
          />
          <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
        </div>

        {/* Button - Right Side */}
        <button className="z-20 ml-auto bg-white text-red-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition whitespace-nowrap">
          GET A QUOTE
        </button>

      </div>
    </div>
  );
};

export default FooterCTA;
