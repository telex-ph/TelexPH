"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Plus, MapPin, Calendar, Clock, Banknote } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
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

const jobLabels: { key: JobKey; label: string }[] = [
  { key: "associate-sales-manager", label: "Associate Sales Manager" },
  { key: "devops-security-engineer", label: "DevOps Security Engineer" },
  { key: "frontend-web-developer", label: "Front-End Web Developer" },
  { key: "global-analytics-consultant", label: "Global Analytics Consultant" },
  { key: "sr-wellbeing-specialist", label: "Sr. Wellbeing Specialist" },
  { key: "team-leader", label: "Team Leader" },
];

// ─────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────
interface SectionHeadingProps {
  title: string;
}
function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-extrabold tracking-wider" style={{ color: "#1a1a1a" }}>
        {title}
      </h3>
      <div className="w-16 h-[4px] bg-[#800000] mt-1"></div>
    </div>
  );
}

interface CheckListProps {
  items: string[];
  italic?: boolean;
}
function CheckList({ items, italic = false }: CheckListProps) {
  return (
    <ul className="space-y-5 lg:pl-10 mt-5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-4 lg:gap-5 text-gray-700 text-[14px] sm:text-[15px] py-1">
          <Check size={18} className="text-[#800000] mt-1 flex-shrink-0" strokeWidth={2.5} />
          <span className={`text-justify${italic ? " italic" : ""}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface BadgesProps {
  posted: string;
  type?: string;
  salary?: string;
}
function Badges({ posted, type = "full-time", salary = "competitive" }: BadgesProps) {
  return (
    <div className="flex flex-row items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
        <Calendar size={16} className="text-[#800000] flex-shrink-0" />
        <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <p className="text-[11px] text-gray-500 uppercase font-extrabold leading-none tracking-widest">posted</p>
          <p className="text-[13px] font-extrabold text-gray-800 uppercase mt-0.5">{posted}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
        <Clock size={16} className="text-[#800000] flex-shrink-0" />
        <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <p className="text-[11px] text-gray-500 uppercase font-extrabold leading-none tracking-widest">type</p>
          <p className="text-[13px] font-extrabold text-gray-800 uppercase mt-0.5">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-md">
        <Banknote size={16} className="text-[#800000] flex-shrink-0" />
        <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <p className="text-[11px] text-gray-500 uppercase font-extrabold leading-none tracking-widest">salary</p>
          <p className="text-[13px] font-extrabold text-gray-800 uppercase mt-0.5">{salary}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared salary range items (same for all jobs)
// ─────────────────────────────────────────────
const SALARY_ITEMS = [
  "Defines the lowest and highest possible salary for the position",
  "Based on experience, skills, education, and job responsibilities",
  "May vary depending on performance, tenure, or internal policies",
  "Helps applicants understand earning potential before applying",
  "Supports fair and transparent compensation decisions",
];

const BENEFITS_ITEMS = [
  "Competitive salary based on skills and experience",
  "Flexible working hours or remote work options",
  "Opportunities for learning, training, and career growth",
  "Health insurance and paid leave benefits",
  "Collaborative and inclusive team culture",
];

// ─────────────────────────────────────────────
// Job data map
// ─────────────────────────────────────────────
interface JobData {
  department: string;
  titleLeft: string;
  titleRed: string;
  posted: string;
  jobTitle: string;
  jobDept: string;
  img1: string;
  img1Alt: string;
  img2: string;
  img2Alt: string;
  summary: string;
  description: string;
  requirementsIntro: string;
  requirements: string[];
}

const JOB_DATA: Record<JobKey, JobData> = {
  "associate-sales-manager": {
    department: "operations",
    titleLeft: "associate",
    titleRed: "sales manager",
    posted: "dec 02, 2025",
    jobTitle: "Associate Sales Manager",
    jobDept: "Operations",
    img1: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
    img1Alt: "sales team meeting",
    img2: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
    img2Alt: "business discussion",
    summary:
      "The Associate Sales Manager is a results-driven leader within our Operations division, responsible for overseeing day-to-day sales team performance and driving revenue growth across assigned accounts. This position demands a dynamic individual who can motivate a team, build strong client relationships, and execute strategic sales plans with precision. The ideal candidate has a track record of meeting and exceeding sales targets while developing the professional capabilities of team members under their supervision, contributing directly to the organization's business goals and long-term growth strategy.",
    description:
      "The Associate Sales Manager is responsible for overseeing the management of sales teams supporting assigned accounts to drive business goals. This role entails coaching and developing sales representatives, analyzing performance metrics, coordinating with cross-functional teams, and implementing strategies to maximize revenue. The ASM ensures that client expectations are met, maintains strong account relationships, and escalates issues to senior management when necessary.",
    requirementsIntro:
      "Candidates must demonstrate strong leadership qualities and a solid background in sales management, with the ability to inspire teams and translate strategic objectives into measurable results within a fast-paced operations environment.",
    requirements: [
      "Bachelor's degree in Business Administration, Marketing, or a related field",
      "Minimum 2–4 years of experience in sales, with at least 1 year in a supervisory or team lead capacity",
      "Proven track record of meeting or exceeding sales quotas and KPIs",
      "Strong communication, negotiation, and interpersonal skills",
      "Proficiency in CRM software (e.g., Salesforce, HubSpot) and Microsoft Office Suite",
    ],
  },
  "devops-security-engineer": {
    department: "information technology",
    titleLeft: "devops",
    titleRed: "security engineer",
    posted: "nov 05, 2025",
    jobTitle: "DevOps Security Engineer",
    jobDept: "Information Technology",
    img1: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    img1Alt: "cybersecurity",
    img2: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&auto=format&fit=crop",
    img2Alt: "server room",
    summary:
      "The DevOps Security Engineer occupies a critical position within our Information Technology team, responsible for embedding security practices throughout the entire software development lifecycle. This role combines deep DevOps expertise with a strong foundation in cybersecurity to proactively identify, mitigate, and respond to vulnerabilities in our infrastructure and applications. The successful candidate will champion a security-first culture, drive automation of security testing pipelines, and ensure our systems meet the highest standards of compliance and resilience in an ever-evolving threat landscape.",
    description:
      "The DevOps Security Engineer is responsible for designing, implementing, and maintaining secure CI/CD pipelines, infrastructure-as-code, and cloud environments. This role works closely with development and operations teams to integrate automated security testing, threat modeling, and vulnerability management into every stage of deployment. The engineer also leads incident response efforts, conducts security audits, and ensures ongoing compliance with industry frameworks such as ISO 27001, SOC 2, and NIST.",
    requirementsIntro:
      "The ideal candidate brings a blend of DevOps engineering and cybersecurity expertise, with hands-on experience securing cloud-native environments and automated deployment pipelines in production-grade systems.",
    requirements: [
      "Proven experience with CI/CD tools such as Jenkins, GitLab CI, or GitHub Actions",
      "Strong knowledge of cloud platforms (AWS, Azure, or GCP) and infrastructure security best practices",
      "Hands-on experience with container security, Kubernetes hardening, and Docker environments",
      "Familiarity with SAST, DAST, and SIEM tools for automated security scanning and monitoring",
      "Relevant certifications such as AWS Security Specialty, CISSP, CEH, or CompTIA Security+ preferred",
    ],
  },
  "frontend-web-developer": {
    department: "information technology",
    titleLeft: "front-end",
    titleRed: "developer",
    posted: "oct 24, 2025",
    jobTitle: "Front-End Developer",
    jobDept: "Information Technology",
    img1: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    img1Alt: "developer at work",
    img2: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop",
    img2Alt: "coding on screen",
    summary:
      "The Front-End Web Developer is a key member of our Information Technology team, responsible for building and maintaining visually engaging, high-performance web interfaces that deliver seamless user experiences. This role requires a developer who is not only technically proficient in modern front-end technologies but also has a strong sense of design aesthetics and an understanding of user behavior. The ideal candidate thrives in an agile environment, collaborates effectively with designers and back-end engineers, and consistently delivers clean, scalable, and accessible code.",
    description:
      "The Front-End Web Developer is responsible for creating responsive, user-friendly web interfaces that ensure a smooth and visually appealing experience. Working under the IT department, this role bridges the gap between design and technology by translating UI/UX wireframes and prototypes into functional, pixel-perfect web pages. The developer is also expected to contribute to code reviews, maintain documentation, and keep up with emerging front-end trends and best practices.",
    requirementsIntro:
      "The candidate shall be proficient in modern web technologies and frameworks, with a strong portfolio demonstrating previous front-end projects. Experience working in collaborative, agile development teams is highly preferred.",
    requirements: [
      "Proficient in HTML5, CSS3, and JavaScript (ES6+) with a solid understanding of responsive design",
      "Experience with React.js, Vue.js, or similar modern front-end frameworks",
      "Familiarity with version control systems such as Git and collaborative workflows",
      "Understanding of RESTful APIs and experience integrating front-end with back-end services",
      "Ability to optimize web applications for maximum speed, scalability, and accessibility",
    ],
  },
  "global-analytics-consultant": {
    department: "research & analytics",
    titleLeft: "global analytics",
    titleRed: "consultant",
    posted: "jan 15, 2025",
    jobTitle: "Global Analytics Consultant",
    jobDept: "Research & Analytics",
    img1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    img1Alt: "data analytics workspace",
    img2: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    img2Alt: "consulting team discussion",
    summary:
      "The Consultant for Global Analytic Design plays a pivotal role in shaping data-driven strategies that power organizational decisions at a global scale. This position sits at the intersection of research methodology, data visualization, and strategic consulting, requiring a professional who can translate complex datasets into compelling, actionable insights. The ideal candidate is adept at working with cross-functional and multicultural teams across multiple time zones, delivering analytic frameworks that align with international business objectives while maintaining rigorous standards of accuracy and clarity.",
    description:
      "The Global Analytics Consultant is responsible for developing and implementing comprehensive analytic frameworks used across international markets. Working closely with research leads, data engineers, and senior stakeholders, this role drives the design of reporting structures, dashboards, and insights models that inform strategic direction. The consultant ensures consistency in analytic methodology while adapting deliverables to meet the needs of diverse global clients and internal partners.",
    requirementsIntro:
      "The successful candidate shall bring strong analytical expertise and a consultative mindset, with demonstrated experience in designing research frameworks and analytic solutions for global or enterprise-level organizations.",
    requirements: [
      "Bachelor's or Master's degree in Statistics, Data Science, Business Analytics, or a related field",
      "Minimum 3–5 years of experience in analytics consulting or research design",
      "Proficiency in data visualization tools such as Tableau, Power BI, or Looker",
      "Strong command of statistical analysis methods and tools (R, Python, SPSS, or SAS)",
      "Excellent communication skills with the ability to present findings to executive stakeholders",
    ],
  },
  "sr-wellbeing-specialist": {
    department: "human resource",
    titleLeft: "sr. wellbeing",
    titleRed: "specialist",
    posted: "jan 10, 2026",
    jobTitle: "Sr. Wellbeing Specialist",
    jobDept: "Human Resource",
    img1: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    img1Alt: "wellbeing team",
    img2: "https://images.unsplash.com/photo-1591522811280-a8759970b03f?q=80&w=800&auto=format&fit=crop",
    img2Alt: "counseling session",
    summary:
      "The Senior Wellbeing Specialist is a compassionate and highly skilled professional within our Human Resource division, dedicated to developing, delivering, and evaluating programs that support the psychological health and overall wellness of our workforce. This role leads a diverse team of specialists committed to creating a workplace culture where mental health is prioritized, stigma is eliminated, and every employee feels supported. The ideal candidate brings clinical or organizational psychology expertise, program design experience, and a genuine passion for making a measurable difference in people's lives.",
    description:
      "The Senior Wellbeing Specialist leads the design and implementation of employee wellness initiatives, psychological health programs, and support services that foster a resilient and thriving workforce. This role involves collaborating with HR leadership, department managers, and external mental health providers to build comprehensive intervention strategies, conduct wellbeing assessments, and develop data-driven recommendations that continuously improve the organization's approach to employee health.",
    requirementsIntro:
      "The successful applicant shall hold relevant credentials in psychology or human wellness and possess demonstrated experience in designing and managing workplace wellbeing programs within mid-to-large-scale organizations.",
    requirements: [
      "Bachelor's or Master's degree in Psychology, Counseling, Social Work, or a related field",
      "Licensed Psychologist or Registered Guidance Counselor (LGC/RPm) preferred",
      "Minimum 4–6 years of experience in employee wellness, EAP management, or organizational psychology",
      "Experience in program design, facilitation, and evaluation of wellbeing initiatives",
      "Strong empathy, active listening, and stakeholder engagement skills",
    ],
  },
  "team-leader": {
    department: "operations",
    titleLeft: "team",
    titleRed: "leader",
    posted: "feb 18, 2026",
    jobTitle: "Team Leader",
    jobDept: "Operations",
    img1: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    img1Alt: "team leader",
    img2: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
    img2Alt: "call center operations",
    summary:
      "The Team Leader, Operations is a frontline people manager responsible for the day-to-day supervision, coaching, and performance management of a group of call center associates. This role is pivotal in ensuring that service level agreements are consistently met, team morale remains high, and each associate has the guidance they need to succeed. The ideal candidate leads by example, communicates with clarity and empathy, and possesses the operational acumen to make real-time decisions that keep the team running at peak efficiency while delivering outstanding service to clients and customers alike.",
    description:
      "The Team Leader, Operations is responsible for the daily supervision of a group of call center associates, ensuring adherence to schedules, quality standards, and client-specific processes. The TL monitors real-time performance metrics, conducts one-on-one coaching sessions, facilitates team huddles, and serves as the primary escalation point for complex customer interactions. This role also collaborates closely with workforce management, quality assurance, and training teams to drive continuous improvement across the floor.",
    requirementsIntro:
      "Candidates must have prior experience in a BPO or call center environment with a demonstrated ability to lead, mentor, and develop front-line agents toward consistent performance excellence and client satisfaction targets.",
    requirements: [
      "At least 1–2 years of experience as a Team Leader or Senior Agent in a BPO or call center setting",
      "Strong understanding of call center KPIs including AHT, CSAT, FCR, and service level metrics",
      "Excellent verbal and written communication skills with the ability to give clear, constructive feedback",
      "Ability to manage performance issues, conduct disciplinary actions, and implement improvement plans",
      "Amenable to work on shifting schedules including weekends and holidays",
    ],
  },
};

// ─────────────────────────────────────────────
// Job detail panel (renders the active job)
// ─────────────────────────────────────────────
interface JobDetailPanelProps {
  jobKey: JobKey;
}
function JobDetailPanel({ jobKey }: JobDetailPanelProps) {
  const router = useRouter();

  const job = JOB_DATA[jobKey];

  // Navigate to the VA application form page
  const handleApplyNow = () => {
    router.push("/VirtualAssistant/VAforms");
  };

  return (
    <div className="w-full relative bg-white">
      {/* dot background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pb-20">
        {/* Header */}
        <div className="w-full text-left pt-10 pb-10">
          <div className="mb-4">
            <span
              className="px-5 py-1.5 rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ backgroundColor: "#800000" }}
            >
              {job.department}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl md:text-[2.6rem] tracking-tight uppercase whitespace-nowrap"
                style={{
                  color: "#1a1a1a",
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {job.titleLeft} <span style={{ color: "#800000" }}>{job.titleRed}</span>
              </h2>
              <div className="flex items-center gap-2 text-gray-600 italic">
                <MapPin size={15} className="text-[#800000] flex-shrink-0" />
                <span className="text-sm font-light">Cawayan Bugtong, Guimba, Nueva Ecija</span>
              </div>
            </div>
            <Badges posted={job.posted} />
          </div>

          <div className="w-full h-[2px]" style={{ backgroundColor: "#800000", opacity: 0.2 }} />
        </div>

        {/* Body */}
        <div className="mt-0 relative z-20 overflow-visible">
          {/* Summary + images */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 items-start overflow-visible">
            <div className="lg:col-span-5 flex flex-col justify-start pt-0 lg:pt-10 order-first">
              <div className="relative mb-6">
                <SectionHeading title="SUMMARY" />
              </div>
              <div className="w-full lg:w-[140%]">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify"
                  style={{ textJustify: "inter-character", wordBreak: "break-word", hyphens: "none", textIndent: "40px" }}
                >
                  {job.summary}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[450px] hidden md:block overflow-visible order-last mt-10 lg:mt-0">
              <div className="absolute top-0 left-10 lg:left-64 w-[280px] lg:w-[360px] h-[200px] lg:h-[250px] z-10">
                <img
                  src={job.img1}
                  alt={job.img1Alt}
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-gray-50"
                />
              </div>
              <div className="absolute top-[100px] lg:top-[130px] left-[80px] lg:left-[320px] w-[280px] lg:w-[360px] h-[200px] lg:h-[250px] z-20">
                <img
                  src={job.img2}
                  alt={job.img2Alt}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="border-t border-gray-200 pt-8 mt-4 relative">
            <div className="absolute left-[33.333%] top-0 bottom-0 w-[2px] bg-[#800000] opacity-30 hidden lg:block" />

            {/* Description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-16 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <SectionHeading title="DESCRIPTION" />
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-20 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <SectionHeading title="REQUIREMENTS" />
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  {job.requirementsIntro}
                </p>
                <CheckList items={job.requirements} />
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 lg:mb-20 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <SectionHeading title="BENEFITS & PERKS" />
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify mb-6 lg:mb-8"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  The company offers a supportive and flexible work environment that values professional growth, work-life balance, and employee well-being.
                </p>
                <CheckList items={BENEFITS_ITEMS} italic />
              </div>
            </div>

            {/* Salary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-10 items-start gap-4 lg:gap-0">
              <div className="lg:col-span-4 lg:pr-8">
                <SectionHeading title="SALARY RANGE" />
              </div>
              <div className="lg:col-span-8 lg:pl-16">
                <p
                  className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 text-justify mb-6 lg:mb-8"
                  style={{ textJustify: "inter-character", textIndent: "40px" }}
                >
                  The salary range refers to the minimum to maximum compensation offered for a specific position, based on factors such as role responsibilities, experience level, skills, and company budget. It provides applicants with a clear expectation of potential earnings while allowing flexibility for negotiation depending on qualifications and performance.
                </p>
                <CheckList items={SALARY_ITEMS} italic />

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12 relative z-30">
                  {/* Apply Now → navigates to VA form page */}
                  <div
                    onClick={handleApplyNow}
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#a10000] to-[#ce1212] text-white px-8 py-3 rounded-2xl shadow-[0_10px_20px_rgba(161,0,0,0.3)] hover:shadow-[0_15px_25px_rgba(161,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "'open sans', sans-serif", fontWeight: 600 }}
                  >
                    <span className="text-[12px] sm:text-[13px] tracking-wide uppercase">apply now</span>
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>

                  <button
                    onClick={() => router.push("/client/login")}
                    className="group flex items-center justify-center gap-2 bg-white border-2 border-[#a10000] text-[#a10000] px-8 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-[#a10000] hover:to-[#ce1212] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                    style={{ fontFamily: "'open sans', sans-serif", fontWeight: 600 }}
                  >
                    <span className="text-[12px] sm:text-[13px] tracking-wide uppercase">book now</span>
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main export — JobDetails with tab navigation
// ─────────────────────────────────────────────
export default function JobDetails() {
  const searchParams = useSearchParams();

  const getInitialJob = (): JobKey => {
    const param = searchParams.get("job");
    if (param && JOB_KEYS.includes(param as JobKey)) return param as JobKey;
    return "associate-sales-manager";
  };

  const [selectedJob, setSelectedJob] = useState<JobKey>(getInitialJob);

  useEffect(() => {
    const param = searchParams.get("job");
    if (param && JOB_KEYS.includes(param as JobKey)) {
      setSelectedJob(param as JobKey);
    }
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col gap-5">
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

      {/* Active job detail */}
      <div className="max-w-7xl mx-auto px-6 w-full">
        <JobDetailPanel key={selectedJob} jobKey={selectedJob} />
      </div>
    </div>
  );
}