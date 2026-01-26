"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  XCircle, 
  LayoutGrid, 
  List, 
  Settings, 
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function CareerPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const INITIAL_VISIBLE_COUNT = 6; 

  const JOBS = [
    {
      id: 1,
      title: "Consultant, Global Analytic Design",
      dept: "Research & Analytics",
      location: "Guimba, Nueva Ecija",
      description: "Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Front End Web Developer",
      dept: "Information Technology",
      location: "Guimba, Nueva Ecija",
      description: "Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "DevOps Security Engineer",
      dept: "Information Technology",
      location: "Guimba, Nueva Ecija",
      description: "Provide exceptional customer support via phone, email, and chat. Handle inquiries, resolve issues, and ensure customer satisfaction through personalized service.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Associates Sales Manager",
      dept: "Operations",
      location: "Guimba, Nueva Ecija",
      description: "The Associate Sales Manager is responsible for overseeing the management of the team(s) supporting accounts to drive the business goals.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Sr. Wellbeing Specialist",
      dept: "Human Resource",
      location: "Guimba, Nueva Ecija",
      description: "Our psychological health team is a diverse group of specialists dedicated to developing, delivering, and evaluating programs.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
    },
    {
      id: 6,
      title: "Team Leader",
      dept: "Operations",
      location: "Guimba, Nueva Ecija",
      description: "The Team Leader, Operations is responsible for the day-to-day supervision of a group of call center associates.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 7,
      title: "Senior React Developer",
      dept: "Information Technology",
      location: "Guimba, Nueva Ecija",
      description: "Leading the frontend team in building scalable web applications using React and Next.js ecosystem.",
      image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 8,
      title: "HR Business Partner",
      dept: "Human Resource",
      location: "Guimba, Nueva Ecija",
      description: "Collaborate with business leaders to align human resources strategies with business objectives.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 9,
      title: "Quality Assurance Specialist",
      dept: "Operations",
      location: "Guimba, Nueva Ecija",
      description: "Ensure the quality of customer service interactions meets the company standards and compliance.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 10,
      title: "Data Analyst",
      dept: "Research & Analytics",
      location: "Guimba, Nueva Ecija",
      description: "Analyze large datasets to provide actionable insights for business growth and operational efficiency.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 11,
      title: "Network Administrator",
      dept: "Information Technology",
      location: "Guimba, Nueva Ecija",
      description: "Manage and maintain the company's computer networks to ensure optimal performance and security.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 12,
      title: "Customer Success Manager",
      dept: "Operations",
      location: "Guimba, Nueva Ecija",
      description: "Build and maintain strong relationships with clients to ensure their success and satisfaction.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDept("");
    setSelectedLocation("");
    setIsExpanded(false);
  };

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === "" || job.dept.toLowerCase().includes(selectedDept.toLowerCase());
      const matchesLoc = selectedLocation === "" || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesDept && matchesLoc;
    });
  }, [searchQuery, selectedDept, selectedLocation]);

  const visibleJobs = isExpanded ? filteredJobs : filteredJobs.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = Math.max(0, filteredJobs.length - INITIAL_VISIBLE_COUNT);

  const filterStyles = `
    w-full bg-white border border-gray-200 py-1.5 px-4 rounded-full
    text-[12px] font-medium text-gray-500 outline-none 
    appearance-none cursor-pointer transition-all duration-300
    hover:border-[#800000] focus:border-[#800000]
  `;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Poppins', sans-serif; 
        }
      `}</style>

      {/* ADJUSTED: Removed min-h-screen and reduced vertical padding */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-12">
        
        {/* FILTERS SECTION */}
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

        {/* --- JOB LIST --- */}
        <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
          {visibleJobs.map((job) => (
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
                  
                  <div className="bg-[#800000] rounded-xl text-white shadow-md cursor-pointer hover:scale-110 transition-transform w-9 h-9 flex items-center justify-center">
                    <Settings size={20} className="stroke-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- VIEW MORE BUTTON --- */}
        {/* ADJUSTED: Reduced top margin from mt-12 to mt-8 */}
        {filteredJobs.length > INITIAL_VISIBLE_COUNT && (
          <div className="w-full flex justify-center mt-14 mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-[#800000] text-white text-[12px] font-bold py-3 px-8 rounded-lg flex items-center gap-2 hover:bg-[#660000] transition-colors shadow-lg tracking-wider"
            >
              {isExpanded ? (
                <>
                  VIEW LESS 
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  VIEW MORE ({remainingCount} MORE)
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase text-[13px] tracking-widest">
              No matching positions found
            </p>
          </div>
        )}
      </div>
    </>
  );
}