"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  XCircle,
  LayoutGrid,
  List,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

// --- IMPORT YOUR DESIGN SYSTEM ---
import { COLORS, FONTS, FONT_WEIGHTS, TYPOGRAPHY } from "@/constant/styles";

export default function CaseStudiesFilter() {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // PAGINATION STATE
  const [visibleCount, setVisibleCount] = useState(6);

  // *** THEME COLOR ***
  const THEME_RED = "#a10000";

  // DATA: List of Resources
  const allResources = [
    {
      id: 1,
      type: "Case Studies",
      title: "Horseshoe Ridge",
      date: "5 days ago",
      status: "Active",
      tag: "Technology",
      description:
        "An existing vendor-managed approach to inbound transportation became unsustainable for evolving demands.",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      type: "Events",
      title: "Global Supply Chain Summit",
      date: "Coming Soon",
      status: "Active",
      tag: "Logistics",
      description:
        "A 3-day virtual event gathering the brightest minds in global logistics and automated freight.",
      image:
        "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      type: "Guides",
      title: "2026 Freight Manual",
      date: "1 week ago",
      status: "Completed",
      tag: "Analytics",
      description:
        "Download our comprehensive guide on reducing total landed costs through advanced reporting.",
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      type: "Videos",
      title: "AI Integration Demo",
      date: "3 days ago",
      status: "Active",
      tag: "Technology",
      description:
        "Watch how real-time tracking and AI-driven route optimization reduces overhead by 35%.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      type: "Webinars",
      title: "Scaling Support Teams",
      date: "Live Tomorrow",
      status: "Active",
      tag: "Infrastructure",
      description:
        "How to scale support teams from 15 to 300+ agents while maintaining high CSAT scores.",
      image:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      type: "White Papers",
      title: "Market Trends Report",
      date: "1 month ago",
      status: "Completed",
      tag: "Analytics",
      description:
        "In-depth analysis of cross-border operations and large-scale infrastructure projects.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 7,
      type: "Case Studies",
      title: "Cold Chain Revolution",
      date: "2 weeks ago",
      status: "Completed",
      tag: "Logistics",
      description:
        "How a pharmaceutical giant reduced spoilage by 90% using IoT sensors and automated re-routing.",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 8,
      type: "Videos",
      title: "Drone Delivery Pilot",
      date: "Yesterday",
      status: "Active",
      tag: "Technology",
      description:
        "Exclusive footage of our urban drone delivery tests in metropolitan areas.",
      image:
        "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 9,
      type: "Guides",
      title: "Sustainability Handbook",
      date: "3 weeks ago",
      status: "Active",
      tag: "Infrastructure",
      description:
        "A step-by-step guide to reducing your carbon footprint in supply chain management.",
      image:
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 10,
      type: "Case Studies",
      title: "Automotive Fast-Track",
      date: "1 month ago",
      status: "Completed",
      tag: "Logistics",
      description:
        "Streamlining parts delivery for a major automotive manufacturer using JIT principles.",
      image:
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 11,
      type: "White Papers",
      title: "Blockchain in Freight",
      date: "2 days ago",
      status: "Active",
      tag: "Technology",
      description:
        "Exploring the security and transparency benefits of blockchain ledgers in shipping.",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    },
  ];

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, selectedType, selectedTag]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedTag("");
    setVisibleCount(6);
  };

  const filteredCards = useMemo(() => {
    return allResources.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "" || card.type === selectedType;
      const matchesTag = selectedTag === "" || card.tag === selectedTag;

      return matchesSearch && matchesType && matchesTag;
    });
  }, [searchQuery, selectedType, selectedTag]);

  const displayedCards = filteredCards.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filteredCards.length;

  const handleToggleView = () => {
    if (isAllVisible) {
      setVisibleCount(6);
    } else {
      setVisibleCount((prev) => prev + 6);
    }
  };

  // Styles for Select/Inputs
  const filterInputStyles = {
    fontFamily: FONTS.rubik,
    color: COLORS.dark,
    borderColor: "#e5e7eb", // default border
  };

  // Helper style object to pass the primary color to CSS variables safely
  const primaryColorStyle = {
    "--primary-color": THEME_RED,
  } as React.CSSProperties;

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Poppins:wght@400;600;700;900&family=Rubik:wght@400;500&display=swap");

        :root {
          --font-poppins: "Poppins", sans-serif;
          --font-open-sans: "Open Sans", sans-serif;
          --font-rubik: "Rubik", sans-serif;
        }

        body {
          font-family: var(--font-rubik);
          color: ${COLORS.dark};
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div className="w-full bg-white pt-10 pb-0">
        {/* Intro Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              {/* SUCCESS STORIES LABEL */}
              <p
                className="text-[13px] uppercase tracking-[0.2em] mb-3"
                style={{
                  color: THEME_RED,
                  fontFamily: FONTS.openSans,
                  fontWeight: FONT_WEIGHTS.bold,
                }}
              >
                — Success Stories
              </p>

              <h1
                className="text-3xl md:text-5xl mb-4 leading-tight"
                style={{
                  fontFamily: FONTS.openSans,
                  fontWeight: FONT_WEIGHTS.black,
                  color: COLORS.dark,
                }}
              >
                Real Results.{" "}
                <span style={{ color: THEME_RED }}>Real Impact.</span>
              </h1>
              <p
                className="text-sm md:text-base max-w-2xl leading-relaxed"
                style={{
                  fontFamily: FONTS.openSans,
                  color: COLORS.dark,
                  opacity: 0.7,
                }}
              >
                Dive into our collection of success stories. From global
                logistics giants to tech startups, see how we deliver
                operational excellence.
              </p>
            </div>

            {/* Trusted By Leaders */}
            <div className="hidden md:flex flex-col items-end">
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: FONTS.openSans,
                  fontWeight: FONT_WEIGHTS.bold,
                  color: "#9ca3af",
                }}
              >
                Trusted by Leaders
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px]"
                    style={{
                      backgroundColor: "#f3f4f6",
                      fontFamily: FONTS.openSans,
                      fontWeight: FONT_WEIGHTS.bold,
                      color: "#9ca3af",
                    }}
                  >
                    C{i}
                  </div>
                ))}
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px]"
                  style={{
                    backgroundColor: THEME_RED,
                    color: COLORS.white,
                    fontFamily: FONTS.openSans,
                    fontWeight: FONT_WEIGHTS.bold,
                  }}
                >
                  +50
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMPACT STATS STRIP (UPDATED TO GRAY-50) */}
        <div
          className="w-full py-12 px-4 sm:px-6 mb-10 bg-gray-50 text-gray-900 shadow-sm border-y border-gray-100"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200">
            {[
              { icon: Globe, val: "20+", label: "Countries Served" },
              { icon: TrendingUp, val: "40%", label: "Avg. Cost Reduction" },
              { icon: Users, val: "500+", label: "Expert Agents" },
              { icon: Award, val: "98%", label: "Client Retention" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center group cursor-default"
              >
                <div className="mb-3 p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
                  {/* Icon color changed to THEME_RED for contrast */}
                  <stat.icon size={24} color={THEME_RED} />
                </div>
                <h3
                  className="text-3xl mb-1"
                  style={{
                    fontFamily: FONTS.openSans,
                    fontWeight: FONT_WEIGHTS.bold,
                  }}
                >
                  {stat.val}
                </h3>
                <p
                  className="text-[11px] uppercase tracking-widest text-gray-500"
                  style={{
                    fontFamily: FONTS.openSans,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MAIN FILTER & LIST SECTION --- */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-4 bg-white">
        {/* Filters Section */}
        <section className="w-full mb-8 sm:mb-10 sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              {/* Search */}
              <div
                className="relative w-full sm:w-auto min-w-[200px] flex-grow lg:flex-grow-0"
                style={primaryColorStyle} // Pass var for hover/focus
              >
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 py-1.5 pl-9 pr-4 rounded-full text-[12px] outline-none transition-all duration-300 focus:border-[var(--primary-color)]"
                  style={filterInputStyles}
                />
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Dropdowns */}
              {[
                {
                  val: selectedType,
                  set: setSelectedType,
                  opts: [
                    "All Types",
                    "Case Studies",
                    "Events",
                    "Guides",
                    "Videos",
                    "Webinars",
                    "White Papers",
                  ],
                },
                {
                  val: selectedTag,
                  set: setSelectedTag,
                  opts: [
                    "All Topics",
                    "Technology",
                    "Logistics",
                    "Analytics",
                    "Infrastructure",
                  ],
                },
              ].map((dropdown, idx) => (
                <div
                  key={idx}
                  className="relative w-[48%] sm:w-auto min-w-[140px] flex-grow sm:flex-grow-0"
                  style={primaryColorStyle} // Pass var
                >
                  <select
                    value={dropdown.val}
                    onChange={(e) => dropdown.set(e.target.value)}
                    className="w-full bg-white border border-gray-200 py-1.5 px-4 rounded-full text-[12px] outline-none appearance-none cursor-pointer transition-all duration-300 hover:border-[var(--primary-color)] focus:border-[var(--primary-color)]"
                    style={{
                      fontFamily: FONTS.openSans,
                      fontWeight: FONT_WEIGHTS.medium,
                      color: "#6b7280",
                    }}
                  >
                    {dropdown.opts.map((opt) => (
                      <option
                        key={opt}
                        value={opt === dropdown.opts[0] ? "" : opt}
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={12} className="text-gray-400" />
                  </div>
                </div>
              ))}

              <button
                onClick={handleReset}
                className="ml-auto sm:ml-0 flex items-center gap-1.5 px-2 py-1 text-gray-400 hover:text-[var(--primary-color)] transition-colors"
                style={primaryColorStyle}
              >
                <XCircle size={14} />
                <span
                  style={{
                    fontFamily: FONTS.openSans,
                    fontWeight: FONT_WEIGHTS.medium,
                    fontSize: "11px",
                  }}
                >
                  Reset
                </span>
              </button>
            </div>

            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 self-end lg:self-auto">
              {[
                { mode: false, Icon: List },
                { mode: true, Icon: LayoutGrid },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => setIsGridView(btn.mode)}
                  className={`p-1.5 rounded-lg transition-all ${
                    isGridView === btn.mode ? "bg-white shadow-sm" : ""
                  }`}
                  style={{
                    color: isGridView === btn.mode ? THEME_RED : "#d1d5db",
                  }}
                >
                  <btn.Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Cards Grid */}
        <div
          className={
            isGridView
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              : "flex flex-col gap-6"
          }
        >
          {displayedCards.map((card) => {
            const detailsUrl = `/resources/CaseStudiesCardDetails?id=${card.id}`;

            return (
              <div
                key={card.id}
                className={`bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-50 transition-all hover:shadow-xl overflow-hidden group
                  ${
                    isGridView
                      ? "flex flex-col rounded-bl-[40px] rounded-br-[40px] rounded-tl-2xl rounded-tr-2xl h-full"
                      : "flex flex-col sm:flex-row items-start sm:items-center rounded-2xl h-auto sm:h-48"
                  }`}
                style={primaryColorStyle} // Pass color var to the whole card for group-hover usage
              >
                <div
                  className={`relative bg-gray-100 shrink-0 overflow-hidden ${
                    isGridView
                      ? "h-48 sm:h-52 w-full"
                      : "h-48 sm:h-full w-full sm:w-40 md:w-64"
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-0 left-0">
                    <div
                      className="text-white text-[10px] py-1.5 px-4 sm:px-5 sm:pr-8 uppercase rounded-br-full shadow-sm"
                      style={{
                        backgroundColor: THEME_RED,
                        fontFamily: FONTS.openSans,
                        fontWeight: FONT_WEIGHTS.bold,
                      }}
                    >
                      {card.type}
                    </div>
                  </div>
                </div>

                <div
                  className={`p-5 sm:p-6 flex flex-col flex-grow w-full ${
                    isGridView
                      ? "items-center text-center"
                      : "items-start text-left justify-center sm:ml-4"
                  }`}
                >
                  <div
                    className={`flex flex-col w-full ${
                      isGridView ? "items-center mb-4" : "items-start mb-2"
                    }`}
                  >
                    <h3
                      className="text-[16px] sm:text-[18px] mb-2 line-clamp-1 transition-colors group-hover:text-[var(--primary-color)]"
                      style={{
                        fontFamily: FONTS.poppins,
                        fontWeight: FONT_WEIGHTS.bold,
                        color: COLORS.dark,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-[10px] uppercase tracking-widest leading-none"
                      style={{
                        fontFamily: FONTS.openSans,
                        fontWeight: FONT_WEIGHTS.semibold,
                        color: "#9ca3af",
                      }}
                    >
                      {card.date} • {card.tag}
                    </p>
                  </div>

                  {isGridView && (
                    <div
                      className="w-[90%] border-t-2 mb-5"
                      style={{ borderColor: THEME_RED }}
                    ></div>
                  )}

                  <p
                    className="text-[13px] leading-relaxed mb-6 px-0 sm:px-2 line-clamp-2"
                    style={{
                      fontFamily: FONTS.rubik,
                      color: "#6b7280",
                      fontWeight: FONT_WEIGHTS.regular,
                    }}
                  >
                    {card.description}
                  </p>

                  <div
                    className={`mt-auto w-full flex items-center ${
                      isGridView
                        ? "justify-between px-0 sm:px-2"
                        : "justify-between"
                    }`}
                  >
                    <Link
                      href={detailsUrl}
                      className="text-[12px] uppercase hover:underline underline-offset-4 decoration-2 tracking-wide"
                      style={{
                        color: THEME_RED,
                        fontFamily: FONTS.openSans,
                        fontWeight: FONT_WEIGHTS.bold,
                      }}
                    >
                      View Details
                    </Link>
                    <Link href={detailsUrl}>
                      <div
                        className="rounded-xl text-white shadow-md cursor-pointer hover:scale-110 transition-transform w-9 h-9 flex items-center justify-center"
                        style={{ backgroundColor: THEME_RED }}
                      >
                        <ArrowUpRight size={20} className="stroke-white" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayedCards.length === 0 && (
          <div className="text-center py-20">
            <p
              className="text-gray-400 uppercase text-[13px] tracking-widest"
              style={{
                fontFamily: FONTS.openSans,
                fontWeight: FONT_WEIGHTS.bold,
              }}
            >
              No matching resources found
            </p>
          </div>
        )}

        {filteredCards.length > 6 && (
          <div className="flex justify-center mt-12 mb-0">
            <button
              onClick={handleToggleView}
              className="group flex items-center gap-2 px-8 py-3 text-white rounded-lg shadow-md transition-all duration-300 uppercase tracking-widest text-[12px] hover:brightness-90"
              style={{
                backgroundColor: THEME_RED,
                fontFamily: FONTS.openSans,
                fontWeight: FONT_WEIGHTS.bold,
              }}
            >
              {isAllVisible ? (
                <>
                  Show Less
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </>
              ) : (
                <>
                  View More ({filteredCards.length - visibleCount} more)
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}