import {
  addDays,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  differenceInDays,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from 'date-fns'
import {
  DEFAULT_TIME_UNITS,
  TIME_DISPLAY_UNITS,
  type TimeDisplayUnit,
} from '../types'

function pluralize(value: number, unit: TimeDisplayUnit): string {
  const label = unit.charAt(0).toUpperCase() + unit.slice(1)
  const singular = label.endsWith('s') ? label.slice(0, -1) : label
  return value === 1 ? `1 ${singular}` : `${value} ${label}`
}

export function normalizeTimeUnits(units: unknown): TimeDisplayUnit[] {
  if (!Array.isArray(units) || units.length === 0) return [...DEFAULT_TIME_UNITS]
  const valid = units.filter(
    (u): u is TimeDisplayUnit =>
      typeof u === 'string' && TIME_DISPLAY_UNITS.includes(u as TimeDisplayUnit),
  )
  return valid.length > 0 ? valid : [...DEFAULT_TIME_UNITS]
}

export function formatTaskElapsed(
  timestamp: number | null,
  units: TimeDisplayUnit[],
  now = Date.now(),
): string {
  if (timestamp === null) return 'Never'

  const from = new Date(timestamp)
  const to = new Date(now)
  if (from.getTime() >= to.getTime()) return 'Just now'

  const selected = normalizeTimeUnits(units)
  const selectedSet = new Set(selected)
  const parts: string[] = []
  let cursor = from

  if (selectedSet.has('years')) {
    const years = differenceInYears(to, cursor)
    if (years > 0) parts.push(pluralize(years, 'years'))
    cursor = addYears(cursor, years)
  }

  if (selectedSet.has('months')) {
    const months = differenceInMonths(to, cursor)
    if (months > 0) parts.push(pluralize(months, 'months'))
    cursor = addMonths(cursor, months)
  }

  if (selectedSet.has('days')) {
    const days = differenceInDays(to, cursor)
    if (days > 0) parts.push(pluralize(days, 'days'))
    cursor = addDays(cursor, days)
  }

  if (selectedSet.has('minutes')) {
    const minutes = differenceInMinutes(to, cursor)
    if (minutes > 0) parts.push(pluralize(minutes, 'minutes'))
    cursor = addMinutes(cursor, minutes)
  }

  if (selectedSet.has('seconds')) {
    const seconds = differenceInSeconds(to, cursor)
    if (seconds > 0) parts.push(pluralize(seconds, 'seconds'))
    cursor = addSeconds(cursor, seconds)
  }

  if (parts.length === 0) return 'Just now'
  return `${parts.join(' ')} ago`
}

/** @deprecated use formatTaskElapsed */
export function formatRelativeTime(timestamp: number | null, now = Date.now()): string {
  return formatTaskElapsed(timestamp, ['days'], now)
}
