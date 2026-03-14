import { useAuth } from '../auth/AuthContext';
import { useTheme, themes } from '../hooks/useTheme';

export default function AppHeader() {
  const { isAuthenticated, userName, login, logout } = useAuth();
  const { current, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[var(--surface-1)] text-[var(--text-primary)] shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">NaApiE</span>
        <span className="hidden sm:inline text-xs text-[var(--text-secondary)]">
          Need another API Explorer
        </span>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={current.id}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-[var(--surface-3)] text-[var(--text-secondary)] text-sm px-2 py-1
                     outline-none cursor-pointer rounded-none"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {isAuthenticated && userName && (
          <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">{userName}</span>
        )}
        <button
          onClick={isAuthenticated ? logout : login}
          className="rounded-none px-4 py-1.5 text-sm font-medium transition text-white
                     bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]"
        >
          {isAuthenticated ? 'Sign out' : 'Sign in'}
        </button>
      </div>
    </header>
  );
}
