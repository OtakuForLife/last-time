export function formatRelativeTime(timestamp: number | null, now = Date.now()): string {
  if (timestamp === null) return 'Never'

  const diffMs = now - timestamp
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays} days ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`

  const diffYears = Math.floor(diffDays / 365)
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`
}
