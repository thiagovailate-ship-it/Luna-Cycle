import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { iconMap } from './icons.js'
import { AppIcon } from './AppIcon.jsx'

export function Icon({ name, size = 20, strokeWidth = 1.8, ...props }) {
  const Component = iconMap[name] || iconMap.Circle
  return <Component size={size} strokeWidth={strokeWidth} {...props} />
}

export function Logo({ compact = false, subtitle = true }) {
  return (
    <div className={`logo-lockup ${compact ? 'logo-compact' : ''}`}>
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="luna-mark-gradient" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e98ba1" />
            <stop offset="1" stopColor="#a5486a" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="27" fill="url(#luna-mark-gradient)" opacity=".16" />
        <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".45" strokeDasharray="2 6" />
        <path d="M41 12c-12 3-20 13-20 24 0 12 9 21 21 21 3 0 6-.6 8.5-1.8-4.4-2.2-7-6.8-7-12.1 0-6.6 4.8-12.1 11.2-13.4C50.5 21 46.5 14.8 41 12Z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M32 22c5 7 9 12 9 17a9 9 0 0 1-18 0c0-5 4-10 9-17Z" fill="currentColor" opacity=".78" />
        <path d="M47 18c1 2.3 2.7 4 5 5-2.3 1-4 2.7-5 5-1-2.3-2.7-4-5-5 2.3-1 4-2.7 5-5Z" fill="currentColor" opacity=".85" />
      </svg>
      <div>
        <div className="logo-word">Luna Cycle</div>
        {subtitle && compact && <div className="logo-subtitle">Seu ciclo, no seu ritmo</div>}
      </div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions, back = false, onBack }) {
  return (
    <header className="page-header">
      <div className="page-header-main">
        {back && (
          <button type="button" className="icon-button back-button" onClick={onBack} aria-label="Voltar">
            <Icon name="ArrowLeft" size={20} />
          </button>
        )}
        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}

export function Card({ children, className = '', as: Tag = 'section', ...props }) {
  return <Tag className={`card ${className}`} {...props}>{children}</Tag>
}

export function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function IconCircle({ icon, tone = 'rose', size = 'medium', children }) {
  return (
    <span className={`icon-circle icon-${tone} icon-${size}`}>
      {icon ? <AppIcon name={icon} size={size === 'large' ? 28 : 20} /> : children}
    </span>
  )
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>
}

export function Pill({ active, children, onClick, icon, type = 'button' }) {
  return (
    <button type={type} className={`pill ${active ? 'pill-active' : ''}`} onClick={onClick}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  )
}

export function Tabs({ items, active, onChange, className = '' }) {
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const current = items.findIndex((item) => item.id === active)
    if (current < 0) return
    event.preventDefault()
    const next = event.key === 'ArrowRight'
      ? (current + 1) % items.length
      : (current - 1 + items.length) % items.length
    onChange(items[next].id)
    const buttons = event.currentTarget.querySelectorAll('[role="tab"]')
    buttons[next]?.focus()
  }

  return (
    <div className={`tabs ${className}`} role="tablist" onKeyDown={onKeyDown}>
      {items.map((item) => (
        <button key={item.id} type="button" role="tab" aria-selected={active === item.id} tabIndex={active === item.id ? 0 : -1} className={`tab ${active === item.id ? 'tab-active' : ''}`} onClick={() => onChange(item.id)}>
          {item.icon && <Icon name={item.icon} size={15} />}
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, hint, children, required, className = '' }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}{required && <em> *</em>}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}

export function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className={`toggle-row ${disabled ? 'is-disabled' : ''}`}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-track" aria-hidden="true"><span /></span>
    </label>
  )
}

export function Modal({ open, onClose, title, description, children, footer, size = 'medium' }) {
  const cardRef = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const card = cardRef.current
    const focusables = () => {
      if (!card) return []
      return [...card.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.disabled && element.offsetParent !== null)
    }
    const firstField = card?.querySelector('input:not([type="hidden"]), textarea, select')
    ;(firstField || focusables()[0] || card)?.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') {
        closeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div ref={cardRef} className={`modal-card modal-${size}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ icon = 'Sparkles', title, description, action }) {
  return (
    <div className="empty-state">
      <IconCircle icon={icon} tone="rose" size="large" />
      <h3>{title}</h3>
      <p>{description}</p>
      <small className="empty-state-gentle">Sem pressa — você registra quando fizer sentido.</small>
      {action}
    </div>
  )
}

export function ProgressRing({ progress = 0, size = 168, stroke = 12, value, label, sublabel }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = Math.max(0, Math.min(1, progress)) * circumference
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(199,117,138,.15)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--rose)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="progress-ring-content">
        {value && <strong data-sensitive>{value}</strong>}
        {label && <span>{label}</span>}
        {sublabel && <small>{sublabel}</small>}
      </div>
    </div>
  )
}

export function LineChart({ data = [], lines = [], height = 180, unit = '', minValue, maxValue, labels = 4 }) {
  const width = 600
  const padding = 16
  const values = data.flatMap((row) => lines.map((line) => Number(row[line.key] || 0)))
  const min = minValue ?? Math.min(...values, 0) - 1
  const max = maxValue ?? Math.max(...values, 1) + 1
  const range = max - min || 1
  const xFor = (index) => padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2)
  const yFor = (value) => height - padding - ((Number(value) - min) / range) * (height - padding * 2)
  const pathFor = (key) => data.map((row, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index).toFixed(1)} ${yFor(row[key]).toFixed(1)}`).join(' ')
  return (
    <div className="chart-wrap">
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img">
        {Array.from({ length: labels }).map((_, index) => {
          const y = padding + (index / Math.max(1, labels - 1)) * (height - padding * 2)
          return <line key={index} x1="0" y1={y} x2={width} y2={y} className="chart-gridline" />
        })}
        {lines.map((line) => (
          <path key={line.key} d={pathFor(line.key)} fill="none" stroke={line.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {lines.map((line) => data.map((row, index) => (
          <circle key={`${line.key}-${index}`} cx={xFor(index)} cy={yFor(row[line.key])} r="3.5" fill="#fff" stroke={line.color} strokeWidth="2" />
        )))}
      </svg>
      <div className="chart-legend">
        {lines.map((line) => <span key={line.key}><i style={{ background: line.color }} />{line.label}</span>)}
        {unit && <small>{unit}</small>}
      </div>
    </div>
  )
}

export function BarChart({ data = [], color = 'var(--rose)', height = 160, suffix = '' }) {
  const max = Math.max(1, ...data.map((item) => Number(item.value || 0)))
  return (
    <div className="bar-chart" style={{ height }}>
      {data.map((item, index) => (
        <div className="bar-item" key={`${item.label}-${index}`} title={`${item.label}: ${item.value}${suffix}`}>
          <div className="bar-value">{item.value}{suffix}</div>
          <div className="bar-track"><div className="bar-fill" style={{ height: `${Math.max(4, (Number(item.value) / max) * 100)}%`, background: color }} /></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function StatCard({ icon, label, value, hint, tone = 'rose', onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`stat-card ${onClick ? 'clickable' : ''}`} onClick={onClick} type={onClick ? 'button' : undefined}>
      <IconCircle icon={icon} tone={tone} />
      <div>
        <span>{label}</span>
        <strong data-sensitive>{value}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </Tag>
  )
}

export function ListRow({ icon, title, description, meta, onClick, right, tone = 'rose' }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`list-row ${onClick ? 'clickable' : ''}`} onClick={onClick} type={onClick ? 'button' : undefined}>
      {icon && <IconCircle icon={icon} tone={tone} />}
      <span className="list-row-text">
        <strong data-sensitive>{title}</strong>
        {description && <small>{description}</small>}
      </span>
      {meta && <span className="list-row-meta">{meta}</span>}
      {right || (onClick && <Icon name="ChevronRight" size={17} />)}
    </Tag>
  )
}

export function Avatar({ name, size = 50 }) {
  const initials = (name || 'LC').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.33 }}>{initials}</span>
}
