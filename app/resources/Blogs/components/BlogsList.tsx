"use client";

import React from "react";
import { HiOutlineArrowRight, HiOutlineArrowUpRight } from "react-icons/hi2";
import { FONTS, FONT_WEIGHTS } from "@/constant/styles";

// Define the Blog interface para mag-match sa database fields
interface IContentSection {
  title: string;
  content: string;
}

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  author: string;
  mainCategory: string;
  subcategory: string;
  shortDescription: string;
  mainContent: IContentSection[];
  picture: string;
  status: "published" | "draft" | "scheduled";
  createdAt: string;
  updatedAt: string;
}

interface BlogsListProps {
  blogs: IBlog[]; // Data mula sa database
  onArticleClick: (post: IBlog) => void;
  searchQuery: string;
  viewMode: 'grid' | 'list'; // ADDED viewMode prop
  activeTab: string;
  categoryFilter: string | null;
}

// Per-tab label/headline/description — mirrors the category groups in BlogsFilter.tsx
const TAB_CONTENT: { value: string; subcategories: string[]; label: string; headline: string; description: string }[] = [
  {
    value: "All",
    subcategories: [],
    label: "our journal",
    headline: "Founders Corner",
    description: "A curated mix of insights, playbooks, and updates from every corner of TelexPH — for teams building smarter, leaner operations.",
  },
  {
    value: "Main Service Categories",
    subcategories: ["Customer Experience (CX)", "Back Office Solutions", "Virtual Assistance", "Sales & Lead Generation"],
    label: "our services",
    headline: "Service Deep Dives",
    description: "Explore how our Customer Experience, Back Office, Virtual Assistance, and Sales teams turn outsourcing into a growth advantage.",
  },
  {
    value: "Industry-Specific Insights",
    subcategories: ["E-commerce Support", "Real Estate Outsourcing", "Healthcare BPO", "Tech & SaaS Scaling"],
    label: "industry insights",
    headline: "Industry Intelligence",
    description: "Sector-specific playbooks on E-commerce, Real Estate, Healthcare, and Tech & SaaS — built from real client outcomes.",
  },
  {
    value: "Business Growth & Strategy",
    subcategories: ["Scale Smarter", "Outsourcing 101", "Cost Optimization"],
    label: "business growth",
    headline: "Growth & Strategy",
    description: "Practical frameworks for scaling smarter, optimizing costs, and turning outsourcing into a strategic growth lever.",
  },
  {
    value: "Company Culture & Updates",
    subcategories: ["TelexPH Life", "News & Press Releases"],
    label: "company culture",
    headline: "Life at TelexPH",
    description: "Behind-the-scenes stories, team milestones, and the latest news shaping the TelexPH culture.",
  },
];

export default function BlogsList({ blogs, onArticleClick, searchQuery, viewMode, activeTab, categoryFilter }: BlogsListProps) {

  // While on the ALL tab, a picked categoryFilter drives the label/headline/description
  // instead of activeTab, so the tab itself can stay on "All".
  const effectiveCategoryValue = activeTab === "All" && categoryFilter ? categoryFilter : activeTab;
  const activeTabContent =
    TAB_CONTENT.find((t) => t.value === effectiveCategoryValue || t.subcategories.includes(effectiveCategoryValue)) || TAB_CONTENT[0];

  // Helper function para sa date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Logic para sa pag-organize ng data mula sa 'blogs' prop
  // 1. Featured Post: Ang pinakabagong blog
  const featuredPost = blogs.length > 0 ? blogs[0] : null;
  
  // 2. Latest Updates (Sidebar): Susunod na 5 na blogs
  const latestUpdates = blogs.slice(1, 6);

  // 3. Founders Corner / Grid: Ang mga natitirang blogs (hindi na kasama yung nasa Latest Updates), max 6
  const gridBlogs = blogs.slice(6, 12);

  // Kung walang data, wag mag-error, magpakita ng simple message
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No blog posts available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 bg-white font-['Poppins',_sans-serif]">

      {/* Tab-specific label, headline, and description */}
      <div className="max-w-4xl mb-10">
        <span
          className="uppercase tracking-[0.2em] mb-1 block"
          style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "14px", color: "#800000" }}
        >
          {activeTabContent.label}
        </span>
        <h2
          className="tracking-tight mb-2 text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px]"
          style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: "#282828" }}
        >
          {searchQuery ? `Results for "${searchQuery}"` : activeTabContent.headline}
        </h2>
        {!searchQuery && (
          <p
            className="leading-relaxed text-gray-500"
            style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, fontSize: "16px" }}
          >
            {activeTabContent.description}
          </p>
        )}
      </div>

      {/* Featured & Latest Updates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
        
        {/* LEFT: Featured Post (Dynamic) */}
        <div className="lg:col-span-8 relative group mb-20 lg:mb-0">
          {featuredPost && (
            <>
              <div className="relative h-[220px] sm:h-[300px] md:h-[380px] lg:h-[450px] w-full overflow-hidden rounded-lg shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)]">
                <img
                  src={featuredPost.picture}
                  className="w-full h-full object-cover object-top"
                  alt={featuredPost.title}
                />
              </div>
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 bg-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:w-[85%] max-w-[600px] border border-gray-50 flex items-center justify-between gap-3 sm:gap-6">
                <div className="flex-grow min-w-0">
                  <span className="text-[#800000] font-normal text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1 sm:mb-2 block">featured blog</span>
                  <h1 className="text-sm sm:text-base lg:text-lg font-bold leading-tight text-gray-900 line-clamp-2">{featuredPost.title}</h1>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <p className="text-[11px] text-gray-400 font-normal whitespace-nowrap hidden sm:block">{formatDate(featuredPost.createdAt)}</p>
                  <div
                    onClick={() => onArticleClick(featuredPost)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-[#800000] rounded-full flex items-center justify-center text-white cursor-pointer hover:rotate-45 transition-all shadow-lg flex-shrink-0"
                  >
                      <HiOutlineArrowUpRight className="text-sm sm:text-base" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Latest Updates (Dynamic) */}
        <div className="lg:col-span-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight border-b border-gray-100 pb-2">Latest Updates</h2>
          <div className="flex flex-col gap-3">
            {latestUpdates.map((post) => (
              <div 
                key={post._id} 
                onClick={() => onArticleClick(post)}
                className="group cursor-pointer flex gap-4 items-center bg-white p-3 rounded-[10px] border border-gray-50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.15)] transition-all"
              >
                <div className="w-16 h-16 rounded-[8px] overflow-hidden flex-shrink-0">
                  <img src={post.picture} className="w-full h-full object-cover" alt="Thumb" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-normal text-[#800000] uppercase tracking-widest mb-0.5">{post.mainCategory}</span>
                  <h4 className="text-[13px] font-bold leading-snug group-hover:text-[#800000] line-clamp-2 transition-colors" style={{ color: "#282828" }}>
                    {post.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section Label + Title — only when there's actually more to show */}
      {(searchQuery ? blogs : gridBlogs).length > 0 && (
        <div className="mb-6">
          <span
            className="uppercase tracking-[0.2em] mb-1 block"
            style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "12px", color: "#800000" }}
          >
            keep exploring
          </span>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
            More from the Journal
          </h3>
        </div>
      )}

      {/* CONDITIONAL RENDERING: List View or Grid View */}
      {viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="flex flex-col gap-6">
          {(searchQuery ? blogs : gridBlogs).map((blog) => (
            <div 
              key={blog._id} 
              className="group bg-white rounded-xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col md:flex-row transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] hover:translate-y-[-3px]"
            >
              <div className="relative md:w-[320px] aspect-[2.6/1] md:aspect-auto md:h-auto overflow-hidden bg-gray-50 flex-shrink-0">
                <img 
                  src={blog.picture} 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" 
                  alt="Blog" 
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-white/95 backdrop-blur-sm text-[#800000] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-md">
                    {blog.mainCategory}
                  </span>
                  {blog.subcategory && (
                    <span className="bg-[#800000]/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[9px] font-medium tracking-wide shadow-md">
                      {blog.subcategory}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-1 rounded-full bg-[#800000] opacity-60"></div>
                    <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">{blog.author}</span>
                  </div>
                  
                  <h3 
                    onClick={() => onArticleClick(blog)}
                    className="text-[22px] font-bold text-gray-900 leading-tight mb-3 group-hover:text-[#800000] transition-colors cursor-pointer"
                  >
                    {blog.title}
                  </h3>
                  
                  <p className="text-[14px] text-gray-500 font-normal leading-relaxed line-clamp-2">
                    {blog.shortDescription}
                  </p>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-4">
                  <span className="text-[11px] text-gray-400 font-normal uppercase tracking-tighter">{formatDate(blog.createdAt)}</span>
                  
                  <div 
                    onClick={() => onArticleClick(blog)}
                    className="text-[#800000] font-normal text-[11px] flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer uppercase tracking-widest"
                  >
                    Read Article <HiOutlineArrowRight className="text-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(searchQuery ? blogs : gridBlogs).map((blog) => (
            <div 
              key={blog._id} 
              className="group bg-white rounded-xl overflow-hidden shadow-[0_35px_70px_-20px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col transition-all duration-500 hover:translate-y-[-5px] w-full"
            >
              <div className="relative aspect-[2.6/1] m-4 overflow-hidden rounded-lg bg-gray-50">
                <img src={blog.picture} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" alt="Blog" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-white/95 backdrop-blur-sm text-[#800000] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-md">
                    {blog.mainCategory}
                  </span>
                  {blog.subcategory && (
                    <span className="bg-[#800000]/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[9px] font-medium tracking-wide shadow-md">
                      {blog.subcategory}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-8 pb-6 pt-2 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full bg-[#800000] opacity-60"></div>
                  <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">{blog.author}</span>
                </div>
                
                <h3 
                  onClick={() => onArticleClick(blog)}
                  className="text-[19px] font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#800000] transition-colors cursor-pointer line-clamp-2"
                >
                  {blog.title}
                </h3>
                
                <p className="text-[13px] text-gray-500 font-normal leading-relaxed mb-4 line-clamp-2">
                  {blog.shortDescription}
                </p>
                
                <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
                  <span className="text-[11px] text-gray-400 font-normal uppercase tracking-tighter">{formatDate(blog.createdAt)}</span>
                  
                  <div 
                    onClick={() => onArticleClick(blog)}
                    className="text-[#800000] font-normal text-[11px] flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer uppercase tracking-widest"
                  >
                    Read Article <HiOutlineArrowRight className="text-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}