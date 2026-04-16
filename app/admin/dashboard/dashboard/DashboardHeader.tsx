'use client'

import { useDashboardTheme } from './useDashboardTheme'

interface DashboardHeaderProps {
  selecteddate: string
  onDateChange: (val: string) => void
}

// ── Header: title + date picker ──────────────────────────────────────────────
export default function DashboardHeader({ selecteddate, onDateChange }: DashboardHeaderProps) {
  const { borderColor, textPrimary, textMuted, inputBg, isdarkmode } = useDashboardTheme()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
        paddingBottom: 22,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: textPrimary,
            margin: 0,
            lineHeight: 1.3,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Dashboard overview
        </h2>
        <p
          style={{
            fontSize: 12,
            color: textMuted,
            margin: '4px 0 0',
            fontWeight: 400,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Key metrics and performance at a glance
        </p>
      </div>

      <div>
        <input
          type="date"
          value={selecteddate}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            width: 192,
            padding: '8px 16px',
            borderRadius: 10,
            border: `1px solid ${borderColor}`,
            background: inputBg,
            color: isdarkmode ? '#d1d5db' : '#6b7280',
            fontSize: 11,
            fontWeight: 400,
            cursor: 'pointer',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif",
          }}
        />
      </div>
    </div>
  )
}
