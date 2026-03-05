// ── Shared types for the Admin Dashboard ────────────────────────────────────

export interface DailyView {
  date: string
  count: number
}

export interface CaseStudyAnalytics {
  resourceId: string
  dailyViews: DailyView[]
  viewCount: number
}

export interface EngagementData {
  name: string
  views: number
  likes: number
}

export interface CaseStudyStats {
  totalAllTime: number
  totalUnique: number
  daily: number
  weekly: number
  monthly: number
  yearly: number
}

export interface QuickStats {
  totalViews: number
  totalUniqueViews: number
  totalBlogs: number
  totalCaseStudies: number
  totalClients: number
  totalAppointments: number
}

export type ResourceFilter = 'all' | 'blog' | 'casestudy'

// ── Time period filter for Engagement Metrics ────────────────────────────────
export type TimeFilter = 'daily' | 'weekly' | 'monthly' | '6months' | 'custom'

export interface DateRange {
  startDate: string // ISO date string 'YYYY-MM-DD'
  endDate: string   // ISO date string 'YYYY-MM-DD'
}

export interface IService {
  _id: string
  serviceId: string
  name: string
  description: string
  badge: string
  isActive: boolean
  coverPhoto?: string | null
  inactivePhoto?: string | null
}

export interface ThemeTokens {
  isdarkmode: boolean
  cardBg: string
  borderColor: string
  textPrimary: string
  textMuted: string
  subtleBg: string
  pageBg: string
  inputBg: string
  card: React.CSSProperties
}