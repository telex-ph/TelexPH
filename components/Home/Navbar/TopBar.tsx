import React from "react";

// Icons
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaRegClock,
} from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { HiLocationMarker } from "react-icons/hi";

const TopBar: React.FC = () => {
  return (
    <div className="bg-red-600 text-white text-xs hidden md:flex items-center justify-between h-[40px]">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto px-4 xl:px-8">
        {/* Left Info */}
        <div className="flex items-center space-x-6 lg:w-[350px]">
          <span className="flex items-center">
            <FaRegClock className="w-3 h-3 mr-2" />
            Sun - Fri (7:00 - 18:00)
          </span>
          <span className="flex items-center">
            <IoCallOutline className="w-3 h-3 mr-2" />
            +0044 9922299
          </span>
        </div>

        {/* Right Info */}
        <div className="flex items-center space-x-6">
          <span className="hidden lg:flex items-center">
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
    </div>
  );
};

export default TopBar;