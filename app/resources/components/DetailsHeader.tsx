"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiChevronRight } from "react-icons/hi2";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaLink,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import { FONTS, getColorWithOpacity } from "@/constant/styles";

import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";

// Define the CaseStudy interface based on your schema
interface CaseStudy {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  cover: string;
  status: string;
  tags: string[];
  author: string;
  likesCount?: number;
}

// Fallback data in case API fails
const FALLBACK_DATA = {
  id: 1,
  type: "case studies",
  title: "loading case study",
  subtitle: "please wait while we load the content",
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  author: "",
};

// ✅ FIXED: API like/unlike function
async function toggleLikeCaseStudy(id: string, isLiked: boolean) {
  try {
    const method = isLiked ? 'DELETE' : 'POST'; // 👈 Toggle between POST/DELETE
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/casestudies/${id}/like`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    
    return { success: true, likesCount: data.likesCount, hasLiked: data.hasLiked };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

// ✅ NEW: Check like status from API
async function checkLikeStatus(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/casestudies/${id}/like-status`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking like status:', error);
    return { hasLiked: false, likesCount: 0 };
  }
}

export default function DetailsHeader() {
  const [showNav, setShowNav] = useState(false);
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  
  const bodyTextColor = getColorWithOpacity("dark", 0.7);
  const targetMaroon = "rgb(161, 0, 0)";

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        setError(false);
        
        let response;
        
        if (slug) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/casestudies/fetch/${slug}`);
        } else if (id) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/casestudies/${id}`);
        } else {
          setError(true);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch case study");
        }

        const data = await response.json();
        setCaseStudy(data);
        setLikesCount(data.likesCount || 0);

        // ✅ FIXED: Check like status from API instead of localStorage
        if (data._id) {
          const likeStatus = await checkLikeStatus(data._id);
          setHasLiked(likeStatus.hasLiked);
          setLikesCount(likeStatus.likesCount);
        }
      } catch (err) {
        console.error("Error fetching case study:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [slug, id]);

  // ✅ FIXED: Handle like/unlike toggle
  const handleLikeToggle = async () => {
    if (isLiking || !caseStudy?._id) return; // 👈 Removed hasLiked check
    
    setIsLiking(true);
    
    const result = await toggleLikeCaseStudy(caseStudy._id, hasLiked);
    
    if (result.success) {
      setLikesCount(result.likesCount || 0);
      setHasLiked(result.hasLiked || false);
    }
    
    setIsLiking(false);
  };

  // Prepare display data
  const displayData = caseStudy
    ? {
        type: "case studies",
        title: caseStudy.title,
        subtitle: caseStudy.subtitle || "",
        image: caseStudy.cover,
        tags: caseStudy.tags,
        author: caseStudy.author,
      }
    : FALLBACK_DATA;

  return (
    <>
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <div className="container mx-auto px-4 sm:px-6 pt-24 md:pt-32 mb-4 md:mb-5">
        <nav className="flex items-center justify-start gap-2 md:gap-3 overflow-x-auto no-scrollbar" aria-label="breadcrumb">
          <Link 
            href="/" 
            className="text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-[0.1em] hover:text-[#a10000] transition-colors no-underline flex-shrink-0" 
            style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}
          >
            home
          </Link>
          <HiChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <Link 
            href="/resources" 
            className="text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-[0.1em] hover:text-[#a10000] transition-colors no-underline flex-shrink-0" 
            style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}
          >
            resources
          </Link>
          <HiChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <span 
            className="text-[11px] md:text-[13px] lg:text-[15px] font-black uppercase tracking-[0.1em] truncate text-[#a10000]" 
            style={{ fontFamily: FONTS.openSans }}
          >
            {loading ? "loading..." : displayData.title}
          </span>
        </nav>
      </div>

      <section className="relative w-full h-[240px] md:h-[300px] lg:h-[380px] bg-white overflow-hidden flex items-center content-visibility-auto">
        
        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a10000] mx-auto mb-4"></div>
              <p style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}>
                Loading case study...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
            <div className="text-center px-4">
              <p className="text-xl font-bold mb-2" style={{ fontFamily: FONTS.openSans, color: targetMaroon }}>
                Case Study Not Found
              </p>
              <p style={{ fontFamily: FONTS.openSans, color: bodyTextColor }}>
                The case study you're looking for doesn't exist.
              </p>
            </div>
          </div>
        )}

        {/* Cover image */}
        <div className="absolute inset-0 flex justify-end z-0">
          <div 
            className="relative w-full md:w-[70%] h-full overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 10%, black 40%)',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 10%, black 40%)'
            }}
          >
            <img 
              src={displayData.image} 
              className="w-full h-full object-cover transform-gpu"
              style={{ objectPosition: '50% 50%' }}
              alt={displayData.title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-[280px] sm:max-w-md md:max-xl lg:max-w-2xl">
            <div className="mb-1 md:mb-2">
              <span
                className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black inline-block"
                style={{ 
                  fontFamily: FONTS.openSans,
                  color: targetMaroon
                }}
              >
                — {displayData.type}
              </span>
            </div>

            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-black text-[#111] mb-1 md:mb-2 leading-[1.1] tracking-tighter"
              style={{ fontFamily: FONTS.openSans }}
            >
              {displayData.title.split(' ').slice(0, -1).join(' ')}
              {displayData.title.split(' ').length > 1 && (
                <>
                  <br />
                  <span className="text-[#a10000]">
                    {displayData.title.split(' ').slice(-1)}
                  </span>
                </>
              )}
              {displayData.title.split(' ').length === 1 && (
                <span className="text-[#a10000]">
                  {displayData.title}
                </span>
              )}
            </h1>

            {displayData.subtitle && (
              <p
                className="text-sm md:text-lg text-gray-900 font-bold leading-snug"
                style={{ 
                  fontFamily: FONTS.openSans
                }}
              >
                {displayData.subtitle}
              </p>
            )}

            {displayData.author && (
              <p
                className="text-xs md:text-sm mt-2 md:mt-3 uppercase tracking-wide"
                style={{ 
                  fontFamily: FONTS.openSans,
                  color: bodyTextColor,
                  fontWeight: 600
                }}
              >
                By {displayData.author}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Social Icons and Like Button Section */}
      {!loading && !error && caseStudy && (
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-6 print:hidden">
          <div className="flex items-center gap-3">
            {/* Social Share Icons */}
            <div 
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white transition-all text-gray-500"
              title="Share on Facebook"
            >
              <FaFacebookF size={14} />
            </div>
            
            <div 
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-blue-400 hover:text-white transition-all text-gray-500"
              title="Share on Twitter"
            >
              <FaTwitter size={14} />
            </div>
            
            <div 
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-blue-700 hover:text-white transition-all text-gray-500"
              title="Share on LinkedIn"
            >
              <FaLinkedinIn size={14} />
            </div>
            
            <div 
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-600 hover:text-white transition-all text-gray-500"
              title="Share via Email"
            >
              <FaEnvelope size={14} />
            </div>
            
            <div 
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-600 hover:text-white transition-all text-gray-500"
              title="Copy Link"
            >
              <FaLink size={14} />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            {/* ✅ FIXED: Like/Unlike Button - Always clickable */}
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}  // 👈 Only disabled while processing
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                hasLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer'
              } ${isLiking ? 'opacity-50 cursor-wait' : ''}`}
              style={{ fontFamily: FONTS.openSans }}
              title={hasLiked ? 'Click to unlike' : 'Like this case study'}
            >
              {hasLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}