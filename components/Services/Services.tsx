"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Headphones, 
  Monitor, 
  TrendingUp, 
  UserCheck, 
  Briefcase, 
  Share2, 
  Layout, 
  Loader2,
  AlertCircle 
} from "lucide-react";

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#850000";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// API URL - defaults to relative path which will be proxied by Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// --- Types & Mappings ---

// Mapping icons based on serviceId from your database/seed file
const ICON_MAP: Record<string, React.ReactNode> = {
  "ai-builder": (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
      <polyline points="7.5 19.79 7.5 14.6 3 12" />
      <polyline points="21 12 16.5 14.6 16.5 19.79" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </>
  ),
  "automation": (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  "booking-appointment": (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  "courses-products": (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  "crm": (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  "csr": (
    <>
      <path d="M20 7h-4a2 2 0 0 1-2-2V3M4 7h4a2 2 0 0 0 2-2V3" />
      <path d="M12 12h.01" />
      <path d="M12 8h.01" />
      <path d="M12 16h.01" />
    </>
  ),
  "email-marketing": (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  "funnel-builder": (
    <>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </>
  ),
  "gray-label": (
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>
  ),
  "social-media-management": (
    <>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </>
  ),
  "survey-forms": (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </>
  ),
  "tech-support": (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  "web-development": (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
};

// Updated IMAGE_MAP to match the serviceIds in seed-services.ts
const IMAGE_MAP: Record<string, string> = {
  "ai-builder": "/images/services1.webp",
  "automation": "/images/services2.webp",
  "booking-appointment": "/images/services3.webp",
  "courses-products": "/images/services4.webp",
  "crm": "/images/services5.webp",
  "csr": "/images/services6.webp",
  "email-marketing": "/images/services1.webp",
  "funnel-builder": "/images/services2.webp",
  "gray-label": "/images/services3.webp",
  "social-media-management": "/images/services4.webp",
  "survey-forms": "/images/services5.webp",
  "tech-support": "/images/services6.webp",
  "web-development": "/images/services1.webp",
};

interface ServiceType {
  _id: string;
  serviceId: string; 
  title: string;
  imageSrc: string;
  isHighlight: boolean;
  icon: React.ReactNode;
  description: string;
  coverPhoto?: string | null;
}

const ServiceCard = ({ 
  service, 
  isCarousel = false,
  index = 0
}: { 
  service: ServiceType; 
  isCarousel?: boolean;
  index?: number;
}) => {
  const isHighlighted = service.isHighlight;
  // First 3 images should load eagerly for LCP optimization
  const shouldPrioritize = index < 3;

  const imageContainerClasses = isCarousel 
    ? 'relative w-full h-56 lg:h-64 sm:h-64' 
    : 'relative w-full h-64 sm:h-72'; 

  const contentCardClasses = isCarousel
    ? 'p-4 -bottom-6 left-1/2 transform -translate-x-1/2 w-[95%]' 
    : 'p-5 -bottom-6 left-20 -right-6'; 

  const iconCircleClasses = isCarousel ? 'w-14 h-14 -top-3 -right-3' : 'w-16 h-16 -top-3 -right-3';
  const iconSizeClasses = isCarousel ? 'w-6 h-6' : 'w-7 h-7';

  // Determine if using base64 image
  const isBase64Image = service.imageSrc.startsWith('data:image');

  return (
    <div className="relative group h-full"> 
      <div className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
        <div className={imageContainerClasses}>
          {isBase64Image ? (
            // For base64 images, use img tag instead of Next Image
            <img
              src={service.imageSrc}
              alt={service.title}
              className="w-full h-full object-cover"
              loading={shouldPrioritize ? "eager" : "lazy"}
            />
          ) : (
            <Image
              src={service.imageSrc}
              alt={service.title}
              fill
              className="object-cover"
              priority={shouldPrioritize}
              loading={shouldPrioritize ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </div>

      <div
        className={`absolute rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden ${contentCardClasses}`}
        style={{
          backgroundColor: isHighlighted ? DARK_RED : "#fff",
        }}
      >
        <div
          className={`absolute rounded-full flex items-center justify-center ${iconCircleClasses}`}
          style={{
            backgroundColor: isHighlighted
              ? "#fff"
              : "rgba(254, 226, 226, 0.5)",
          }}
        >
          <svg
            className={`${iconSizeClasses}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isHighlighted ? DARK_RED : DARK_RED}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {service.icon}
          </svg>
        </div>

        <h3
          className="text-base font-open-sans-bold mb-2.5 leading-tight"
          style={{ color: isHighlighted ? "#fff" : "#374151" }}
        >
          {service.title}
        </h3>
        <Link
          href="/services"
          className="flex items-center text-sm font-rubik-regular transition-colors gap-1.5 group/link"
        >
          <span
            className="p-1 rounded flex items-center justify-center transition-colors"
            style={{
              backgroundColor: isHighlighted
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(254, 226, 226, 0.5)",
            }}
          >
            <ArrowUpRight
              className="w-4 h-4 transition-transform rotate-[15deg] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              style={{ color: isHighlighted ? "#fff" : DARK_RED }}
            />
          </span>
          <span
            className="font-rubik-regular"
            style={{
              color: isHighlighted
                ? "rgba(255, 255, 255, 0.8)"
                : "#9ca3af",
            }}
          >
            Read More
          </span>
        </Link>
      </div>
    </div>
  );
};

interface ViewAllServicesButtonProps {
  isLargeScreenHeader?: boolean;
}

const ViewAllServicesButton: React.FC<ViewAllServicesButtonProps> = ({ 
  isLargeScreenHeader = false
}) => (
  <div className={`${isLargeScreenHeader ? 'hidden lg:flex' : 'flex justify-center mt-12 md:mt-16 lg:hidden'}`}>
    <Link 
      href="/services"
      className={`flex items-center gap-3 group ${isLargeScreenHeader ? 'mt-6 md:mt-0 lg:flex items-center' : ''}`} 
    >
      <button
        className={`flex items-center justify-center rounded-full text-white transition-all hover:scale-105 shadow-lg ${isLargeScreenHeader ? 'w-16 h-16' : 'w-11 h-11'}`}
        style={{ backgroundColor: DARK_RED }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = HOVER_DARK_RED)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = DARK_RED)
        }
      >
        <ArrowUpRight className={`rotate-[15deg] ${isLargeScreenHeader ? 'w-7 h-7' : 'w-5 h-5'}`} /> 
      </button>
      <p className="text-gray-900 font-open-sans-bold text-lg transition-colors group-hover:text-gray-700">
        View All Services
      </p>
    </Link>
  </div>
);

function ServicesGrid() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper function to process image source
  const getImageSource = (coverPhoto: string | null | undefined, serviceId: string): string => {
    console.log(`🔍 Processing image for ${serviceId}:`, {
      hasCoverPhoto: !!coverPhoto,
      coverPhotoLength: coverPhoto?.length,
      coverPhotoPreview: coverPhoto?.substring(0, 50)
    });

    // If coverPhoto exists and is a valid string
    if (coverPhoto && typeof coverPhoto === 'string' && coverPhoto.trim()) {
      const trimmedPhoto = coverPhoto.trim();
      
      // Check if it's already a data URL
      if (trimmedPhoto.startsWith('data:image')) {
        console.log(`✅ Using data URL for ${serviceId}`);
        return trimmedPhoto;
      }
      
      // Check if it looks like base64 (common base64 characters)
      if (trimmedPhoto.match(/^[A-Za-z0-9+/]+={0,2}$/) && trimmedPhoto.length > 100) {
        console.log(`✅ Converting base64 to data URL for ${serviceId}`);
        return `data:image/jpeg;base64,${trimmedPhoto}`;
      }
      
      // Check if it's a regular URL (http/https)
      if (trimmedPhoto.startsWith('http://') || trimmedPhoto.startsWith('https://')) {
        console.log(`✅ Using external URL for ${serviceId}`);
        return trimmedPhoto;
      }
      
      // Check if it's a relative path
      if (trimmedPhoto.startsWith('/')) {
        console.log(`✅ Using relative path for ${serviceId}`);
        return trimmedPhoto;
      }
    }
    
    // Fallback to IMAGE_MAP or default
    const fallbackImage = IMAGE_MAP[serviceId] || "/images/services1.webp";
    console.log(`⚠️ Using fallback image for ${serviceId}:`, fallbackImage);
    return fallbackImage;
  };

  // --- Fetch Data ---
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${API_BASE_URL}/api/services?isActive=true`;
      console.log('🔍 Fetching services from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to load services (${response.status})`);
      }
      
      const data = await response.json();
      console.log('✅ Received services data:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      // Mapping database fields to local component props
      const mappedData = data.map((item: any) => {
        console.log(`\n📦 Mapping service: ${item.serviceId}`);
        console.log('Raw item:', JSON.stringify(item, null, 2));
        
        const imageSource = getImageSource(item.coverPhoto, item.serviceId);
        
        return {
          _id: item._id,
          serviceId: item.serviceId,
          title: item.name,
          description: item.description,
          imageSrc: imageSource,
          coverPhoto: item.coverPhoto,
          // Maintain the highlight design for tech support as requested
          isHighlight: item.serviceId === "tech-support",
          // Dynamic icon lookup based on serviceId
          icon: ICON_MAP[item.serviceId] || <Layout className="w-full h-full" />
        };
      });

      console.log('\n📊 Final mapped services:', mappedData);
      setServices(mappedData);
    } catch (err: any) {
      console.error("❌ Error loading services:", err);
      setError(err.message || "Could not load services at this time");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // --- Carousel Scroll Handler ---
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    if (window.innerWidth >= 1024) return; 

    let timeout: NodeJS.Timeout | null = null;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      const scrollLeft = element.scrollLeft;
      const totalScrollWidth = element.scrollWidth - element.clientWidth;
      const totalItems = services.length;

      if (totalScrollWidth > 0 && totalItems > 1) {
        const scrollPerCard = totalScrollWidth / (totalItems - 1); 
        const newIndex = Math.round(scrollLeft / scrollPerCard);
        setCurrentIndex(Math.min(newIndex, totalItems - 1));
      } else {
        setCurrentIndex(0);
      }
      if (timeout) clearTimeout(timeout);
    }, 150); 
  }, [services.length]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); 

  const commonHeader = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-20">
      <div>
        <p
          className="text-sm font-open-sans-bold mb-3 uppercase tracking-wide flex items-center gap-2"
          style={{ color: DARK_RED }}
        >
          <span className="w-8 h-[2px]" style={{ backgroundColor: DARK_RED }}></span>
          OUR SERVICES
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-5xl font-open-sans-bold text-gray-900 leading-tight max-w-lg">
          Services Designed to Meet Every Need
        </h2>
      </div>

      <ViewAllServicesButton isLargeScreenHeader={true} />
    </div>
  );

  return (
    <div id="services" className="bg-white py-16">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {commonHeader}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#a10000]" />
          <p className="text-gray-500 animate-pulse">Fetching latest services...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-800 font-bold text-xl">Something went wrong</p>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={fetchServices}
            className="px-6 py-2 bg-[#a10000] text-white rounded-full hover:bg-[#850000] transition-all"
          >
            Try Again
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-800 font-bold text-xl">No services available</p>
          <p className="text-gray-500">Check back soon for updates</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className={`${DEFAULT_MAX_WIDTH_CLASS} hidden lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {services.map((service, index) => (
                <ServiceCard key={service._id} service={service} isCarousel={false} index={index} />
              ))}
            </div>
          </div>

          {/* Mobile Carousel View */}
          <div className="block lg:hidden">
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex overflow-x-scroll snap-x snap-mandatory pb-8 px-4 space-x-4 hide-scrollbar" 
              >
                {services.map((service, index) => (
                  <div 
                    key={service._id} 
                    className="w-[85vw] sm:w-[60vw] md:w-[45vw] flex-shrink-0 snap-start" 
                  >
                    <ServiceCard service={service} isCarousel={true} index={index} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pagination Dots */}
            {services.length > 0 && (
              <div className="flex justify-center gap-2 mt-8"> 
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (scrollRef.current) {
                        const cardContainerPaddingLeft = 16; 
                        const targetCard = scrollRef.current.children[index] as HTMLElement;
                        
                        if (targetCard) {
                          scrollRef.current.scrollTo({
                            left: targetCard.offsetLeft - cardContainerPaddingLeft, 
                            behavior: 'smooth',
                          });
                          setCurrentIndex(index);
                        }
                      }
                    }}
                    className={`transition-all duration-300 rounded-full h-2 ${
                      index === currentIndex
                        ? "w-8 shadow-lg shadow-red-300/50 scale-110"
                        : "w-4 hover:bg-gray-400"
                    }`}
                    style={{
                      backgroundColor: index === currentIndex ? DARK_RED : "#e5e7eb",
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <ViewAllServicesButton isLargeScreenHeader={false} />
          </div>
        </>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default ServicesGrid;