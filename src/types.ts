export interface Category {
  id: string
  name: string
}

export type TimeDisplayUnit = 'years' | 'months' | 'days' | 'minutes' | 'seconds'

export const TIME_DISPLAY_UNITS: TimeDisplayUnit[] = [
  'years',
  'months',
  'days',
  'minutes',
  'seconds',
]

export const DEFAULT_TIME_UNITS: TimeDisplayUnit[] = ['days']

export interface Task {
  id: string
  name: string
  emoji: string
  categoryId: string
  lastDoneAt: number | null
  isFavorite: boolean
  timeUnits: TimeDisplayUnit[]
  createdAt: number
}

export interface AppSettings {
  darkMode: boolean
}

export interface AppData {
  tasks: Task[]
  categories: Category[]
  settings: AppSettings
}

export type TaskFormData = {
  name: string
  emoji: string
  categoryId: string
  isFavorite: boolean
  timeUnits: TimeDisplayUnit[]
}
