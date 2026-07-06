import { formatRelativeTime } from './relativeTime'

const noon = new Date('2026-07-06T12:00:00').getTime()

const cases: [number | null, string][] = [
  [null, 'Never'],
  [noon, 'Today'],
  [noon - 86_400_000, 'Yesterday'],
  [noon - 8 * 86_400_000, '8 days ago'],
  [noon - 45 * 86_400_000, '1 month ago'],
  [noon - 400 * 86_400_000, '1 year ago'],
]

for (const [ts, expected] of cases) {
  const got = formatRelativeTime(ts, noon)
  if (got !== expected) throw new Error(`formatRelativeTime(${ts}) = "${got}", want "${expected}"`)
}

console.log('relativeTime self-check ok')
