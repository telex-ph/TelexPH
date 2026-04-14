"use client";

import React from "react";
import { BarChart3, Eye, LineChart, PieChart } from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

const FEATURES = [
  {
    title: "Page view totals",
    description:
      "Track how often your blogs and case studies are opened so you know what content resonates.",
    Icon: Eye,
  },
  {
    title: "Trends over time",
    description:
      "Spot daily, weekly, and monthly patterns to plan releases and campaigns with confidence.",
    Icon: LineChart,
  },
  {
    title: "Resource breakdown",
    description:
      "Compare performance across assets and double down on topics that drive real engagement.",
    Icon: PieChart,
  },
  {
    title: "Admin-ready dashboards",
    description:
      "Your team gets clear charts and summaries in one place—no spreadsheets required.",
    Icon: BarChart3,
  },
];

export default function PageViewsAnalyticsSection() {
  return (
    <section
      id="page-views-analytics"
      className="w-full px-4 sm:px-6 lg:px-16 py-12 lg:py-20 bg-gradient-to-b from-white to-gray-50/80"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <p
              className={`text-sm ${FONT_CLASSES.openSansBold} uppercase tracking-wide flex items-center gap-2 mb-3`}
              style={{ color: COLORS.primary }}
            >
              <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
              Page views analytics
            </p>
            <h2
              className={`text-[1.75rem] md:text-[2.5rem] lg:text-[3rem] ${FONT_CLASSES.openSansBold} text-gray-900 leading-tight`}
            >
              See how every page
              <br />
              performs at a glance
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-3 leading-relaxed">
              We measure visits to your public content so you can grow with data, not gut feel. Metrics stay
              focused on traffic and engagement—simple, actionable, and built for busy teams.
            </p>
          </div>

          <div
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:max-w-sm w-full"
            aria-hidden
          >
            <p className={`text-xs ${FONT_CLASSES.openSansBold} text-gray-400 uppercase tracking-wider mb-4`}>
              Example snapshot
            </p>
            <div className="flex items-end justify-between gap-2 h-28">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 5 ? COLORS.primary : `${COLORS.primary}33`,
                      minHeight: 8,
                    }}
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">Weekly page views (illustrative)</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className={`text-lg ${FONT_CLASSES.openSansBold} text-gray-900 mb-2`}>{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
