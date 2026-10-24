import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Gamepad2,
  LayoutDashboard,
  Network,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      await logout();
    } catch {
      setError("Chưa thể đăng xuất. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a href="#admin-content" className="skip-link">
        Đi đến nội dung quản trị
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="page-container flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-xl font-black text-white"
          >
            <span className="icon-tile">
              <Gamepad2 aria-hidden="true" className="h-5 w-5" />
            </span>
            Ocvoivoii<span className="text-xs text-purple-300">Quản trị</span>
          </Link>
          <Link to="/" className="btn-secondary">
            Xem website
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </header>
      <div className="page-container grid items-start gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="glass-panel p-4 lg:sticky lg:top-28">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            Không gian quản trị
          </p>
          <nav aria-label="Điều hướng quản trị" className="mt-3 space-y-2">
            {[
              { to: "/admin", label: "Tổng quan", Icon: LayoutDashboard },
              { to: "/admin/ecosystem", label: "Hệ sinh thái", Icon: Network },
              {
                to: "/admin/community",
                label: "Biểu mẫu cộng đồng",
                Icon: Gamepad2,
              },
            ].map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-purple-500/15 text-purple-100 ring-1 ring-purple-400/25" : "text-slate-300 hover:bg-white/5"}`
                }
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="break-all px-3 text-xs leading-6 text-slate-400">
              {user.email}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={handleLogout}
              className="mt-3 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              {busy ? "Đang đăng xuất…" : "Đăng xuất"}
            </button>
            {error && (
              <p role="alert" className="mt-3 px-3 text-sm text-rose-300">
                {error}
              </p>
            )}
          </div>
        </aside>
        <main id="admin-content" tabIndex={-1} className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
