"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react"; 

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#850000";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const LG_BREAKPOINT = 1024; 

const services = [
  {
    title: "Customer Support Outsourcing",
    imageSrc: "/images/services1.jpg",
    isHighlight: false,
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Technical Helpdesk",
    imageSrc: "/images/services2.jpg",
    isHighlight: true,
    icon: (
      <>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
  },
  {
    title: "Sales & Lead Generation",
    imageSrc: "/images/services3.jpg",
    isHighlight: false,
    icon: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
  },
  {
    title: "Virtual Assistance",
    imageSrc: "/images/services4.jpg",
    isHighlight: false,
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
  },
  {
    title: "Back Office Operations",
    imageSrc: "/images/services5.jpg",
    isHighlight: false,
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
  },
  {
    title: "Social Media Management",
    imageSrc: "/images/services6.jpg",
    isHighlight: false,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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

  const contentCardClasses = isCarousel
    ? 'p-4 -bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%]' 
    : 'p-5 -bottom-6 left-20 -right-6'; 

  const iconCircleClasses = isCarousel ? 'w-14 h-14 -top-3 -right-3' : 'w-16 h-16 -top-3 -right-3';
  const iconSizeClasses = isCarousel ? 'w-6 h-6' : 'w-7 h-7';

  return (
    <div className={`relative group ${isCarousel ? 'px-1' : ''}`}>
      <div className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
        <div className="relative w-full aspect-[4/3]">
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

const ViewAboutUsButton = () => (
    <div className="flex justify-center mt-12 md:mt-16">
        <a 
          href="#"
          className="flex items-center gap-3 group" 
        >
            <button
                className="flex items-center justify-center w-11 h-11 rounded-full text-white transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: DARK_RED }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = HOVER_DARK_RED)
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = DARK_RED)
                }
            >
                <ArrowUpRight className="w-5 h-5 rotate-[15deg]" /> 
            </button>
            <p className="text-gray-900 font-open-sans-bold text-lg transition-colors group-hover:text-gray-700">
                View About Us
            </p>
        </a>
    </div>
);


function ServicesGrid() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    setIsLargeScreen(mediaQuery.matches);

    const handleResize = () => {
      setIsLargeScreen(mediaQuery.matches);
      if (mediaQuery.matches) {
        setCurrentIndex(0);
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (isLargeScreen || !element) return;

    let timeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            const scrollLeft = element.scrollLeft;
            const firstCard = element.children[0];
            const cardWidth = firstCard?.scrollWidth || 1; 

            const newIndex = Math.round(scrollLeft / cardWidth); 
            setCurrentIndex(newIndex);
        }, 150); 
    };

    element.addEventListener('scroll', handleScroll);
    return () => {
        element.removeEventListener('scroll', handleScroll);
        if (timeout) clearTimeout(timeout);
    };
  }, [isLargeScreen]);


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

      <div className="mt-6 md:mt-0 lg:flex items-center gap-4 hidden">
        <button
          className="flex items-center justify-center w-16 h-16 rounded-full text-white transition-all hover:scale-105 shadow-lg"
          style={{ backgroundColor: DARK_RED }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = HOVER_DARK_RED)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = DARK_RED)
          }
        >
          <ArrowUpRight className="w-7 h-7" />
        </button>
        <p className="text-gray-900 font-open-sans-bold text-lg hidden md:block">
          View All Services
        </p>
      </div>
    </div>
  );

  if (isLargeScreen) {
    return (
      <div id="services" className="bg-white py-16"> {/* Added id="services" here */}
        <div className={DEFAULT_MAX_WIDTH_CLASS}>
          {commonHeader}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} isCarousel={false} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="services" className="bg-white py-16"> {/* Added id="services" here for consistency across screen sizes */}
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
        {commonHeader}
      </div>

      <div className="relative overflow-hidden">
        
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll snap-x snap-mandatory pb-8 hide-scrollbar md:px-6" 
        >
          {services.map((service, index) => (
            <div 
              key={index} 
              className="w-11/12 sm:w-2/3 md:w-1/2 flex-shrink-0 snap-start px-2" 
            >
              <ServiceCard service={service} isCarousel={true} />
            </div>
          ))}
          <div className="w-4 flex-shrink-0"></div> 
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8"> 
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => {
                setCurrentIndex(index);
                if (scrollRef.current) {
                    const targetCard = scrollRef.current.children[index] as HTMLElement;
                    
                    if (targetCard) {
                        const targetLeft = targetCard.offsetLeft;
                        
                        scrollRef.current.scrollTo({
                            left: targetLeft,
                            behavior: 'smooth',
                        });
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
      
      <ViewAboutUsButton />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          padding-left: 0.5rem; /* Start padding for alignment */
        }
        @media (min-width: 640px) { /* Adjust padding for sm screens */
            .hide-scrollbar {
                padding-left: 1rem; 
            }
        }
      `}</style>
    </div>
  );
}

export default ServicesGrid;