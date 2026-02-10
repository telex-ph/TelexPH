"use client";

import React, { useState, useEffect } from "react";
import { HiOutlineArrowLeft, HiHeart, HiOutlineHeart } from "react-icons/hi2";

// Define Interface para sa TypeScript safety (Base sa iyong backend model)
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
  likeCount: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogsArticleProps {
  post: IBlog | null;
  onBack: () => void;
  onArticleClick: (post: IBlog) => void;
  allBlogs: IBlog[];
}

export default function BlogsArticle({ post, onBack, onArticleClick, allBlogs }: BlogsArticleProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!post) return null;

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Initialize like count and check like status
  useEffect(() => {
    if (post) {
      setLikeCount(post.likeCount || 0);
      checkLikeStatus();
    }
  }, [post]);

  // Check if current user has liked this blog
  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/blogs/${post._id}/like-status`);
      const data = await response.json();
      setHasLiked(data.hasLiked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (isLiking) return; // Prevent multiple clicks
    
    setIsLiking(true);
    
    try {
      const url = `http://localhost:3000/api/blogs/${post._id}/like`;
      const method = hasLiked ? 'DELETE' : 'POST';
      
      const response = await fetch(url, { method });
      const data = await response.json();
      
      if (response.ok) {
        setLikeCount(data.likeCount);
        setHasLiked(data.hasLiked);
      } else {
        console.error("Error toggling like:", data.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Sidebar Logic: Kunin ang latest 3 blogs pero i-exclude ang kasalukuyang binabasa
  const latestUpdates = allBlogs
    ? allBlogs
        .filter((item) => item._id !== post._id)
        .slice(0, 3)
    : [];

  return (
    <div className="bg-white min-h-screen font-['Poppins',_sans-serif] text-gray-900 pb-24">
      {/* Progress Bar Decor */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-50 z-50">
        <div className="bg-[#800000] h-full w-1/3"></div>
      </div>

      <nav className="max-w-[1300px] mx-auto px-6 py-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-gray-400 hover:text-[#800000] transition-all group"
        >
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-[#800000] transition-all">
            <HiOutlineArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-[0.2em]">back to journal</span>
        </button>
      </nav>

      <article>
        <header className="max-w-[900px] mx-auto px-6 text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-[#800000] text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1 bg-[#800000]/5 rounded-full">
              {post.mainCategory}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-gray-400 text-[11px] font-medium uppercase tracking-[0.1em]">
                {post.subcategory}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-col items-center gap-2 mb-6">
            <p className="text-gray-400 text-[14px]">
              By <span className="text-gray-900 font-bold">{post.author || "TelexPH Admin"}</span>
            </p>
            <p className="text-gray-400 text-[12px] uppercase tracking-widest">
              Published on {formatDate(post.createdAt)}
            </p>
          </div>

          {/* Like Button */}
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-[13px] transition-all duration-300 ${
                hasLiked 
                  ? 'bg-[#800000] text-white shadow-lg hover:shadow-xl' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {hasLiked ? (
                <HiHeart className="w-5 h-5" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>
        </header>

        <section className="max-w-[1400px] mx-auto px-6 mb-20">
          <div className="w-full aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl bg-gray-100">
            <img 
              src={post.picture} 
              className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105" 
              alt={post.title} 
            />
          </div>
        </section>

        <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Social Share Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-10">
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest rotate-180 [writing-mode:vertical-lr]">Share Article</p>
                <div className="flex flex-col gap-4 text-gray-400">
                   <span className="hover:text-[#800000] cursor-pointer text-[12px] font-bold">IN</span>
                   <span className="hover:text-[#800000] cursor-pointer text-[12px] font-bold">TW</span>
                   <span className="hover:text-[#800000] cursor-pointer text-[12px] font-bold">FB</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Sections from Database */}
          <main className="lg:col-span-7">
            <div className="prose prose-lg max-w-none text-gray-700 leading-[1.9] font-normal">
              {/* Short Description as Lead Paragraph */}
              <p className="text-xl md:text-2xl text-gray-900 font-medium mb-10 leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:text-[#800000] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                {post.shortDescription}
              </p>

              <div className="space-y-12 text-[17px]">
                {post.mainContent && post.mainContent.map((section, index) => (
                    <div key={index} className="space-y-4">
                        {section.title && (
                            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
                                {section.title}
                            </h3>
                        )}
                        <p className="whitespace-pre-line">
                            {section.content}
                        </p>
                    </div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Sidebar (Latest Updates & Meta) */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-[#fafafa] p-8 rounded-[30px] border border-gray-50 shadow-sm">
              <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest mb-8 flex justify-between items-center">
                Latest Updates
                <span className="w-10 h-[1px] bg-gray-200"></span>
              </h3>
              
              <div className="space-y-8">
                {latestUpdates.length > 0 ? (
                  latestUpdates.map((item) => (
                    <div 
                      key={item._id} 
                      className="group cursor-pointer flex gap-5"
                      onClick={() => {
                        onArticleClick(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200">
                        <img 
                          src={item.picture} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                          alt={item.title} 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-bold text-[#800000] uppercase tracking-widest mb-1">
                          {item.mainCategory}
                        </span>
                        <h4 className="text-[13px] font-bold leading-snug text-gray-900 group-hover:text-[#800000] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic">No other articles found.</p>
                )}
              </div>
            </div>

            <div className="p-8 border border-gray-100 rounded-[30px] space-y-6">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Meta</p>
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-gray-400">Date Posted</span>
                   <span className="font-bold">{formatDate(post.createdAt)}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-gray-400">Main Topic</span>
                   <span className="font-bold text-[#800000]">{post.mainCategory}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-gray-400">Likes</span>
                   <span className="font-bold text-[#800000]">{likeCount}</span>
                 </div>
               </div>
            </div>
          </aside>

        </div>
      </article>
    </div>
  );
}