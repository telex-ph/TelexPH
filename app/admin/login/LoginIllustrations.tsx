export function DashboardIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="200" cy="330" rx="140" ry="16" fill="#000" opacity="0.25" />

      <g className="animate-illo-float-slow">
        <rect x="80" y="110" width="240" height="160" rx="16" fill="#fff" />
        <rect x="80" y="110" width="240" height="36" rx="16" fill="#800000" />
        <circle cx="100" cy="128" r="4" fill="#fff" opacity="0.8" />
        <circle cx="114" cy="128" r="4" fill="#fff" opacity="0.5" />
        <circle cx="128" cy="128" r="4" fill="#fff" opacity="0.3" />

        <rect x="100" y="162" width="76" height="46" rx="8" fill="#fdeaea" />
        <path d="M108 194 L122 174 L135 185 L149 168" stroke="#800000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <rect x="184" y="162" width="116" height="46" rx="8" fill="#fdeaea" />
        <rect x="196" y="190" width="9" height="12" rx="2" fill="#a10000" />
        <rect x="211" y="180" width="9" height="22" rx="2" fill="#800000" />
        <rect x="226" y="170" width="9" height="32" rx="2" fill="#a10000" />
        <rect x="241" y="182" width="9" height="20" rx="2" fill="#800000" />
        <rect x="256" y="174" width="9" height="28" rx="2" fill="#a10000" />

        <rect x="100" y="218" width="200" height="34" rx="8" fill="#fdeaea" />
        <circle cx="120" cy="235" r="10" fill="#800000" opacity="0.85" />
        <rect x="140" y="228" width="100" height="7" rx="3.5" fill="#800000" opacity="0.3" />
        <rect x="140" y="239" width="66" height="6" rx="3" fill="#800000" opacity="0.18" />
      </g>

      <g className="animate-illo-float-fast">
        <circle cx="330" cy="96" r="30" fill="#fff" />
        <path d="M318 96 L326 104 L342 86" stroke="#800000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <g className="animate-illo-float-med">
        <circle cx="62" cy="222" r="24" fill="#fff" opacity="0.95" />
        <path d="M52 222h20M62 212v20" stroke="#a10000" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g className="animate-illo-float-med" style={{ animationDelay: '-2.4s' }}>
        <rect x="256" y="284" width="52" height="52" rx="14" fill="#fff" />
        <path d="M272 310 L281 319 L296 302" stroke="#800000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <circle cx="60" cy="90" r="5" fill="#fff" opacity="0.5" className="animate-illo-float-fast" />
      <circle cx="340" cy="250" r="4" fill="#fff" opacity="0.4" className="animate-illo-float-med" />
    </svg>
  )
}

export function SecurityIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="200" cy="330" rx="140" ry="16" fill="#000" opacity="0.25" />

      <g className="animate-illo-float-slow">
        <path d="M200 96 L300 128 V206 C300 262 256 298 200 318 C144 298 100 262 100 206 V128 Z" fill="#fff" />
        <path d="M200 110 L286 138 V204 C286 252 250 282 200 300 C150 282 114 252 114 204 V138 Z" fill="#fdeaea" />
        <rect x="172" y="192" width="56" height="44" rx="9" fill="#800000" />
        <path d="M184 192 v-16 a16 16 0 0 1 32 0 v16" stroke="#800000" strokeWidth="8" fill="none" />
        <circle cx="200" cy="210" r="6" fill="#fff" />
        <rect x="196" y="215" width="8" height="14" rx="4" fill="#fff" />
      </g>

      <g className="animate-illo-float-fast">
        <circle cx="82" cy="140" r="26" fill="#fff" />
        <path d="M72 140 L80 148 L94 130" stroke="#800000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <g className="animate-illo-float-med">
        <rect x="288" y="196" width="56" height="56" rx="14" fill="#fff" />
        <circle cx="316" cy="216" r="7" fill="#a10000" opacity="0.7" />
        <rect x="300" y="230" width="32" height="6" rx="3" fill="#800000" opacity="0.25" />
        <rect x="300" y="240" width="20" height="6" rx="3" fill="#800000" opacity="0.15" />
      </g>

      <g className="animate-illo-float-med" style={{ animationDelay: '-3s' }}>
        <circle cx="90" cy="268" r="20" fill="#fff" opacity="0.95" />
        <circle cx="90" cy="268" r="7" fill="#a10000" opacity="0.6" />
      </g>

      <circle cx="330" cy="320" r="5" fill="#fff" opacity="0.5" className="animate-illo-float-fast" />
      <circle cx="70" cy="80" r="4" fill="#fff" opacity="0.4" className="animate-illo-float-med" />
    </svg>
  )
}

export function TeamIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="200" cy="330" rx="140" ry="16" fill="#000" opacity="0.25" />

      <g className="animate-illo-float-slow">
        <rect x="110" y="140" width="180" height="132" rx="18" fill="#fff" />
        <circle cx="200" cy="188" r="28" fill="#fdeaea" />
        <circle cx="200" cy="179" r="11" fill="#800000" opacity="0.85" />
        <path d="M176 212 a24 24 0 0 1 48 0" fill="#800000" opacity="0.85" />
        <rect x="146" y="234" width="108" height="9" rx="4.5" fill="#fdeaea" />
        <rect x="160" y="250" width="80" height="7" rx="3.5" fill="#fdeaea" />
      </g>

      <g className="animate-illo-float-fast">
        <circle cx="92" cy="108" r="34" fill="#fff" />
        <circle cx="92" cy="99" r="12" fill="#800000" opacity="0.8" />
        <path d="M66 130 a26 26 0 0 1 52 0" fill="#800000" opacity="0.8" />
      </g>

      <g className="animate-illo-float-med">
        <circle cx="312" cy="132" r="32" fill="#fff" />
        <circle cx="312" cy="123" r="11" fill="#a10000" opacity="0.8" />
        <path d="M288 152 a25 25 0 0 1 50 0" fill="#a10000" opacity="0.8" />
      </g>

      <g className="animate-illo-float-med" style={{ animationDelay: '-2.2s' }}>
        <rect x="290" y="240" width="50" height="50" rx="14" fill="#fff" />
        <path d="M303 262 h24 M303 271 h16" stroke="#800000" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </g>

      <g className="animate-illo-float-fast" style={{ animationDelay: '-1.4s' }}>
        <circle cx="82" cy="264" r="22" fill="#fff" opacity="0.95" />
        <path d="M73 264 h18 M82 255 v18" stroke="#800000" strokeWidth="4" strokeLinecap="round" />
      </g>

      <circle cx="340" cy="300" r="5" fill="#fff" opacity="0.5" className="animate-illo-float-med" />
      <circle cx="55" cy="180" r="4" fill="#fff" opacity="0.4" className="animate-illo-float-fast" />
    </svg>
  )
}

export const loginSlides = [
  {
    id: 'dashboard',
    Illustration: DashboardIllustration,
    title: 'Operate with clarity',
    description: 'Track performance and manage operations from a single dashboard.',
  },
  {
    id: 'security',
    Illustration: SecurityIllustration,
    title: 'Built for security',
    description: 'Every login is protected so your data stays safe and private.',
  },
  {
    id: 'team',
    Illustration: TeamIllustration,
    title: 'Empower your team',
    description: 'Coordinate teams and clients seamlessly in one place.',
  },
]
