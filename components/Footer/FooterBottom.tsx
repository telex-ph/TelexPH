import React from "react";

const FooterBottom = () => {
  return (
    <div className="border-t border-gray-700 mt-0 py-4 px-6 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto font-rubik">
      {/* Left side */}
      <div>
        © Copyright 2025 by 
        <span className="text-white font-open-sans-bold"> TelexPH</span>
      </div>

      {/* Right side */}
      <div className="flex space-x-6 mt-2 md:mt-0">
        <a href="#" className="hover:text-white transition font-rubik">Privacy policy</a>
        <a href="#" className="hover:text-white transition font-rubik">Terms and Condition</a>
      </div>
    </div>
  );
};

export default FooterBottom;
