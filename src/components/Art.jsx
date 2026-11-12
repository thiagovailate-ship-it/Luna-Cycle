export function HeroArt({ className = '', variant = 'woman' }) {
  if (variant === 'moon') {
    return (
      <svg className={className} viewBox="0 0 260 220" fill="none" aria-hidden="true">
        <path d="M157 18c-45 12-74 49-74 93 0 54 42 96 96 96 12 0 24-2 35-7-20-10-33-31-33-55 0-33 26-60 59-62C226 43 194 9 157 18Z" stroke="currentColor" strokeWidth="2" opacity=".7" />
        <path d="M180 40c2 5 6 9 11 11-5 2-9 6-11 11-2-5-6-9-11-11 5-2 9-6 11-11Z" fill="currentColor" opacity=".65" />
        <path d="M47 204c9-25 24-40 45-47 12-4 17-11 21-24 7-24 24-39 47-42 24-3 41 12 44 34 2 15-3 29-17 40-11 9-16 20-15 39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M81 176c-12-12-21-25-25-40M188 170c12-10 20-24 23-42" stroke="currentColor" strokeWidth="1.4" opacity=".45" />
        <path d="M72 204c8-16 19-27 35-34M122 204c7-13 17-22 30-27" stroke="currentColor" strokeWidth="1.4" opacity=".45" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 330 430" fill="none" aria-hidden="true">
      <g opacity=".55" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M18 408c22-47 45-76 74-95 22-14 28-37 41-71 20-51 52-77 96-72 45 6 69 42 60 84-6 28-25 45-55 64-26 16-35 38-32 90" />
        <path d="M119 265c-27-24-44-54-50-91M257 256c23-18 39-41 47-71" />
        <path d="M79 408c15-31 35-54 61-70M187 408c11-21 26-37 46-49M252 408c8-15 20-27 36-37" />
        <path d="M55 345c-15-20-24-40-28-62M289 342c12-12 22-28 29-47" />
      </g>
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M112 146c-10-19-3-38 11-49 9-7 19-9 31-9 31 0 51 19 56 45 5 25-6 44-20 57-9 9-15 18-17 31" />
        <path d="M145 88c-3 17 2 32 16 39 11 6 24 5 35-3" />
        <path d="M145 88c-19 3-33 14-35 31-2 14 7 26 21 30" />
        <path d="M126 127c-10 0-17-7-17-16 0-3 1-7 3-9" />
        <path d="M160 127c-9 8-8 18-1 23M173 125c6 1 12 4 15 9" />
        <path d="M172 170c-14 8-19 20-18 37 1 24 9 43 9 65" />
        <path d="M204 181c13 9 20 22 19 39-1 20-9 37-10 59" />
      </g>
      <g fill="currentColor" opacity=".13">
        <path d="M252 279c16 7 27 20 31 39-16 1-30-5-39-18-5-7-6-14-5-21 4 2 9 2 13 0Z" />
        <path d="M259 278c-11-4-19-12-23-24 13 0 24 5 30 15 3 4 4 8 4 12-4 1-8 0-11-3Z" />
      </g>
      <path d="M92 362c15-27 33-45 55-56M227 362c-11-21-27-37-48-49" stroke="currentColor" strokeWidth="1.3" opacity=".35" />
    </svg>
  )
}

export function BabyArt({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 340 330" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="baby-womb-fill" cx="42%" cy="34%" r="74%">
          <stop offset="0%" stopColor="#FFF4F2" />
          <stop offset="42%" stopColor="#FAD7DB" />
          <stop offset="76%" stopColor="#F1B3BF" />
          <stop offset="100%" stopColor="#E5A0AE" />
        </radialGradient>
        <linearGradient id="baby-womb-rim" x1="60" y1="30" x2="300" y2="310" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3C0CA" />
          <stop offset=".55" stopColor="#E6A3B1" />
          <stop offset="1" stopColor="#D98697" />
        </linearGradient>
        <radialGradient id="baby-head-skin" cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#FFF2E7" />
          <stop offset="55%" stopColor="#F9CDBC" />
          <stop offset="100%" stopColor="#EDA596" />
        </radialGradient>
        <linearGradient id="baby-body-skin" x1="170" y1="140" x2="235" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBE0D2" />
          <stop offset=".55" stopColor="#F5C4B2" />
          <stop offset="1" stopColor="#EAA091" />
        </linearGradient>
        <linearGradient id="baby-limb-skin" x1="160" y1="150" x2="210" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBDCCD" />
          <stop offset="1" stopColor="#EDA898" />
        </linearGradient>
        <linearGradient id="baby-cord" x1="90" y1="180" x2="170" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFB3C2" />
          <stop offset="1" stopColor="#E295A9" />
        </linearGradient>
        <filter id="baby-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <ellipse cx="172" cy="166" rx="158" ry="164" fill="#F6C8D1" opacity=".32" filter="url(#baby-blur)" />

      <g transform="rotate(-7 172 166)">
        <ellipse cx="172" cy="166" rx="143" ry="151" fill="url(#baby-womb-rim)" />
        <ellipse cx="172" cy="166" rx="135" ry="143" fill="url(#baby-womb-fill)" />
        <ellipse cx="167" cy="157" rx="112" ry="120" stroke="#FFF" strokeOpacity=".3" strokeWidth="2" />
      </g>

      <g strokeLinecap="round" fill="none">
        <path d="M171 207c-20 7-32-6-48-4-13 2-22-8-29-20" stroke="url(#baby-cord)" strokeWidth="8" />
        <path d="M171 207c-20 7-32-6-48-4-13 2-22-8-29-20" stroke="#FBD3DC" strokeWidth="2.6" strokeDasharray="5 7" opacity=".9" />
      </g>

      <ellipse cx="196" cy="246" rx="52" ry="16" fill="#D98B9C" opacity=".18" filter="url(#baby-blur)" />

      <path d="M222 218c-20 18-42 22-58 15" stroke="#E5A093" strokeWidth="23" strokeLinecap="round" />
      <path d="M164 233c-13 3-22 12-24 24" stroke="#E5A093" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx="139" cy="262" rx="14" ry="9" transform="rotate(-24 139 262)" fill="#F0B7A8" />
      <path d="M131 258c3-1 7 0 10 2" stroke="#DF9C8E" strokeWidth="1.4" strokeLinecap="round" />

      <path d="M208 143c25 6 41 29 40 53-1 23-16 40-37 44-24 5-45-9-52-31-7-22 2-43 18-55 10-7 21-12 31-11Z" fill="url(#baby-body-skin)" />
      <path d="M240 166c10 18 8 40-6 53" stroke="#E3A092" strokeWidth="2.4" opacity=".5" strokeLinecap="round" />
      <ellipse cx="188" cy="206" rx="25" ry="30" transform="rotate(-18 188 206)" fill="#FBE2D5" opacity=".5" />

      <path d="M218 209c-13 20-30 30-46 27-12-2-20 8-17 19 3 12 15 18 27 14" stroke="url(#baby-limb-skin)" strokeWidth="27" strokeLinecap="round" />
      <ellipse cx="188" cy="274" rx="16" ry="10" transform="rotate(10 188 274)" fill="#F9D2C3" />
      <path d="M178 270c3-2 8-2 11 0" stroke="#E3A294" strokeWidth="1.6" strokeLinecap="round" />

      <path d="M215 162c-6 13-6 24-1 33" stroke="#EEB2A1" strokeWidth="16" strokeLinecap="round" />

      <g transform="rotate(-12 224 112)">
        <ellipse cx="224" cy="112" rx="46" ry="48" fill="url(#baby-head-skin)" />
        <path d="M231 64c20 6 33 21 36 41" stroke="#E3A096" strokeWidth="3" opacity=".45" strokeLinecap="round" />
        <path d="M244 107c7 2 9 10 5 16-3 5-9 6-12 3" fill="#F2B4A6" stroke="#DC9288" strokeWidth="2.2" />
        <path d="M246 112c3 2 3 6 1 9" stroke="#DC9288" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
        <path d="M183 87c-6 11-8 23-5 33 2 6-1 10 2 15 3 5 9 7 15 6" stroke="#E2A094" strokeWidth="2.1" strokeLinecap="round" opacity=".6" />
        <path d="M180 123c3 4 8 5 12 2" stroke="#DC9288" strokeWidth="2" strokeLinecap="round" />
        <path d="M187 134c4 2 8 2 11-1" stroke="#CD8287" strokeWidth="2" strokeLinecap="round" />
        <path d="M189 111c5 4 11 4 16 0" stroke="#B96F6F" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M190 115c1 2 3 3 5 3" stroke="#B96F6F" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
        <path d="M189 103c5-3 11-3 16 0" stroke="#E0A094" strokeWidth="2" strokeLinecap="round" opacity=".6" />
        <ellipse cx="204" cy="126" rx="12" ry="9" transform="rotate(-12 204 126)" fill="#F7B9A8" opacity=".4" />
        <path d="M197 73c8-9 21-14 33-12" stroke="#E7AA9D" strokeWidth="6" strokeLinecap="round" opacity=".28" />
      </g>

      <path d="M215 163c-6 12-4 23 3 30" stroke="#F2BCAB" strokeWidth="17" strokeLinecap="round" />
      <path d="M214 170c1 8 2 15 5 20" stroke="#FBDCCD" strokeWidth="7" strokeLinecap="round" opacity=".4" />
      <path d="M218 191c-6-5-10-11-11-18" stroke="#F2BCAB" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="206" cy="167" rx="11" ry="10" transform="rotate(-30 206 167)" fill="#F8CDBC" />
      <path d="M200 163c2-2 5-3 8-2" stroke="#E3A294" strokeWidth="1.5" strokeLinecap="round" />

      <ellipse cx="198" cy="92" rx="16" ry="22" transform="rotate(-18 198 92)" fill="#FFF" opacity=".22" />
    </svg>
  )
}

export function BraceletArt({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 240 260" fill="none" aria-hidden="true">
      <ellipse cx="120" cy="133" rx="90" ry="91" fill="#F9E5E6" opacity=".7" />
      <path d="M58 72c25-31 97-31 123 0 20 24 20 96 0 120-26 31-97 31-123 0-20-24-20-96 0-120Z" fill="#D58698" opacity=".38" />
      <path d="M61 73c25-29 94-29 118 0 18 22 18 91 0 113-24 29-93 29-118 0-18-22-18-91 0-113Z" stroke="var(--rose)" strokeWidth="12" strokeLinecap="round" />
      <path d="M68 84c22-24 82-24 104 0 14 17 14 78 0 95-22 24-82 24-104 0-14-17-14-78 0-95Z" stroke="#EAB1BC" strokeWidth="5" opacity=".8" />
      <rect x="91" y="116" width="58" height="38" rx="13" fill="#F9EFF0" stroke="var(--rose)" strokeWidth="2" />
      <path d="M111 134c3-6 9-9 15-6 5 3 6 8 3 13-3 4-8 7-13 9-5-2-10-5-13-9-3-5-2-10 3-13 1-1 3-1 5 0Z" fill="var(--rose)" opacity=".65" />
      <path d="M56 78c-10 13-14 34-14 55M184 78c10 13 14 34 14 55" stroke="#B8657B" strokeWidth="5" strokeLinecap="round" opacity=".5" />
    </svg>
  )
}

export function DecorativeLeaf({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" aria-hidden="true">
      <path d="M52 158C48 117 52 73 75 31c7-13 15-21 23-26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 112c-18-9-29-22-34-42 19 2 33 10 41 24M60 84c14-9 22-22 24-40-15 7-25 18-30 34M77 58c-9-9-12-20-10-34 11 7 17 17 18 30" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}
