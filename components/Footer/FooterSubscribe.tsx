import React from "react";

const FooterSubscribe = () => {
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-poppins-black mb-2 text-base text-white">Subscribe Now</h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>

      <p className="text-xs sm:text-sm text-gray-300 mb-3">
        Subscribe our newsletter to get the latest news and updates!
      </p>
      <div className="flex border border-gray-500 rounded overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-3 py-1.5 sm:py-2 w-full bg-transparent text-xs sm:text-sm focus:outline-none"
        />
        <button className="bg-[#a10000] px-4 text-sm">→</button>
      </div>
    </div>
  );
};

export default FooterSubscribe;