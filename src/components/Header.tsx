type HeaderProps = {
  onAdd: () => void
  onSettings: () => void
}

export function Header({ onAdd, onSettings }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">Last Time</h1>
        <p className="header__tagline">One tap. That&apos;s it.</p>
      </div>
      <div className="header__actions">
        <button type="button" className="icon-btn" onClick={onSettings} aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          + Add
        </button>
      </div>
    </header>
  )
}
