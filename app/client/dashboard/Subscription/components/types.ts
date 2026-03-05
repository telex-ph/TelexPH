// ─── TYPES ─────────────────────────────────────────────────────────────────────
export interface Addon {
  label: string
  price: number
}

export interface Service {
  id: string
  name: string
  short: string
  icon: string
  price: number
  priceLabel: string
  period: string
  tag: string
  featured: boolean
  description: string
  inclusions: string[]
  addons: Addon[]
  note: string | null
}

export interface ServiceCategory {
  key: string
  label: string
  icon: string
  services: Service[]
}

export interface Plan {
  id: number
  name: string
  tier: string
  price: number
  priceLabel: string
  billing: string
  renewDate: string
  daysLeft: number | null
  status: 'active' | 'ending' | 'ended'
  sessions: number
  totalSessions: number
  perks: string[]
  color: string
  bg: string
  isService: boolean
}

export interface Preferences {
  startOption: string
  duration: string
  selectedAddons: string[]
  total: number
}
