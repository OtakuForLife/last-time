import { tapFeedback } from '../lib/haptics'
import { formatRelativeTime } from '../lib/relativeTime'
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
                {task.isFavorite && (
                  <span className="task__star" aria-label="Favorite">
                    ⭐
                  </span>
                )}
              </div>
              <span className="task__time">
                Last {formatRelativeTime(task.lastDoneAt)}
              </span>
              {categoryMap[task.categoryId] && (
                <span className="task__category">{categoryMap[task.categoryId]}</span>
              )}
            </div>
            <div className="task__actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="icon-btn icon-btn--sm"
                onClick={() => onToggleFavorite(task.id)}
                aria-label={task.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {task.isFavorite ? '★' : '☆'}
              </button>
              <button
                type="button"
                className="icon-btn icon-btn--sm"
                onClick={() => onEdit(task)}
                aria-label="Edit task"
              >
                ✎
              </button>
              <button
                type="button"
                className="icon-btn icon-btn--sm icon-btn--danger"
                onClick={() => {
                  if (confirm(`Delete "${task.name}"?`)) onDelete(task.id)
                }}
                aria-label="Delete task"
              >
                ×
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
