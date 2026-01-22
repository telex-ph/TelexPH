"use client";

import React, { useState, useMemo, useEffect } from "react";
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

export default function CareerPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

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

  const JOBS = [
    {
      id: 1,
      title: "Consultant, Global Analytic Design",
      dept: "Research & Analytics",
      location: "Clark, Pampanga",
      description: "Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Front End Web Developer",
      dept: "Information Technology",
      location: "Clark, Pampanga",
      description: "Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "DevOps Security Engineer",
      dept: "Information Technology",
      location: "Clark, Pampanga",
      description: "Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Associates Sales Manager",
      dept: "Operations",
      location: "Clark, Pampanga",
      description: "The Associate Sales Manager is responsible for overseeing the management of the team(s) supporting accounts to drive the business goals.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Sr. Wellbeing Specialist",
      dept: "Human Resource",
      location: "Clark, Pampanga",
      description: "Our psychological health team is a diverse group of specialists dedicated to developing, delivering, and evaluating programs.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
    },
    {
      id: 6,
      title: "Team Leader",
      dept: "Operations",
      location: "Clark, Pampanga",
      description: "The Team Leader, Operations is responsible for the day-to-day supervision of a group of call center associates.",
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
    w-full bg-white border border-gray-200 py-1.5 px-4 rounded-full
    text-[12px] font-medium text-gray-500 outline-none 
    appearance-none cursor-pointer transition-all duration-300
    hover:border-[#800000] focus:border-[#800000]
  `;

  const handleOpenModal = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Poppins', sans-serif; 
          background-color: #ffffff;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-6 bg-white min-h-screen">
        <section className="w-full mb-8"> 
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-grow">
              <div className="relative min-w-[200px]">
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-white border border-gray-200 py-1.5 pl-9 pr-4 rounded-full text-[12px] font-medium text-gray-500 outline-none transition-all duration-300 focus:border-[#800000]" 
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative min-w-[130px]">
                <select className={filterStyles} value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                  <option value="">Department</option>
                  <option value="Research & Analytics">Research & Analytics</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Operations">Operations</option>
                  <option value="Human Resource">Human Resource</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={12} className="text-gray-400" /></div>
              </div>

              <div className="relative min-w-[130px]">
                <select className={filterStyles} value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                  <option value="">Location</option>
                  <option value="Clark, Pampanga">Clark, Pampanga</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={12} className="text-gray-400" /></div>
              </div>

              <button onClick={handleReset} className="flex items-center gap-1.5 px-2 py-1 text-gray-400 hover:text-[#800000] transition-colors">
                <XCircle size={14} />
                <span className="text-[11px] font-medium">Reset</span>
              </button>
            </div>

            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button 
                onClick={() => setIsGridView(false)}
                className={`p-1.5 rounded-lg transition-all ${!isGridView ? "bg-white shadow-sm text-[#800000]" : "text-gray-300"}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setIsGridView(true)}
                className={`p-1.5 rounded-lg transition-all ${isGridView ? "bg-white shadow-sm text-[#800000]" : "text-gray-300"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </section>

        <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className={`bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-50 transition-all hover:shadow-xl overflow-hidden
                ${isGridView 
                  ? "flex flex-col rounded-bl-[40px] rounded-br-[40px] rounded-tl-2xl rounded-tr-2xl" 
                  : "flex flex-row items-center rounded-2xl h-auto md:h-48"
                }`}
            >
              <div className={`relative bg-gray-100 shrink-0 ${isGridView ? "h-52 w-full" : "h-full w-40 md:w-64"}`}>
                <img 
                  src={job.image} 
                  alt={job.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0">
                  <div className="bg-[#800000] text-white text-[10px] py-1.5 px-5 pr-8 uppercase rounded-br-full" style={{ fontWeight: 400 }}>
                    {job.dept}
                  </div>
                </div>
              </div>

              <div className={`p-6 flex flex-col flex-grow ${isGridView ? "items-center text-center" : "items-start text-left justify-center ml-4"}`}>
                <div className={`flex flex-col ${isGridView ? "items-center mb-4" : "items-start mb-2"}`}>
                  <h3 className="text-[18px] text-[#1a191c] leading-[1.2] mb-2 line-clamp-1" style={{ fontWeight: 600 }}>
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-none" style={{ fontWeight: 600 }}>
                    {job.location}
                  </p>
                </div>

                {isGridView && <div className="w-[90%] border-t-2 border-[#800000] mb-5"></div>}
                
                <p className={`text-[13px] text-gray-500 leading-relaxed mb-6 px-2 ${isGridView ? "line-clamp-3" : "line-clamp-2"}`} style={{ fontWeight: 400 }}>
                  {job.description}
                </p>

                <div className={`mt-auto w-full flex items-center ${isGridView ? "justify-between px-2" : "justify-between"}`}>
                  <Link 
                    href="/careers/job-details" 
                    className="text-[#a10000] text-[13px] uppercase hover:underline underline-offset-4 decoration-2"
                    style={{ fontFamily: "'Poppins'", fontWeight: 600 }}
                  >
                    View job details
                  </Link>
                  
                  <div 
                    onClick={() => handleOpenModal(job)}
                    className="bg-[#800000] rounded-xl text-white shadow-md cursor-pointer hover:scale-110 transition-transform w-9 h-9 flex items-center justify-center"
                  >
                    <Settings size={20} className="stroke-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase text-[13px] tracking-widest">
              No matching positions found
            </p>
          </div>
        )}
      </div>

      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 overflow-hidden pt-40">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-10 duration-500">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-[#800000] hover:text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            <div className="relative h-44 w-full">
              <img src={(selectedJob as any).image} alt={(selectedJob as any).title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-8 text-white">
                <span className="bg-[#800000] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2 inline-block">
                  {(selectedJob as any).dept}
                </span>
                <h2 className="text-2xl font-bold uppercase tracking-tight leading-tight">{(selectedJob as any).title}</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-7 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MapPin size={18} className="text-[#800000]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Location</p>
                    <p className="text-sm font-semibold text-gray-700">{(selectedJob as any).location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Briefcase size={18} className="text-[#800000]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Position Type</p>
                    <p className="text-sm font-semibold text-gray-700">Full-Time</p>
                  </div>
                </div>
              </div>

              <div className="mb-9 bg-white rounded-2xl border-l-4 border-[#800000] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Settings size={16} className="text-[#800000]" />
                  Job Overview
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.
                </p>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 group flex items-center justify-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-8 py-4 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 transition-all duration-300" style={{ fontWeight: 600 }}>
                  <span className="text-[13px] tracking-wide uppercase">Apply Now</span>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <button className="flex-1 group flex items-center justify-center gap-2 bg-white border-2 border-[#a10000] text-[#a10000] px-8 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-[#a10000] hover:to-[#ce1212] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm" style={{ fontWeight: 600 }}>
                  <span className="text-[13px] tracking-wide uppercase">Book Now</span>
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