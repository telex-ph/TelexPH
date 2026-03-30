"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { COLORS, FONTS } from "@/constant/styles";
import { 
  HiChevronDown, 
  HiMagnifyingGlass, 
  HiXMark, 
  HiListBullet, 
  HiSquares2X2,
  HiPaperAirplane, 
  HiEllipsisVertical 
} from "react-icons/hi2";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com';

// ✅ NEW: Random Profile Picture Generator
function generateRandomProfiles(seed: string | number, count: number = 3) {
  const profiles = [];
  // Convert seed to a consistent number
  const seedNum = typeof seed === 'string' ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;
  
  for (let i = 0; i < count; i++) {
    // Generate a random number between 1-70 based on seed
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
  const [apiCaseStudies, setApiCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navItems = [
    { name: "All" },
    { name: "Case Studies" },
    { name: "Events" },
    { name: "Guides" },
    { name: "Videos" },
    { name: "Webinars" },
    { name: "White Papers" },
  ];

  // Hardcoded resources (keeping all original data)
  const hardcodedResources = [
    {
      id: 1,
      type: "Case Studies",
      title: "Horseshoe Ridge",
      date: "5 days ago",
      status: "Active",
      tag: "Technology",
      description: "An existing vendor-managed approach to inbound transportation became unsustainable for evolving demands.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      type: "Events",
      title: "Global Supply Chain Summit",
      date: "Coming Soon",
      status: "Active",
      tag: "Logistics",
      description: "A 3-day virtual event gathering the brightest minds in global logistics and automated freight.",
      image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      type: "Guides",
      title: "2026 Freight Manual",
      date: "1 week ago",
      status: "Completed",
      tag: "Analytics",
      description: "Download our comprehensive guide on reducing total landed costs through advanced reporting.",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      type: "Videos",
      title: "AI Integration Demo",
      date: "3 days ago",
      status: "Active",
      tag: "Technology",
      description: "Watch how real-time tracking and AI-driven route optimization reduces overhead by 35%.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      type: "Webinars",
      title: "Scaling Support Teams",
      date: "Live Tomorrow",
      status: "Active",
      tag: "Infrastructure",
      description: "How to scale support teams from 15 to 300+ agents while maintaining high CSAT scores.",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      type: "White Papers",
      title: "Market Trends Report",
      date: "1 month ago",
      status: "Completed",
      tag: "Analytics",
      description: "In-depth analysis of cross-border operations and large-scale infrastructure projects.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    },
  ];

  // Fetch case studies from API on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const apiData = await getAllCaseStudies();
      
      // Transform API data to match the expected format
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
          image: item.cover || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        };
      });

      setApiCaseStudies(transformedApiData);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const allResources = useMemo(() => {
    return [...apiCaseStudies, ...hardcodedResources];
  }, [apiCaseStudies]);

  const filteredCards = useMemo(() => {
    let cards = allResources;

    if (activeTab !== "All") {
      cards = cards.filter((r) => r.type === activeTab);
    }

    if (searchQuery) {
      cards = cards.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      cards = cards.filter((r) => r.status === statusFilter);
    }

    if (tagFilter !== "Filter by tag") {
      cards = cards.filter((r) => r.tag === tagFilter);
    }

    return cards;
  }, [allResources, activeTab, searchQuery, statusFilter, tagFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setTagFilter("Filter by tag");
  };

  const toggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const formalColor = "#4b5563"; 

  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-10 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className="relative pb-4 text-[14px] font-bold whitespace-nowrap transition-all duration-200 uppercase tracking-tight"
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
          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-7xl">
            <div className="relative flex-grow max-w-[400px]">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-400 transition-all"
                style={{ fontFamily: FONTS.openSans, color: formalColor }}
              />
            </div>

            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-auto min-w-[140px] appearance-none bg-white border border-gray-200 px-4 py-2.5 pr-10 rounded-lg text-[14px] font-bold cursor-pointer outline-none hover:border-gray-300"
                style={{ fontFamily: FONTS.openSans, color: formalColor }}
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-auto min-w-[160px] appearance-none bg-white border border-gray-200 px-4 py-2.5 pr-10 rounded-lg text-[14px] font-bold cursor-pointer outline-none hover:border-gray-300"
                style={{ fontFamily: FONTS.openSans, color: formalColor }}
              >
                <option value="Filter by tag">Filter by tag</option>
                <option value="Technology">Technology</option>
                <option value="Logistics">Logistics</option>
                <option value="Analytics">Analytics</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <button onClick={handleReset} className="flex items-center gap-2 text-[14px] font-bold hover:text-black transition-colors px-2 whitespace-nowrap" style={{ fontFamily: FONTS.openSans, color: formalColor }}>
              <div className="border border-gray-300 rounded-full p-0.5"><HiXMark className="w-3.5 h-3.5" /></div>
              Reset filters
            </button>

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400"}`}><HiListBullet className="w-5 h-5" /></button>
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400"}`}><HiSquares2X2 className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Loading case studies...</p>
          </div>
        )}

        {!isLoading && (
          <div className={`max-w-7xl mx-auto ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center" : "flex flex-col gap-6 items-center"}`}>
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => {
                const isExpanded = expandedCardId === card.id;
                // ✅ Generate random profiles based on card ID
                const profilePictures = generateRandomProfiles(card.id, 3);
                
                return (
                  <div 
                    key={card.id} 
                    className={`relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300
                      ${viewMode === "grid" ? "w-full max-w-[300px] h-[320px]" : "w-full max-w-5xl h-[180px] flex flex-row"}`}
                  >
                    <div className={viewMode === "grid" ? "absolute top-0 w-full h-[150px]" : "w-[300px] h-full"}>
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800") {
                            target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
                          }
                        }}
                      />
                    </div>

                    <div 
                      className={`${viewMode === "grid" 
                        ? `absolute bottom-0 w-full bg-white transition-all duration-500 ease-in-out px-6 pt-6 rounded-t-xl ${isExpanded ? "h-[250px]" : "h-[185px]"}`
                        : "flex-grow bg-white px-8 py-6"}`}
                    >
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-400 text-[11px] font-medium mb-1 uppercase tracking-wider">{card.date} • {card.status}</p>
                            <h4 className="text-[18px] font-bold text-gray-900 leading-tight mb-3" style={{ fontFamily: FONTS.openSans }}>{card.title}</h4>
                          </div>
                          {viewMode === "grid" && (
                            <button onClick={() => toggleExpand(card.id)} className="bg-gray-100 hover:bg-gray-200 text-gray-500 p-1.5 rounded-full">
                              <HiEllipsisVertical className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          )}
                        </div>
                        <hr className="border-gray-50 mb-3" />
                        <div className={`${viewMode === "grid" ? (isExpanded ? "max-h-24 opacity-100 mb-4" : "max-h-0 opacity-0 overflow-hidden") : "opacity-100 mb-2"}`}>
                          <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3">{card.description}</p>
                        </div>
                        <div className="mt-auto pb-6 flex justify-between items-center">
                          {/* ✅ FIXED: Use generated random profile pictures */}
                          <div className="flex -space-x-1.5">
                            {profilePictures.map((profileUrl, i) => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src={profileUrl} alt={`user-${i}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                          <Link href={`/resources/CaseStudiesCardDetails?id=${card.id}`}>
                            <button className="w-10 h-10 rounded-full bg-[#800000] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                              <HiPaperAirplane className="w-4 h-4 rotate-45" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-gray-400 italic text-center w-full">No resources found in {activeTab}.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}