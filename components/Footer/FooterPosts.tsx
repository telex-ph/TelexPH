import React from "react";
import Image from "next/image";
import Link from "next/link";

const FooterPosts: React.FC = () => {
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

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="font-poppins-black mb-2 text-sm sm:text-base text-white">
          Popular Post
        </h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto sm:mx-0">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.link}
            {...(post.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer block"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-[#a10000]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 sm:p-4 flex flex-col justify-between">
              <div className="flex justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#a10000]"
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

              <div className="text-white px-1 sm:px-0 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-xs sm:text-sm lg:text-base font-open-sans-bold leading-tight">
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
