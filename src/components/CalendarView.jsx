import { useState } from 'react'
import { format, isSameMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCalendarGrid, monthLabel, toISO, todayISO, WEEKDAYS } from '../lib/date.js'
import { getDayMeta } from '../lib/cycle.js'
import { useApp } from '../context/AppContext.jsx'
import { AppIcon } from './AppIcon.jsx'

export default function CalendarView({ data, selectedDate = todayISO(), onSelectDate, mode = 'cycle' }) {
  const { discreet } = useApp()
  const [month, setMonth] = useState(() => new Date(`${toISO(selectedDate) || todayISO()}T12:00:00`))
  const days = getCalendarGrid(month)

  const changeMonth = (offset) => {
    setMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1, 12))
  }

  return (
    <div className="calendar-view">
      <div className="calendar-toolbar">
        <button type="button" className="icon-button" onClick={() => changeMonth(-1)} aria-label="Mês anterior"><ChevronLeft size={18} /></button>
        <strong>{monthLabel(format(month, 'yyyy-MM-dd'))}</strong>
        <button type="button" className="icon-button" onClick={() => changeMonth(1)} aria-label="Próximo mês"><ChevronRight size={18} /></button>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAYS.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const iso = toISO(day)
          const meta = getDayMeta(data, iso)
          const classes = [
            'calendar-day',
            !isSameMonth(day, month) && 'calendar-day-muted',
            meta.isToday && 'calendar-day-today',
            meta.isPeriod && 'calendar-day-period',
            meta.isPredictedPeriod && 'calendar-day-predicted',
            mode === 'cycle' && meta.isFertile && 'calendar-day-fertile',
            mode === 'cycle' && meta.isOvulation && 'calendar-day-ovulation',
            toISO(selectedDate) === iso && 'calendar-day-selected',
          ].filter(Boolean).join(' ')
          return (
            <button type="button" key={iso} className={classes} onClick={() => onSelectDate?.(iso)} aria-label={iso}>
              <span className="calendar-day-number">{day.getDate()}</span>
              <span className="calendar-dots">
                {meta.isPeriod && <i className="dot dot-period" />}
                {meta.hasSymptom && <i className="dot dot-symptom" />}
                {meta.hasReminder && <i className="dot dot-hydration" />}
              </span>
            </button>
          )
        })}
      </div>
      <div className="calendar-legend">
        {mode === 'cycle' ? (
          <>
            <span><i className="legend-icon legend-rose"><AppIcon name="drop" size={13} /></i>{discreet ? 'Ciclo' : 'Menstruação'}</span>
            <span><i className="legend-icon legend-green"><AppIcon name="leaf" size={13} /></i>{discreet ? 'Fase 2' : 'Período fértil'}</span>
            <span><i className="legend-icon legend-purple"><AppIcon name="sparkles" size={13} /></i>{discreet ? 'Fase 3' : 'Ovulação'}</span>
            <span><i className="legend-icon legend-blue"><AppIcon name="bell" size={13} /></i>Lembretes</span>
            <span><i className="legend-dot legend-today" />Hoje</span>
          </>
        ) : (
          <>
            <span><i className="legend-dot legend-consult" />Consulta</span>
            <span><i className="legend-dot legend-exam" />Exame</span>
            <span><i className="legend-dot legend-task" />Tarefa</span>
            <span><i className="legend-dot legend-hydration" />Hidratação</span>
          </>
        )}
      </div>
    </div>
  )
}
