import { useId } from 'react'

export function CycleOrbitArt({ className = '', size = 240 }) {
  const raw = useId().replace(/:/g, '')
  const id = `orbit-${raw}`
  return (
    <svg className={`cycle-orbit-art ${className}`} width={size} height={size} viewBox="0 0 240 240" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="30" y1="20" x2="215" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7b9c6" />
          <stop offset=".52" stopColor="#d76f8b" />
          <stop offset="1" stopColor="#9b4e76" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="104" fill={`url(#${id})`} opacity=".28" />
      <circle cx="120" cy="120" r="91" stroke="#fff" strokeOpacity=".7" strokeWidth="1.4" strokeDasharray="3 9" />
      <circle cx="120" cy="120" r="68" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2" />
      <path d="M120 29a91 91 0 0 1 78.8 45.5" stroke="#fff" strokeOpacity=".95" strokeWidth="3" strokeLinecap="round" />
      <path d="M211 120a91 91 0 0 1-45.5 78.8" stroke="#fff" strokeOpacity=".45" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M120 211a91 91 0 0 1-78.8-45.5" stroke="#fff" strokeOpacity=".25" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M29 120a91 91 0 0 1 45.5-78.8" stroke="#fff" strokeOpacity=".2" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="120" cy="29" r="8" fill="#fff" opacity=".95" />
      <circle cx="211" cy="120" r="7" fill="#f7c5cf" />
      <circle cx="120" cy="211" r="6" fill="#b58ac9" opacity=".8" />
      <circle cx="29" cy="120" r="6" fill="#9bc9bd" opacity=".8" />
      <circle cx="120" cy="120" r="45" fill="#fff" fillOpacity=".16" stroke="#fff" strokeOpacity=".38" strokeWidth="1.2" />
      <path d="M120 91c8.5 11.5 15 19.2 15 27.2a15 15 0 0 1-30 0c0-8 6.5-15.7 15-27.2Z" fill="#fff" fillOpacity=".95" />
      <path d="M120 101c4.4 6.2 8.2 11.4 8.2 16" stroke="#c35f7a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="128" cy="119" r="2" fill="#c35f7a" opacity=".7" />
      <g fill="#fff">
        <path d="M56 44c1.2 3.2 3.2 5.2 6.4 6.4-3.2 1.2-5.2 3.2-6.4 6.4-1.2-3.2-3.2-5.2-6.4-6.4 3.2-1.2 5.2-3.2 6.4-6.4Z" opacity=".85" />
        <path d="M190 174c.8 2.3 2.3 3.8 4.6 4.6-2.3.8-3.8 2.3-4.6 4.6-.8-2.3-2.3-3.8-4.6-4.6 2.3-.8 3.8-2.3 4.6-4.6Z" opacity=".65" />
        <circle cx="47" cy="169" r="2.2" opacity=".6" />
        <circle cx="198" cy="61" r="2.6" opacity=".7" />
      </g>
    </svg>
  )
}

export function CycleHeroArt({ className = '' }) {
  const raw = useId().replace(/:/g, '')
  const id = `hero-${raw}`
  return (
    <svg className={`cycle-hero-art ${className}`} viewBox="0 0 440 440" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-blob`} x1="62" y1="40" x2="390" y2="410" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f9c8d1" />
          <stop offset=".55" stopColor="#dd8298" />
          <stop offset="1" stopColor="#a55076" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="130" y1="70" x2="310" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7b354f" />
          <stop offset="1" stopColor="#4d2538" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="210" y1="90" x2="280" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7cfc5" />
          <stop offset="1" stopColor="#e8a99f" />
        </linearGradient>
      </defs>
      <path d="M224 18c93 0 172 75 172 170 0 104-78 206-177 234C120 394 38 311 38 194 38 90 120 18 224 18Z" fill={`url(#${id}-blob)`} opacity=".58" />
      <circle cx="220" cy="202" r="150" stroke="#fff" strokeOpacity=".38" strokeWidth="1.5" strokeDasharray="4 10" />
      <circle cx="220" cy="202" r="117" stroke="#fff" strokeOpacity=".24" strokeWidth="1.2" />
      <path d="M220 52a150 150 0 0 1 129.9 75" stroke="#fff" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" />
      <path d="M370 202a150 150 0 0 1-75 129.9" stroke="#fff" strokeOpacity=".32" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="220" cy="52" r="9" fill="#fff" opacity=".92" />
      <circle cx="370" cy="202" r="7.5" fill="#f9c8d1" />
      <circle cx="220" cy="352" r="6.5" fill="#c5a2dd" opacity=".8" />
      <circle cx="70" cy="202" r="6.5" fill="#a9d5c7" opacity=".8" />
      <path d="M164 376c-10-56-8-101 7-141 12-32 13-63 2-91-8-20-6-43 9-61 13-16 33-20 53-13 27 9 43 35 44 64 1 26-11 47-33 64-19 15-28 36-25 62 3 31 16 71 31 116" fill={`url(#${id}-hair)`} />
      <path d="M198 93c-18 6-29 22-28 41 1 22 16 39 38 43 4 1 7 1 11 1 4 15 2 30-5 44-5 10-12 17-23 21" fill={`url(#${id}-face)`} />
      <path d="M199 94c-15 8-23 21-22 36 1 19 14 34 33 38" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <path d="M221 136c-4 5-3 11 2 14M235 134c4 1 8 4 10 8" stroke="#9b5a5c" strokeWidth="2" strokeLinecap="round" opacity=".75" />
      <circle cx="231" cy="126" r="2" fill="#9b5a5c" opacity=".75" />
      <path d="M206 176c-11 8-18 19-19 34-1 21 8 40 23 53" stroke={`url(#${id}-hair)`} strokeWidth="10" strokeLinecap="round" />
      <path d="M247 178c12 7 19 18 20 32 1 20-7 38-21 51" stroke={`url(#${id}-hair)`} strokeWidth="9" strokeLinecap="round" opacity=".85" />
      <path d="M138 401c25-55 58-91 99-109M293 402c-19-41-47-72-83-92" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <g fill="#fff">
        <path d="M87 83c1.6 4.2 4.2 6.8 8.4 8.4-4.2 1.6-6.8 4.2-8.4 8.4-1.6-4.2-4.2-6.8-8.4-8.4 4.2-1.6 6.8-4.2 8.4-8.4Z" opacity=".88" />
        <path d="M354 314c1.1 3 3 4.9 6 6-3 1.1-4.9 3-6 6-1.1-3-3-4.9-6-6 3-1.1 4.9-3 6-6Z" opacity=".7" />
        <circle cx="73" cy="287" r="3" opacity=".55" />
        <circle cx="346" cy="91" r="3.4" opacity=".72" />
        <circle cx="316" cy="380" r="2.4" opacity=".6" />
      </g>
      <path d="M308 126c6.2 9.2 11 15.2 11 21.2a11 11 0 0 1-22 0c0-6 4.8-12 11-21.2Z" fill="#fff" fillOpacity=".92" />
      <path d="M308 134c3 4.4 5.5 8 5.5 11.3" stroke="#cb6b85" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PeriodFlowArt({ className = '', level = 2 }) {
  const drops = [0.28, 0.55, 0.9]
  return (
    <span className={`period-flow-art ${className}`} aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <svg key={index} viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path
            d="M12 3.5c2.7 3.7 5.4 6.8 5.4 9.7a5.4 5.4 0 1 1-10.8 0C6.6 10.3 9.3 7.2 12 3.5Z"
            fill="currentColor"
            fillOpacity={index < level ? drops[Math.min(index, 2)] : 0.08}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}
