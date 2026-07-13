import React from "react";

const FooterLogo = () => {
  return (
    <div>
      <div className="flex flex-col items-start">
        <img
          src="/images/telexlogo.webp"
          alt="Telex Logo"
          width={200}
          height={80}
          className="mb-2 w-28 sm:w-36 md:w-44 h-auto"
        />
        <p className="text-gray-400 text-xs sm:text-sm uppercase font-open-sans-bold ml-3 sm:ml-5" style={{ letterSpacing: '0.25em' }}>Scale Smarter</p>
      </div>
    </div>
  );
};

export default FooterLogo;