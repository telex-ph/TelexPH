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
} from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

const services = [
  {
    title: "CUSTOMER SUPPORT OUTSOURCING",
    description:
      "Deliver exceptional customer experiences through voice, chat, and email channels. Our trained agents provide prompt, friendly, and knowledgeable assistance that strengthens your brand and builds customer loyalty—available 24/7 to keep your business running smoothly.",
    icon: Headphones,
    image: "/images/services1.webp",
    bgColor: COLORS.white,
    textColor: COLORS.black,
    isDark: false,
  },
  {
    title: "TECHNICAL HELPDESK",
    description:
      "We keep your systems running and your customers connected. Our experienced technical support specialists handle software troubleshooting, hardware issues, and user assistance with efficiency and precision—ensuring your business stays operational without downtime.",
    icon: Monitor,
    image: "/images/services2.webp",
    bgColor: COLORS.dark,
    textColor: COLORS.white,
    isDark: true,
  },
  {
    title: "SALES & LEAD GENERATION",
    description:
      "Accelerate your revenue growth with data-driven sales and lead generation campaigns. Our expert agents connect you with qualified leads, nurture prospects, and close deals, helping you achieve consistent growth and measurable ROI.",
    icon: TrendingUp,
    image: "/images/services3.webp",
    bgColor: COLORS.dark,
    textColor: COLORS.white,
    isDark: true,
  },
  {
    title: "VIRTUAL ASSISTANCE",
    description:
      "Focus on what matters most while we handle the rest. Our virtual assistants manage administrative tasks, calendar scheduling, research, and communication support, ensuring productivity and organization at every level of your business.",
    icon: UserCheck,
    image: "/images/services4.webp",
    bgColor: COLORS.white,
    textColor: COLORS.black,
    isDark: false,
  },
  {
    title: "BACK OFFICE OPERATIONS",
    description:
      "Simplify your back-end operations through efficient outsourcing. From data entry, payroll, and accounting to HR support and documentation, our team ensures accuracy, speed, and confidentiality—so you can focus on strategy and innovation.",
    icon: Briefcase,
    image: "/images/services5.webp",
    bgColor: COLORS.white,
    textColor: COLORS.black,
    isDark: false,
  },
  {
    title: "SOCIAL MEDIA MANAGEMENT",
    description:
      "Enhance your digital presence with creative content and smart marketing strategies. We handle your social media platforms, audience engagement, and brand storytelling to keep your business visible, relevant, and competitive online.",
    icon: Share2,
    image: "/images/services6.webp",
    bgColor: COLORS.dark,
    textColor: COLORS.white,
    isDark: true,
  },
];

const ServiceCard: React.FC<{
  service: (typeof services)[0];
  index: number;
}> = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = service.icon;

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
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={index < 2}
        />

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
  services: typeof services;
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

const ServiceCarousel: React.FC<{ services: typeof services }> = ({
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
          <div key={index} className="flex-shrink-0 w-full snap-start">
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

        <div className="lg:hidden pb-2 overflow-visible">
          <ServiceCarousel services={services} />
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
