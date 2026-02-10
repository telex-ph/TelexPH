"use client";

import React, { useState, useEffect } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import BlogsHero from "./components/BlogsHero";
import BlogsFilter from "./components/BlogsFilter";
import BlogsList from "./components/BlogsList";
import BlogsArticle from "./components/BlogsArticle"; 

// Define the Blog interface based on your backend model
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
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogsPage() {
  const [showNav, setShowNav] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");

  const [isArticleView, setIsArticleView] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IBlog | null>(null);

  // State for blogs data
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API base URL - adjust this to your backend URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        
        // Add search query if exists
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        // Add category filter if not 'All'
        if (activeTab !== 'All') {
          // Map frontend tabs to backend categories
          const categoryMap: { [key: string]: string } = {
            'Insights': 'Industry-Specific Insights',
            'News': 'Company Culture & Updates',
            'Tutorials': 'Main Service Categories',
            'Webinars': 'Business Growth & Strategy',
          };
          
          const mainCategory = categoryMap[activeTab];
          if (mainCategory) {
            params.append('mainCategory', mainCategory);
          }
        }

        // Only fetch published blogs for public view
        params.append('status', 'published');

        const url = `${API_BASE_URL}/blogs${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
        }

        const data: IBlog[] = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchQuery, activeTab]); // Re-fetch when search or tab changes

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  const handleArticleClick = (post: IBlog) => {
    setSelectedPost(post);
    setIsArticleView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setIsArticleView(false);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',_sans-serif]">
      <Nav openNav={openNavHandler} />
      <MobileNav showNav={showNav} closeNav={closeNavHandler} />

      <main className="pb-20">
        {isArticleView ? (
          <div className="animate-in fade-in duration-500">
            <BlogsArticle 
              post={selectedPost} 
              onBack={handleBackToList}
              onArticleClick={handleArticleClick}
              allBlogs={blogs}
            />
          </div>
        ) : (
          <>
            <BlogsHero />
            <div className="max-w-[1400px] mx-auto px-4">
              <BlogsFilter 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-[#800000] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading blogs...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Blogs</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-center max-w-md">
                    <div className="text-gray-300 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Blogs Found</h3>
                    <p className="text-gray-600">
                      {searchQuery 
                        ? `No blogs match your search "${searchQuery}"`
                        : `No ${activeTab.toLowerCase()} blogs available at the moment.`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <BlogsList 
                  blogs={blogs}
                  onArticleClick={handleArticleClick}
                  searchQuery={searchQuery}
                  viewMode={viewMode}
                />
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}