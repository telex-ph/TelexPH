import React from "react";

const FooterSubscribe = () => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Subscribe Now</h3>
      <p className="text-sm text-gray-300 mb-4">
        Subscribe our newsletter to get the latest news and updates!
      </p>
      <div className="flex border border-gray-500 rounded overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-3 py-2 w-full bg-transparent text-sm focus:outline-none"
        />
        <button className="bg-red-600 px-4">→</button>
      </div>
    </div>
  );
};

export default FooterSubscribe;
