import { Outlet, Link, useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/hooks/useAuth';
import { UserDropdown } from '~/components/UserDropdown';

export default function Layout() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="bg-[var(--card)]/80 backdrop-blur-sm border-b border-[var(--border)]/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
          >
            Reparo
          </Link>

          <nav className="flex items-center gap-4">
            {user && (
              <Button
                onClick={() => navigate('/createissue')}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              >
                Create Issue
              </Button>
            )}

            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-[var(--muted)] animate-pulse" />
            ) : user ? (
              <UserDropdown user={user} onLogout={logout} />
            ) : (
              <Link to="/login">
                <Button className="bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card)]/70 text-center py-4 border-t border-[var(--border)]/50 text-[var(--foreground)] text-sm">
        © {new Date().getFullYear()} Reparo — Empowering Communities
      </footer>
    </div>
  );
}