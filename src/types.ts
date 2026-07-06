export interface Category {
  id: string
  name: string
}

export interface Task {
  id: string
  name: string
  emoji: string
  categoryId: string
  lastDoneAt: number | null
  isFavorite: boolean
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
}
