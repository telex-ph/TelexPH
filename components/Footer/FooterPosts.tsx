import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FooterPosts: React.FC = () => {
  const [activePost, setActivePost] = useState<number | null>(null);

  const posts = [
    {
      id: 1,
      image: "/images/post1.webp",
      title: "Book a Free Consultation",
      link: "https://hiretelex.com/scale-with-telex",
      external: true,
    },
    {
      id: 2,
      image: "/images/post2.webp",
      title: "Learn About Our Services",
      link: "/services",
      external: false,
    },
    {
      id: 3,
      image: "/images/post3.webp",
      title: "Discover Client Testimonials",
      link: "/services#service-testimonials",
      external: false,
    },
    {
      id: 4,
      image: "/images/post4.webp",
      title: "Get to Know TelexPH",
      link: "/about",
      external: false,
    },
  ];

  const handleClick = (e: React.MouseEvent, postId: number) => {
    // Detect if device has touch capability (mobile/tablet)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      // On touch devices, first click shows overlay, second click goes to link
      if (activePost !== postId) {
        e.preventDefault();
        setActivePost(postId);
      }
      // If activePost === postId, let the link navigate normally
    }
    // On desktop, just navigate normally (hover handles the overlay)
  };

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="mb-6">
        <h3 className="font-poppins-black mb-2 text-base text-white">
          Popular Post
        </h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 w-full">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.link}
            {...(post.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={(e) => handleClick(e, post.id)}
            className="
              relative 
              aspect-[3/2] sm:aspect-square
              max-h-40 sm:max-h-none
              rounded-lg 
              overflow-hidden 
              group 
              cursor-pointer 
              block 
              transition-transform 
              duration-500 
              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay - shows on hover (desktop) or when active (mobile) */}
            <div className={`
              absolute 
              inset-0 
              bg-[#a10000]/80 
              transition-opacity 
              duration-300 
              p-2 sm:p-3 md:p-3 lg:p-4
              flex 
              flex-col 
              justify-between
              ${activePost === post.id ? 'opacity-100' : 'opacity-0'}
              group-hover:opacity-100
            `}>
              <div className="flex justify-start">
                <div className={`
                  w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10
                  bg-white 
                  rounded-full 
                  flex 
                  items-center 
                  justify-center 
                  transform 
                  transition-transform 
                  duration-300
                  ${activePost === post.id ? 'scale-100' : 'scale-0'}
                  group-hover:scale-100
                `}>
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[#a10000]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>

              <div className={`
                text-white 
                transform 
                transition-all 
                duration-300
                ${activePost === post.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
                group-hover:translate-y-0 
                group-hover:opacity-100
              `}>
                <p className="
                  text-[10px] sm:text-[11px] md:text-xs lg:text-base
                  font-open-sans-bold 
                  leading-tight
                ">
                  {post.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterPosts;