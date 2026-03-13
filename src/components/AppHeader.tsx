import { useAuth } from '../auth/AuthContext';

export default function AppHeader() {
  const { isAuthenticated, userName, login, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">NaApiE</span>
        <span className="hidden sm:inline text-xs text-slate-400">
          Need another API Explorer
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && userName && (
          <span className="text-sm text-slate-300 hidden sm:inline">{userName}</span>
        )}
        <button
          onClick={isAuthenticated ? logout : login}
          className="rounded-none px-4 py-1.5 text-sm font-medium transition
                     bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        >
          {isAuthenticated ? 'Sign out' : 'Sign in'}
        </button>
      </div>
    </header>
  );
}
