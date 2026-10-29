import { useEffect, useState } from 'react'
import type { Task } from '../types'

function tickMsForTasks(tasks: Task[]): number {
  for (const task of tasks) {
    if (task.timeUnits.includes('seconds')) return 1000
  }
  for (const task of tasks) {
    if (task.timeUnits.includes('minutes')) return 1000
  }
  for (const task of tasks) {
    if (task.timeUnits.includes('days')) return 60_000
  }
  return 3_600_000
}

export function useNow(tasks: Task[]): number {
  const [now, setNow] = useState(() => Date.now())
  const tickMs = tickMsForTasks(tasks)

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined

    const tick = () => setNow(Date.now())

    const start = () => {
      tick()
      id = setInterval(tick, tickMs)
    }

    const stop = () => {
      if (id !== undefined) clearInterval(id)
      id = undefined
    }

    const onVisibility = () => {
      stop()
      if (document.visibilityState === 'visible') start()
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [tickMs])

  return now
}
