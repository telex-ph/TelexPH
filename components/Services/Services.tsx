"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#850000";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

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

const ServiceCard = ({ service }: { service: ServiceType }) => {
  const isHighlighted = service.isHighlight;

  return (
    <div className="relative group">
      {/* Main image container with rounded corners */}
      <div className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={service.imageSrc}
            alt={service.title}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          />
        </div>
      </div>

      {/* Content card */}
      <div
        className="absolute -bottom-6 left-20 -right-6 rounded-xl p-5 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden"
        style={{
          backgroundColor: isHighlighted ? DARK_RED : "#fff",
        }}
      >
        {/* Decorative circle with icon */}
        <div
          className="absolute -top-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isHighlighted
              ? "#fff"
              : "rgba(254, 226, 226, 0.5)",
          }}
        >
          <svg
            className="w-7 h-7"
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
              className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
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

function ServicesGrid() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className={DEFAULT_MAX_WIDTH_CLASS}>
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
          <div className="mt-6 md:mt-0 flex items-center gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesGrid;
