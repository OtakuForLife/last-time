import { Preferences } from '@capacitor/preferences'
import { normalizeTimeUnits } from './relativeTime'
import type { AppData, Category, Task } from '../types'

const STORAGE_KEY = 'last-time-data'

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'home', name: 'Home' },
  { id: 'health', name: 'Health' },
  { id: 'car', name: 'Car' },
  { id: 'pets', name: 'Pets' },
]

function normalizeTask(task: Task): Task {
  return {
    ...task,
    timeUnits: normalizeTimeUnits(task.timeUnits),
  }
}

const DEFAULT_TASKS: Task[] = [
  {
    id: 'demo-water-plants',
    name: 'Water Plants',
    emoji: '🌱',
    categoryId: 'home',
    lastDoneAt: Date.now() - 8 * 86_400_000,
    isFavorite: true,
    timeUnits: ['days'],
    createdAt: Date.now(),
  },
  {
    id: 'demo-bed-sheets',
    name: 'Change Bed Sheets',
    emoji: '🛏',
    categoryId: 'home',
    lastDoneAt: Date.now() - 12 * 86_400_000,
    isFavorite: false,
    timeUnits: ['days'],
    createdAt: Date.now(),
  },
  {
    id: 'demo-wash-car',
    name: 'Wash Car',
    emoji: '🚗',
    categoryId: 'car',
    lastDoneAt: Date.now() - 37 * 86_400_000,
    isFavorite: false,
    timeUnits: ['days'],
    createdAt: Date.now(),
  },
  {
    id: 'demo-deworm-dog',
    name: 'Deworm Dog',
    emoji: '🐶',
    categoryId: 'pets',
    lastDoneAt: Date.now() - 91 * 86_400_000,
    isFavorite: true,
    timeUnits: ['months', 'days'],
    createdAt: Date.now(),
  },
  {
    id: 'demo-fireplace',
    name: 'Clean Fireplace',
    emoji: '🔥',
    categoryId: 'home',
    lastDoneAt: Date.now() - 204 * 86_400_000,
    isFavorite: false,
    timeUnits: ['years', 'months', 'days'],
    createdAt: Date.now(),
  },
]

export function createDefaultData(): AppData {
  return {
    tasks: DEFAULT_TASKS,
    categories: DEFAULT_CATEGORIES,
    settings: { darkMode: false },
  }
}

async function readRaw(): Promise<string | null> {
  const { value } = await Preferences.get({ key: STORAGE_KEY })
  return value
}

async function writeRaw(value: string): Promise<void> {
  await Preferences.set({ key: STORAGE_KEY, value })
}

export async function loadData(): Promise<AppData> {
  const raw = await readRaw()
  if (!raw) return createDefaultData()

  try {
    const parsed = JSON.parse(raw) as AppData
    return {
      tasks: (parsed.tasks ?? []).map(normalizeTask),
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      settings: { darkMode: parsed.settings?.darkMode ?? false },
    }
  } catch {
    return createDefaultData()
  }
}

export async function saveData(data: AppData): Promise<void> {
  await writeRaw(JSON.stringify(data))
}

export function exportData(data: AppData): string {
  return JSON.stringify({ version: 1, exportedAt: Date.now(), ...data }, null, 2)
}

export function importData(json: string): AppData {
  const parsed = JSON.parse(json) as Partial<AppData> & { version?: number }
  if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
    throw new Error('Invalid backup: missing tasks')
  }
  return {
    tasks: parsed.tasks.map((t) => normalizeTask(t as Task)),
    categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
    settings: { darkMode: parsed.settings?.darkMode ?? false },
  }
}
