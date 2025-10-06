import { Outlet, Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
          >
            FixConnect
          </Link>

          <nav className="flex items-center gap-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
              onClick={() => navigate("/createissue")}
            >
              Create Issue
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>

            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
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
      <footer className="bg-white/70 text-center py-4 border-t border-white/50 text-slate-600 text-sm">
        © {new Date().getFullYear()} FixConnect — Empowering Communities
      </footer>
    </div>
  );
}