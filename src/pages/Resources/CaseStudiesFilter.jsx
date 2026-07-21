
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { COLORS, FONTS } from "@/constant/styles";
import {
  HiChevronDown,
  HiMagnifyingGlass,
  HiXMark,
  HiListBullet,
  HiSquares2X2,
  HiEye
} from "react-icons/hi2";
const API_BASE_URL = "https://telexph-admin.onrender.com/api";
async function getAllCaseStudies() {
  try {
    const response = await fetch(`${API_BASE_URL}/casestudies`);
    if (!response.ok) throw new Error("Failed to fetch case studies");
    return response.json();
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}
function CaseStudiesFilter() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [tagFilter, setTagFilter] = useState("Filter by tag");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [apiCaseStudies, setApiCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const statusRef = useRef(null);
  const tagRef = useRef(null);
  const tabsRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, startScrollLeft: 0, moved: false });
  const handleTabsPointerDown = (e) => {
    if (!tabsRef.current) return;
    dragState.current.isDragging = true;
    dragState.current.moved = false;
    dragState.current.startX = e.clientX;
    dragState.current.startScrollLeft = tabsRef.current.scrollLeft;
  };
  const handleTabsPointerMove = (e) => {
    if (!dragState.current.isDragging || !tabsRef.current) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 3) dragState.current.moved = true;
    tabsRef.current.scrollLeft = dragState.current.startScrollLeft - delta;
  };
  const handleTabsPointerUp = () => {
    dragState.current.isDragging = false;
  };
  const handleTabClick = (name) => {
    if (dragState.current.moved) return;
    setActiveTab(name);
  };
  useEffect(() => {
    function handleClickOutside(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(e.target)) {
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
    { name: "White Papers" }
  ];
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab && navItems.some((item) => item.name === tab)) {
      setActiveTab(tab);
    }
  }, []);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const apiData = await getAllCaseStudies();
      const transformedApiData = apiData.map((item) => {
        let description = "";
        if (Array.isArray(item.challenge) && item.challenge.length > 0) {
          description = item.challenge[0]?.text || "";
        } else if (Array.isArray(item.sections) && item.sections.length > 0) {
          description = item.sections[0]?.text || "";
        } else if (Array.isArray(item.solution) && item.solution.length > 0) {
          description = item.solution[0]?.text || "";
        }
        const fullDescription = description;
        if (description.length > 150) {
          description = description.substring(0, 150) + "...";
        }
        const statusMap = {
          "active": "Active",
          "completed": "Completed",
          "draft": "Draft",
          "scheduled": "Scheduled"
        };
        const tagMap = {
          "technology": "Technology",
          "logistics": "Logistics",
          "analytics": "Analytics",
          "infrastructure": "Infrastructure"
        };
        const firstTag = Array.isArray(item.tags) && item.tags.length > 0 ? tagMap[item.tags[0]] || "Technology" : "Technology";
        return {
          id: item._id,
          type: "Case Studies",
          title: item.title || "Untitled Case Study",
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          status: statusMap[item.status] || "Active",
          tag: firstTag,
          description: description || "No description available.",
          fullDescription: fullDescription || "No description available.",
          image: item.cover || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
          authors: Array.isArray(item.authors) ? item.authors : []
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
      cards = cards.filter((r) => r.type === activeTab);
    }
    if (searchQuery) {
      cards = cards.filter(
        (r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "All Status") {
      cards = cards.filter((r) => r.status === statusFilter);
    }
    if (tagFilter !== "Filter by tag") {
      cards = cards.filter((r) => r.tag === tagFilter);
    }
    return cards;
  }, [apiCaseStudies, activeTab, searchQuery, statusFilter, tagFilter]);
  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
    setTagFilter("Filter by tag");
    setCurrentPage(1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter, tagFilter]);
  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
  const paginatedCards = filteredCards.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const [modalCard, setModalCard] = useState(null);
  useEffect(() => {
    if (modalCard) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [modalCard]);
  const formalColor = "#4b5563";
  const renderAuthorAvatars = (authors, size, textSize = "text-[9px] md:text-[11px]") => <div className="flex items-center gap-1.5 min-w-0 flex-1">
      <div className="flex -space-x-1 flex-shrink-0">
        {authors.slice(0, 3).map(
    (author, i) => author.image ? <div key={i} className={`${size} rounded-full border-2 border-white bg-gray-200 overflow-hidden`}>
              <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
            </div> : <div
      key={i}
      className={`${size} rounded-full border-2 border-white flex items-center justify-center ${textSize} font-bold`}
      style={{ background: "rgba(128,0,0,0.12)", color: "#800000" }}
      title={author.name}
    >
              {author.name?.charAt(0).toUpperCase()}
            </div>
  )}
      </div>
      {authors.length > 0 && <span className={`${textSize} font-medium text-gray-500 truncate`}>
          {authors[0]?.name}
          {authors.length > 1 ? ` +${authors.length - 1}` : ""}
        </span>}
    </div>;
  return <section className="w-full">
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
    return <button
      key={item.name}
      onClick={() => handleTabClick(item.name)}
      className="relative pb-3 md:pb-4 text-[11px] md:text-[14px] font-bold whitespace-nowrap transition-all duration-200 uppercase tracking-tight"
      style={{
        fontFamily: FONTS.openSans,
        color: isActive ? COLORS.black : formalColor
      }}
    >
                {item.name}
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0070f3]" />}
              </button>;
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
              {statusOpen && <div className="absolute z-20 top-full mt-2 w-full min-w-[160px] bg-white rounded-xl shadow-lg overflow-hidden py-1">
                  {statusOptions.map((option) => <button
    key={option}
    type="button"
    onClick={() => {
      setStatusFilter(option);
      setStatusOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-[14px] font-bold transition-colors ${statusFilter === option ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}
    style={{ fontFamily: FONTS.openSans }}
  >
                      {option}
                    </button>)}
                </div>}
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
              {tagOpen && <div className="absolute z-20 top-full mt-2 w-full min-w-[180px] bg-white rounded-xl shadow-lg overflow-hidden py-1">
                  {tagOptions.map((option) => <button
    key={option}
    type="button"
    onClick={() => {
      setTagFilter(option);
      setTagOpen(false);
    }}
    className={`w-full text-left px-4 py-2.5 text-[14px] font-bold transition-colors ${tagFilter === option ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"}`}
    style={{ fontFamily: FONTS.openSans }}
  >
                      {option}
                    </button>)}
                </div>}
            </div>

            {hasActiveFilters && <button
    onClick={handleReset}
    title="Clear filters"
    className="flex items-center gap-2 text-[12px] md:text-[14px] font-bold bg-white border border-red-500 text-red-500 hover:bg-red-50 transition-colors p-2 md:px-3 md:py-2.5 rounded-lg whitespace-nowrap"
    style={{ fontFamily: FONTS.openSans }}
  >
                <HiXMark className="w-4 h-4" />
                <span className="hidden md:inline">Clear</span>
              </button>}

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 ml-auto">
              <button onClick={() => setViewMode("list")} className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-700" : "text-gray-400"}`}><HiListBullet className="w-4 h-4 md:w-5 md:h-5" /></button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-400"}`}><HiSquares2X2 className="w-4 h-4 md:w-5 md:h-5" /></button>
            </div>
          </div>
          </div>
        </div>

        {isLoading && <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Loading case studies...</p>
          </div>}

        {!isLoading && <div className={`max-w-7xl mx-auto ${viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 justify-items-center" : "flex flex-col gap-6 items-center"}`}>
            {paginatedCards.length > 0 ? paginatedCards.map((card, index) => {
    if (viewMode === "grid") {
      return <div
        key={card.id ?? index}
        className="group bg-white rounded-2xl overflow-hidden shadow-[0_20px_45px_-20px_rgba(0,0,0,0.2)] md:shadow-[0_35px_70px_-20px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col h-full w-full max-w-[260px] md:max-w-[300px] transition-all duration-500 hover:translate-y-[-5px]"
      >
                      <div className="relative aspect-[2.6/1] overflow-hidden bg-gray-50">
                        <img
        src={card.image}
        alt={card.title}
        className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
        onError={(e) => {
          const target = e.target;
          if (target.src !== "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800") {
            target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
          }
        }}
      />
                        <span
        className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/95 backdrop-blur-sm text-[#800000] px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest shadow-md"
        style={{ fontFamily: FONTS.openSans }}
      >
                          {card.type}
                        </span>
                      </div>

                      <div className="px-4 md:px-6 pt-3 md:pt-4 pb-3 md:pb-5 flex flex-col flex-grow">
                        <p className="text-gray-400 text-[9px] md:text-[10px] font-normal mb-1.5 uppercase tracking-widest flex flex-wrap items-center gap-x-1.5 gap-y-0.5" style={{ fontFamily: FONTS.rubik }}>
                          <span className="whitespace-nowrap">{card.date}</span>
                          <span className={`px-1.5 py-0.5 rounded font-semibold ${card.status === "Active" ? "bg-green-100 text-green-700" : card.status === "Completed" ? "bg-blue-100 text-blue-700" : card.status === "Draft" ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"}`}>
                            {card.status}
                          </span>
                        </p>

                        <h4
        onClick={() => setModalCard(card)}
        className="text-[13px] md:text-[17px] font-bold text-[#282828] leading-tight mb-2 group-hover:text-[#800000] transition-colors cursor-pointer line-clamp-2"
        style={{ fontFamily: FONTS.poppins }}
      >
                          {card.title}
                        </h4>

                        <p className="text-gray-500 text-[10px] md:text-[12px] leading-relaxed mb-3 md:mb-4 line-clamp-2 flex-grow">
                          {card.description}
                        </p>

                        <div className="mt-auto flex justify-between items-center gap-2 border-t border-gray-50 pt-3">
                          {renderAuthorAvatars(card.authors, "w-5 h-5 md:w-7 md:h-7", "text-[9px] md:text-[11px]")}
                          <Link href={`/resources/CaseStudiesCardDetails?id=${card.id}`} className="flex-shrink-0">
                            <button
        title="Preview article"
        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#800000] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
      >
                              <HiEye className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>;
    }
    return <div
      key={card.id ?? index}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 w-full max-w-5xl min-h-[88px] md:min-h-[200px] flex flex-row"
    >
                    <div className="relative w-[80px] md:w-[300px] flex-shrink-0">
                      <img
      src={card.image}
      alt={card.title}
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => {
        const target = e.target;
        if (target.src !== "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800") {
          target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
        }
      }}
    />
                      <span
      className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 text-gray-800 text-[10px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm hidden md:block"
      style={{ fontFamily: FONTS.openSans }}
    >
                        {card.type}
                      </span>
                    </div>

                    <div className="flex-grow min-w-0 bg-white px-2.5 py-2 md:px-8 md:pt-6 md:pb-4">
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className="text-gray-400 text-[10px] md:text-[11px] font-normal mb-0.5 md:mb-1 uppercase tracking-wider flex flex-wrap items-center gap-x-1 md:gap-x-1.5 gap-y-0.5" style={{ fontFamily: FONTS.rubik }}>
                                <span className="whitespace-nowrap">{card.date}</span>
                                <span className={`px-1 md:px-1.5 py-0.5 rounded font-semibold ${card.status === "Active" ? "bg-green-100 text-green-700" : card.status === "Completed" ? "bg-blue-100 text-blue-700" : card.status === "Draft" ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"}`}>
                                  {card.status}
                                </span>
                              </p>
                              <h4
      onClick={() => setModalCard(card)}
      className="text-[12px] md:text-[18px] font-bold text-[#282828] leading-tight mb-1 md:mb-3 line-clamp-1 md:line-clamp-1 cursor-pointer"
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
                          <div className="mt-auto md:mt-0 pt-1 md:pt-3 flex justify-between items-center gap-2">
                            {renderAuthorAvatars(card.authors, "w-4 h-4 md:w-7 md:h-7", "text-[8px] md:text-[11px]")}
                            <Link href={`/resources/CaseStudiesCardDetails?id=${card.id}`} className="flex-shrink-0">
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
                  </div>;
  }) : <div className="col-span-full py-20 text-gray-400 italic text-center w-full">No resources found in {activeTab}.</div>}
          </div>}

        {
    /* Pagination Controls */
  }
        {!isLoading && totalPages > 0 && <div className="flex justify-center items-center gap-2 md:gap-4 mt-8 md:mt-12 mb-6 md:mb-8">
            <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="px-3 py-1.5 md:px-5 md:py-2 border border-gray-200 rounded-lg text-[11px] md:text-[14px] font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
    style={{ fontFamily: FONTS.openSans }}
  >
              Next
            </button>
          </div>}
      </div>

      {modalCard && <div
    className="fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-black/50 p-4 pt-[130px] md:pt-4 overflow-y-auto"
    onClick={() => setModalCard(null)}
  >
          <div
    className="relative w-full max-w-lg h-[75vh] max-h-[620px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
            <button
    onClick={() => setModalCard(null)}
    className="absolute top-3 right-3 z-10 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white"
    style={{ color: "#282828" }}
  >
              <HiXMark className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[160px] flex-shrink-0">
              <img
    src={modalCard.image}
    alt={modalCard.title}
    className="w-full h-full object-cover"
    onError={(e) => {
      const target = e.target;
      if (target.src !== "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800") {
        target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
      }
    }}
  />
              <span
    className="absolute top-3 left-3 bg-white/90 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm"
    style={{ fontFamily: FONTS.openSans, color: "#282828" }}
  >
                {modalCard.type}
              </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 px-5 pt-4 pb-5">
              <p className="text-gray-400 text-[11px] font-normal mb-2 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0" style={{ fontFamily: FONTS.rubik }}>
                <span>{modalCard.date}</span>
                <span
    className={`px-1.5 py-0.5 rounded font-semibold ${modalCard.status === "Active" ? "bg-green-100 text-green-700" : modalCard.status === "Completed" ? "bg-blue-100 text-blue-700" : modalCard.status === "Draft" ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"}`}
  >
                  {modalCard.status}
                </span>
              </p>
              <h4 className="text-[20px] font-bold text-[#282828] leading-tight mb-3 flex-shrink-0" style={{ fontFamily: FONTS.poppins }}>
                {modalCard.title}
              </h4>
              {modalCard.authors && modalCard.authors.length > 0 && <div className="mb-3 flex-shrink-0">
                  {renderAuthorAvatars(modalCard.authors, "w-6 h-6", "text-[11px]")}
                </div>}
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <span style={{ fontFamily: FONTS.openSans, fontWeight: 700, fontSize: "16px", color: "#282828", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                  About
                </span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <p style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: "16px", lineHeight: 1.75, color: "rgba(40,40,40,0.65)" }}>
                  {modalCard.fullDescription || modalCard.description}
                </p>
              </div>
            </div>
          </div>
        </div>}
    </section>;
}
export {
  CaseStudiesFilter as default
};
