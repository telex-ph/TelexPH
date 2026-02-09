"use client";

import React, { useState } from "react";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import BlogsHero from "./components/BlogsHero";
import BlogsFilter from "./components/BlogsFilter";
import BlogsList from "./components/BlogsList";
import BlogsArticle from "./components/BlogsArticle"; 

export default function BlogsPage() {
  const [showNav, setShowNav] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");

  const [isArticleView, setIsArticleView] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const openNavHandler = () => setShowNav(true);
  const closeNavHandler = () => setShowNav(false);

  const handleArticleClick = (post: any) => {
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
            <BlogsArticle post={selectedPost} onBack={handleBackToList} />
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
              <BlogsList 
                onArticleClick={handleArticleClick}
                searchQuery={searchQuery}
              />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}