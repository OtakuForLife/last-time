type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search">
      <svg className="search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        className="search__input"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
      />
      {value && (
        <button type="button" className="search__clear" onClick={() => onChange('')} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  )
}
