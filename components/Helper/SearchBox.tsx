import React from "react";
import { FaCalendar, FaMap } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

const SearchBox = () => {
  return (
    <div className="w-full flex justify-center items-center mt-4 sm:mt-12">
      <div
        className="bg-white rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        items-center justify-center gap-9 w-[95%] sm:w-[80%] max-w-4xl shadow-lg"
      >
        {/* 1st Search Input */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <FaMap className="w-6 h-6 text-blue-600" />
            <p className="text-lg font-medium">Location</p>
          </div>
          <input
            type="text"
            placeholder="Where are you going?"
            className="outline-none border-b border-gray-300 placeholder:text-gray-800 p-2"
          />
        </div>

        {/* 2nd Search Input */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <FaCalendar className="w-6 h-6 text-blue-600" />
            <p className="text-lg font-medium">Start Date</p>
          </div>
          <input
            type="date"
            className="outline-none border-b border-gray-300 p-2"
          />
        </div>

        {/* 3rd Search Input */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <FaCalendar className="w-6 h-6 text-blue-600" />
            <p className="text-lg font-medium">End Date</p>
          </div>
          <input
            type="date"
            className="outline-none border-b border-gray-300 p-2"
          />
        </div>

        {/* 4th Search Input */}
        <div className="flex items-center space-x-6">
          <FaUserGroup className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-lg font-medium mb-[0.2rem]">Guest</p>
            <p className="text-base font-normal">1 Guest 1 Room</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
