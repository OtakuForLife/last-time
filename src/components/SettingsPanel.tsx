import { useRef } from 'react'
import { exportData, importData } from '../lib/storage'
import { CloseIcon } from './CloseIcon'
import type { AppData, Category } from '../types'

type SettingsPanelProps = {
  darkMode: boolean
  categories: Category[]
  onDarkModeChange: (value: boolean) => void
  onAddCategory: (name: string) => string
  onDeleteCategory: (id: string) => void
  onImport: (data: AppData) => void
  onExport: () => AppData
  onClose: () => void
}

export function SettingsPanel({
  darkMode,
  categories,
  onDarkModeChange,
  onAddCategory,
  onDeleteCategory,
  onImport,
  onExport,
  onClose,
}: SettingsPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const json = exportData(onExport())
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `last-time-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = importData(reader.result as string)
        onImport(data)
        alert('Backup restored successfully.')
      } catch {
        alert('Could not read backup file. Check the format and try again.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="sheet sheet--wide">
        <div className="sheet__header">
          <h2 id="settings-title">Settings</h2>
          <button type="button" className="icon-btn icon-btn--dismiss" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <section className="settings-section">
          <h3>Appearance</h3>
          <label className="settings-toggle">
            <span>Dark mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => onDarkModeChange(e.target.checked)}
            />
            <span className="settings-toggle__track" />
          </label>
        </section>

        <section className="settings-section">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map((cat) => (
              <li key={cat.id} className="category-list__item">
                <span>{cat.name}</span>
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  onClick={() => {
                    if (categories.length <= 1) {
                      alert('You need at least one category.')
                      return
                    }
                    if (confirm(`Delete category "${cat.name}"?`)) onDeleteCategory(cat.id)
                  }}
                  aria-label={`Delete ${cat.name}`}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
          <div className="form__row">
            <input
              ref={categoryRef}
              className="form__input"
              placeholder="New category"
            />
            <button
              type="button"
              className="btn"
              onClick={() => {
                const name = categoryRef.current?.value ?? ''
                if (!name.trim()) return
                onAddCategory(name)
                if (categoryRef.current) categoryRef.current.value = ''
              }}
            >
              Add
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h3>Backup &amp; Restore</h3>
          <p className="settings-hint">
            Export your tasks to a JSON file. Restore anytime — fully offline.
          </p>
          <div className="settings-actions">
            <button type="button" className="btn" onClick={handleExport}>
              Export backup
            </button>
            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              Import backup
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImport(file)
                e.target.value = ''
              }}
            />
          </div>
        </section>

        <section className="settings-section settings-section--about">
          <h3>About</h3>
          <p>
            Last Time — remember when you last did something.
            <br />
            No accounts. No cloud. One tap.
          </p>
          <p className="settings-version">Version 1.0</p>
        </section>
      </div>
    </div>
  )
}
