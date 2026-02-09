"use client";

import React from "react";
import { HiMagnifyingGlass, HiListBullet, HiSquares2X2, HiChevronDown } from "react-icons/hi2";
import { COLORS, FONTS } from "@/constant/styles";

interface BlogsFilterProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function BlogsFilter({ 
  viewMode, setViewMode, activeTab, setActiveTab, searchQuery, setSearchQuery 
}: BlogsFilterProps) {
  
  const navItems = ["All", "Insights", "News", "Tutorials", "Webinars"];

  return (
    <div className="w-full mb-10">
      <div className="flex flex-wrap justify-center gap-x-10 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className="relative pb-4 text-[14px] font-bold uppercase tracking-tight transition-all duration-200"
            style={{ 
              color: activeTab === item ? COLORS.black : "#4b5563", 
              fontFamily: FONTS.openSans 
            }}
          >
            {item}
            {activeTab === item && <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#800000]"></span>}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-7xl mx-auto">
        <div className="relative flex-grow max-w-[400px]">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search blogs...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#800000] transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow-sm text-[#800000]" : "text-gray-400"}`}><HiListBullet className="w-5 h-5" /></button>
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm text-[#800000]" : "text-gray-400"}`}><HiSquares2X2 className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}