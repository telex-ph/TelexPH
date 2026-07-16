"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { COLORS, FONTS } from "@/constant/styles";
import { 
  HiChevronDown, 
  HiMagnifyingGlass, 
  HiXMark, 
  HiListBullet, 
  HiSquares2X2,
  HiEye,
  HiEllipsisVertical
} from "react-icons/hi2";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com';

// ✅ Random Profile Picture Generator
function generateRandomProfiles(seed: string | number, count: number = 3) {
  const profiles = [];
  const seedNum = typeof seed === 'string' ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;
  for (let i = 0; i < count; i++) {
    const randomNum = ((seedNum + i * 13) % 70) + 1;
    profiles.push(`https://i.pravatar.cc/150?img=${randomNum}`);
  }
  return profiles;
}

// API Functions
async function getAllCaseStudies() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/casestudies`);
    if (!response.ok) throw new Error('Failed to fetch case studies');
    return response.json();
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export default function CaseStudiesFilter() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [tagFilter, setTagFilter] = useState("Filter by tag");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [apiCaseStudies, setApiCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, startScrollLeft: 0, moved: false });

  const handleTabsPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tabsRef.current) return;
    dragState.current.isDragging = true;
    dragState.current.moved = false;
    dragState.current.startX = e.clientX;
    dragState.current.startScrollLeft = tabsRef.current.scrollLeft;
  };

  const handleTabsPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging || !tabsRef.current) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 3) dragState.current.moved = true;
    tabsRef.current.scrollLeft = dragState.current.startScrollLeft - delta;
  };

  const handleTabsPointerUp = () => {
    dragState.current.isDragging = false;
  };

  const handleTabClick = (name: string) => {
    if (dragState.current.moved) return;
    setActiveTab(name);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setTagOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = ["All Status", "Active", "Completed", "Draft", "Scheduled"];
  const tagOptions = ["Filter by tag", "Technology", "Logistics", "Analytics", "Infrastructure"];

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "All Status" || tagFilter !== "Filter by tag";

  const navItems = [
    { name: "All" },
    { name: "Case Studies" },
    { name: "Events" },
    { name: "Guides" },
    { name: "Videos" },
    { name: "Webinars" },
    { name: "White Papers" },
  ];

  // Activate a specific tab when arriving via ?tab=<Name> (e.g. from a case study's "View All Articles" link)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab && navItems.some((item) => item.name === tab)) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch case studies from API on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const apiData = await getAllCaseStudies();
      
      const transformedApiData = apiData.map((item: any) => {
        let description = "";
        
        if (Array.isArray(item.challenge) && item.challenge.length > 0) {
          description = item.challenge[0]?.text || "";
        } 
        else if (Array.isArray(item.sections) && item.sections.length > 0) {
          description = item.sections[0]?.text || "";
        }
        else if (Array.isArray(item.solution) && item.solution.length > 0) {
          description = item.solution[0]?.text || "";
        }
        
        const fullDescription = description;
        if (description.length > 150) {
          description = description.substring(0, 150) + "...";
        }

        const statusMap: Record<string, string> = {
          "active": "Active",
          "completed": "Completed",
          "draft": "Draft",
          "scheduled": "Scheduled"
        };

        const tagMap: Record<string, string> = {
          "technology": "Technology",
          "logistics": "Logistics",
          "analytics": "Analytics",
          "infrastructure": "Infrastructure"
        };
        
        const firstTag = Array.isArray(item.tags) && item.tags.length > 0 
          ? tagMap[item.tags[0]] || "Technology"
          : "Technology";

        return {
          id: item._id,
          type: "Case Studies",
          title: item.title || "Untitled Case Study",
          date: new Date(item.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          status: statusMap[item.status] || "Active",
          tag: firstTag,
          description: description || "No description available.",
          fullDescription: fullDescription || "No description available.",
          image: item.cover || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        };
      });

      setApiCaseStudies(transformedApiData);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const filteredCards = useMemo(() => {
    let cards = apiCaseStudies;

    if (activeTab !== "All") {
      cards = cards.filter((r: any) => r.type === activeTab);
    }

    if (searchQuery) {
      cards = cards.filter((r: any) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      cards = cards.filter((r: any) => r.status === statusFilter);
    }

    if (tagFilter !== "Filter by tag") {
      cards = cards.filter((r: any) => r.tag === tagFilter);
    }

    return cards;
  }, [apiCaseStudies, activeTab, searchQuery, statusFilter, tagFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setTagFilter("Filter by tag");
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter, tagFilter]);

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
  const paginatedCards = filteredCards.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const [modalCard, setModalCard] = useState<any | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const formalColor = "#4b5563";

  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        
        <div
          ref={tabsRef}
          onPointerDown={handleTabsPointerDown}
          onPointerMove={handleTabsPointerMove}
          onPointerUp={handleTabsPointerUp}
          onPointerLeave={handleTabsPointerUp}
          className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-x-4 md:gap-x-10 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleTabClick(item.name)}
                className="relative pb-3 md:pb-4 text-[11px] md:text-[14px] font-bold whitespace-nowrap transition-all duration-200 uppercase tracking-tight"
                style={{
                  fontFamily: FONTS.openSans,
                  color: isActive ? COLORS.black : formalColor,
                }}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0070f3]"></span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center w-full mb-12">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full max-w-7xl">
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-[400px]">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeTab}...`}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-lg text-[12px] md:text-[14px] font-bold outline-none focus:border-gray-400 transition-all"
                style={{ fontFamily: FONTS.openSans, color: formalColor }}
              />
            </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto md:flex-1">
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => setStatusOpen((v) => !v)}
                className="w-auto min-w-[95px] md:min-w-[140px] flex items-center justify-between gap-1.5 md:gap-2 bg-white px-2.5 md:px-4 py-2 md:py-2.5 rounded-lg text-[12px] md:text-[14px] font-bold cursor-pointer outline-none shadow-sm hover:shadow-md transition-shadow"
                style={{ fontFamily: FONTS.openSans, color: formalColor }}
              >
                {statusFilter}
                <HiChevronDown className={`text-gray-400 w-4 h-4 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
              </button>
              {statusOpen && (
                <div className="absolute z-20 top-full mt-2 w-full min-w-[160px] bg-white rounded-xl shadow-lg overflow-hidden py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => { setStatusFilter(option); setStatusOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[14px] font-bold transition-colors ${statusFilter === option ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}
                      style={{ fontFamily: FONTS.openSans }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={tagRef}>
              <button
                type="button"
                onClick={() => setTagOpen((v) => !v)}
                className="w-auto min-w-[105px] md:min-w-[160px] flex items-center justify-between gap-1.5 md:gap-2 bg-white px-2.5 md:px-4 py-2 md:py-2.5 rounded-lg text-[12px] md:text-[14px] font-bold cursor-pointer outline-none shadow-sm hover:shadow-md transition-shadow"
                style={{ fontFamily: FONTS.openSans, color: formalColor }}
              >
                {tagFilter}
                <HiChevronDown className={`text-gray-400 w-4 h-4 transition-transform ${tagOpen ? "rotate-180" : ""}`} />
              </button>
              {tagOpen && (
                <div className="absolute z-20 top-full mt-2 w-full min-w-[180px] bg-white rounded-xl shadow-lg overflow-hidden py-1">
                  {tagOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => { setTagFilter(option); setTagOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[14px] font-bold transition-colors ${tagFilter === option ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}
                      style={{ fontFamily: FONTS.openSans }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                title="Clear filters"
                className="flex items-center gap-2 text-[12px] md:text-[14px] font-bold bg-white border border-red-500 text-red-500 hover:bg-red-50 transition-colors p-2 md:px-3 md:py-2.5 rounded-lg whitespace-nowrap"
                style={{ fontFamily: FONTS.openSans }}
              >
                <HiXMark className="w-4 h-4" />
                <span className="hidden md:inline">Clear</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 ml-auto">
              <button onClick={() => setViewMode("list")} className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400"}`}><HiListBullet className="w-4 h-4 md:w-5 md:h-5" /></button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400"}`}><HiSquares2X2 className="w-4 h-4 md:w-5 md:h-5" /></button>
            </div>
          </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Loading case studies...</p>
          </div>
        )}

        {!isLoading && (
          <div className={`max-w-7xl mx-auto ${viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 justify-items-center" : "flex flex-col gap-6 items-center"}`}>
            {paginatedCards.length > 0 ? (
              paginatedCards.map((card: any, index: number) => {
                const isExpanded = expandedCardId === index;
                const profilePictures = generateRandomProfiles(card.id, 3);

                return (
                  <div
                    key={card.id ?? index}
                    className={`relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300
                      ${viewMode === "grid" ? "w-full max-w-[260px] md:max-w-[300px] h-[215px] md:h-[290px]" : "w-full max-w-5xl min-h-[88px] md:min-h-[200px] flex flex-row"}`}
                  >
                    <div className={viewMode === "grid" ? "absolute top-0 w-full h-[105px] md:h-[120px]" : "relative w-[80px] md:w-[300px] flex-shrink-0"}>
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className={viewMode === "grid" ? "w-full h-full object-cover" : "absolute inset-0 w-full h-full object-cover"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800") {
                            target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
                          }
                        }}
                      />
                      <span
                        className={`absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 text-gray-800 text-[10px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm ${viewMode === "list" ? "hidden md:block" : ""}`}
                        style={{ fontFamily: FONTS.openSans }}
                      >
                        {card.type}
                      </span>
                    </div>

                    {viewMode === "grid" ? (
                      <>
                        <div
                          className={`absolute bottom-[35px] md:bottom-[81px] w-full bg-white transition-all duration-500 ease-in-out px-4 md:px-6 pt-3 md:pt-6 rounded-t-xl overflow-hidden ${isExpanded ? "h-[135px] md:h-[200px]" : "h-[75px] md:h-[100px]"}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className="text-gray-400 text-[10px] md:text-[11px] font-normal mb-1 uppercase tracking-wider flex flex-wrap items-center gap-x-1.5 gap-y-0.5" style={{ fontFamily: FONTS.rubik }}>
                                <span className="whitespace-nowrap">{card.date}</span>
                                <span className={`px-1.5 py-0.5 rounded font-semibold ${
                                  card.status === 'Active' ? 'bg-green-100 text-green-700' :
                                  card.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                  card.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {card.status}
                                </span>
                              </p>
                              <h4
                                onClick={() => { if (typeof window !== "undefined" && window.innerWidth < 768) setModalCard(card); }}
                                className="text-[12px] md:text-[18px] font-bold text-[#282828] leading-tight mb-2 md:mb-3 line-clamp-2 cursor-pointer md:cursor-auto"
                                style={{ fontFamily: FONTS.poppins }}
                              >
                                {card.title}
                              </h4>
                            </div>
                            <button onClick={() => toggleExpand(index)} className="hidden md:flex bg-gray-100 hover:bg-gray-200 text-gray-500 p-1.5 rounded-full flex-shrink-0">
                              <HiEllipsisVertical className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                          <hr className="border-gray-50 mb-2 md:mb-3" />
                          <div className={isExpanded ? "max-h-24 opacity-100 transition-opacity duration-300" : "max-h-0 opacity-0 overflow-hidden"}>
                            <p className="text-gray-500 text-[10px] md:text-[13px] leading-relaxed line-clamp-3">{card.description}</p>
                          </div>
                        </div>

                        <div className="absolute bottom-0 w-full bg-white px-4 md:px-6 pt-1.5 md:pt-3 pb-2 md:pb-6 z-20">
                          <hr className="hidden md:block border-gray-100 mb-2 md:mb-3" />
                          <div className="flex justify-between items-center">
                            <div className="flex -space-x-1">
                              {profilePictures.map((profileUrl, i) => (
                                <div key={i} className="w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                  <img src={profileUrl} alt={`user-${i}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                            <Link href={`/resources/CaseStudiesCardDetails?id=${card.id}`}>
                              <button
                                title="Preview article"
                                className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#800000] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                              >
                                <HiEye className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-grow min-w-0 bg-white px-2.5 py-2 md:px-8 md:pt-6 md:pb-4">
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className="text-gray-400 text-[10px] md:text-[11px] font-normal mb-0.5 md:mb-1 uppercase tracking-wider flex flex-wrap items-center gap-x-1 md:gap-x-1.5 gap-y-0.5" style={{ fontFamily: FONTS.rubik }}>
                                <span className="whitespace-nowrap">{card.date}</span>
                                <span className={`px-1 md:px-1.5 py-0.5 rounded font-semibold ${
                                  card.status === 'Active' ? 'bg-green-100 text-green-700' :
                                  card.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                  card.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {card.status}
                                </span>
                              </p>
                              <h4
                                onClick={() => { if (typeof window !== "undefined" && window.innerWidth < 768) setModalCard(card); }}
                                className="text-[12px] md:text-[18px] font-bold text-[#282828] leading-tight mb-1 md:mb-3 line-clamp-1 md:line-clamp-1 cursor-pointer md:cursor-auto"
                                style={{ fontFamily: FONTS.poppins }}
                              >
                                {card.title}
                              </h4>
                            </div>
                          </div>
                          <hr className="border-gray-50 mb-1 md:mb-3" />
                          <div className="opacity-100 mb-1 md:mb-2">
                            <p className="text-gray-500 text-[10px] md:text-[13px] leading-snug md:leading-relaxed line-clamp-1 md:line-clamp-3">{card.description}</p>
                          </div>
                          <hr className="hidden md:block border-gray-100 mt-auto" />
                          <div className="mt-auto md:mt-0 pt-1 md:pt-3 flex justify-between items-center">
                            <div className="flex -space-x-1.5">
                              {profilePictures.map((profileUrl, i) => (
                                <div key={i} className="w-4 h-4 md:w-7 md:h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                  <img src={profileUrl} alt={`user-${i}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                            <Link href={`/resources/CaseStudiesCardDetails?id=${card.id}`}>
                              <button
                                title="Preview article"
                                className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#800000] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                              >
                                <HiEye className="w-2.5 h-2.5 md:w-4 md:h-4" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-gray-400 italic text-center w-full">No resources found in {activeTab}.</div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 md:gap-4 mt-8 md:mt-12 mb-6 md:mb-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 md:px-5 md:py-2 border border-gray-200 rounded-lg text-[11px] md:text-[14px] font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
              style={{ fontFamily: FONTS.openSans }}
            >
              Previous
            </button>
            <span className="text-gray-500 text-[11px] md:text-[14px] font-medium" style={{ fontFamily: FONTS.rubik }}>
              Page <span className="text-gray-900 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 md:px-5 md:py-2 border border-gray-200 rounded-lg text-[11px] md:text-[14px] font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
              style={{ fontFamily: FONTS.openSans }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {modalCard && (
        <div
          className="md:hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalCard(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalCard(null)}
              className="absolute top-3 right-3 z-10 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white"
              style={{ color: '#282828' }}
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[160px] flex-shrink-0">
              <img
                src={modalCard.image}
                alt={modalCard.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800") {
                    target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
                  }
                }}
              />
              <span
                className="absolute top-3 left-3 bg-white/90 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm"
                style={{ fontFamily: FONTS.openSans, color: '#282828' }}
              >
                {modalCard.type}
              </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 px-5 pt-4 pb-5">
              <p className="text-gray-400 text-[11px] font-normal mb-2 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0" style={{ fontFamily: FONTS.rubik }}>
                <span>{modalCard.date}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-semibold ${
                    modalCard.status === 'Active' ? 'bg-green-100 text-green-700' :
                    modalCard.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                    modalCard.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}
                >
                  {modalCard.status}
                </span>
              </p>
              <h4 className="text-[20px] font-bold text-[#282828] leading-tight mb-3 flex-shrink-0" style={{ fontFamily: FONTS.poppins }}>
                {modalCard.title}
              </h4>
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <span style={{ fontFamily: FONTS.openSans, fontWeight: 700, fontSize: '16px', color: '#282828', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  About
                </span>
                <span className="flex-1 h-px bg-gray-200"></span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <p style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: '16px', lineHeight: 1.75, color: 'rgba(40,40,40,0.65)' }}>
                  {modalCard.fullDescription || modalCard.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}