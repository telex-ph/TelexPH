"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import DetailsHeader from "../components/DetailsHeader"; 
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaLink,
  FaFilePdf
} from "react-icons/fa";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { COLORS, FONTS, getColorWithOpacity } from "@/constant/styles";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com';

// Hardcoded content data (original)
const HARDCODED_CONTENT_DATA: Record<string, any> = {
  "6": {
    challenge: "Rapidly changing geopolitical landscapes and fragmented port data made it impossible for shippers to predict freight rate fluctuations.",
    solution: "C.H. Robinson aggregated data from over 500 ports and 2,000 carrier contracts to create a transparent, real-time market visibility framework.",
    resultsSummary: [
      "Accurate rate forecasting",
      "Early risk detection",
      "Competitive benchmarking",
      "Strengthened supply resilience"
    ],
    body: [
      { 
        title: "Navigating the New Global Trade Era", 
        text: "The global trade landscape in early 2026 is no stranger to the volatility of energy costs and shifting international regulations. For years, companies operated with a reactive mindset—adjusting to port congestions and rate hikes only after they occurred. However, as trade corridors expanded and regional complexities grew, this status quo became unsustainable. Shippers started experiencing massive operational bottlenecks because they lacked a single source of truth for market data." 
      },
      { 
        title: "Recognizing the Need for Data Transparency", 
        text: "As portfolios grew in size, the absence of integrated technology left procurement teams dependent on manual tracking and anecdotal market reports. This hindered the ability to respond swiftly to geopolitical shifts or optimize logistics across multiple global sites. They needed a smarter, more scalable way to manage market intelligence. Recognizing this need, the firm shifted towards a data-driven approach, ultimately leveraging C.H. Robinson's analytical powerhouse to address the next phase of their trade strategy." 
      },
      { 
        title: "Aggregated Intelligence and Real-Time Visibility", 
        text: "Once the data framework was implemented, C.H. Robinson took decisive action. By centralizing data from thousands of carrier contracts and global port authorities, the system shifted control back to the shipper. The transportation management system now enables seamless market entry, comprehensive risk reporting, and streamlined lane analysis all in one place. This integrated technology allows teams to see performance issues before they impact the bottom line." 
      },
      { 
        title: "Overcoming Market Setbacks with Innovation", 
        text: "The first real test came when sudden regulatory changes in Southeast Asian ports threatened to derail Q1 budgets. Using the new Market Trends framework, the firm was able to establish a dedicated mitigation strategy within 48 hours. Onsite experts and data scientists coordinated to re-route critical shipments, sorting through compliant and non-compliant carriers. This proactive response turned a potential financial setback into an opportunity for operational excellence." 
      },
      { 
        title: "Strategic Results and Long-term Empowerment", 
        text: "The newfound transparency led to profound results. Projects saw cost savings, reduced risk, and smoother operations across the board. The strong relationship between data and execution meant better forecasting for project needs and resources. C.H. Robinson didn't just meet expectations; they redefined what success looks like for global trade logistics in 2026." 
      }
    ]
  }
};

// API fetch function
async function getCaseStudyById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/casestudies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch case study');
    return response.json();
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}

function CaseStudyDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "6";
  
  const [study, setStudy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiData, setIsApiData] = useState(false);
  
  // ✅ NEW: Like/Unlike States
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function loadCaseStudy() {
      setIsLoading(true);
      
      // Check if ID is a hardcoded one (numeric string < 10)
      const isHardcoded = !isNaN(Number(id)) && Number(id) < 100;
      
      if (isHardcoded && HARDCODED_CONTENT_DATA[id]) {
        // Use hardcoded data
        setStudy(HARDCODED_CONTENT_DATA[id]);
        setIsApiData(false);
      } else {
        // Fetch from API (MongoDB ID format)
        const apiData = await getCaseStudyById(id);
        
        if (apiData) {
          // ✅ Transform API data to match expected format
          const transformedStudy = {
            // Extract challenge text - API returns array of {title, text}
            challenge: Array.isArray(apiData.challenge) && apiData.challenge.length > 0
              ? apiData.challenge.map((c: any) => c.text).join(" ")
              : "No challenge information available.",
            
            // Extract solution text - API returns array of {title, text}
            solution: Array.isArray(apiData.solution) && apiData.solution.length > 0
              ? apiData.solution.map((s: any) => s.text).join(" ")
              : "No solution information available.",
            
            // Create results summary from solution titles
            resultsSummary: Array.isArray(apiData.solution) && apiData.solution.length > 0
              ? apiData.solution.map((s: any) => s.title)
              : ["Results not available"],
            
            // Transform sections array to body format
            body: Array.isArray(apiData.sections) && apiData.sections.length > 0
              ? apiData.sections.map((section: any) => ({
                  title: section.subtitle || "",
                  text: section.text || ""
                }))
              : [
                  {
                    title: apiData.title || "Case Study",
                    text: "Content not available."
                  }
                ]
          };
          
          setStudy(transformedStudy);
          setIsApiData(true);
          
          // ✅ NEW: Initialize like count and check status
          setLikesCount(apiData.likesCount || 0);
          checkLikeStatus();
        } else {
          // Fallback to default hardcoded data
          setStudy(HARDCODED_CONTENT_DATA["6"]);
          setIsApiData(false);
        }
      }
      
      setIsLoading(false);
    }

    loadCaseStudy();
  }, [id]);

  // ✅ NEW: Check if user has liked this case study
  const checkLikeStatus = async () => {
    if (!isApiData) return; // Only check for API data
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/casestudies/${id}/like-status`);
      const data = await response.json();
      setHasLiked(data.hasLiked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  // ✅ NEW: Handle like/unlike toggle
  const handleLikeToggle = async () => {
    if (isLiking || !isApiData) return; // Prevent multiple clicks and only work with API data
    
    setIsLiking(true);
    
    try {
      const url = `${API_BASE_URL}/api/casestudies/${id}/like`;
      const method = hasLiked ? 'DELETE' : 'POST';
      
      const response = await fetch(url, { method });
      const data = await response.json();
      
      if (response.ok) {
        setLikesCount(data.likesCount);
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

  const handlePrintPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 font-bold text-[18px]" style={{ fontFamily: FONTS.poppins }}>LOADING CASE STUDY...</p>
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-bold text-[24px]" style={{ fontFamily: FONTS.poppins, color: COLORS.primary }}>
            Case Study Not Found
          </p>
          <Link href="/resources" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden">
        <DetailsHeader />
      </div>

      <main className="w-full px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white">
          
          <div className="lg:col-span-8">
            <article className="space-y-12">
              {study.body.map((item: any, idx: number) => (
                <div key={idx} className="break-inside-avoid">
                  {item.title && (
                    <h2 
                      className="text-2xl font-bold uppercase mb-6" 
                      style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
                    >
                      {item.title}
                    </h2>
                  )}
                  <p 
                    className="leading-relaxed mb-8 text-[18px]"
                    style={{ 
                      fontFamily: FONTS.rubik, 
                      color: getColorWithOpacity("dark", 0.7) 
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </article>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f9f9f9] p-10 border-l-4" style={{ borderColor: COLORS.primary }}>
              <h3 
                className="text-xl font-bold uppercase mb-4" 
                style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
              >
                Challenge
              </h3>
              <p 
                style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.8) }}
                className="leading-relaxed"
              >
                {study.challenge}
              </p>
            </div>

            <div className="bg-[#f9f9f9] p-10 border-l-4" style={{ borderColor: COLORS.primary }}>
              <h3 
                className="text-xl font-bold uppercase mb-4" 
                style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
              >
                Solution
              </h3>
              <p 
                style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.8) }}
                className="leading-relaxed"
              >
                {study.solution}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 print:hidden">
          <button 
            onClick={handlePrintPDF}
            className="flex items-center gap-3 text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md text-[13px]"
            style={{ backgroundColor: COLORS.primary, fontFamily: FONTS.poppins }}
          >
            <FaFilePdf size={18} />
            Download PDF
          </button>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 20mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .lg\:col-span-8 { width: 65% !important; float: left !important; }
          .lg\:col-span-4 { width: 30% !important; float: right !important; }
          .grid { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function CaseStudiesCardDetailsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-white font-bold text-[24px]">
        LOADING...
      </div>
    }>
      <CaseStudyDetailsContent />
    </Suspense>
  );
}