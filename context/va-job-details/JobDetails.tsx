"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Plus, MapPin, Calendar, Clock, Banknote } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type JobKey =
  | "virtual-executive-assistant"
  | "social-media-manager"
  | "customer-support-specialist"
  | "digital-marketing-specialist"
  | "bookkeeping-specialist"
  | "content-writer";

const JOB_KEYS: JobKey[] = [
  "virtual-executive-assistant",
  "social-media-manager",
  "customer-support-specialist",
  "digital-marketing-specialist",
  "bookkeeping-specialist",
  "content-writer",
];

const jobLabels: { key: JobKey; label: string }[] = [
  { key: "virtual-executive-assistant", label: "Virtual Executive Assistant" },
  { key: "social-media-manager", label: "Social Media Manager" },
  { key: "customer-support-specialist", label: "Customer Support Specialist" },
  { key: "digital-marketing-specialist", label: "Digital Marketing Specialist" },
  { key: "bookkeeping-specialist", label: "Bookkeeping Specialist" },
  { key: "content-writer", label: "Content Writer" },
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
  "Compensation is aligned with the scope of responsibilities and level of expertise required for the role",
  "Final offer is subject to evaluation of qualifications, relevant experience, and overall fit",
  "Performance, dedication, and growth within the role may open opportunities for compensation adjustments over time",
  "Additional allowances and incentives may be considered as part of the overall package",
  "Further details will be discussed with shortlisted candidates during the recruitment process",
];

const BENEFITS_ITEMS = [
  "Work-from-home setup with a structured and supportive remote work environment",
  "Opportunities to grow professionally through mentorship, feedback, and skill development",
  "Collaborative team culture that values communication, reliability, and mutual respect",
  "Exposure to international clients and diverse industries that broaden professional experience",
  "Performance-based recognition and pathways for advancement within the organization",
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
  "virtual-executive-assistant": {
    department: "operations",
    titleLeft: "virtual executive",
    titleRed: "assistant",
    posted: "mar 01, 2026",
    jobTitle: "Virtual Executive Assistant",
    jobDept: "Operations",
    img1: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
    img1Alt: "virtual assistant working remotely",
    img2: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
    img2Alt: "remote team collaboration",
    summary:
      "The Virtual Executive Assistant is a highly organized and proactive professional within our Operations division, dedicated to providing comprehensive administrative and operational support to executives and business owners across different time zones. This role demands a detail-oriented individual who can manage multiple priorities simultaneously, communicate with clarity and professionalism, and take ownership of tasks with minimal supervision. The ideal candidate is tech-savvy, adaptable, and committed to delivering consistent, high-quality assistance that empowers clients to focus on the highest-value aspects of their business.",
    description:
      "The Virtual Executive Assistant is responsible for managing executive calendars, coordinating meetings and travel arrangements, handling email correspondence, preparing reports and presentations, and supporting day-to-day administrative operations. This role also involves liaising with internal teams and external stakeholders on behalf of the client, maintaining organized digital filing systems, and ensuring that all executive priorities are tracked and executed with accuracy and timeliness.",
    requirementsIntro:
      "Candidates must demonstrate exceptional organizational skills and a strong background in administrative support, with the ability to manage executive-level responsibilities independently in a fully remote setting.",
    requirements: [
      "At least 1–3 years of experience as a virtual assistant, executive assistant, or in a similar administrative role",
      "Proficiency in productivity tools such as Google Workspace, Microsoft Office, Zoom, Slack, and project management platforms like Asana or Trello",
      "Excellent written and verbal English communication skills with a professional and client-centric approach",
      "Strong time management skills with the ability to handle multiple tasks and shifting priorities effectively",
      "Reliable internet connection and a dedicated, distraction-free remote work setup",
    ],
  },
  "social-media-manager": {
    department: "marketing",
    titleLeft: "social media",
    titleRed: "manager",
    posted: "feb 20, 2026",
    jobTitle: "Social Media Manager",
    jobDept: "Marketing",
    img1: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    img1Alt: "social media content creation",
    img2: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop",
    img2Alt: "digital marketing workspace",
    summary:
      "The Social Media Manager is a creative and analytically minded professional within our Marketing division, responsible for building and maintaining a compelling online presence for clients across key social media platforms. This role goes beyond content posting — it involves developing strategic content calendars, cultivating engaged communities, monitoring performance metrics, and translating brand identity into consistent, on-target digital storytelling. The ideal candidate is deeply familiar with platform trends, audience behavior, and content best practices, and brings a genuine passion for crafting content that drives meaningful engagement and growth.",
    description:
      "The Social Media Manager oversees the planning, creation, scheduling, and publishing of content across platforms such as Instagram, Facebook, LinkedIn, TikTok, and X (formerly Twitter). This role includes developing monthly content calendars aligned with client goals, engaging with audiences through comments and messages, tracking analytics to assess performance, and presenting insights and recommendations. The manager also coordinates with graphic designers and copywriters to ensure visual and messaging consistency.",
    requirementsIntro:
      "The ideal candidate brings hands-on experience managing social media accounts for businesses or brands, with a proven ability to grow audiences organically and deliver content that aligns with strategic objectives.",
    requirements: [
      "Minimum 1–2 years of experience managing social media accounts for brands, businesses, or agencies",
      "Proficiency with major platforms including Instagram, Facebook, LinkedIn, TikTok, and X, along with scheduling tools such as Buffer, Later, or Hootsuite",
      "Strong writing and editing skills with the ability to adapt tone and voice to different brand identities",
      "Basic graphic design skills using Canva or Adobe Express; experience with video editing tools is an advantage",
      "Familiarity with social media analytics and the ability to interpret data to inform content strategy",
    ],
  },
  "customer-support-specialist": {
    department: "client services",
    titleLeft: "customer support",
    titleRed: "specialist",
    posted: "mar 05, 2026",
    jobTitle: "Customer Support Specialist",
    jobDept: "Client Services",
    img1: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop",
    img1Alt: "customer support specialist with headset",
    img2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    img2Alt: "remote support workspace with laptop",
    summary:
      "The Customer Support Specialist is a client-facing professional within our Client Services division, responsible for delivering responsive, empathetic, and solution-oriented support to customers across various communication channels. This role is central to the client experience — ensuring that inquiries are resolved efficiently, concerns are addressed with care, and every interaction reflects the highest standard of service. The ideal candidate is patient, articulate, and genuinely motivated by helping people, with the ability to stay calm and effective under pressure while maintaining professionalism in all customer interactions.",
    description:
      "The Customer Support Specialist handles inbound customer inquiries via email, live chat, and ticketing platforms, providing timely and accurate resolutions to a wide range of issues. This role involves documenting support cases, escalating complex concerns to appropriate teams, following up to ensure customer satisfaction, and contributing to knowledge base articles and FAQs. The specialist also tracks recurring issues and reports trends to help improve service quality and client retention.",
    requirementsIntro:
      "Candidates must possess strong communication skills and a customer-first mindset, with experience in handling support tickets, resolving issues, and maintaining positive client relationships in a remote environment.",
    requirements: [
      "At least 1–2 years of experience in customer service, client support, or a related role, preferably in a remote or BPO setting",
      "Proficiency in helpdesk and CRM tools such as Zendesk, Freshdesk, HubSpot, or similar platforms",
      "Excellent verbal and written English communication skills with a warm, professional, and solution-oriented tone",
      "Ability to handle multiple conversations simultaneously while maintaining accuracy and composure",
      "Strong problem-solving skills and a genuine commitment to delivering an outstanding customer experience",
    ],
  },
  "digital-marketing-specialist": {
    department: "marketing",
    titleLeft: "digital marketing",
    titleRed: "specialist",
    posted: "feb 10, 2026",
    jobTitle: "Digital Marketing Specialist",
    jobDept: "Marketing",
    img1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    img1Alt: "digital marketing analytics dashboard",
    img2: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    img2Alt: "marketing team strategy session",
    summary:
      "The Digital Marketing Specialist is a results-driven professional within our Marketing division, responsible for planning and executing integrated online marketing campaigns that drive brand awareness, lead generation, and client growth. This role requires a strategic thinker who is equally comfortable analyzing performance data as they are crafting compelling campaign narratives. The ideal candidate is well-versed in the latest digital marketing tools and trends, and possesses the versatility to manage campaigns across multiple channels — from SEO and paid ads to email marketing and content — while consistently delivering measurable results.",
    description:
      "The Digital Marketing Specialist is responsible for developing and executing multi-channel digital marketing strategies that include search engine optimization, paid advertising (Google Ads, Meta Ads), email marketing, and content promotion. This role involves conducting keyword research, managing ad budgets, analyzing campaign performance using analytics tools, and producing reports that communicate insights and recommendations. The specialist collaborates with content and design teams to ensure cohesive messaging and brand consistency across all digital touchpoints.",
    requirementsIntro:
      "The successful candidate shall demonstrate strong digital marketing expertise with hands-on experience running paid and organic campaigns, along with a data-driven approach to optimizing performance across multiple platforms.",
    requirements: [
      "Minimum 2–3 years of experience in digital marketing, preferably in an agency or remote client-service environment",
      "Proficiency in Google Ads, Meta Ads Manager, and SEO tools such as SEMrush, Ahrefs, or Google Search Console",
      "Experience with email marketing platforms such as Mailchimp, Klaviyo, or ActiveCampaign",
      "Strong analytical skills with the ability to interpret campaign data and translate findings into actionable strategy",
      "Google Ads or Meta Blueprint certification is an advantage but not strictly required",
    ],
  },
  "bookkeeping-specialist": {
    department: "finance & accounting",
    titleLeft: "bookkeeping",
    titleRed: "specialist",
    posted: "jan 28, 2026",
    jobTitle: "Bookkeeping Specialist",
    jobDept: "Finance & Accounting",
    img1: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    img1Alt: "bookkeeping and financial records",
    img2: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
    img2Alt: "accountant reviewing financial data",
    summary:
      "The Bookkeeping Specialist is a detail-oriented and highly dependable professional within our Finance & Accounting division, responsible for maintaining accurate and up-to-date financial records for clients across various industries. This role is critical to ensuring financial clarity and compliance, enabling business owners to make informed decisions based on reliable data. The ideal candidate is proficient in accounting software, possesses a thorough understanding of bookkeeping principles, and is committed to delivering precise, timely, and well-organized financial reports that meet each client's unique needs.",
    description:
      "The Bookkeeping Specialist is responsible for recording financial transactions, reconciling bank statements, managing accounts payable and receivable, processing payroll, and maintaining accurate general ledger entries. This role also involves preparing monthly financial reports, supporting tax preparation by organizing relevant financial documents, and flagging discrepancies or irregularities for client review. The specialist works closely with clients to ensure financial data is consistently organized, accessible, and audit-ready.",
    requirementsIntro:
      "Candidates must have a solid foundation in bookkeeping and accounting practices, with demonstrated experience managing financial records for small to mid-sized businesses in a remote or virtual capacity.",
    requirements: [
      "At least 1–3 years of bookkeeping or accounting experience, preferably supporting international or remote clients",
      "Proficiency in accounting software such as QuickBooks Online, Xero, Wave, or FreshBooks",
      "Strong understanding of double-entry bookkeeping, bank reconciliation, and basic financial reporting",
      "High attention to detail with a commitment to accuracy, confidentiality, and data integrity",
      "A degree or diploma in Accounting, Finance, or a related field is preferred; equivalent professional experience is considered",
    ],
  },
  "content-writer": {
    department: "creative services",
    titleLeft: "content",
    titleRed: "writer",
    posted: "mar 10, 2026",
    jobTitle: "Content Writer",
    jobDept: "Creative Services",
    img1: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
    img1Alt: "content writer at work",
    img2: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    img2Alt: "creative team brainstorming",
    summary:
      "The Content Writer is a skilled and versatile communicator within our Creative Services division, responsible for producing high-quality written content that informs, engages, and converts across various platforms and formats. This role requires a writer who can seamlessly adapt their voice and style to match different brand identities, target audiences, and content objectives — whether crafting long-form blog articles, compelling website copy, engaging social media captions, or persuasive email campaigns. The ideal candidate is self-driven, research-oriented, and deeply passionate about the power of words to shape perception and drive action.",
    description:
      "The Content Writer is responsible for researching, writing, editing, and publishing original content for clients across industries including e-commerce, real estate, health and wellness, technology, and professional services. This role involves working from content briefs, conducting keyword research to support SEO goals, adhering to brand guidelines, and meeting editorial deadlines with consistency. The writer collaborates with marketing and design teams to ensure content is aligned with campaign objectives and platform-specific best practices.",
    requirementsIntro:
      "The ideal candidate possesses a strong command of the English language with a versatile writing style, proven experience creating content for diverse industries, and a working knowledge of SEO best practices.",
    requirements: [
      "At least 1–2 years of professional writing experience, with a portfolio demonstrating diverse content formats and industry verticals",
      "Excellent grammar, spelling, and editorial judgment with the ability to self-edit and meet tight deadlines",
      "Familiarity with SEO writing principles, keyword integration, and tools such as Surfer SEO, Clearscope, or Google Search Console",
      "Ability to adapt tone and style across different brand voices — from formal and authoritative to casual and conversational",
      "Experience with content management systems such as WordPress and basic knowledge of on-page SEO is a plus",
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
                  We foster a remote work environment that champions personal growth, professional fulfillment, and the well-being of every team member — because we believe our people are the foundation of everything we deliver.
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
                  Compensation for this position is thoughtfully structured to reflect the nature of the role, the level of expertise required, and the value each team member brings to the organization. While a specific range is part of our internal evaluation process, we are committed to offering packages that are fair, competitive, and rewarding for qualified candidates.
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
    return "virtual-executive-assistant";
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