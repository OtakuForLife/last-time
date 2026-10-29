import { useEffect, useState } from 'react'
import { useAppData, useFilteredTasks } from './hooks/useAppData'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { SettingsPanel } from './components/SettingsPanel'
import type { Task } from './types'

export default function App() {
  const {
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
  } = useAppData()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)

  const filtered = useFilteredTasks(
    data?.tasks ?? [],
    search,
    categoryFilter,
    favoritesOnly,
  )

  useEffect(() => {
    if (!data) return
    document.documentElement.dataset.theme = data.settings.darkMode ? 'dark' : 'light'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', data.settings.darkMode ? '#1A1917' : '#F5F0E8')
    }
  }, [data?.settings.darkMode])

  if (!ready || !data) {
    return (
      <div className="app app--loading">
        <p>Loading…</p>
      </div>
    )
  }

  const handleMarkDone = async (taskId: string) => {
    markDone(taskId)
    setFlashId(taskId)
    setTimeout(() => setFlashId(null), 600)
  }

  return (
    <div className="app">
      <Header
        onAdd={() => {
          setEditingTask(null)
          setShowForm(true)
        }}
        onSettings={() => setShowSettings(true)}
      />

      <SearchBar value={search} onChange={setSearch} />

      <FilterBar
        categories={data.categories}
        categoryFilter={categoryFilter}
        favoritesOnly={favoritesOnly}
        onCategoryChange={setCategoryFilter}
        onFavoritesToggle={() => setFavoritesOnly((v) => !v)}
      />

      <TaskList
        tasks={filtered}
        categories={data.categories}
        flashId={flashId}
        onMarkDone={handleMarkDone}
        onEdit={(task) => {
          setEditingTask(task)
          setShowForm(true)
        }}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteTask}
      />

      {filtered.length === 0 && (
        <p className="empty-state">
          {search || categoryFilter || favoritesOnly
            ? 'No tasks match your filters.'
            : 'Add your first task to get started.'}
        </p>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          categories={data.categories}
          onSave={(form) => {
            if (editingTask) editTask(editingTask.id, form)
            else addTask(form)
            setShowForm(false)
            setEditingTask(null)
          }}
          onDelete={
            editingTask
              ? () => {
                  deleteTask(editingTask.id)
                  setShowForm(false)
                  setEditingTask(null)
                }
              : undefined
          }
          onAddCategory={addCategory}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}

      {showSettings && (
        <SettingsPanel
          darkMode={data.settings.darkMode}
          categories={data.categories}
          onDarkModeChange={setDarkMode}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onImport={replaceData}
          onExport={() => data}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
