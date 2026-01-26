"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import DetailsHeader from "./DetailsHeader";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaLink,
  FaFilePdf
} from "react-icons/fa";
import { COLORS, FONTS, getColorWithOpacity } from "@/constant/styles";

const ALL_CONTENT_DATA: Record<string, any> = {
  "6": {
    challenge: "Rapidly changing geopolitical landscapes and fragmented port data made it impossible for shippers to predict freight rate fluctuations.",
    solution: "C.H. Robinson aggregated data from over 500 ports and 2,000 carrier contracts to create a transparent, real-time market visibility framework.",
    resultsSummary: [
      "Accurate rate forecasting",
      "Early risk detection",
      "Competitive benchmarking",
      "Strengthened supply resilience"
    ],
    body: [
      { 
        title: "Navigating the New Global Trade Era", 
        text: "The global trade landscape in early 2026 is no stranger to the volatility of energy costs and shifting international regulations. For years, companies operated with a reactive mindset—adjusting to port congestions and rate hikes only after they occurred. However, as trade corridors expanded and regional complexities grew, this status quo became unsustainable. Shippers started experiencing massive operational bottlenecks because they lacked a single source of truth for market data." 
      },
      { 
        title: "Recognizing the Need for Data Transparency", 
        text: "As portfolios grew in size, the absence of integrated technology left procurement teams dependent on manual tracking and anecdotal market reports. This hindered the ability to respond swiftly to geopolitical shifts or optimize logistics across multiple global sites. They needed a smarter, more scalable way to manage market intelligence. Recognizing this need, the firm shifted towards a data-driven approach, ultimately leveraging C.H. Robinson's analytical powerhouse to address the next phase of their trade strategy." 
      },
      { 
        title: "Aggregated Intelligence and Real-Time Visibility", 
        text: "Once the data framework was implemented, C.H. Robinson took decisive action. By centralizing data from thousands of carrier contracts and global port authorities, the system shifted control back to the shipper. The transportation management system now enables seamless market entry, comprehensive risk reporting, and streamlined lane analysis all in one place. This integrated technology allows teams to see performance issues before they impact the bottom line." 
      },
      { 
        title: "Overcoming Market Setbacks with Innovation", 
        text: "The first real test came when sudden regulatory changes in Southeast Asian ports threatened to derail Q1 budgets. Using the new Market Trends framework, the firm was able to establish a dedicated mitigation strategy within 48 hours. Onsite experts and data scientists coordinated to re-route critical shipments, sorting through compliant and non-compliant carriers. This proactive response turned a potential financial setback into an opportunity for operational excellence." 
      },
      { 
        title: "Strategic Results and Long-term Empowerment", 
        text: "The newfound transparency led to profound results. Projects saw cost savings, reduced risk, and smoother operations across the board. The strong relationship between data and execution meant better forecasting for project needs and resources. C.H. Robinson didn’t just meet expectations; they redefined what success looks like for global trade logistics in 2026." 
      }
    ]
  }
};

function CaseStudyDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "6";
  const study = ALL_CONTENT_DATA[id] || ALL_CONTENT_DATA["6"];

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden">
        <DetailsHeader />
      </div>

      <main className="w-full px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white">
          
          <div className="lg:col-span-8">
            <div className="flex gap-3 mb-8 print:hidden">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaLink].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-[#a10000] hover:text-white transition-all text-gray-500">
                  <Icon size={14} />
                </div>
              ))}
            </div>

            <article className="space-y-12">
              {study.body.map((item: any, idx: number) => (
                <div key={idx} className="break-inside-avoid">
                  {item.title && (
                    <h2 
                      className="text-2xl font-bold uppercase mb-6" 
                      style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
                    >
                      {item.title}
                    </h2>
                  )}
                  <p 
                    className="leading-relaxed mb-8 text-[18px]"
                    style={{ 
                      fontFamily: FONTS.rubik, 
                      color: getColorWithOpacity("dark", 0.7) 
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </article>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f9f9f9] p-10 border-l-4" style={{ borderColor: COLORS.primary }}>
              <h3 
                className="text-xl font-bold uppercase mb-4" 
                style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
              >
                Challenge
              </h3>
              <p 
                style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.8) }}
                className="leading-relaxed"
              >
                {study.challenge}
              </p>
            </div>

            <div className="bg-[#f9f9f9] p-10 border-l-4" style={{ borderColor: COLORS.primary }}>
              <h3 
                className="text-xl font-bold uppercase mb-4" 
                style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
              >
                Solution
              </h3>
              <p 
                style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.8) }}
                className="leading-relaxed"
              >
                {study.solution}
              </p>
            </div>

            <div className="bg-[#f9f9f9] p-10 border-l-4" style={{ borderColor: COLORS.primary }}>
              <h3 
                className="text-xl font-bold uppercase mb-6" 
                style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
              >
                Result
              </h3>
              <ul className="space-y-4">
                {study.resultsSummary.map((res: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: COLORS.primary }} className="font-bold">•</span>
                    <span 
                      style={{ fontFamily: FONTS.rubik, color: getColorWithOpacity("dark", 0.8) }}
                      className="leading-tight font-medium"
                    >
                      {res}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 print:hidden">
          <button 
            onClick={handlePrintPDF}
            className="flex items-center gap-3 text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md text-[13px]"
            style={{ backgroundColor: COLORS.primary, fontFamily: FONTS.poppins }}
          >
            <FaFilePdf size={18} />
            Download PDF
          </button>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 20mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .lg\:col-span-8 { width: 65% !important; float: left !important; }
          .lg\:col-span-4 { width: 30% !important; float: right !important; }
          .grid { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function CaseStudiesCardDetailsPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white font-bold text-[24px]">LOADING...</div>}>
      <CaseStudyDetailsContent />
    </Suspense>
  );
}