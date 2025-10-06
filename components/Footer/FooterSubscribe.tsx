import React from "react";

const FooterSubscribe = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-poppins-black mb-2 text-white">Subscribe Now</h3>
        {/* Red line sa baba ng heading */}
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>
      
      <p className="text-sm text-gray-300 mb-4">
        Subscribe our newsletter to get the latest news and updates!
      </p>
      <div className="flex border border-gray-500 rounded overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-3 py-2 w-full bg-transparent text-sm focus:outline-none"
        />
        <button className="bg-[#a10000] px-4">→</button>
      </div>
    </div>
  );
};

export default FooterSubscribe;