"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react"; 
import ComingSoonModal from "@/components/Modals/ComingSoonModal"; // Adjust path as needed (e.g., '@/components/modals/ComingSoonModal')

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#850000";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

const services = [
  {
    title: "Customer Support Outsourcing",
    imageSrc: "/images/services1.webp",
    isHighlight: false,
    icon: (
      <>
        <path d="M20 7h-4a2 2 0 0 1-2-2V3M4 7h4a2 2 0 0 0 2-2V3" />
        <path d="M12 12h.01" />
        <path d="M12 8h.01" />
        <path d="M12 16h.01" />
      </>
    ),
  },
  {
    title: "Technical Helpdesk",
    imageSrc: "/images/services2.webp",
    isHighlight: true,
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
  {
    title: "Sales & Lead Generation",
    imageSrc: "/images/services3.webp",
    isHighlight: false,
    icon: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  {
    title: "Virtual Assistance",
    imageSrc: "/images/services4.webp",
    isHighlight: false,
    icon: (
      <>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </>
    ),
  },
  {
    title: "Back Office Operations",
    imageSrc: "/images/services5.webp",
    isHighlight: false,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </>
    ),
  },
  {
    title: "Social Media Management",
    imageSrc: "/images/services6.webp",
    isHighlight: false,
    icon: (
      <>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </>
    ),
  },
];

type ServiceType = typeof services[0];

const ServiceCard = ({ 
  service, 
  isCarousel = false 
}: { 
  service: ServiceType; 
  isCarousel?: boolean; 
}) => {
  const isHighlighted = service.isHighlight;

  const imageContainerClasses = isCarousel 
    ? 'relative w-full h-56 lg:h-64 sm:h-64' 
    : 'relative w-full h-64 sm:h-72'; 

  const contentCardClasses = isCarousel
    ? 'p-4 -bottom-6 left-1/2 transform -translate-x-1/2 w-[95%]' 
    : 'p-5 -bottom-6 left-20 -right-6'; 

  const iconCircleClasses = isCarousel ? 'w-14 h-14 -top-3 -right-3' : 'w-16 h-16 -top-3 -right-3';
  const iconSizeClasses = isCarousel ? 'w-6 h-6' : 'w-7 h-7';

  return (
    <div className="relative group h-full"> 
      <div className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
        <div className={imageContainerClasses}>
          <Image
            src={service.imageSrc}
            alt={service.title}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
            stroke={DARK_RED}
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
        <a
          href="#"
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
        </a>
      </div>
    </div>
  );
};

// Updated ViewAllServicesButton: Now accepts onClick prop for modal
interface ViewAllServicesButtonProps {
  isLargeScreenHeader?: boolean;
  onClick?: () => void; // New prop for opening modal
}

const ViewAllServicesButton: React.FC<ViewAllServicesButtonProps> = ({ 
  isLargeScreenHeader = false, 
  onClick 
}) => (
  <div className={`${isLargeScreenHeader ? 'hidden lg:flex' : 'flex justify-center mt-12 md:mt-16 lg:hidden'}`}>
    <a 
      href="#"
      onClick={(e) => {
        e.preventDefault(); // Prevent default link behavior
        onClick?.(); // Trigger modal open
      }}
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
    </a>
  </div>
);

function ServicesGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modal handlers (same as CompanyDetails)
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
  }, []);

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

      {/* Pass onClick to open modal */}
      <ViewAllServicesButton isLargeScreenHeader={true} onClick={openModal} />
    </div>
  );

  return (
    <div id="services" className="bg-white py-16">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {commonHeader}
      </div>
      <div className={`${DEFAULT_MAX_WIDTH_CLASS} hidden lg:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} isCarousel={false} />
          ))}
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll snap-x snap-mandatory pb-8 px-4 space-x-4 hide-scrollbar" 
          >
            {services.map((service, index) => (
              <div 
                key={index} 
                className="w-[85vw] sm:w-[60vw] md:w-[45vw] flex-shrink-0 snap-start" 
              >
                <ServiceCard service={service} isCarousel={true} />
              </div>
            ))}
          </div>
        </div>
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
        {/* Pass onClick to open modal */}
        <ViewAllServicesButton isLargeScreenHeader={false} onClick={openModal} />
      </div> 

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      {/* Render the Modal (Services-specific content) */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Our Services Are on the Way!"
        message="Thank you for visiting TelexPH. We're currently putting the finishing touches on our full services page to give you detailed insights. Stay tuned - it'll be live very soon!"
        // backgroundImageSrc="/images/background.jpg" // Optional: Add if you want a background image like in your original ServicesModal
      />
    </div>
  );
}

export default ServicesGrid;