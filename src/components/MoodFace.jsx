import { useId } from 'react'

const palette = {
  1: { fill: '#f6d8dd', stroke: '#b95f75', feature: '#9d435b' },
  2: { fill: '#fae2df', stroke: '#cc7b7b', feature: '#ab5f5f' },
  3: { fill: '#f8ead4', stroke: '#d0a45f', feature: '#a77d3c' },
  4: { fill: '#e2efe1', stroke: '#7ca88a', feature: '#527d61' },
  5: { fill: '#dcefe5', stroke: '#5a9b78', feature: '#2f7455' },
}

const mouths = {
  1: 'M8.2 16.2c1.1-1.4 2.4-2.1 3.8-2.1s2.7.7 3.8 2.1',
  2: 'M8.5 15.4c1-.8 2.1-1.2 3.5-1.2s2.5.4 3.5 1.2',
  3: 'M8.6 14.7h6.8',
  4: 'M8.4 14c1.1 1.2 2.3 1.8 3.6 1.8s2.5-.6 3.6-1.8',
  5: 'M7.9 13.4c1.3 2 2.6 3 4.1 3s2.8-1 4.1-3',
}

export function MoodFace({ value = 3, size = 32, className = '' }) {
  const rawId = useId().replace(/:/g, '')
  const id = `mood-${rawId}`
  const tone = palette[value] || palette[3]
  const happy = value >= 4
  const sad = value <= 2

  return (
    <svg
      className={`mood-face ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
          <stop offset="100%" stopColor={tone.fill} />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={`url(#${id})`} stroke={tone.stroke} strokeWidth="1.5" />
      <circle cx="8.7" cy="10" r="1.15" fill={tone.feature} />
      <circle cx="15.3" cy="10" r="1.15" fill={tone.feature} />
      {happy && (
        <>
          <circle cx="6.9" cy="12.7" r="1.25" fill={tone.stroke} opacity=".18" />
          <circle cx="17.1" cy="12.7" r="1.25" fill={tone.stroke} opacity=".18" />
        </>
      )}
      {sad && <path d="M10.1 7.9c.6-.5 1.2-.7 1.9-.7.7 0 1.3.2 1.9.7" stroke={tone.feature} strokeWidth="1" strokeLinecap="round" opacity=".45" />}
      <path d={mouths[value] || mouths[3]} stroke={tone.feature} strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </svg>
  )
}
