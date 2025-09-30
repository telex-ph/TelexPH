import React from "react";

const FooterPosts = () => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Popular Post</h3>
      
      {/* Gamitin ang Grid para sa 2x2 layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Post 1: Red text box */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
            <div className="bg-red-600 text-white text-sm p-3 h-full flex flex-col justify-end">
                <p className="font-semibold">Solar Energy in the Transportation Sector</p>
                {/* Arrow icon shown in the design */}
                <span className="absolute top-3 right-3 text-2xl transform rotate-45">
                    &uarr;
                </span>
            </div>
        </div>
        
        {/* Post 2: Gray Placeholder */}
        <div className="bg-gray-700 aspect-square rounded-lg"></div>
        
        {/* Post 3: Gray Placeholder */}
        <div className="bg-gray-700 aspect-square rounded-lg"></div>

        {/* Post 4: Gray Placeholder */}
        <div className="bg-gray-700 aspect-square rounded-lg"></div>
      </div>
    </div>
  );
};

export default FooterPosts;