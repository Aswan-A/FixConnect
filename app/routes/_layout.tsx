import { Outlet, Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="bg-[var(--card)]/80 backdrop-blur-sm border-b border-[var(--border)]/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
          >
            FixConnect
          </Link>

          <nav className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/createissue")}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Create Issue
            </Button>

            <Button
              onClick={() => navigate("/profile")}
              className="bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Profile
            </Button>

            <Link to="/login">
              <Button className="bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card)]/70 text-center py-4 border-t border-[var(--border)]/50 text-[var(--foreground)] text-sm">
        © {new Date().getFullYear()} FixConnect — Empowering Communities
      </footer>
    </div>
  );
}
