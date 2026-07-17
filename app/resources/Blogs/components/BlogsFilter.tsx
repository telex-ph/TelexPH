"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiMagnifyingGlass, HiListBullet, HiSquares2X2, HiChevronDown } from "react-icons/hi2";
import { COLORS, FONTS } from "@/constant/styles";

interface BlogsFilterProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function BlogsFilter({
  viewMode, setViewMode, activeTab, setActiveTab, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery
}: BlogsFilterProps) {

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

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

  const isAllTab = activeTab === "All";
  const mainTabOptions = categories.filter((c) => c.value !== "All");

  const activeCategory =
    categories.find((c) => c.value === activeTab || c.subcategories.includes(activeTab)) || categories[0];
  const subcategoryOptions = activeCategory.subcategories;
  const hasSubcategories = subcategoryOptions.length > 0;
  const canOpenDropdown = isAllTab || hasSubcategories;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    setActiveTab(categoryValue);
    setCategoryFilter(null);
    setCategoryDropdownOpen(false);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setActiveTab(subcategory);
    setCategoryFilter(null);
    setCategoryDropdownOpen(false);
  };

  // Picking a category from the dropdown while on ALL filters the content
  // without switching which tab is visually active.
  const handleAllTabCategoryFilter = (categoryValue: string | null) => {
    setCategoryFilter(categoryValue);
    setCategoryDropdownOpen(false);
  };

  return (
    <div className="w-full mb-10">
      {/* Category Tabs */}
      <div className="flex flex-nowrap md:flex-wrap justify-between md:justify-center gap-x-4 md:gap-x-10 border-b border-gray-100 mb-8 overflow-x-auto md:overflow-visible no-scrollbar">
        {categories.map((item) => {
          const isActive = activeTab === item.value || item.subcategories.includes(activeTab);
          return (
            <button
              key={item.value}
              onClick={() => handleCategoryClick(item.value)}
              className="relative pb-3 md:pb-4 text-[11px] md:text-[14px] font-bold whitespace-nowrap uppercase tracking-tight transition-all duration-200 flex-shrink-0"
              style={{
                color: isActive ? COLORS.dark : "#6b7280",
                fontFamily: FONTS.openSans
              }}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#800000]"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search, Category Filter and Toggle Controls */}
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full max-w-7xl">
          <div className="relative w-full md:w-auto md:flex-grow md:max-w-[400px]">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search blogs...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#800000] transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto md:flex-1">
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                disabled={!canOpenDropdown}
                onClick={() => setCategoryDropdownOpen((v) => !v)}
                className="w-auto min-w-[140px] flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg text-[14px] font-bold outline-none shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
                style={{ fontFamily: FONTS.openSans, color: "#4b5563" }}
              >
                {isAllTab
                  ? (categoryFilter ? mainTabOptions.find((c) => c.value === categoryFilter)?.label ?? "Category" : "Category")
                  : (subcategoryOptions.includes(activeTab) ? activeTab : "Category")}
                <HiChevronDown className={`text-gray-400 w-4 h-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {canOpenDropdown && categoryDropdownOpen && (
                <div className="absolute z-20 top-full left-0 mt-2 w-full min-w-[220px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1">
                  {isAllTab ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAllTabCategoryFilter(null)}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${!categoryFilter ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}
                        style={{ fontFamily: FONTS.openSans }}
                      >
                        All Categories
                      </button>
                      {mainTabOptions.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => handleAllTabCategoryFilter(cat.value)}
                          className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                            categoryFilter === cat.value
                              ? "bg-[#800000] text-white"
                              : "text-gray-700 hover:bg-[#800000]/5 hover:text-[#800000]"
                          }`}
                          style={{ fontFamily: FONTS.openSans }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(activeCategory.value)}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${activeTab === activeCategory.value ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}
                        style={{ fontFamily: FONTS.openSans }}
                      >
                        All {activeCategory.label}
                      </button>
                      {subcategoryOptions.map((subcat) => (
                        <button
                          key={subcat}
                          type="button"
                          onClick={() => handleSubcategoryClick(subcat)}
                          className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                            activeTab === subcat
                              ? "bg-[#800000] text-white"
                              : "text-gray-700 hover:bg-[#800000]/5 hover:text-[#800000]"
                          }`}
                          style={{ fontFamily: FONTS.openSans }}
                        >
                          {subcat}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 md:ml-auto">
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
      </div>
    </div>
  );
}
