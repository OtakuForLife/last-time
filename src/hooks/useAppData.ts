import { useCallback, useEffect, useMemo, useState } from 'react'
import { createId } from '../lib/id'
import { loadData, saveData } from '../lib/storage'
import { DEFAULT_TIME_UNITS } from '../types'
import type { AppData, Category, Task, TaskFormData } from '../types'

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadData().then((loaded) => {
      setData(loaded)
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!ready || !data) return
    saveData(data)
  }, [data, ready])

  const update = useCallback((fn: (prev: AppData) => AppData) => {
    setData((prev) => (prev ? fn(prev) : prev))
  }, [])

  const markDone = useCallback(
    (taskId: string) => {
      update((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, lastDoneAt: Date.now() } : t,
        ),
      }))
    },
    [update],
  )

  const addTask = useCallback(
    (form: TaskFormData) => {
      const task: Task = {
        id: createId(),
        name: form.name.trim(),
        emoji: form.emoji || '✓',
        categoryId: form.categoryId,
        lastDoneAt: Date.now(),
        isFavorite: form.isFavorite,
        timeUnits: form.timeUnits.length > 0 ? form.timeUnits : [...DEFAULT_TIME_UNITS],
        createdAt: Date.now(),
      }
      update((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }))
    },
    [update],
  )

  const editTask = useCallback(
    (taskId: string, form: TaskFormData) => {
      update((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                name: form.name.trim(),
                emoji: form.emoji || '✓',
                categoryId: form.categoryId,
                isFavorite: form.isFavorite,
                timeUnits: form.timeUnits.length > 0 ? form.timeUnits : [...DEFAULT_TIME_UNITS],
              }
            : t,
        ),
      }))
    },
    [update],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      update((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
      }))
    },
    [update],
  )

  const toggleFavorite = useCallback(
    (taskId: string) => {
      update((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, isFavorite: !t.isFavorite } : t,
        ),
      }))
    },
    [update],
  )

  const addCategory = useCallback(
    (name: string) => {
      const category: Category = { id: createId(), name: name.trim() }
      update((prev) => ({ ...prev, categories: [...prev.categories, category] }))
      return category.id
    },
    [update],
  )

  const deleteCategory = useCallback(
    (categoryId: string) => {
      update((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== categoryId),
        tasks: prev.tasks.map((t) =>
          t.categoryId === categoryId ? { ...t, categoryId: prev.categories[0]?.id ?? '' } : t,
        ),
      }))
    },
    [update],
  )

  const setDarkMode = useCallback(
    (darkMode: boolean) => {
      update((prev) => ({ ...prev, settings: { ...prev.settings, darkMode } }))
    },
    [update],
  )

  const replaceData = useCallback((next: AppData) => {
    setData(next)
  }, [])

  return {
    data,
    ready,
    markDone,
    addTask,
    editTask,
    deleteTask,
    toggleFavorite,
    addCategory,
    deleteCategory,
    setDarkMode,
    replaceData,
  }
}

export function useFilteredTasks(
  tasks: Task[],
  search: string,
  categoryFilter: string | null,
  favoritesOnly: boolean,
) {
  return useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks
      .filter((t) => {
        if (favoritesOnly && !t.isFavorite) return false
        if (categoryFilter && t.categoryId !== categoryFilter) return false
        if (q && !t.name.toLowerCase().includes(q)) return false
        return true
      })
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
        const aTime = a.lastDoneAt ?? 0
        const bTime = b.lastDoneAt ?? 0
        return aTime - bTime
      })
  }, [tasks, search, categoryFilter, favoritesOnly])
}
