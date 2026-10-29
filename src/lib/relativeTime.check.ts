import { addDays, addMonths, addYears } from 'date-fns'
import { formatTaskElapsed } from './relativeTime'
import type { TimeDisplayUnit } from '../types'

const to = new Date('2026-07-07T12:00:00').getTime()
const from = addYears(addMonths(addDays(new Date(to), -14), -2), -1).getTime()

const cases: [number | null, TimeDisplayUnit[], string][] = [
  [from, ['months', 'days'], '14 Months 14 Days ago'],
  [from, ['years', 'days'], '1 Year 75 Days ago'],
  [addDays(new Date(to), -440).getTime(), ['days'], '440 Days ago'],
  [to, ['days'], 'Just now'],
  [null, ['days'], 'Never'],
]

for (const [ts, units, expected] of cases) {
  const got = formatTaskElapsed(ts, units, to)
  if (got !== expected) {
    throw new Error(
      `formatTaskElapsed(${JSON.stringify(units)}) = "${got}", want "${expected}"`,
    )
  }
}

console.log('relativeTime self-check ok')
