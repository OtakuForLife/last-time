import { tapFeedback } from '../lib/haptics'
import { formatTaskElapsed } from '../lib/relativeTime'
import { useNow } from '../hooks/useNow'
import { CloseIcon } from './CloseIcon'
import type { Category, Task } from '../types'

type TaskListProps = {
  tasks: Task[]
  categories: Category[]
  flashId: string | null
  onMarkDone: (id: string) => void
  onEdit: (task: Task) => void
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({
  tasks,
  categories,
  flashId,
  onMarkDone,
  onEdit,
  onToggleFavorite,
  onDelete,
}: TaskListProps) {
  const now = useNow(tasks)
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <div
            className={`task ${flashId === task.id ? 'task--flash' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              tapFeedback()
              onMarkDone(task.id)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                tapFeedback()
                onMarkDone(task.id)
              }
            }}
          >
            <span className="task__emoji" aria-hidden="true">
              {task.emoji}
            </span>
            <div className="task__body">
              <div className="task__row">
                <span className="task__name">{task.name}</span>
              </div>
              <span className="task__time">
                {formatTaskElapsed(task.lastDoneAt, task.timeUnits, now)}
              </span>
              {categoryMap[task.categoryId] && (
                <span className="task__category">{categoryMap[task.categoryId]}</span>
              )}
            </div>
            <div className="task__actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={`icon-btn icon-btn--favorite ${task.isFavorite ? 'icon-btn--favorite-active' : ''}`}
                onClick={() => onToggleFavorite(task.id)}
                aria-label={task.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={task.isFavorite}
              >
                ★
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onEdit(task)}
                aria-label="Edit task"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                onClick={() => {
                  if (confirm(`Delete "${task.name}"?`)) onDelete(task.id)
                }}
                aria-label="Delete task"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
