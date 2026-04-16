"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "../../layout";
import api from "@/lib/api/axios";

// Types
export type Range = "7d" | "30d" | "90d";
export type Tab = "website" | "funnels" | "visitors";
export type JourneyStage = "Awareness" | "Consideration" | "Decision" | "Converted";

// Constants
const F = "'DM Sans', 'Helvetica Neue', sans-serif";
const F_MONO = "'DM Mono', 'JetBrains Mono', monospace";

// Theme-responsive colors
const getThemeColors = (isDarkMode: boolean) => ({
  bg: isDarkMode ? "#0d0d0d" : "#ffffff",
  surface: isDarkMode ? "#161616" : "#ffffff",
  surfaceHover: isDarkMode ? "#1e1e1e" : "#f8f9fa",
  border: isDarkMode ? "#2a2a2a" : "#e5e7eb",
  borderLight: isDarkMode ? "#222222" : "#f3f4f6",
  text: isDarkMode ? "#f0f0f0" : "#111827",
  textMuted: isDarkMode ? "#888888" : "#6b7280",
  textDim: isDarkMode ? "#555555" : "#9ca3af",
  primary: "#800000",
  primaryLight: "#a00000",
  primaryMuted: "rgba(128,0,0,0.15)",
  success: "#22c55e",
  successBg: "rgba(34,197,94,0.12)",
  danger: "#ef4444",
  dangerBg: "rgba(239,68,68,0.12)",
  warning: "#f59e0b",
  warningBg: "rgba(245,158,11,0.12)",
  chart1: "#800000",
  chart2: "#0D9488",
  chart3: "#7C3AED",
  chart4: "#F59E0B",
  chart5: "#EC4899",
  blue: "#3B82F6",
});

const getTooltipStyle = (isDarkMode: boolean): React.CSSProperties => ({
  background: isDarkMode ? "#1a1a1a" : "#ffffff",
  border: `1px solid ${isDarkMode ? "#2a2a2a" : "#e5e7eb"}`,
  borderRadius: 10,
  fontSize: 11,
  color: isDarkMode ? "#f0f0f0" : "#111827",
  padding: "8px 12px",
  fontFamily: F,
  boxShadow: isDarkMode ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.1)",
});

function fmt(n: number) {
  return n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + "M"
    : n >= 1_000
    ? (n / 1_000).toFixed(1) + "K"
    : String(n);
}

function fmtN(n: number) {
  return n.toLocaleString();
}

// Mock Data
const WEBSITE_DATA: Record<Range, any> = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    views: [18200, 21500, 19800, 24100, 26000, 17400, 15380],
    unique: [4800, 5600, 5200, 6400, 7800, 4900, 4210],
    sessions: [12400, 13800, 14200, 15600, 16800, 17400, 18200],
    totals: { views: 142380, unique: 38910, sessions: 98400, bounceRate: 41.2, avgSession: "3m 24s" },
    changes: { views: 12.4, unique: 8.7, sessions: 5.1, bounceRate: -2.3 },
  },
  "30d": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    views: [82000, 96000, 108000, 124000],
    unique: [22000, 27000, 32000, 36000],
    sessions: [48000, 53000, 60000, 68000],
    totals: { views: 410000, unique: 117000, sessions: 229000, bounceRate: 43.1, avgSession: "3m 18s" },
    changes: { views: 18.2, unique: 15.3, sessions: 9.2, bounceRate: -4.1 },
  },
  "90d": {
    labels: Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - 84 + i * 7);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    views: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50000 + 80000)),
    unique: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20000 + 25000)),
    sessions: Array.from({ length: 12 }, () => Math.floor(Math.random() * 40000 + 45000)),
    totals: { views: 1240000, unique: 351000, sessions: 687000, bounceRate: 42.8, avgSession: "3m 22s" },
    changes: { views: 22.1, unique: 19.4, sessions: 15.2, bounceRate: -3.8 },
  },
};

const TRAFFIC_SOURCES = [
  { source: "Organic Search", percentage: 42.3, color: "#6366F1" },
  { source: "Direct", percentage: 28.7, color: "#22c55e" },
  { source: "Social Media", percentage: 15.2, color: "#f59e0b" },
  { source: "Referral", percentage: 8.4, color: "#8b5cf6" },
  { source: "Email", percentage: 3.8, color: "#ec4899" },
  { source: "Paid", percentage: 1.6, color: "#ef4444" },
];

const fetchTrafficSources = async (range: Range) => {
  try {
    const response = await api.get(`/api/page-views/dashboard/page-views?range=${range}`);
    const data = response.data;
    console.log('fetchTrafficSources response', data);
    if (!Array.isArray(data.trafficSources) || data.trafficSources.length === 0) {
      return TRAFFIC_SOURCES;
    }
    const totalViews = data.trafficSources.reduce((sum: number, source: any) => sum + (source.value || 0), 0);
    return data.trafficSources.map((source: any) => ({
      source: source.name,
      percentage: totalViews > 0 ? Number(((source.value / totalViews) * 100).toFixed(1)) : 0,
      color: source.color || '#888888'
    }));
  } catch (error) {
    console.error('Error fetching traffic sources:', error);
    return TRAFFIC_SOURCES;
  }
};

const TOP_PAGES = [
  { page: "/home", views: 45200, unique: 12800, avgTime: "2m 34s", bounce: 32.1, change: 12.3 },
  { page: "/pricing", views: 38900, unique: 11200, avgTime: "3m 12s", bounce: 28.7, change: 8.9 },
  { page: "/features", views: 32100, unique: 9800, avgTime: "2m 56s", bounce: 35.2, change: -2.1 },
  { page: "/about", views: 28700, unique: 8600, avgTime: "3m 45s", bounce: 41.3, change: 5.6 },
  { page: "/contact", views: 23400, unique: 7200, avgTime: "1m 48s", bounce: 29.8, change: 15.2 },
  { page: "/blog", views: 19800, unique: 6400, avgTime: "4m 12s", bounce: 38.9, change: -8.3 },
  { page: "/services", views: 17600, unique: 5800, avgTime: "3m 28s", bounce: 33.4, change: 11.7 },
  { page: "/resources", views: 14300, unique: 4900, avgTime: "5m 15s", bounce: 42.1, change: -5.2 },
  { page: "/careers", views: 12100, unique: 4200, avgTime: "4m 38s", bounce: 36.7, change: 7.8 },
];

const FUNNELS_DATA = [
  { name: "AI Chatbot", url: "/ai-chatbot", views: 45200, conversions: 1280, rate: 2.8, change: 12.3, color: "#6366F1" },
  { name: "Email Automation", url: "/email-automation", views: 38900, conversions: 1120, rate: 2.9, change: 8.9, color: "#22c55e" },
  { name: "Lead Generation", url: "/lead-generation", views: 32100, conversions: 980, rate: 3.1, change: -2.1, color: "#f59e0b" },
  { name: "CRM Integration", url: "/crm-integration", views: 28700, conversions: 860, rate: 3.0, change: 5.6, color: "#8b5cf6" },
  { name: "Analytics Dashboard", url: "/analytics", views: 23400, conversions: 720, rate: 3.1, change: 15.2, color: "#ec4899" },
  { name: "Social Media Tools", url: "/social-tools", views: 19800, conversions: 640, rate: 3.2, change: -8.3, color: "#f97316" },
  { name: "Customer Support", url: "/support", views: 17600, conversions: 580, rate: 3.3, change: 11.7, color: "#06b6d4" },
  { name: "Project Management", url: "/project-mgmt", views: 14300, conversions: 490, rate: 3.4, change: -5.2, color: "#10b981" },
  { name: "E-commerce Platform", url: "/ecommerce", views: 12100, conversions: 420, rate: 3.5, change: 7.8, color: "#f59e0b" },
];

const VISITOR_MOCK_DATA = {
  "7d": Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + i);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visitors: Math.floor(Math.random() * 80 + 30) };
  }),
  "30d": Array.from({ length: 4 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 21 + i * 7);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visitors: Math.floor(Math.random() * 80 + 30) };
  }),
  "90d": Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 84 + i * 7);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visitors: Math.floor(Math.random() * 80 + 30) };
  }),
};

const fetchTopPages = async (range: Range) => {
  try {
    const response = await api.get(`/api/page-views/dashboard/page-views?range=${range}`);
    const data = response.data;
    console.log('fetchTopPages response', data);
    if (!Array.isArray(data.topPages) || data.topPages.length === 0) {
      return TOP_PAGES;
    }
    return data.topPages.map((page: any) => ({
      page: page.url,
      views: page.views,
      unique: page.unique,
      avgTime: "2m 34s",
      bounce: 32.1,
      change: 0
    }));
  } catch (error) {
    console.error('Error fetching top pages:', error);
    return TOP_PAGES;
  }
};

const fetchFunnels = async (range: Range, search: string, sortBy: string) => {
  try {
    const response = await api.get(`/api/page-views/funnels?range=${range}`);
    // Transform the data to match expected format
    return response.data.funnels.map((funnel: any) => ({
      name: funnel.name,
      url: funnel.url,
      views: funnel.views,
      conversions: funnel.conversions,
      rate: funnel.convRate,
      change: funnel.change,
      color: funnel.color
    }));
  } catch (error) {
    console.error('Error fetching funnels:', error);
    // Fallback to mock data if API fails
    return FUNNELS_DATA;
  }
};

const fetchVisitors = async (range: Range) => {
  try {
    const response = await api.get(`/api/page-views/dashboard/page-views?range=${range}`);
    const data = response.data;
    console.log('fetchVisitors response', data);
    if (!Array.isArray(data.daily) || data.daily.length === 0) {
      return VISITOR_MOCK_DATA[range];
    }
    return data.daily.map((day: any) => ({
      date: day.date,
      visitors: day.unique,
      pageviews: day.views,
      bounceRate: 32.1,
      avgSession: "2m 34s"
    }));
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return VISITOR_MOCK_DATA[range];
  }
};

const fetchWebsiteData = async (range: Range) => {
  try {
    const response = await api.get(`/api/page-views/dashboard/page-views?range=${range}`);
    const data = response.data;
    console.log('fetchWebsiteData response', data);
    if (!data || !data.overview) {
      throw new Error('Invalid page views data');
    }

    const daily = Array.isArray(data.daily) ? data.daily : [];
    const labels = daily.map((day: any) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const views = daily.map((day: any) => day.views || 0);
    const unique = daily.map((day: any) => day.unique || 0);
    const sessions = daily.map((day: any) => day.sessions || 0);

    const totals = {
      views: data.overview.totalViews || 0,
      unique: data.overview.uniqueViews || 0,
      sessions: data.overview.sessions || 0,
      bounceRate: data.overview.bounceRate || 0,
      avgSession: `${Math.floor(data.overview.avgPagesPerVisit || 0)}m ${Math.floor(((data.overview.avgPagesPerVisit || 0) % 1) * 60)}s`
    };

    if (daily.length === 0 && totals.views === 0 && totals.unique === 0 && totals.sessions === 0) {
      return WEBSITE_DATA[range];
    }

    return {
      labels,
      views,
      unique,
      sessions,
      totals,
      changes: data.changes || { views: 0, unique: 0, sessions: 0, bounceRate: 0 }
    };
  } catch (error) {
    console.error('Error fetching website data:', error);
    return WEBSITE_DATA[range];
  }
};


const stageStyles: Record<JourneyStage, { bg: string; text: string; border: string }> = {
  Awareness:     { bg: "rgba(124,58,237,0.15)", text: "#a78bfa", border: "rgba(124,58,237,0.3)" },
  Consideration: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  Decision:      { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Converted:     { bg: "rgba(34,197,94,0.15)",  text: "#4ade80", border: "rgba(34,197,94,0.3)"  },
};

const stageProgress: Record<JourneyStage, string> = {
  Awareness: "25%", Consideration: "50%", Decision: "75%", Converted: "100%",
};

// Shared UI Components
function Btn({ children, active, onClick, colors, style }: { 
  children: React.ReactNode; 
  active?: boolean; 
  onClick?: () => void; 
  colors: ReturnType<typeof getThemeColors>;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px", fontSize: 12, fontWeight: 500, fontFamily: F,
        border: `1px solid ${active ? colors.primary : colors.border}`,
        borderRadius: 8, cursor: "pointer",
        background: active ? colors.primary : "transparent",
        color: active ? "#ffffff" : colors.text,
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function TabBtn({ children, active, onClick, colors }: { 
  children: React.ReactNode; 
  active?: boolean; 
  onClick?: () => void;
  colors: ReturnType<typeof getThemeColors>;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 18px", fontSize: 13, fontWeight: 500, fontFamily: F,
        border: `1px solid ${active ? colors.primary : colors.border}`,
        borderRadius: 8, cursor: "pointer",
        background: active ? colors.primary : "transparent",
        color: active ? "#ffffff" : colors.text,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function DownloadBtn({ label = "Download", colors }: { label?: string; colors: ReturnType<typeof getThemeColors> }) {
  return (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 12px", fontSize: 11, fontWeight: 500, fontFamily: F,
      border: `1px solid ${colors.border}`, borderRadius: 7,
      background: colors.surfaceHover, color: colors.text, cursor: "pointer",
    }}>
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
'use client'

import { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import { WebsitePageViews, PageViewsOverviewResponse, COLORS, F } from "./WebsitePageViews";
import { FunnelsTab } from "./FunnelsTab";
import { VisitorJourneyTracker, MOCK_VISITORS } from "./VisitorJourneyTracker";

export type Range = "7d" | "30d" | "90d";
export type Tab = "pageviews" | "funnels" | "visitors";

// ── Icons ───────────────────────────────────────────────────────────
const IconDownload = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Shared UI ───────────────────────────────────────────────────────
function RangeToggle({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{
      display: "inline-flex",
      background: "#F1F5F9",
      borderRadius: 12,
      padding: 3,
      gap: 2,
    }}>
      {(["7d", "30d", "90d"] as Range[]).map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: value === o ? 600 : 400,
          background: value === o ? "#FFFFFF" : "transparent",
          color: value === o ? "#0F172A" : "#64748B",
          border: "none",
          borderRadius: 9,
          cursor: "pointer",
          fontFamily: F,
          transition: "all 0.15s ease",
          boxShadow: value === o ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function DownloadBtn({ onClick, label = "Export CSV", disabled }: { onClick: () => void; label?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 16px",
        fontSize: 12,
        fontWeight: 500,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        color: disabled ? "#94A3B8" : "#475569",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: F,
        whiteSpace: "nowrap",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => { if (!disabled) { (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; } }}
      onMouseLeave={(e) => { if (!disabled) { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; } }}
    >
      <IconDownload />
      {label}
    </button>
  );
}

function StatCard({ label, value, sub, subColor, colors }: { 
  label: string; 
  value: string; 
  sub?: string; 
  subColor?: string;
  colors: ReturnType<typeof getThemeColors>;
}) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "16px 18px" }}>
      <p style={{ fontSize: 11, color: colors.textMuted, margin: "0 0 8px", fontFamily: F }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 600, color: colors.text, margin: "0 0 6px", fontFamily: F, letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: subColor || colors.success, margin: 0, fontFamily: F }}>{sub}</p>}
    </div>
  );
}

function Card({ children, colors, style }: { 
  children: React.ReactNode; 
  colors: ReturnType<typeof getThemeColors>;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

// Website Tab
function WebsiteTab({ range, colors, tooltipStyle }: { range: Range; colors: ReturnType<typeof getThemeColors>; tooltipStyle: React.CSSProperties; }) {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [website, pages, traffic] = await Promise.all([
          fetchWebsiteData(range),
          fetchTopPages(range),
          fetchTrafficSources(range)
        ]);
        
        setWebsiteData(website);
        setTopPages(pages || []);
        setTrafficSources(traffic || []);
      } catch (error) {
        console.error('Error fetching website data:', error);
        // Set fallback data
        setWebsiteData(WEBSITE_DATA[range]);
        setTopPages(TOP_PAGES);
        setTrafficSources(TRAFFIC_SOURCES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  const d = websiteData || WEBSITE_DATA[range];
  const chartViews = useMemo(() => {
    if (!d || !d.labels || !d.views || !d.unique || !d.sessions) return [];
    return d.labels.map((label: string, i: number) => ({ 
      date: label, 
      views: d.views[i] || 0, 
      unique: d.unique[i] || 0, 
      sessions: d.sessions[i] || 0 
    }));
  }, [d]);
  
  const trafficData = useMemo(() => {
    if (!trafficSources || trafficSources.length === 0) return [];
    return trafficSources.map((s: any) => ({ 
      ...s, 
      visitors: d.totals?.views ? d.totals.views * (s.percentage || 0) / 100 : 0 
    }));
  }, [d, trafficSources]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: colors.textMuted }}>
        Loading analytics data...
      </div>
    );
  }

  // Group pages by section for visual hierarchy
  const pageSections = [
    { label: "HOME", pages: topPages.filter((p: any) => p.page === "/home") },
    { label: "ABOUT", pages: topPages.filter((p: any) => p.page === "/about") },
    { label: "COMPANY", pages: topPages.filter((p: any) => p.page === "/company") },
    { label: "EXPERTISE", pages: topPages.filter((p: any) => p.page === "/expertise") },
    { label: "TOOLS", pages: topPages.filter((p: any) => p.page === "/tools") },
    { label: "SERVICES", pages: topPages.filter((p: any) => p.page === "/services" || p.page === "/services/what-we-offer") },
    { label: "WHY US", pages: topPages.filter((p: any) => p.page === "/why-us") },
    { label: "RESOURCES", pages: topPages.filter((p: any) => p.page === "/resources" || p.page === "/resources/case-studies" || p.page === "/resources/industry-use-cases" || p.page === "/resources/blogs") },
    { label: "CAREERS", pages: topPages.filter((p: any) => p.page === "/careers" || p.page === "/careers/career-center" || p.page === "/careers/career-details") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <StatCard label="Total page views" value={fmt(d.totals.views)}
          sub={`\u25b2 ${d.changes.views}% vs prior`} colors={colors} />
        <StatCard label="Unique visitors" value={fmt(d.totals.unique)}
          sub={`\u25b2 ${d.changes.unique}% vs prior`} colors={colors} />
        <StatCard label="Bounce rate" value={`${d.totals.bounceRate}%`}
          sub={`\u25bc ${Math.abs(d.changes.bounceRate)}% vs prior`} subColor={colors.success} colors={colors} />
        <StatCard label="Avg session" value={d.totals.avgSession}
          sub={`\u25b2 ${d.changes.sessions}% vs prior`} colors={colors} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
        <Card colors={colors}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.border}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>Page views &amp; unique visitors</p>
              <p style={{ fontSize: 11, color: colors.textMuted, margin: "2px 0 0", fontFamily: F }}>Daily trend over selected period</p>
            </div>
            <DownloadBtn colors={colors} />
          </div>
          <div style={{ padding: "16px", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartViews} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={14} barGap={3}>
                <CartesianGrid vertical={false} stroke={colors.borderLight} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: colors.textMuted, fontFamily: F }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: colors.textMuted, fontFamily: F }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(Number(v))} width={34} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="views" fill={colors.chart1} radius={[3, 3, 0, 0]} opacity={0.9} />
                <Bar dataKey="unique" fill="#6366F1" radius={[3, 3, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card colors={colors}>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.border}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>Traffic sources</p>
              <p style={{ fontSize: 11, color: colors.textMuted, margin: "2px 0 0", fontFamily: F }}>By channel</p>
            </div>
            <DownloadBtn colors={colors} />
          </div>
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <PieChart width={110} height={110}>
                <Pie data={trafficSources} cx={51} cy={51} innerRadius={33} outerRadius={50} dataKey="value" strokeWidth={0}>
                  {trafficSources.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {trafficSources.map((s) => (
                  <div key={s.source} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 12, height: 12, background: s.color, borderRadius: 3 }} />
                      <span style={{ fontSize: 12, color: colors.text, fontFamily: F }}>{s.source}</span>
                    </div>
                    <span style={{ fontSize: 12, color: colors.textMuted, fontFamily: F }}>{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Pages */}
      <Card colors={colors}>
        <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>Top pages</p>
            <p style={{ fontSize: 11, color: colors.textMuted, margin: "2px 0 0", fontFamily: F }}>By page views this period</p>
          </div>
          <DownloadBtn colors={colors} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                {["PAGE", "VIEWS", "UNIQUE", "AVG TIME", "BOUNCE", "SHARE"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 10, fontWeight: 600, color: colors.textDim, textAlign: i === 0 ? "left" : "right", fontFamily: F, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageSections.map((section, si) => (
                <React.Fragment key={section.label}>
                  {/* Section header row */}
                  <tr style={{ background: colors.borderLight }}>
                    <td
                      colSpan={6}
                      style={{
                        padding: "6px 14px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: colors.textDim,
                        fontFamily: F,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        borderBottom: `1px solid ${colors.border}`,
                        borderTop: si > 0 ? `1px solid ${colors.border}` : "none",
                      }}
                    >
                      {section.label}
                    </td>
                  </tr>
                  {/* Pages in this section */}
                  {section.pages.map((row, i) => {
                    const isSubPage = row.page.split("/").length > 2;
                    return (
                      <tr
                        key={row.page}
                        style={{ borderBottom: `1px solid ${colors.borderLight}` }}
                      >
                        <td style={{ padding: "11px 14px", fontSize: 12, fontFamily: F_MONO }}>
                          <span style={{ color: isSubPage ? colors.textMuted : colors.primary, paddingLeft: isSubPage ? 16 : 0 }}>
                            {isSubPage ? "↳ " : ""}{row.page}
                          </span>
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: colors.text, fontWeight: 600, textAlign: "right", fontFamily: F }}>{fmtN(row.views)}</td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: colors.text, fontWeight: 600, textAlign: "right", fontFamily: F }}>{fmtN(row.unique)}</td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: colors.textMuted, textAlign: "right", fontFamily: F }}>{row.time}</td>
                        <td style={{ padding: "11px 14px", fontSize: 12, color: colors.textMuted, textAlign: "right", fontFamily: F }}>{row.bounce}</td>
                        <td style={{ padding: "11px 14px", textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                            <span style={{ fontSize: 11, color: colors.text, fontFamily: F }}>{row.share}%</span>
                            <div style={{ width: 72, height: 5, background: colors.borderLight, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${row.share}%`, height: "100%", background: colors.primary, borderRadius: 3 }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Funnels Tab
function FunnelsTab({ range, colors, tooltipStyle }: { range: Range; colors: ReturnType<typeof getThemeColors>; tooltipStyle: React.CSSProperties; }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "conv" | "change">("views");
  const [funnelsData, setFunnelsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFunnels(range, search, sortBy);
        setFunnelsData(data || []);
      } catch (error) {
        console.error('Error fetching funnels data:', error);
        setFunnelsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range, search, sortBy]);

  const totalViews = funnelsData.reduce((s, f) => s + (f.views || 0), 0);
  const totalConv = funnelsData.reduce((s, f) => s + (f.conversions || 0), 0);
  const avgRate = funnelsData.length > 0 ? (funnelsData.reduce((s, f) => s + parseFloat(f.rate || '0'), 0) / funnelsData.length).toFixed(2) : "0.00";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? funnelsData.filter((f: any) => f.name?.toLowerCase().includes(q) || f.url?.toLowerCase().includes(q)) : funnelsData;
    return [...list].sort((a: any, b: any) => {
      if (sortBy === "views") return (b.views || 0) - (a.views || 0);
      if (sortBy === "conv") return (b.conversions || 0) - (a.conversions || 0);
      if (sortBy === "change") return parseFloat(b.change || '0') - parseFloat(a.change || '0');
      return 0;
    });
  }, [search, sortBy, funnelsData]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: colors.textMuted }}>
        Loading funnel data...
      </div>
    );
  }

  const SORT_ICONS: Record<string, string> = { views: "Views", conv: "Conversions", change: "Change" };
  const serviceIcons = ["\ud83d\udcf1", "\ud83d\udcc5", "\ud83d\udce7", "\ud83e\udd16", "\ud83c\udf10", "\ud83c\udf93", "\ud83d\udcbb", "\u26a1", "\ud83d\udccb"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        <StatCard label="Total funnel views" value={fmt(totalViews)} sub="\u25b2 15.2% vs prior" colors={colors} />
        <StatCard label="Unique visitors" value={fmt(Math.round(totalViews * 0.69))} sub="\u25b2 11.4% vs prior" colors={colors} />
        <StatCard label="Total conversions" value={fmt(totalConv)} sub="\u25b2 13.8% vs prior" colors={colors} />
        <StatCard label="Avg. conv. rate" value={`${avgRate}%`} sub="\u25b2 0.6% vs prior" colors={colors} />
        <StatCard label="Active funnels" value={String(funnelsData.length)} sub="Tracked services" subColor={colors.textMuted} colors={colors} />
      </div>

      {/* Funnel Cards Grid */}
      <Card colors={colors}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${colors.border}` }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, margin: "0 0 12px", letterSpacing: "0.08em", fontFamily: F, textTransform: "uppercase" }}>ALL FUNNEL SERVICES</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 140 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: colors.textDim, pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search funnels..."
                style={{ width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, fontSize: 12, fontFamily: F, border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.surfaceHover, color: colors.text, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {/* Sort Buttons */}
            {(["views", "conv", "change"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding: "6px 14px", fontSize: 12, fontWeight: 500, fontFamily: F,
                border: `1px solid ${sortBy === s ? colors.primary : colors.border}`,
                borderRadius: 8, cursor: "pointer",
                background: sortBy === s ? colors.primary : "transparent",
                color: sortBy === s ? "#ffffff" : colors.text,
              }}>
                {SORT_ICONS[s]}
              </button>
            ))}
            <DownloadBtn label="Download all" colors={colors} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: colors.border }}>
          {filtered.map((f: any, i: number) => {
            const maxViews = funnelsData.length > 0 ? Math.max(...funnelsData.map((f: any) => f.views || 0)) : 1;
            const barPct = Math.round(((f.views || 0) / maxViews) * 100);
            const funnelColor = f.color || colors.primary;
            return (
              <div key={f.url || i} style={{ background: colors.surface, padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${funnelColor}20`, border: `1px solid ${funnelColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                      {serviceIcons[i % serviceIcons.length]}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>{f.name || 'Unknown Funnel'}</p>
                      <p style={{ fontSize: 10, color: colors.textDim, margin: "2px 0 0", fontFamily: F_MONO }}>{f.url}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: colors.success, fontFamily: F,
                    background: colors.successBg, padding: "2px 7px", borderRadius: 5,
                  }}>
                    {((f.rate || f.convRate || '0').toString())}%
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 10, color: colors.textDim, margin: "0 0 2px", fontFamily: F }}>Views</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>{fmt(f.views || 0)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: colors.textDim, margin: "0 0 2px", fontFamily: F }}>Conv.</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>{fmt(f.conversions || f.conv || 0)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: colors.textDim, margin: "0 0 2px", fontFamily: F }}>Change</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: colors.success, margin: 0, fontFamily: F }}>+{f.change || '0'}%</p>
                  </div>
                </div>
                <div style={{ height: 4, background: colors.borderLight, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${barPct}%`, background: `linear-gradient(90deg, ${funnelColor}99, ${funnelColor})`, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// Visitor Journey Tab
function VisitorTab({ range, colors, tooltipStyle }: { range: Range; colors: ReturnType<typeof getThemeColors>; tooltipStyle: React.CSSProperties; }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchVisitors(range);
        setChartData(data);
        // For now, use mock visitor list data since backend doesn't provide individual visitors
        setVisitors([
          { id: "V-F0CE1E", initials: "1E", lastSeen: "1h ago", visits: 37, pages: 4, stage: "Decision" as JourneyStage, device: "Desktop", source: "Organic Search", color: "#6366F1", duration: "12m 45s", pageList: ["Homepage", "Pricing", "Features", "Contact"] },
          { id: "V-E7A61E", initials: "1E", lastSeen: "2h ago", visits: 2, pages: 2, stage: "Decision" as JourneyStage, device: "Mobile", source: "Direct", color: "#6366F1", duration: "3m 20s", pageList: ["Homepage", "Blog"] },
          { id: "V-78CD42", initials: "42", lastSeen: "2h ago", visits: 2, pages: 2, stage: "Consideration" as JourneyStage, device: "Desktop", source: "Social Media", color: "#f59e0b", duration: "5m 12s", pageList: ["Blog", "About"] },
          { id: "V-E6AA5B", initials: "5B", lastSeen: "2h ago", visits: 2, pages: 2, stage: "Consideration" as JourneyStage, device: "Tablet", source: "Referral", color: "#f59e0b", duration: "8m 55s", pageList: ["Services", "Pricing"] },
          { id: "V-24CDBB", initials: "BB", lastSeen: "3h ago", visits: 2, pages: 2, stage: "Consideration" as JourneyStage, device: "Mobile", source: "Organic Search", color: "#f59e0b", duration: "2m 10s", pageList: ["Homepage", "Blog"] },
          { id: "V-A91F3C", initials: "3C", lastSeen: "4h ago", visits: 5, pages: 7, stage: "Decision" as JourneyStage, device: "Desktop", source: "Direct", color: "#22c55e", duration: "15m 30s", pageList: ["Pricing", "Features", "Docs", "Contact", "Blog", "About", "Home"] },
          { id: "V-B3DE22", initials: "22", lastSeen: "5h ago", visits: 12, pages: 15, stage: "Converted" as JourneyStage, device: "Desktop", source: "Organic Search", color: "#3B82F6", duration: "24m 18s", pageList: ["Home", "Pricing", "Checkout"] },
          { id: "V-CC0012", initials: "12", lastSeen: "6h ago", visits: 1, pages: 1, stage: "Awareness" as JourneyStage, device: "Mobile", source: "Social Media", color: "#7C3AED", duration: "1m 45s", pageList: ["Homepage"] },
        ]);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
        setChartData(VISITOR_MOCK_DATA[range]);
        setVisitors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);
  const decisionCount = visitors.filter((v: any) => v.stage === "Decision").length;
  const convertedCount = visitors.filter((v: any) => v.stage === "Converted").length;
  const avgPages = visitors.length > 0 ? (visitors.reduce((s: number, v: any) => s + (v.pages || 0), 0) / visitors.length).toFixed(1) : "0.0";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? visitors.filter(v => v.id.toLowerCase().includes(q)) : visitors;
  }, [search, visitors]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: colors.textMuted }}>
        Loading visitor data...
      </div>
    );
  }

  const displayed = showAll ? filtered : filtered.slice(0, 5);
  const hidden = filtered.length - 5;
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <StatCard label="Total visitors tracked" value={String(visitors.length)} sub="unique visitors" subColor={colors.primary} colors={colors} />
        <StatCard label="Converted" value={String(convertedCount)} sub={`${Math.round(convertedCount / visitors.length * 100)}% of total`} colors={colors} />
        <StatCard label="In decision stage" value={String(decisionCount)} sub="high intent" subColor={colors.success} colors={colors} />
        <StatCard label="Avg. pages / visit" value={avgPages} sub="this period" subColor={colors.success} colors={colors} />
      </div>

      {/* Tracker Card */}
      <Card colors={colors}>
        {/* Header */}
        <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0, fontFamily: F }}>Visitor Journey Tracker</p>
            <p style={{ fontSize: 11, color: colors.textMuted, margin: "2px 0 0", fontFamily: F }}>
              {filtered.length} unique visitors tracked · Updated {now}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: colors.textDim, pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search visitor ID..."
                style={{ paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, fontSize: 11, fontFamily: F, border: `1px solid ${colors.border}`, borderRadius: 8, background: colors.surfaceHover, color: colors.text, outline: "none", width: 160 }}
              />
            </div>
            <DownloadBtn colors={colors} />
          </div>
        </div>

        {/* Chart */}
        <div style={{ padding: "16px", height: 180, borderBottom: `1px solid ${colors.border}` }}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={colors.borderLight} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: colors.textMuted, fontFamily: F }} axisLine={false} tickLine={false}
                interval={range === "30d" ? 4 : 0} dy={5} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Visitors"]} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Area dataKey="visitors" fill={colors.primary} radius={[3, 3, 0, 0] as any} opacity={0.85} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Visitor List */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {displayed.map((v, i) => {
            const isOpen = expanded === v.id;
            const ss = stageStyles[v.stage as JourneyStage];
            return (
              <div key={v.id} style={{ borderBottom: i < displayed.length - 1 ? `1px solid ${colors.borderLight}` : "none" }}>
                <div
                  onClick={() => setExpanded(isOpen ? null : v.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                    cursor: "pointer", background: isOpen ? colors.surfaceHover : "transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = colors.surfaceHover; }}
                  onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: `${v.color}20`, border: `1.5px solid ${v.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: v.color, fontFamily: F_MONO,
                  }}>
                    {v.initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: colors.text, fontFamily: F_MONO }}>{v.id}</span>
                      <span style={{ fontSize: 9, color: colors.textDim, background: colors.borderLight, padding: "1px 5px", borderRadius: 4, fontFamily: F }}>{v.device}</span>
                    </div>
                    <p style={{ fontSize: 10, color: colors.textMuted, margin: 0, fontFamily: F }}>
                      {v.source} · Last seen {v.lastSeen} · {v.visits} visits · {v.pages} pages
                    </p>
                  </div>

                  {/* Stage badge */}
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99,
                    background: ss.bg, color: ss.text, border: `1px solid ${ss.border}`,
                    fontFamily: F, whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    {v.stage}
                  </span>

                  {/* Progress */}
                  <div style={{ width: 50, height: 3, background: colors.borderLight, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ height: "100%", width: stageProgress[v.stage as JourneyStage], background: ss.text, borderRadius: 2 }} />
                  </div>

                  {/* Chevron */}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"
                    style={{ color: colors.textDim, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ background: colors.surfaceHover, borderTop: `1px solid ${colors.borderLight}`, padding: "12px 16px 12px 62px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {v.pageList.map((page: any, pi: number) => (
                        <div key={pi} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 11, color: colors.textMuted, fontFamily: F }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: colors.primary, opacity: 0.6 }} />
                          {page}
                          {pi < v.pageList.length - 1 && (
                            <svg width="8" height="8" fill="none" viewBox="0 0 24 24" style={{ color: colors.textDim }}>
                              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 10, color: colors.textDim, margin: "8px 0 0", fontFamily: F_MONO }}>
                      Visitor ID: {v.id} · Session: {v.duration}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show more */}
        {!showAll && hidden > 0 && (
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${colors.border}` }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                width: "100%", padding: "9px 0", fontSize: 12, fontWeight: 500,
                background: colors.primaryMuted, border: `1px solid ${colors.primary}40`,
                borderRadius: 8, color: colors.primary, cursor: "pointer", fontFamily: F,
              }}
            >
              Show {hidden} more visitors
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

// Main Dashboard
export default function AnalyticsDashboard() {
  const { isdarkmode } = useDarkMode();
  const [tab, setTab] = useState<Tab>("website");
  const [range, setRange] = useState<Range>("7d");
  
  const colors = getThemeColors(isdarkmode);
  const tooltipStyle = getTooltipStyle(isdarkmode);

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: "28px 28px 40px", fontFamily: F, color: colors.text }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: "-0.02em", color: colors.text }}>Analytics</h1>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: "4px 0 0" }}>Page views, traffic &amp; engagement overview</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["7d", "30d", "90d"] as Range[]).map(r => (
            <Btn key={r} active={range === r} onClick={() => setRange(r)} colors={colors}>
              {r === "7d" ? "Last 7 days" : r === "30d" ? "Last 30 days" : "Last 90 days"}
            </Btn>
          ))}
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 14px", fontSize: 12, fontWeight: 500, fontFamily: F,
            border: `1px solid ${colors.border}`, borderRadius: 8,
            background: "transparent", color: colors.textMuted, cursor: "pointer",
          }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <TabBtn active={tab === "website"} onClick={() => setTab("website")} colors={colors}>Website</TabBtn>
        <TabBtn active={tab === "funnels"} onClick={() => setTab("funnels")} colors={colors}>Funnels</TabBtn>
        <TabBtn active={tab === "visitors"} onClick={() => setTab("visitors")} colors={colors}>Visitor Journey</TabBtn>
      </div>

      {/* Tab Content */}
      {tab === "website" && <WebsiteTab range={range} colors={colors} tooltipStyle={tooltipStyle} />}
      {tab === "funnels" && <FunnelsTab range={range} colors={colors} tooltipStyle={tooltipStyle} />}
      {tab === "visitors" && <VisitorTab range={range} colors={colors} tooltipStyle={tooltipStyle} />}
    </div>
// ── Utils ─────────────────────────────────────────────────────────────────────
function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const allRows = headers.length ? [headers, ...rows] : rows;
  const csv = allRows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

// Mock data for demo
const MOCK_OVERVIEW: PageViewsOverviewResponse = {
  range: "30d",
  daily: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dateKey: d.toISOString().split("T")[0]!,
      views: Math.floor(1200 + Math.random() * 800),
      unique: Math.floor(700 + Math.random() * 400),
      sessions: Math.floor(900 + Math.random() * 500),
    };
  }),
  totals: { views: 38420, uniqueVisitors: 18650, sessions: 25340, avgPagesPerVisit: 3.2, bounceRate: 41.5 },
  changes: { views: 12.4, unique: 8.7, sessions: 10.2, bounceRate: -3.1 },
  topPages: [
    { page: "/", label: "Homepage", section: "Home", views: 12800, change: 15.2 },
    { page: "/services", label: "Our Services", section: "Services", views: 7340, change: 8.1 },
    { page: "/about", label: "About Us", section: "About", views: 4210, change: -2.4 },
    { page: "/contact", label: "Contact", section: "Other", views: 3620, change: 22.7 },
    { page: "/pricing", label: "Pricing Plans", section: "Services", views: 3100, change: 18.5 },
    { page: "/blog", label: "Resources & Blog", section: "Resources", views: 2850, change: 6.3 },
    { page: "/careers", label: "Join Our Team", section: "Careers", views: 1400, change: -5.8 },
    { page: "/why-us", label: "Why Choose Us", section: "Why Us", views: 1100, change: 11.0 },
  ],
  trafficSources: [
    { name: "Organic Search", value: 42, color: COLORS.chart1 },
    { name: "Direct", value: 28, color: COLORS.chart2 },
    { name: "Social Media", value: 18, color: COLORS.chart3 },
    { name: "Referral", value: 12, color: COLORS.chart4 },
  ],
  devices: [
    { device: "Desktop", views: 22000 },
    { device: "Mobile", views: 13500 },
    { device: "Tablet", views: 2920 },
  ],
  funnels: [
    { name: "AI Builder", url: "https://preview.ghl/ai-builder", views: 8400, unique: 6200, conversions: 642, convRate: 7.64, change: 21.4, color: COLORS.chart1 },
    { name: "Automation", url: "https://preview.ghl/automation", views: 7100, unique: 5800, conversions: 548, convRate: 7.71, change: 12.2, color: COLORS.chart2 },
    { name: "Booking & Appointment", url: "https://preview.ghl/booking", views: 6100, unique: 4800, conversions: 348, convRate: 5.71, change: -3.2, color: COLORS.chart3 },
    { name: "Courses/Products", url: "https://preview.ghl/courses", views: 5250, unique: 4100, conversions: 490, convRate: 9.33, change: 14.6, color: COLORS.chart4 },
    { name: "CRM", url: "https://preview.ghl/crm", views: 4700, unique: 3900, conversions: 281, convRate: 5.98, change: 6.8, color: COLORS.chart5 },
    { name: "CSR", url: "https://preview.ghl/csr", views: 4200, unique: 3100, conversions: 224, convRate: 5.33, change: 11.2, color: COLORS.chart1 },
    { name: "Document Signing", url: "https://preview.ghl/document-signing", views: 3800, unique: 2800, conversions: 190, convRate: 5.00, change: 4.5, color: COLORS.chart2 },
    { name: "Email Marketing", url: "https://preview.ghl/email-marketing", views: 3500, unique: 2500, conversions: 175, convRate: 5.00, change: 8.1, color: COLORS.chart3 },
    { name: "Gray-Label", url: "https://preview.ghl/gray-label", views: 3100, unique: 2100, conversions: 124, convRate: 4.00, change: 2.2, color: COLORS.chart4 },
    { name: "Funnel Builder", url: "https://preview.ghl/funnel-builder", views: 2900, unique: 1900, conversions: 150, convRate: 5.17, change: 18.4, color: COLORS.chart5 },
    { name: "SMS", url: "https://preview.ghl/sms", views: 2600, unique: 1600, conversions: 110, convRate: 4.23, change: 3.4, color: COLORS.chart1 },
    { name: "Social Media Management", url: "https://preview.ghl/social-media", views: 2400, unique: 1500, conversions: 100, convRate: 4.16, change: 7.2, color: COLORS.chart2 },
    { name: "Surveys & Forms", url: "https://preview.ghl/surveys", views: 2100, unique: 1200, conversions: 80, convRate: 3.81, change: -1.2, color: COLORS.chart3 },
    { name: "Tech Support", url: "https://preview.ghl/tech-support", views: 1800, unique: 1000, conversions: 65, convRate: 3.61, change: 5.5, color: COLORS.chart4 },
    { name: "Video & Graphics Design", url: "https://preview.ghl/video-graphics", views: 1500, unique: 800, conversions: 45, convRate: 3.00, change: 2.1, color: COLORS.chart5 },
    { name: "Web Development", url: "https://preview.ghl/web-development", views: 1200, unique: 600, conversions: 30, convRate: 2.50, change: 1.5, color: COLORS.chart1 },
    { name: "Website Builder", url: "https://preview.ghl/website-builder", views: 900, unique: 400, conversions: 20, convRate: 2.22, change: -0.5, color: COLORS.chart2 },
    { name: "White-Label", url: "https://preview.ghl/white-label", views: 600, unique: 200, conversions: 10, convRate: 1.66, change: 0.0, color: COLORS.chart3 },
  ],
};

export default function PageViewsAnalytics() {
  const [tab, setTab] = useState<Tab>("visitors");
  const [range, setRange] = useState<Range>("30d");
  const [overview, setOverview] = useState<PageViewsOverviewResponse>(MOCK_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadingVisitors, setDownloadingVisitors] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api
      .get<PageViewsOverviewResponse>("/dashboard/page-views", { params: { range } })
      .then((res) => {
        if (!cancelled) {
          setOverview(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Could not load analytics. Check that you are signed in and the API is reachable.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [range]);

  // Fallback to mock data if there are no real funnel views yet
  const funnels = overview.funnels.length > 0 ? overview.funnels : MOCK_OVERVIEW.funnels;

  const handleDownloadPageViews = () => {
    const rows: (string | number)[][] = [
      ["=== Traffic Over Time ==="],
      ["Date", "Views", "Unique Visitors", "Sessions"],
      ...overview.daily.map((d) => [d.date, d.views, d.unique, d.sessions]),
    ];
    downloadCSV(`page-views-${range}.csv`, [], rows);
  };

  const handleDownloadFunnels = () => {
    const sorted = [...funnels].sort((a, b) => b.views - a.views);
    downloadCSV("ghl-funnels.csv",
      ["Funnel Name", "URL", "Views", "Unique Visitors", "Conversions", "Conv. Rate (%)", "Change (%)"],
      sorted.map((f) => [f.name, f.url, f.views, f.unique, f.conversions, f.convRate, f.change])
    );
  };

  const handleDownloadVisitors = async () => {
    setDownloadingVisitors(true);
    try {
      const res = await api.get("/dashboard/page-views/visitors/download", {
        params: { range },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visitor-journey-${range}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingVisitors(false);
    }
  };

  const TABS: { label: string; value: Tab; badge?: number }[] = [
    { label: "Visitor Journey", value: "visitors", badge: overview.totals.uniqueVisitors },
    { label: "Website Page Views", value: "pageviews", badge: overview.totals.views },
    { label: "Funnels", value: "funnels", badge: funnels.length },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ fontFamily: F, color: "#0F172A", display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s ease" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid #E2E8F0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(79,70,229,0.25)",
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: F, letterSpacing: "-0.5px", color: "#0F172A" }}>
                Analytics Dashboard
              </h2>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "3px 0 0", fontFamily: F }}>
                Track performance, funnels & visitor journeys
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {tab === "pageviews" && <DownloadBtn onClick={handleDownloadPageViews} label="Export Views" disabled={!overview} />}
            {tab === "funnels" && <DownloadBtn onClick={handleDownloadFunnels} label="Export CSV" disabled={funnels.length === 0} />}
            {tab === "visitors" && <DownloadBtn onClick={handleDownloadVisitors} label={downloadingVisitors ? "Downloading…" : "Export Visitors"} disabled={downloadingVisitors} />}
            <RangeToggle value={range} onChange={setRange} />
          </div>
        </div>

        {loadError && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" /><path d="M12 8v4M12 16h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <p style={{ fontSize: 13, color: "#DC2626", fontFamily: F, margin: 0 }}>{loadError}</p>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 14, padding: 4, width: "fit-content" }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              style={{
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: tab === t.value ? 600 : 400,
                background: tab === t.value ? "#FFFFFF" : "transparent",
                border: "none",
                borderRadius: 10,
                color: tab === t.value ? "#0F172A" : "#64748B",
                cursor: "pointer",
                fontFamily: F,
                display: "flex", alignItems: "center", gap: 7,
                transition: "all 0.15s",
                boxShadow: tab === t.value ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {t.label}
              {t.badge !== undefined && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 99,
                  background: tab === t.value ? COLORS.primaryMuted : "#E2E8F0",
                  color: tab === t.value ? COLORS.primary : "#64748B",
                  fontFamily: F, lineHeight: 1.7,
                }}>
                  {loading ? "…" : t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "24px 0" }}>
            <div style={{ width: 16, height: 16, border: "2px solid #E2E8F0", borderTopColor: COLORS.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: 13, color: "#94A3B8", fontFamily: F, margin: 0 }}>Loading analytics…</p>
          </div>
        )}

        {/* ── Page Views Tab ── */}
        {tab === "pageviews" && !loading && (
          <WebsitePageViews overview={overview} />
        )}

        {/* ── Funnels Tab ── */}
        {tab === "funnels" && !loading && (
          <FunnelsTab range={range} onRangeChange={setRange} />
        )}

        {/* ── Visitor Journey Tab ── */}
        {tab === "visitors" && !loading && <VisitorJourneyTracker range={range} />}
      </div>
    </>
  );
}