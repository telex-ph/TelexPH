"use client";

import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { 
  Search, 
  XCircle, 
  LayoutGrid, 
  List, 
  Settings, 
  ChevronDown,
  X,
  MapPin,
  Briefcase,
  Plus
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  dept: string;
  location: string;
  description: string;
  image: string;
}

export default function CareerPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const JOBS: Job[] = [
    {
      id: 1,
      title: "consultant, global analytic design",
      dept: "research & analytics",
      location: "clark, pampanga",
      description: "provide exceptional customer support via phone, email, and chat. handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "front end web developer",
      dept: "information technology",
      location: "clark, pampanga",
      description: "provide exceptional customer support via phone, email, and chat. handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "devops security engineer",
      dept: "information technology",
      location: "clark, pampanga",
      description: "provide exceptional customer support via phone, email, and chat. handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "associates sales manager",
      dept: "operations",
      location: "clark, pampanga",
      description: "the associate sales manager is responsible for overseeing the management of the team(s) supporting accounts to drive the business goals.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "sr. wellbeing specialist",
      dept: "human resource",
      location: "clark, pampanga",
      description: "our psychological health team is a diverse group of specialists dedicated to developing, delivering, and evaluating programs.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
    },
    {
      id: 6,
      title: "team leader",
      dept: "operations",
      location: "clark, pampanga",
      description: "the team leader, operations is responsible for the day-to-day supervision of a group of call center associates.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDept("");
    setSelectedLocation("");
  };

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === "" || job.dept.toLowerCase().includes(selectedDept.toLowerCase());
      const matchesLoc = selectedLocation === "" || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesDept && matchesLoc;
    });
  }, [searchQuery, selectedDept, selectedLocation]);

  const filterStyles = `
    w-full bg-white border border-gray-200 py-2 px-4 rounded-full
    text-[12px] font-medium text-gray-500 outline-none 
    appearance-none cursor-pointer transition-all duration-300
    hover:border-[#800000] focus:border-[#800000]
  `;

  const handleOpenModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white min-h-screen overflow-x-hidden">
        
        {/* filters section */}
        <section className="w-full mb-8"> 
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-3 w-full xl:w-auto flex-grow">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="search jobs..." 
                  value={searchQuery} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} 
                  className="w-full bg-white border border-gray-200 py-2 pl-9 pr-4 rounded-full text-[12px] font-medium text-gray-500 outline-none transition-all duration-300 focus:border-[#800000]" 
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative w-full">
                <select className={filterStyles} value={selectedDept} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDept(e.target.value)}>
                  <option value="">department</option>
                  <option value="research & analytics">research & analytics</option>
                  <option value="information technology">information technology</option>
                  <option value="operations">operations</option>
                  <option value="human resource">human resource</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={12} className="text-gray-400" /></div>
              </div>

              <div className="relative w-full">
                <select className={filterStyles} value={selectedLocation} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedLocation(e.target.value)}>
                  <option value="">location</option>
                  <option value="clark, pampanga">clark, pampanga</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={12} className="text-gray-400" /></div>
              </div>

              <button onClick={handleReset} className="flex items-center justify-center gap-1.5 px-4 py-2 text-gray-400 hover:text-[#800000] transition-colors border border-transparent hover:border-gray-100 rounded-full">
                <XCircle size={14} />
                <span className="text-[11px] font-medium uppercase tracking-wider">reset</span>
              </button>
            </div>

            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 self-end xl:self-auto">
              <button 
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded-lg transition-all ${!isGridView ? "bg-white shadow-sm text-[#800000]" : "text-gray-300"}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded-lg transition-all ${isGridView ? "bg-white shadow-sm text-[#800000]" : "text-gray-300"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* jobs list */}
        <div className={isGridView 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
          : "flex flex-col gap-6"
        }>
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className={`bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-50 transition-all hover:shadow-xl overflow-hidden
                ${isGridView 
                  ? "flex flex-col rounded-bl-[40px] rounded-br-[40px] rounded-tl-2xl rounded-tr-2xl" 
                  : "flex flex-col md:flex-row items-stretch rounded-2xl h-auto"
                }`}
            >
              <div className={`relative bg-gray-100 shrink-0 ${isGridView ? "h-48 sm:h-52 w-full" : "h-48 md:h-auto md:w-64"}`}>
                <img 
                  src={job.image} 
                  alt={job.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0">
                  <div className="bg-[#800000] text-white text-[9px] sm:text-[10px] py-1.5 px-4 sm:px-5 pr-8 uppercase rounded-br-full font-medium tracking-tight">
                    {job.dept}
                  </div>
                </div>
              </div>

              <div className={`p-5 sm:p-6 flex flex-col flex-grow ${isGridView ? "items-center text-center" : "items-start text-left justify-center md:ml-4"}`}>
                <div className={`flex flex-col w-full ${isGridView ? "items-center mb-4" : "items-start mb-2"}`}>
                  <h3 className="text-[16px] sm:text-[18px] text-[#1a191c] leading-[1.3] mb-2 line-clamp-1 uppercase font-semibold">
                    {job.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest leading-none font-semibold">
                    {job.location}
                  </p>
                </div>

                {isGridView && <div className="w-[80%] border-t-2 border-[#800000] mb-5 opacity-80"></div>}
                
                <p className={`text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-6 ${isGridView ? "line-clamp-3 px-2" : "line-clamp-2 w-full"}`}>
                  {job.description}
                </p>

                <div className={`mt-auto w-full flex items-center ${isGridView ? "justify-between px-2" : "justify-between"}`}>
                  <Link 
                    href="/careers/job-details" 
                    className="text-[#a10000] text-[12px] sm:text-[13px] uppercase hover:underline underline-offset-4 decoration-2 font-semibold"
                  >
                    view details
                  </Link>
                  
                  <div 
                    onClick={() => handleOpenModal(job)}
                    className="bg-[#800000] rounded-xl text-white shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all w-9 h-9 flex items-center justify-center"
                  >
                    <Settings size={18} className="stroke-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* empty state */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-24 sm:py-32">
            <p className="text-gray-400 font-bold uppercase text-[12px] sm:text-[13px] tracking-widest px-4">
              no positions match your current filters
            </p>
          </div>
        ) : (
          /* footer button */
          <div className="w-full flex justify-center mt-12 mb-6 px-4">
            <button 
              className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-10 sm:px-14 py-4 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
            >
              <span className="text-[13px] sm:text-[14px] tracking-widest uppercase font-medium">show all jobs</span>
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>

      {/* modal backdrop & content */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 md:slide-in-from-top-10 duration-500 max-h-[92vh] flex flex-col">
            
            {/* close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[#800000] transition-all z-20 border border-white/20"
            >
              <X size={20} />
            </button>

            {/* modal header */}
            <div className="relative h-40 sm:h-52 w-full shrink-0">
              <img src={selectedJob.image} alt={selectedJob.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8 text-white pr-10">
                <span className="bg-[#800000] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2 inline-block">
                  {selectedJob.dept}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight leading-tight">{selectedJob.title}</h2>
              </div>
            </div>

            {/* modal body */}
            <div className="p-5 sm:p-8 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                    <MapPin size={18} className="text-[#800000]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold">location</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 uppercase truncate">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                    <Briefcase size={18} className="text-[#800000]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold">position type</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 uppercase truncate">full-time</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-white rounded-2xl border-l-4 border-[#800000] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Settings size={16} className="text-[#800000]" />
                  job overview
                </h4>
                <p className="text-gray-600 leading-relaxed text-[13px] sm:text-sm">
                  {selectedJob.description}
                </p>
              </div>

              {/* action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="flex-1 group flex items-center justify-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-6 py-4 rounded-xl sm:rounded-2xl shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-semibold">
                  <span className="text-[12px] sm:text-[13px] tracking-widest uppercase">apply now</span>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <button className="flex-1 group flex items-center justify-center gap-2 bg-white border-2 border-[#a10000] text-[#a10000] px-6 py-4 rounded-xl sm:rounded-2xl hover:bg-[#a10000] hover:text-white hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-semibold shadow-sm">
                  <span className="text-[12px] sm:text-[13px] tracking-widest uppercase">book now</span>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}