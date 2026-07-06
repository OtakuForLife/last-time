import { useState, type FormEvent } from 'react'
import type { Category, Task, TaskFormData } from '../types'

const EMOJI_SUGGESTIONS = ['🌱', '🛏', '🚗', '🐶', '🔥', '🧹', '💧', '🍳', '🌿', '🧺', '🔧', '📦']

type TaskFormProps = {
  task: Task | null
  categories: Category[]
  onSave: (form: TaskFormData) => void
  onDelete?: () => void
  onAddCategory: (name: string) => string
  onClose: () => void
}

export function TaskForm({
  task,
  categories,
  onSave,
  onDelete,
  onAddCategory,
  onClose,
}: TaskFormProps) {
  const [name, setName] = useState(task?.name ?? '')
  const [emoji, setEmoji] = useState(task?.emoji ?? '🌱')
  const [categoryId, setCategoryId] = useState(task?.categoryId ?? categories[0]?.id ?? '')
  const [isFavorite, setIsFavorite] = useState(task?.isFavorite ?? false)
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name, emoji, categoryId, isFavorite })
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    const id = onAddCategory(newCategory)
    setCategoryId(id)
    setNewCategory('')
    setShowNewCategory(false)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
      <div className="sheet">
        <div className="sheet__header">
          <h2 id="task-form-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label">
            Name
            <input
              className="form__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Water plants"
              autoFocus
              required
            />
          </label>

          <fieldset className="form__fieldset">
            <legend className="form__label">Icon</legend>
            <div className="emoji-picker">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-picker__btn ${emoji === e ? 'emoji-picker__btn--active' : ''}`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
              <input
                className="emoji-picker__custom"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
                maxLength={2}
                aria-label="Custom emoji"
              />
            </div>
          </fieldset>

          <label className="form__label">
            Category
            <select
              className="form__input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {showNewCategory ? (
            <div className="form__row">
              <input
                className="form__input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <button type="button" className="btn" onClick={handleAddCategory}>
                Add
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={() => setShowNewCategory(true)}>
              + New category
            </button>
          )}

          <label className="form__check">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
            />
            Favorite
          </label>

          <div className="form__actions">
            {onDelete && (
              <button type="button" className="btn btn--danger" onClick={onDelete}>
                Delete
              </button>
            )}
            <button type="submit" className="btn btn--primary">
              {task ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
