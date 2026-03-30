"use client";

import React, { useState } from "react";
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
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Category structure with subcategories
  const categories = [
    { 
      label: "All", 
      value: "All",
      subcategories: []
    },
    { 
      label: "Services", 
      value: "Main Service Categories",
      subcategories: [
        "Customer Experience (CX)",
        "Back Office Solutions",
        "Virtual Assistance",
        "Sales & Lead Generation"
      ]
    },
    { 
      label: "Insights", 
      value: "Industry-Specific Insights",
      subcategories: [
        "E-commerce Support",
        "Real Estate Outsourcing",
        "Healthcare BPO",
        "Tech & SaaS Scaling"
      ]
    },
    { 
      label: "Growth", 
      value: "Business Growth & Strategy",
      subcategories: [
        "Scale Smarter",
        "Outsourcing 101",
        "Cost Optimization"
      ]
    },
    { 
      label: "Culture", 
      value: "Company Culture & Updates",
      subcategories: [
        "TelexPH Life",
        "News & Press Releases"
      ]
    },
  ];

  const handleCategoryClick = (categoryValue: string) => {
    setActiveTab(categoryValue);
    setOpenDropdown(null); // Close dropdown when selecting main category
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setActiveTab(subcategory);
    setOpenDropdown(null); // Close dropdown after selection
  };

  const toggleDropdown = (categoryValue: string) => {
    if (openDropdown === categoryValue) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(categoryValue);
    }
  };

  return (
    <div className="w-full mb-10">
      {/* Category Tabs with Dropdowns */}
      <div className="flex flex-wrap justify-center gap-x-6 border-b border-gray-100 mb-8 pb-1">
        {categories.map((item) => (
          <div key={item.value} className="relative group">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCategoryClick(item.value)}
                className="relative pb-3 text-[13px] font-bold uppercase tracking-tight transition-all duration-200 hover:text-[#800000]"
                style={{ 
                  color: activeTab === item.value || item.subcategories.includes(activeTab) ? COLORS.black : "#6b7280", 
                  fontFamily: FONTS.openSans 
                }}
              >
                {item.label}
                {(activeTab === item.value || item.subcategories.includes(activeTab)) && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#800000] rounded-full"></span>
                )}
              </button>
              
              {/* Dropdown trigger - More visible */}
              {item.subcategories.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(item.value);
                  }}
                  className="pb-3 text-gray-500 hover:text-[#800000] transition-colors"
                >
                  <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.value ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Dropdown Menu - Improved visibility */}
            {item.subcategories.length > 0 && openDropdown === item.value && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 min-w-[260px] z-[100] animate-in fade-in duration-200">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select {item.label}</p>
                </div>
                {item.subcategories.map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => handleSubcategoryClick(subcat)}
                    className={`w-full text-left px-4 py-3 text-[13px] font-medium transition-all duration-150 ${
                      activeTab === subcat 
                        ? 'bg-[#800000] text-white' 
                        : 'text-gray-700 hover:bg-[#800000]/5 hover:text-[#800000]'
                    }`}
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search and Toggle Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-7xl mx-auto">
        <div className="relative flex-grow max-w-[400px]">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search blogs...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#800000] transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
          <button 
            onClick={() => setViewMode("list")} 
            className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#800000]" : "text-gray-400 hover:text-gray-600"}`}
          >
            <HiListBullet className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode("grid")} 
            className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#800000]" : "text-gray-400 hover:text-gray-600"}`}
          >
            <HiSquares2X2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}