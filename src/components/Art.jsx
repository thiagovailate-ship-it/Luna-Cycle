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
        <linearGradient id="womb" x1="70" y1="20" x2="290" y2="310" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6C9CE" />
          <stop offset="1" stopColor="#D9899B" />
        </linearGradient>
      </defs>
      <path d="M169 11c65 0 119 53 119 119 0 78-53 147-119 189C103 277 50 208 50 130 50 64 104 11 169 11Z" fill="url(#womb)" opacity=".38" />
      <path d="M169 11c65 0 119 53 119 119 0 78-53 147-119 189C103 277 50 208 50 130 50 64 104 11 169 11Z" stroke="currentColor" strokeWidth="2" opacity=".45" />
      <path d="M191 62c-29-12-61 3-74 30-11 24-5 52 14 69 19 17 48 20 69 7 25-16 36-48 25-75-6-14-18-25-34-31Z" fill="#F3AAB5" opacity=".55" stroke="currentColor" strokeWidth="2" />
      <path d="M167 77c-20 4-35 18-37 37-2 20 12 38 32 43 19 5 39-4 47-21 9-18 3-39-13-51-8-6-19-9-29-8Z" fill="#E88D9F" opacity=".3" />
      <path d="M174 98c-19 0-35 14-37 33-2 15 7 29 20 36 13 8 30 6 41-4 12-11 16-28 10-43-6-14-19-22-34-22Z" fill="#D7778D" opacity=".72" stroke="currentColor" strokeWidth="1.7" />
      <path d="M151 111c-7 8-10 18-8 28M145 130c-8 3-13 10-14 19M163 141c-6 9-7 20-1 29M184 151c-7 5-10 13-8 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
      <path d="M187 103c-3 7-4 14-2 21 1 4 4 7 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="181" cy="118" r="2" fill="currentColor" opacity=".65" />
      <path d="M124 174c-10 5-15 15-13 26 3 15 17 26 33 26M221 175c12 4 20 15 19 29-1 13-10 24-22 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".65" />
      <path d="M84 277c-8 5-13 14-13 24M258 277c8 5 13 14 13 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".45" />
      <path d="M192 36c2 5 6 9 11 11-5 2-9 6-11 11-2-5-6-9-11-11 5-2 9-6 11-11Z" fill="currentColor" opacity=".45" />
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
