"use client";

import React from "react";
import { HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineArrowUpRight } from "react-icons/hi2";

export default function BlogsList({ onArticleClick }: any) {
  const latestPosts = [
    { id: "post-1", title: "Optimizing Last-Mile Delivery Routes For Faster Fulfillment", date: "Feb 06", category: "Logistics", img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=200", author: "Admin" },
    { id: "post-2", title: "The Role Of Artificial Intelligence In Modern Warehouse Automation", date: "Feb 05", category: "Tech", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=200", author: "Admin" },
    { id: "post-3", title: "Sustainability In Logistics: Reducing Carbon Footprints In Shipping", date: "Feb 04", category: "Eco", img: "https://images.unsplash.com/photo-1566232392379-afd9298e6a46?q=80&w=200", author: "Admin" },
    { id: "post-4", title: "How To Manage Global Supply Chain Disruptions In 2026", date: "Feb 03", category: "Supply", img: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=200", author: "Admin" },
  ];

  const gridBlogs = [
    { id: "1", headline: "The Future Of Logistics", sub: "Exploring How Digital Transformation Is Revolutionizing The Global Supply Chain.", category: "Logistics", img: "https://images.unsplash.com/photo-1566232392379-afd9298e6a46?q=80&w=800", author: "By Admin", date: "Feb 06, 2026" },
    { id: "2", headline: "Supply Chain Mastery", sub: "A Guide On Managing Inventory And Reducing Costs Through Modern Corporate.", category: "Management", img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800", author: "By Waleed", date: "Feb 05, 2026" },
    { id: "3", headline: "Remote Distribution", sub: "Connecting Remote Areas With Tech-Driven Logistics Solutions Globally.", category: "Innovation", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800", author: "By Guillaume", date: "Feb 04, 2026" },
  ];

  const featuredPost = {
    id: "featured",
    title: "Navigating The Complexities Of Global Logistics In A Digital-First Era",
    date: "February 06, 2026",
    category: "Logistics",
    author: "Admin",
    img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200",
    sub: "Exploring the deep impact of modern logistics on global trade and how digital transformation is shaping the future of supply chain management."
  };

  return (
    <div className="max-w-[1600px] mx-auto px-10 py-12 bg-white font-['Poppins',_sans-serif]">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
        <div className="lg:col-span-8 relative group">
          <div className="relative h-[450px] w-full overflow-hidden rounded-[40px] shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)]">
            <img 
              src={featuredPost.img} 
              className="w-full h-full object-cover" 
              alt="Industrial Logistics" 
            />
          </div>
          <div className="absolute -bottom-6 -right-2 lg:right-12 bg-white p-8 lg:p-10 rounded-[35px] shadow-[0_50px_90px_-20px_rgba(0,0,0,0.35)] max-w-lg border border-gray-50 flex flex-col">
            <span className="text-[#800000] font-normal text-[12px] uppercase tracking-[0.2em] mb-3 block">featured blog</span>
            <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-gray-900 mb-4">{featuredPost.title}</h1>
            <div className="flex items-center justify-between mt-auto">
                <p className="text-[14px] text-gray-400 font-normal">{featuredPost.date}</p>
                
                <div 
                  onClick={() => onArticleClick(featuredPost)}
                  className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center text-white cursor-pointer hover:rotate-45 transition-all shadow-xl"
                >
                   <HiOutlineArrowUpRight className="text-lg" />
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight border-b border-gray-100 pb-2">Latest Updates</h2>
          <div className="flex flex-col gap-3">
            {latestPosts.map((post, i) => (
              <div 
                key={i} 
                onClick={() => onArticleClick(post)}
                className="group cursor-pointer flex gap-4 items-center bg-white p-3 rounded-[25px] border border-gray-50 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.15)] transition-all"
              >
                <div className="w-16 h-16 rounded-[18px] overflow-hidden flex-shrink-0">
                  <img src={post.img} className="w-full h-full object-cover" alt="Thumb" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-normal text-[#800000] uppercase tracking-widest mb-0.5">{post.category}</span>
                  <h4 className="text-[13px] font-bold leading-snug text-gray-900 group-hover:text-[#800000] line-clamp-2 transition-colors">
                    {post.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
           <span className="text-[#800000] font-normal text-[12px] uppercase tracking-[0.2em] mb-1 block">our journal</span>
           <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Founders Corner</h2>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:bg-[#800000] hover:text-white transition-all shadow-sm"><HiOutlineArrowLeft className="text-lg" /></button>
          <button className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-400 hover:bg-[#800000] hover:text-white transition-all shadow-sm"><HiOutlineArrowRight className="text-lg" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridBlogs.map((blog) => (
          <div 
            key={blog.id} 
            className="group bg-white rounded-[40px] overflow-hidden shadow-[0_35px_70px_-20px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col transition-all duration-500 hover:translate-y-[-5px] w-full"
          >
            <div className="relative aspect-[2.6/1] m-4 overflow-hidden rounded-[25px] bg-gray-50">
              <img src={blog.img} className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" alt="Blog" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/95 backdrop-blur-sm text-[#800000] px-4 py-1.5 rounded-lg text-[10px] font-normal uppercase tracking-widest shadow-md">
                  {blog.category}
                </span>
              </div>
            </div>

            <div className="px-8 pb-6 pt-2 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-1 rounded-full bg-[#800000] opacity-60"></div>
                <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">{blog.author}</span>
              </div>
              
              <h3 
                onClick={() => onArticleClick(blog)}
                className="text-[19px] font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#800000] transition-colors cursor-pointer"
              >
                {blog.headline}
              </h3>
              
              <p className="text-[13px] text-gray-500 font-normal leading-relaxed mb-4 line-clamp-2">
                {blog.sub}
              </p>
              
              <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
                <span className="text-[11px] text-gray-400 font-normal uppercase tracking-tighter">{blog.date}</span>
                
                <div 
                  onClick={() => onArticleClick(blog)}
                  className="text-[#800000] font-normal text-[11px] flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer uppercase tracking-widest"
                >
                  Read Article <HiOutlineArrowRight className="text-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}