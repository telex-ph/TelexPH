"use client";

import React from "react";
import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineEye } from "react-icons/hi2";

export default function BlogsArticle({ post, onBack, onArticleClick }: any) {
  if (!post) return null;

  const latestPosts = [
    { 
      id: "1", 
      title: "Optimizing Last-Mile Delivery Routes For Faster Fulfillment", 
      headline: "Optimizing Last-Mile Delivery Routes For Faster Fulfillment",
      category: "LOGISTICS", 
      author: "Admin User",
      date: "February 06, 2026",
      sub: "efficiency in the last mile is the frontier of modern logistics.",
      img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=100&w=1000" 
    },
    { 
      id: "2", 
      title: "The Role Of Artificial Intelligence In Modern Warehouse Automation", 
      headline: "The Role Of Artificial Intelligence In Modern Warehouse Automation",
      category: "TECH", 
      author: "Tech Specialist",
      date: "February 05, 2026",
      sub: "ai is transforming how we store and move goods globally.",
      img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=100&w=1000" 
    },
    { 
      id: "3", 
      title: "Sustainability In Logistics: Reducing Carbon Footprints In Shipping", 
      headline: "Sustainability In Logistics: Reducing Carbon Footprints In Shipping",
      category: "ECO", 
      author: "Eco Consultant",
      date: "February 04, 2026",
      sub: "the industry is moving towards a greener future with electric fleets.",
      img: "https://images.unsplash.com/photo-1566232392379-afd9298e6a46?q=100&w=1000" 
    }
  ];

  return (
    <div className="bg-white min-h-screen font-['Poppins',_sans-serif] text-gray-900 pb-24">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-50 z-50">
        <div className="bg-[#800000] h-full w-1/4"></div>
      </div>

      <nav className="max-w-[1300px] mx-auto px-6 py-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-gray-400 hover:text-[#800000] transition-all group"
        >
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-[#800000] transition-all">
            <HiOutlineArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-[0.2em]">back to journal</span>
        </button>
      </nav>

      <article>
        <header className="max-w-[900px] mx-auto px-6 text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-[#800000] text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1 bg-[#800000]/5 rounded-full">
              {post.category || "Insight"}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-gray-400 text-[11px] font-medium uppercase tracking-[0.1em]">5 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight">
            {post.headline || post.title}
          </h1>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-400 text-[14px]">
              By <span className="text-gray-900 font-bold">{post.author || "Admin User"}</span>
            </p>
            <p className="text-gray-400 text-[12px] uppercase tracking-widest">
              Published on {post.date || "February 09, 2026"}
            </p>
          </div>
        </header>
        <section className="max-w-[1400px] mx-auto px-6 mb-20">
          <div className="w-full aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl bg-gray-100">
            <img 
              src={post.img.replace("w=200", "w=1500")} 
              className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105" 
              alt="featured content" 
            />
          </div>
        </section>


        <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">

          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-10">
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest rotate-180 [writing-mode:vertical-lr]">Share Article</p>
                <div className="flex flex-col gap-4 text-gray-400">
                   <span className="hover:text-[#800000] cursor-pointer text-[12px] font-bold">IN</span>
                   <span className="hover:text-[#800000] cursor-pointer text-[12px] font-bold">TW</span>
                   <span className="hover:text-[#800000] cursor-pointer text-[12px] font-bold">FB</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-7">
            <div className="prose prose-lg max-w-none text-gray-700 leading-[1.9] font-normal">
              <p className="text-xl md:text-2xl text-gray-900 font-medium mb-10 leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:text-[#800000] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                {post.sub || "in the dynamic realm of business, understanding the current operational landscape is paramount. before embarking on the journey of streamlining, it's crucial to conduct a comprehensive analysis."}
              </p>

              <div className="space-y-8 text-[17px]">
                <p>
                  conducting a thorough audit of your current logistics and supply chain processes allows you to pinpoint exact areas where time and resources are being underutilized. it’s about looking beyond the surface level of operations.
                </p>

                <blockquote className="my-12 py-4 px-8 border-l-4 border-[#800000] bg-gray-50 italic text-xl text-gray-800 rounded-r-2xl">
                  "the goal is not just to move products faster, but to create a sustainable ecosystem where data and physical movement are perfectly synchronized."
                </blockquote>

                <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">the future of warehouse automation</h3>
                <p>
                  as we look towards the rest of 2026, automation is no longer a luxury but a necessity. implementing intelligent sorting systems and robotic assistance can reduce human error by up to 40% in high-volume environments.
                </p>
              </div>
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-[#fafafa] p-8 rounded-[30px] border border-gray-50 shadow-sm">
              <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest mb-8 flex justify-between items-center">
                Latest Updates
                <span className="w-10 h-[1px] bg-gray-200"></span>
              </h3>
              
              <div className="space-y-8">
                {latestPosts.map((item) => (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer flex gap-5"
                    onClick={() => {
                      onArticleClick(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200">
                      <img 
                        src={item.img} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        alt="update" 
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[9px] font-bold text-[#800000] uppercase tracking-widest mb-1">
                        {item.category}
                      </span>
                      <h4 className="text-[13px] font-bold leading-snug text-gray-900 group-hover:text-[#800000] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border border-gray-100 rounded-[30px] space-y-6">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Meta</p>
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-gray-400">Word Count</span>
                   <span className="font-bold">1,240 words</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-gray-400">Primary Tag</span>
                   <span className="font-bold text-[#800000]">Strategy</span>
                 </div>
               </div>
            </div>
          </aside>

        </div>
      </article>
    </div>
  );
}