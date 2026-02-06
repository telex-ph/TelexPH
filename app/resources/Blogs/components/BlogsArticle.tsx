"use client";

import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export default function BlogsArticle({ post, onBack }: any) {
  if (!post) return null;

  const latestPosts = [
    { id: "1", title: "Optimizing Last-Mile Delivery Routes For Faster Fulfillment", category: "Logistics", img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=100&w=800" },
    { id: "2", title: "The Role Of Artificial Intelligence In Modern Warehouse Automation", category: "Tech", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=100&w=800" },
    { id: "3", title: "Sustainability In Logistics: Reducing Carbon Footprints In Shipping", category: "Eco", img: "https://images.unsplash.com/photo-1566232392379-afd9298e6a46?q=100&w=800" },
    { id: "4", title: "How To Manage Global Supply Chain Disruptions In 2026", category: "Supply", img: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=100&w=800" },
  ];

  return (
    <div className="bg-white min-h-screen font-['Poppins',_sans-serif] pb-20">
      <nav className="max-w-[1400px] mx-auto px-10 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-900 hover:text-[#800000] transition-colors group">
          <HiOutlineArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium tracking-tight">back to journal</span>
        </button>
      </nav>

      <header className="max-w-[950px] mx-auto px-6 text-center mb-16">
        <div className="text-[#800000] text-[12px] font-bold uppercase tracking-[0.3em] mb-4">
          {post.date || "23rd november 2026"}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.15] mb-8 tracking-tight italic">
          {post.headline || post.title}
        </h1>
        <p className="text-gray-500 text-[17px] max-w-[700px] mx-auto leading-relaxed italic">
          Dive into the world of operational efficiency and learn strategies to boost productivity effortlessly.
        </p>
      </header>

      <section className="max-w-[1400px] mx-auto px-10 mb-24">
        <div className="w-full h-[500px] md:h-[700px] rounded-[30px] overflow-hidden shadow-2xl">
          <img src={post.img} className="w-full h-full object-cover" alt="article cover" />
        </div>
      </section>

      <main className="max-w-[1300px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        <div className="hidden lg:block lg:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">share</p>
          <div className="flex flex-col gap-5 text-[13px] font-medium text-gray-900 uppercase tracking-widest">
            <span className="cursor-pointer hover:text-[#800000] transition-colors">instagram</span>
            <span className="cursor-pointer hover:text-[#800000] transition-colors">twitter</span>
            <span className="cursor-pointer hover:text-[#800000] transition-colors">facebook</span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Understanding the Current Landscape</h2>
            <div className="text-[17px] text-gray-600 font-normal leading-[1.9] space-y-8">
              <p>
                In the dynamic realm of business, understanding the current operational landscape is paramount. 
                Before embarking on the journey of streamlining, it's crucial to conduct a comprehensive analysis 
                of existing processes. This involves identifying bottlenecks, redundancies, and areas where 
                efficiency can be heightened.
              </p>
              <p>
                Taking a holistic view, consider not only internal processes but also external factors 
                influencing operations. analyze market trends, customer expectations, and industry benchmarks.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Crafting a Streamlining Strategy</h2>
            <p className="text-[17px] text-gray-600 font-normal leading-[1.9]">
              Armed with insights from the operational analysis, the next step is crafting a tailored 
              streamlining strategy. This involves not just cutting excesses but optimizing processes 
              for sustained efficiency.
            </p>
          </section>
        </div>

        <div className="lg:col-span-3 space-y-12">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-10 border-b border-gray-100 pb-4">Latest Updates</h3>
            <div className="flex flex-col gap-10">
              {latestPosts.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-md">
                    <img 
                      src={item.img} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt="latest update" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-2 italic">
                      {item.category}
                    </span>
                    <h4 className="text-[14px] font-bold leading-snug text-gray-900 group-hover:text-[#800000] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}