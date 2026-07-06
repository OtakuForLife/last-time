import type { Category } from '../types'

type FilterBarProps = {
  categories: Category[]
  categoryFilter: string | null
  favoritesOnly: boolean
  onCategoryChange: (id: string | null) => void
  onFavoritesToggle: () => void
}

export function FilterBar({
  categories,
  categoryFilter,
  favoritesOnly,
  onCategoryChange,
  onFavoritesToggle,
}: FilterBarProps) {
  return (
    <div className="filters">
      <button
        type="button"
        className={`chip ${favoritesOnly ? 'chip--active' : ''}`}
        onClick={onFavoritesToggle}
      >
        ⭐ Favorites
      </button>
      <button
        type="button"
        className={`chip ${categoryFilter === null ? 'chip--active' : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`chip ${categoryFilter === cat.id ? 'chip--active' : ''}`}
          onClick={() => onCategoryChange(categoryFilter === cat.id ? null : cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
