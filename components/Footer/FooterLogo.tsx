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
          className="mb-2"
        /> 
        <p className="text-gray-400 text-sm uppercase font-open-sans-bold ml-5" style={{ letterSpacing: '0.35em' }}>Scale Smarter</p>
      </div>
    </div>
  );
};

export default FooterLogo;