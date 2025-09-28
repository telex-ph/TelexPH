import React from "react";

// Icons
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaRegClock } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { HiLocationMarker } from "react-icons/hi";

const TopBar: React.FC = () => {
  return (
    // === 1. TOP RED BAR ===
    // This section is only visible on medium screens (md) and up
    <div className="bg-red-600 text-white text-xs hidden md:flex items-center justify-between px-4 xl:px-8 py-2 h-[40px]">
      {/* Left Info (Hours and Phone) */}
      <div className="flex items-center space-x-6">
        <span className="flex items-center">
          <FaRegClock className="w-3 h-3 mr-2" />
          Sun - Fri (7:00 - 18:00)
        </span>
        <span className="flex items-center">
          <IoCallOutline className="w-3 h-3 mr-2" />
          +0044 9922299
        </span>
      </div>

      {/* Right Info (Address and Social Links) */}
      <div className="flex items-center space-x-6">
        <span className="flex items-center">
          <HiLocationMarker className="w-4 h-4 mr-2" />
          22 Sterling Close, Winchester, M23 4FD
        </span>
        <div className="flex space-x-3">
          <FaFacebookF className="w-3 h-3 cursor-pointer hover:text-gray-200 transition" />
          <FaTwitter className="w-3 h-3 cursor-pointer hover:text-gray-200 transition" />
          <FaInstagram className="w-3 h-3 cursor-pointer hover:text-gray-200 transition" />
          <FaYoutube className="w-3 h-3 cursor-pointer hover:text-gray-200 transition" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;