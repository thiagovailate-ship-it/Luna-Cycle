import { iconMap } from './icons.js'

const glyphs = {
  home: (
    <>
      <path d="M3.8 11.2 12 4l8.2 7.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.4 10.1V20h11.2v-9.9" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10.1 20v-5.1h3.8V20" fill="currentColor" opacity=".28" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.2" width="17" height="15" rx="3.5" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.8 3.5v3.5M16.2 3.5v3.5M3.8 9.6h16.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="13.2" r="1.5" fill="currentColor" />
      <circle cx="14.9" cy="13.2" r="1.5" fill="currentColor" opacity=".45" />
      <path d="M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
    </>
  ),
  drop: (
    <>
      <path d="M12 3.2c3.1 4.2 6.2 7.6 6.2 11.1a6.2 6.2 0 1 1-12.4 0C5.8 10.8 8.9 7.4 12 3.2Z" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.1 14.7c0 1.9 1.3 3.3 3.2 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.2" cy="10" r="1.05" fill="currentColor" opacity=".75" />
    </>
  ),
  cycle: (
    <>
      <circle cx="12" cy="12" r="8.2" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.8a8.2 8.2 0 0 1 7.4 4.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.4 8.5h-3.1M19.4 8.5V5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20.2a8.2 8.2 0 0 1-7.4-4.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <path d="M4.6 15.5h3.1M4.6 15.5v3.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity=".55" />
      <circle cx="12" cy="12" r="2.15" fill="currentColor" opacity=".8" />
    </>
  ),
  health: (
    <>
      <path d="M12 20s-7.2-4.5-7.2-9.2A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.2 2.6C19.2 15.5 12 20 12 20Z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.8 12.5h2.4l1.3-2.2 2 4.3 1.3-2.1h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  symptoms: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.2 12.2h2l1.1-2.5 1.8 5.2 1.1-2.7h2.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.1" cy="9.2" r="1" fill="currentColor" opacity=".65" />
      <circle cx="15.2" cy="8.2" r=".8" fill="currentColor" opacity=".45" />
    </>
  ),
  chart: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="3.5" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.3 15.5v-3.1M11.7 15.5V8.2M16.1 15.5v-5.1" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M7 8.5l3.1-2.4 3 2 3.6-3.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity=".55" />
    </>
  ),
  report: (
    <>
      <path d="M6 3.8h8.6l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14.3 3.9V8h3.9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.2 12.5h7.4M8.2 15.6h5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".65" />
      <path d="M8.2 9.5h2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M6.4 10.2a5.6 5.6 0 0 1 11.2 0c0 4 1.4 5.5 1.9 6.1H4.5c.5-.6 1.9-2.1 1.9-6.1Z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10.2 19.3a2.2 2.2 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18.7" cy="6.2" r="2.1" fill="currentColor" opacity=".85" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity=".85" />
      <path d="M12 9.4c-1.5-3.7-.5-5.8 1.2-6.1 1.7-.3 2.6 1.6 1.3 4.4M14.5 12c3.7-1.5 5.8-.5 6.1 1.2.3 1.7-1.6 2.6-4.4 1.3M12 14.5c1.5 3.7.5 5.8-1.2 6.1-1.7.3-2.6-1.6-1.3-4.4M9.5 12c-3.7 1.5-5.8.5-6.1-1.2-.3-1.7 1.6-2.6 4.4-1.3" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.4c.7 3.8 2 5.1 5.8 5.8-3.8.7-5.1 2-5.8 5.8-.7-3.8-2-5.1-5.8-5.8 3.8-.7 5.1-2 5.8-5.8Z" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18.2 14.3c.35 1.9 1 2.55 2.9 2.9-1.9.35-2.55 1-2.9 2.9-.35-1.9-1-2.55-2.9-2.9 1.9-.35 2.55-1 2.9-2.9Z" fill="currentColor" opacity=".7" />
      <circle cx="6.2" cy="17.3" r="1.3" fill="currentColor" opacity=".6" />
    </>
  ),
  water: (
    <>
      <path d="M7 6.5h10l-1.1 13.1a1.5 1.5 0 0 1-1.5 1.4H9.6a1.5 1.5 0 0 1-1.5-1.4L7 6.5Z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7.5 11.2c1.5-.9 3 .9 4.5 0s3-.9 4.5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.2 14.7c1.2-.7 2.4.7 3.6 0s2.4-.7 3.6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".55" />
      <path d="M9 6.5c0-1.6 1.3-2.9 3-2.9s3 1.3 3 2.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  moon: (
    <>
      <path d="M15.6 3.5A8.5 8.5 0 1 0 20.5 14 7 7 0 0 1 15.6 3.5Z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17.3 4.2c.35 1 1 1.65 2 2-.95.35-1.6 1-2 2-.35-1-1-1.65-2-2 .95-.35 1.6-1 2-2Z" fill="currentColor" opacity=".75" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20.2S4.3 15.6 4.3 10.3A4.4 4.4 0 0 1 12 7.7a4.4 4.4 0 0 1 7.7 2.6c0 5.3-7.7 9.9-7.7 9.9Z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.2 11.5c1.5-2.1 3.8-2.1 5.2 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".65" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.3 19.2 6v5.8c0 4.5-3 7.4-7.2 9-4.2-1.6-7.2-4.5-7.2-9V6L12 3.3Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2.1 2.1L15.3 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.8v2M12 19.2v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.8 12h2M19.2 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  device: (
    <>
      <rect x="7" y="6.5" width="10" height="11" rx="3" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 6.5V3.8M14.5 6.5V3.8M9.5 17.5v2.7M14.5 17.5v2.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 12h2l.7-1.4 1 2.8.7-1.4h1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.6" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.2 20c.7-3.6 3.3-5.6 6.8-5.6s6.1 2 6.8 5.6" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.2v2.2M12 18.6v2.2M4.5 12H2.3M21.7 12h-2.2M6.2 6.2 4.6 4.6M19.4 19.4l-1.6-1.6M6.2 17.8l-1.6 1.6M19.4 4.6l-1.6 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10.8v5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.9" r="1.15" fill="currentColor" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.6" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .9-1 1.7v.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.7" r="1.1" fill="currentColor" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5c2.8-.9 5-.6 7 .9 2-1.5 4.2-1.8 7-.9v14.1c-2.8-.9-5-.6-7 .9-2-1.5-4.2-1.8-7-.9V4.5Z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 5.4v14.1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.4 8.5c1-.3 1.8-.2 2.5.2M14.1 8.7c.7-.4 1.5-.5 2.5-.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
    </>
  ),
  pill: (
    <>
      <rect x="3.2" y="8.5" width="17.6" height="7" rx="3.5" transform="rotate(-35 12 12)" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.1 9.1 5.8 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7.6" cy="7.6" r=".9" fill="currentColor" opacity=".7" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14.2 13.9V5.6a2.2 2.2 0 1 0-4.4 0v8.3a4 4 0 1 0 4.4 0Z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9.5v6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.7" r="1.9" fill="currentColor" opacity=".8" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M8.2 15.2a5.4 5.4 0 1 1 7.6 0c-.8.8-1.2 1.6-1.3 2.6H9.5c-.1-1-.5-1.8-1.3-2.6Z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.7 20h4.6M10.4 22h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 8.2v3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".6" />
    </>
  ),
  cramps: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.3 10.2c1.4-1.4 2.8 1.4 4.2 0s2.8-1.4 4.2 0M7.6 13.9c1.4-1.4 2.8 1.4 4.2 0s2.8-1.4 4.2 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.2" r="1" fill="currentColor" opacity=".7" />
    </>
  ),
  headache: (
    <>
      <path d="M8.3 19.5v-2.2c-1.8-1.2-2.9-3.1-2.9-5.3a6.6 6.6 0 0 1 13.2 0c0 2.2-1.1 4.1-2.9 5.3v2.2" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.8 12h1.1l.8-1.6 1.2 3.2.8-1.6h1.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.8 19.5h4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  bloating: (
    <>
      <circle cx="12" cy="12" r="8.4" fill="currentColor" opacity=".11" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.3 12.5c1.1 1.7 2.3 2.5 3.7 2.5s2.6-.8 3.7-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8.6" cy="9" r="1.2" fill="currentColor" opacity=".7" />
      <circle cx="15.4" cy="9" r="1.2" fill="currentColor" opacity=".7" />
      <circle cx="12" cy="7.8" r=".8" fill="currentColor" opacity=".5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.3 12.2 2.5 2.5 4.9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  plus: (
    <>
      <circle cx="12" cy="12" r="8.6" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8.1v7.8M8.1 12h7.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.2" width="14" height="10.3" rx="3" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.2 10.2V7.7a3.8 3.8 0 0 1 7.6 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="1.3" fill="currentColor" />
    </>
  ),
  eye: (
    <>
      <path d="M2.6 12S6 6.5 12 6.5 21.4 12 21.4 12 18 17.5 12 17.5 2.6 12 2.6 12Z" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="currentColor" opacity=".7" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.6 6.9A9.6 9.6 0 0 1 12 6.5c6 0 9.4 5.5 9.4 5.5a17 17 0 0 1-2.9 3.3M6.2 8.3A17 17 0 0 0 2.6 12S6 17.5 12 17.5c1 0 1.9-.1 2.7-.4" fill="currentColor" opacity=".08" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" opacity=".55" />
    </>
  ),
  wind: (
    <>
      <path d="M3.5 9h9.2a2.7 2.7 0 1 0-2.7-2.7M3.5 13h13.8a2.5 2.5 0 1 1-2.5 2.5M3.5 17h5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18.1" cy="7.1" r="1" fill="currentColor" opacity=".6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.7" cy="10.7" r="6.2" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" />
      <path d="m15.4 15.4 4.3 4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5.3l3.3 2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  star: (
    <>
      <path d="m12 3.3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.3Z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c-8.2 0-14 3.6-14 9.5A6.5 6.5 0 0 0 12.5 20C18.4 20 20 12.2 20 4Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 19c2.4-4.1 5.1-6.8 9-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".65" />
    </>
  ),
}

const aliases = {
  House: 'home',
  Home: 'home',
  CalendarDays: 'calendar',
  CalendarRange: 'calendar',
  CalendarClock: 'calendar',
  CalendarHeart: 'calendar',
  CalendarPlus: 'calendar',
  Droplet: 'drop',
  Droplets: 'drop',
  Activity: 'cycle',
  RefreshCw: 'cycle',
  HeartPulse: 'health',
  Stethoscope: 'symptoms',
  ChartNoAxesCombined: 'chart',
  ChartColumn: 'report',
  ClipboardList: 'report',
  BellRing: 'bell',
  Bell: 'bell',
  Flower2: 'flower',
  Sparkles: 'sparkles',
  GlassWater: 'water',
  Moon: 'moon',
  MoonStar: 'moon',
  Heart: 'heart',
  HeartHandshake: 'heart',
  ShieldCheck: 'shield',
  Sun: 'sun',
  Watch: 'device',
  User: 'user',
  UserRound: 'user',
  Settings: 'settings',
  Info: 'info',
  CircleHelp: 'help',
  BookHeart: 'book',
  Pill: 'pill',
  Thermometer: 'thermometer',
  Lightbulb: 'lightbulb',
  Check: 'check',
  CheckCircle2: 'check',
  CircleCheck: 'check',
  Plus: 'plus',
  LockKeyhole: 'lock',
  Eye: 'eye',
  EyeOff: 'eyeOff',
  Wind: 'wind',
  Search: 'search',
  Clock3: 'clock',
  Star: 'star',
  Leaf: 'leaf',
  BatteryLow: 'health',
  Brain: 'headache',
  Waves: 'cramps',
  Scale: 'chart',
  Utensils: 'flower',
  Bone: 'bloating',
  Milk: 'water',
  Dumbbell: 'cycle',
  Salad: 'leaf',
  ScanHeart: 'health',
  FlaskConical: 'report',
  Microscope: 'report',
  History: 'clock',
  TriangleAlert: 'info',
  CloudUpload: 'report',
  MapPin: 'report',
}

export function AppIcon({ name, size = 22, strokeWidth = 1.8, className = '', ...props }) {
  const resolved = glyphs[name] || glyphs[aliases[name]]
  if (!resolved) {
    const Fallback = iconMap[name] || iconMap[aliases[name]] || iconMap.Circle
    return <Fallback size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" focusable="false" {...props} />
  }
  return (
    <svg
      className={`app-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {resolved}
    </svg>
  )
}
