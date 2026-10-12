
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { COLORS, FONTS, FONT_WEIGHTS } from "@/constant/styles";
import { htmlToText } from "@/lib/rich-text";
import PageLoader from "@/components/PageLoader";
import useRotatingIndex from "@/lib/useRotatingIndex";
import { HiMagnifyingGlass, HiListBullet, HiSquares2X2, HiOutlineArrowRight } from "react-icons/hi2";
import FeaturedHighlight from "@/components/FeaturedHighlight";
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
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
const FALLBACK_IMG = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
const TAB_INTRO = {
  All: { label: "success stories", headline: "Proven Results", description: "Real-world stories of how TelexPH helps partners reach operational excellence through outsourcing and dedicated business support." }
};
["Technology", "Logistics", "Analytics", "Infrastructure"].forEach((t) => {
  TAB_INTRO[t] = { label: t.toLowerCase(), headline: `${t} Case Studies`, description: `How our ${t.toLowerCase()} work delivers measurable results for partners.` };
});
function CaseStudiesFilter() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [apiCaseStudies, setApiCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navItems = [
    { name: "All" },
    { name: "Technology" },
    { name: "Logistics" },
    { name: "Analytics" },
    { name: "Infrastructure" }
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
      // Public site shows published work only — draft/scheduled/completed stay internal.
      const activeOnly = apiData.filter((item) => item.status === "active");
      const transformedApiData = activeOnly.map((item) => {
        let description = "";
        if (Array.isArray(item.challenge) && item.challenge.length > 0) {
          description = item.challenge[0]?.text || "";
        } else if (Array.isArray(item.sections) && item.sections.length > 0) {
          description = item.sections[0]?.text || "";
        } else if (Array.isArray(item.solution) && item.solution.length > 0) {
          description = item.solution[0]?.text || "";
        }
        description = htmlToText(description);
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
        const tags = Array.isArray(item.tags) ? item.tags.map((t) => tagMap[t]).filter(Boolean) : [];
        return {
          id: item._id,
          type: "Case Studies",
          tags,
          title: item.title || "Untitled Case Study",
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          status: statusMap[item.status] || "Active",
          description: description || "No description available.",
          fullDescription: fullDescription || "No description available.",
          image: item.cover || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
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
      cards = cards.filter((r) => r.tags.includes(activeTab));
    }
    if (searchQuery) {
      cards = cards.filter(
        (r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return cards;
  }, [apiCaseStudies, activeTab, searchQuery]);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, viewMode]);
  // The highlight rotates through the top 6; the rest of them fill "Latest Updates".
  const top = filteredCards.slice(0, 6);
  const { index: highlightIdx, setIndex: setHighlight, pause } = useRotatingIndex(top.length);
  const featured = top[highlightIdx] ?? null;
  const latest = top.filter((_, k) => k !== highlightIdx);
  const highlightItems = top.map((c) => ({ id: c.id, image: c.image, title: c.title, date: c.date, href: `/resources/casestudiescarddetails?id=${c.id}` }));
  // List view shows every case study; grid view shows the ones after the highlighted six.
  const rest = viewMode === "list" || searchQuery ? filteredCards : filteredCards.slice(6);
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE);
  const gridCards = rest.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const intro = TAB_INTRO[activeTab] || TAB_INTRO.All;
  const detailsUrl = (card) => `/resources/casestudiescarddetails?id=${card.id}`;
  const onImgError = (e) => {
    if (e.target.src !== FALLBACK_IMG) e.target.src = FALLBACK_IMG;
  };
  return <div className="max-w-[1400px] mx-auto px-4">
      <div className="w-full mb-10">
        <div className="flex flex-nowrap md:flex-wrap justify-between md:justify-center gap-x-4 md:gap-x-10 border-b border-gray-100 mb-8 overflow-x-auto md:overflow-visible no-scrollbar">
          {navItems.map((item) => {
    const isActive = activeTab === item.name;
    return <button
      key={item.name}
      onClick={() => setActiveTab(item.name)}
      className="relative pb-3 md:pb-4 text-[11px] md:text-[14px] font-bold whitespace-nowrap uppercase tracking-tight transition-all duration-200 flex-shrink-0"
      style={{ color: isActive ? COLORS.dark : "#6b7280", fontFamily: FONTS.openSans }}
    >
                {item.name}
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#800000]" />}
              </button>;
  })}
        </div>

        <div className="flex justify-center w-full">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full max-w-7xl">
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-[400px]">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search case studies..."
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#800000] transition-all shadow-sm"
  />
            </div>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 ml-auto">
              {[["list", HiListBullet], ["grid", HiSquares2X2]].map(([mode, Icon]) => <button
    key={mode}
    onClick={() => setViewMode(mode)}
    className={`p-2 rounded-md transition-all ${viewMode === mode ? "bg-white shadow-sm text-[#800000]" : "text-gray-400 hover:text-gray-600"}`}
  >
                  <Icon className="w-5 h-5" />
                </button>)}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? <PageLoader fullScreen={false} /> : !featured ? <div className="text-center py-20">
          <p className="text-gray-500">No case studies available.</p>
        </div> : <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 bg-white">
          <div className="max-w-4xl mb-10">
            <span className="uppercase tracking-[0.2em] mb-1 block" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "14px", color: "#800000" }}>
              {intro.label}
            </span>
            <h2 className="tracking-tight mb-2 text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px]" style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: "#282828" }}>
              {searchQuery ? `Results for "${searchQuery}"` : intro.headline}
            </h2>
            {!searchQuery && <p className="leading-relaxed text-gray-500" style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, fontSize: "16px" }}>
                {intro.description}
              </p>}
          </div>

          {viewMode !== "list" && <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
            <FeaturedHighlight items={highlightItems} index={highlightIdx} onSelect={setHighlight} onHover={pause} label="featured case study" fallbackImg={FALLBACK_IMG} />

        <div className="lg:col-span-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight border-b border-gray-100 pb-2">Latest Updates</h2>
              <div className="flex flex-col gap-3">
                {latest.map((card) => <Link
    key={card.id}
    href={detailsUrl(card)}
    className="group cursor-pointer flex gap-4 items-center bg-white p-3 rounded-[10px] border border-gray-50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.15)] transition-all"
  >
                    <div className="w-16 h-16 rounded-[8px] overflow-hidden flex-shrink-0">
                      <img src={card.image} className="w-full h-full object-cover" alt="Thumb" onError={onImgError} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-normal text-[#800000] uppercase tracking-widest mb-0.5">{card.tags[0] || card.type}</span>
                      <h4 className="text-[13px] font-bold leading-snug group-hover:text-[#800000] line-clamp-2 transition-colors" style={{ color: "#282828" }}>{card.title}</h4>
                    </div>
                  </Link>)}
              </div>
            </div>
          </div>}

      {gridCards.length > 0 && <div className="mb-6">
              <span className="uppercase tracking-[0.2em] mb-1 block" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "12px", color: "#800000" }}>{viewMode === "list" ? "browse all" : "keep exploring"}</span>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-2">{viewMode === "list" ? "All Case Studies" : "More Case Studies"}</h3>
            </div>}

          {viewMode === "list" ? <div className="flex flex-col gap-6">
              {gridCards.map((card) => <div key={card.id} className="group bg-white rounded-xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col md:flex-row transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] hover:translate-y-[-3px]">
                  <div className="relative md:w-[320px] aspect-[2.6/1] md:aspect-auto md:h-auto md:min-h-[220px] overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={card.image} className="w-full h-full md:absolute md:inset-0 object-cover transition-transform duration-[1.2s] group-hover:scale-110" alt={card.title} onError={onImgError} />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-white/95 backdrop-blur-sm text-[#800000] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-md">{card.tags[0] || card.type}</span>
                    </div>
                  </div>
                  <div className="px-8 py-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-[22px] font-bold text-gray-900 leading-tight mb-3 group-hover:text-[#800000] transition-colors"><Link href={detailsUrl(card)}>{card.title}</Link></h3>
                      <p className="text-[14px] text-gray-500 font-normal leading-relaxed line-clamp-2">{card.description}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-4">
                      <span className="text-[11px] text-gray-400 font-normal uppercase tracking-tighter">{card.date}</span>
                      <Link href={detailsUrl(card)} className="text-[#800000] font-normal text-[11px] flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
                        Read Case Study <HiOutlineArrowRight className="text-md" />
                      </Link>
                    </div>
                  </div>
                </div>)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridCards.map((card) => <div key={card.id} className="group bg-white rounded-xl overflow-hidden shadow-[0_35px_70px_-20px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col transition-all duration-500 hover:translate-y-[-5px] w-full">
                  <div className="relative aspect-[2.6/1] m-4 overflow-hidden rounded-lg bg-gray-50">
                    <img src={card.image} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" alt={card.title} onError={onImgError} />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-white/95 backdrop-blur-sm text-[#800000] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-md">{card.tags[0] || card.type}</span>
                    </div>
                  </div>
                  <div className="px-8 pb-6 pt-2 flex flex-col flex-grow">
                    <h3 className="text-[19px] font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#800000] transition-colors line-clamp-2"><Link href={detailsUrl(card)}>{card.title}</Link></h3>
                    <p className="text-[13px] text-gray-500 font-normal leading-relaxed mb-4 line-clamp-2">{card.description}</p>
                    <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
                      <span className="text-[11px] text-gray-400 font-normal uppercase tracking-tighter">{card.date}</span>
                      <Link href={detailsUrl(card)} className="text-[#800000] font-normal text-[11px] flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
                        Read Case Study <HiOutlineArrowRight className="text-md" />
                      </Link>
                    </div>
                  </div>
                </div>)}
            </div>}

          {totalPages > 1 && <div className="flex justify-center items-center gap-4 mt-12">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 border border-gray-200 rounded-lg text-[14px] font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm" style={{ fontFamily: FONTS.openSans }}>Previous</button>
              <span className="text-gray-500 text-[14px] font-medium" style={{ fontFamily: FONTS.rubik }}>Page <span className="text-gray-900 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span></span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 border border-gray-200 rounded-lg text-[14px] font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm" style={{ fontFamily: FONTS.openSans }}>Next</button>
            </div>}
        </div>}
    </div>;
}
export {
  CaseStudiesFilter as default
};
