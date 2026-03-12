"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Headphones,
  Monitor,
  TrendingUp,
  UserCheck,
  Briefcase,
  Share2,
  Layout,
  Loader2,
  AlertCircle,
  PackageSearch,
  Calendar,
  BookOpen,
  Users,
  Mail,
  Filter,
  Tag,
  FileText,
  Code,
  Plus,
} from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

// API URL - defaults to relative path which will be proxied by Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Icon mapping based on serviceId
const ICON_MAP: Record<string, any> = {
  "ai-builder": PackageSearch,
  "automation": Monitor,
  "booking-appointment": Calendar,
  "courses-products": BookOpen,
  "crm": Users,
  "csr": Headphones,
  "email-marketing": Mail,
  "funnel-builder": Filter,
  "gray-label": Tag,
  "social-media-management": Share2,
  "survey-forms": FileText,
  "tech-support": Monitor,
  "web-development": Code,
};

// Fallback images based on serviceId
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
  description: string;
  icon: any;
  image: string;
  bgColor: string;
  textColor: string;
  isDark: boolean;
  isActive: boolean;
  coverPhoto?: string | null;
  inactivePhoto?: string | null;
}

const ServiceCard: React.FC<{
  service: ServiceType;
  index: number;
}> = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = service.icon;

  // Use native <img> for base64 data URLs and external http/https URLs (e.g. Cloudinary).
  // next/image requires external hostnames to be whitelisted in next.config.ts —
  // using <img> avoids that requirement entirely for dynamically-sourced images.
  const isBase64Image = service.image.startsWith('data:image');
  const isExternalUrl = service.image.startsWith('http://') || service.image.startsWith('https://');

  return (
    <div
      className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] h-full"
      style={{ backgroundColor: service.bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background: service.isDark
            ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)"
            : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 100%)",
        }}
      />

      <div className="relative h-72 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-[1]" />
        {(isBase64Image || isExternalUrl) ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading={index < 2 ? "eager" : "lazy"}
          />
        ) : (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={index < 2}
          />
        )}

        <div
          className="absolute top-6 right-6 z-[2] p-4 rounded-2xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{
            backgroundColor: service.isDark
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.08)",
            border: service.isDark
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <IconComponent
            className="w-7 h-7"
            style={{
              color: service.isDark ? COLORS.white : COLORS.primary,
            }}
          />
        </div>
      </div>

      <div className="relative p-8 z-[2]">
        <div
          className="w-16 h-1 rounded-full mb-5 transition-all duration-500 group-hover:w-24"
          style={{
            backgroundColor: COLORS.primary,
          }}
        />

        <h3
          className={`${FONT_CLASSES.openSansBold} text-2xl mb-4 transition-colors duration-300`}
          style={{ color: service.textColor }}
        >
          {service.title}
        </h3>

        <p
          className={`${FONT_CLASSES.rubikRegular} text-base leading-relaxed`}
          style={{
            color: service.isDark ? "#d1d5db" : "#4b5563",
          }}
        >
          {service.description}
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"
        style={{ backgroundColor: COLORS.primary }}
      />
    </div>
  );
};

const CarouselPagination: React.FC<{
  services: ServiceType[];
  activeIndex: number;
  scrollTo: (index: number) => void;
}> = ({ services, activeIndex, scrollTo }) => {
  return (
    <div className="flex justify-center mt-8 space-x-3">
      {services.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={`h-2.5 rounded-full transition-all duration-300 ease-out hover:opacity-100 ${
            index === activeIndex
              ? "w-8 opacity-100"
              : "bg-gray-300 w-2.5 opacity-50 hover:opacity-70"
          }`}
          style={{
            backgroundColor: index === activeIndex ? COLORS.primary : undefined,
          }}
          aria-label={`Go to service ${index + 1}`}
        />
      ))}
    </div>
  );
};

const ServiceCarousel: React.FC<{ services: ServiceType[] }> = ({
  services,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth =
        scrollRef.current.querySelector(":scope > div")?.clientWidth || 1;

      const newIndex = Math.round(scrollLeft / (itemWidth + 16));
      if (newIndex !== activeIndex) setActiveIndex(newIndex);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const itemWidth =
        scrollRef.current.querySelector(":scope > div")?.clientWidth || 1;
      scrollRef.current.scrollTo({
        left: index * (itemWidth + 16),
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex snap-x snap-mandatory overflow-x-scroll overflow-y-visible space-x-4 px-4 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {services.map((service, index) => (
          <div key={service._id} className="flex-shrink-0 w-full snap-start">
            <ServiceCard service={service} index={index} />
          </div>
        ))}
      </div>
      <CarouselPagination
        services={services}
        activeIndex={activeIndex}
        scrollTo={scrollTo}
      />
    </>
  );
};

export default function ServiceFeatures() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to process image source
  const getImageSource = (
    coverPhoto: string | null | undefined,
    inactivePhoto: string | null | undefined,
    isActive: boolean,
    serviceId: string
  ): string => {
    // Pick which photo to use based on active status
    const photo = isActive ? coverPhoto : (inactivePhoto ?? coverPhoto);

    console.log(`🔍 Processing image for ${serviceId}:`, {
      isActive,
      hasCoverPhoto: !!coverPhoto,
      hasInactivePhoto: !!inactivePhoto,
      usingPhoto: isActive ? 'coverPhoto' : 'inactivePhoto (fallback: coverPhoto)',
      photoLength: photo?.length,
      photoPreview: photo?.substring(0, 50)
    });

    // If photo exists and is a valid string
    if (photo && typeof photo === 'string' && photo.trim()) {
      const trimmedPhoto = photo.trim();
      
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

  // Determine background styling based on index (alternating pattern)
  const getServiceStyling = (index: number) => {
    // Pattern: white, dark, dark, white, white, dark
    const darkPattern = [1, 2, 5]; // indices that should be dark
    const isDark = darkPattern.includes(index % 6);
    
    return {
      bgColor: isDark ? COLORS.dark : COLORS.white,
      textColor: isDark ? COLORS.white : COLORS.black,
      isDark: isDark,
    };
  };

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${API_BASE_URL}/api/services`;
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

      // Map database fields to component structure
      const mappedData = data.map((item: any, index: number) => {
        console.log(`\n📦 Mapping service: ${item.serviceId}`);
        console.log('Raw item:', JSON.stringify(item, null, 2));
        
        const imageSource = getImageSource(item.coverPhoto, item.inactivePhoto, item.isActive, item.serviceId);
        const styling = getServiceStyling(index);
        
        return {
          _id: item._id,
          serviceId: item.serviceId,
          title: item.name.toUpperCase(), // Match original format
          description: item.description,
          icon: ICON_MAP[item.serviceId] || Layout,
          image: imageSource,
          isActive: item.isActive,
          coverPhoto: item.coverPhoto,
          inactivePhoto: item.inactivePhoto,
          ...styling,
        };
      });

      // Sort: active services first, then inactive
      const sortedData = [...mappedData].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));

      console.log('\n📊 Final mapped services:', sortedData);
      setServices(sortedData);
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

  return (
    <section
      className="py-20 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-50 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span
              className={`${FONT_CLASSES.openSansBold} text-sm uppercase tracking-[0.25em] px-6 py-2 rounded-full inline-block`}
              style={{
                color: COLORS.primary,
              }}
            >
              — OUR SERVICES
            </span>
          </div>
          <h2
            className={`${FONT_CLASSES.openSansBold} text-3xl md:text-4xl lg:text-5xl mb-4`}
            style={{ color: COLORS.black }}
          >
            Services Designed to
            <br />
            <span style={{ color: COLORS.primary }}>Meet Every Need</span>
          </h2>
          <p
            className={`${FONT_CLASSES.rubikRegular} text-lg text-gray-600 max-w-2xl mx-auto`}
          >
            From customer support to technical assistance, we provide
            comprehensive solutions that drive your business forward
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: COLORS.primary }} />
            <p className={`${FONT_CLASSES.rubikRegular} text-gray-500 animate-pulse`}>
              Loading our services...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className={`${FONT_CLASSES.openSansBold} text-gray-800 text-xl mb-2`}>
              Something went wrong
            </p>
            <p className={`${FONT_CLASSES.rubikRegular} text-gray-500 mb-6`}>
              {error}
            </p>
            <button 
              onClick={fetchServices}
              className={`${FONT_CLASSES.openSansBold} px-6 py-3 rounded-full text-white transition-all hover:scale-105`}
              style={{ backgroundColor: COLORS.primary }}
            >
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className={`${FONT_CLASSES.openSansBold} text-gray-800 text-xl mb-2`}>
              No services available
            </p>
            <p className={`${FONT_CLASSES.rubikRegular} text-gray-500`}>
              Check back soon for updates
            </p>
          </div>
        ) : (
          <>
            <div className="lg:hidden pb-2 overflow-visible">
              <ServiceCarousel services={services} />
            </div>

            <div className="hidden lg:block">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
                {(showAll ? services : services.slice(0, 2)).map((service, index) => (
                  <ServiceCard key={service._id} service={service} index={index} />
                ))}
              </div>

              {services.length > 2 && (
                <div className="w-full flex justify-center mt-12 mb-6">
                  <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-10 sm:px-14 py-4 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    <span className="text-[13px] sm:text-[14px] tracking-widest uppercase font-medium">
                      {showAll ? "show less" : "show all services"}
                    </span>
                    <Plus
                      size={18}
                      className={`transition-transform duration-300 ${showAll ? "rotate-45" : "group-hover:rotate-90"}`}
                    />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}