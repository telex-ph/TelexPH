"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import Footer from "@/components/Footer/Footer";
import DetailsHero from "./components/DetailsHero";

import AssociateSalesManager from "./components/AssociateSalesManagerDetails";
import DevOpsSecurityEngineer from "./components/DevOpsSecurityEngineerDetails";
import FrontEndWebDeveloper from "./components/FrontEndWebDeveloperDetails";
import GlobalAnalyticDesignConsultant from "./components/GlobalAnalyticsConsultantDetails";
import SrWellbeingSpecialist from "./components/SrWellbeingSpecialistDetails";
import TeamLeader from "./components/TeamLeaderDetails";

type JobKey =
  | "associate-sales-manager"
  | "devops-security-engineer"
  | "frontend-web-developer"
  | "global-analytics-consultant"
  | "sr-wellbeing-specialist"
  | "team-leader";

const JOB_KEYS: JobKey[] = [
  "associate-sales-manager",
  "devops-security-engineer",
  "frontend-web-developer",
  "global-analytics-consultant",
  "sr-wellbeing-specialist",
  "team-leader",
];

const jobComponents: Record<JobKey, React.ReactNode> = {
  "associate-sales-manager": <AssociateSalesManager />,
  "devops-security-engineer": <DevOpsSecurityEngineer />,
  "frontend-web-developer": <FrontEndWebDeveloper />,
  "global-analytics-consultant": <GlobalAnalyticDesignConsultant />,
  "sr-wellbeing-specialist": <SrWellbeingSpecialist />,
  "team-leader": <TeamLeader />,
};

const jobLabels: { key: JobKey; label: string }[] = [
  { key: "associate-sales-manager", label: "Associate Sales Manager" },
  { key: "devops-security-engineer", label: "DevOps Security Engineer" },
  { key: "frontend-web-developer", label: "Front-End Web Developer" },
  { key: "global-analytics-consultant", label: "Global Analytics Consultant" },
  { key: "sr-wellbeing-specialist", label: "Sr. Wellbeing Specialist" },
  { key: "team-leader", label: "Team Leader" },
];

export default function JobDetailsPage() {
  const [showNav, setShowNav] = useState(false);
  const searchParams = useSearchParams();
  
  const getInitialJob = (): JobKey => {
    const param = searchParams.get("job");
    if (param && JOB_KEYS.includes(param as JobKey)) {
      return param as JobKey;
    }
    return "associate-sales-manager";
  };

  const [selectedJob, setSelectedJob] = useState<JobKey>(getInitialJob);

  // Sync if the URL param changes (e.g. browser back/forward)
  useEffect(() => {
    const param = searchParams.get("job");
    if (param && JOB_KEYS.includes(param as JobKey)) {
      setSelectedJob(param as JobKey);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-poppins">
      <Nav openNav={() => setShowNav(true)} />
      <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />

      <main className="pt-[100px] pb-12 w-full">
        <div className="max-w-full mx-auto flex flex-col gap-5">
          <div className="w-full">
            <DetailsHero />
          </div>

          {/* Job selector tabs */}
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="flex flex-wrap justify-center gap-6 border-b border-gray-200">
              {jobLabels.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedJob(key)}
                  className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedJob === key
                      ? "text-[#8B0000] border-b-2 border-[#8B0000] -mb-px"
                      : "text-gray-500 hover:text-[#8B0000]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic job detail component */}
          <div className="max-w-7xl mx-auto px-6 w-full flex flex-col gap-5">
            {jobComponents[selectedJob]}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}