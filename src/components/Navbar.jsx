import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Gamepad2, Menu, X, LogIn, ShieldCheck } from "lucide-react";
import { navigation } from "../config/site";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const location = useLocation();
  const { isAdmin, loading, user } = useAuth();
  const [openKey, setOpenKey] = useState(null);
  const open = openKey === location.key;
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpenKey(null);
    function keyDown(event) {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    }
    function pointerDown(event) {
      if (!headerRef.current?.contains(event.target)) close();
    }
    const media = window.matchMedia("(min-width: 1024px)");
    function breakpoint(event) {
      if (event.matches) close();
    }
    document.addEventListener("keydown", keyDown);
    document.addEventListener("pointerdown", pointerDown);
    media.addEventListener("change", breakpoint);
    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("pointerdown", pointerDown);
      media.removeEventListener("change", breakpoint);
    };
  }, [open]);
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "nav-link-active" : ""}`;
  const accountLabel = isAdmin ? "Quản trị" : user ? "Tài khoản" : "Đăng nhập";
  const AccountIcon = isAdmin ? ShieldCheck : LogIn;
  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl"
    >
      <div className="page-container flex h-20 items-center justify-between gap-4">
        <Link
          to="/"
          aria-label="Ocvoivoii — Trang chủ"
          onClick={() => setOpenKey(null)}
          className="flex shrink-0 items-center gap-3 rounded-xl"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/15 text-purple-300">
            <Gamepad2 aria-hidden="true" className="h-6 w-6" />
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            Ocvoi<span className="text-cyan-300">voii</span>
            <span className="text-purple-400">.</span>
          </span>
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={linkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            {loading ? (
              <span role="status" className="text-xs text-slate-400">
                Đang kiểm tra…
              </span>
            ) : (
              <Link
                to={isAdmin ? "/admin" : "/login"}
                className="nav-link account-nav-link"
              >
                <AccountIcon aria-hidden="true" className="h-4 w-4" />
                {accountLabel}
              </Link>
            )}
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
            onClick={() => setOpenKey(open ? null : location.key)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Điều hướng trên điện thoại"
        hidden={!open}
        className="border-t border-white/10 bg-slate-950 px-5 py-4 lg:hidden"
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-2">
          {navigation.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                onClick={() => setOpenKey(null)}
                className={linkClass}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="mt-2 border-t border-white/10 pt-3">
            {loading ? (
              <p role="status" className="px-4 text-sm text-slate-400">
                Đang kiểm tra tài khoản…
              </p>
            ) : (
              <Link
                to={isAdmin ? "/admin" : "/login"}
                onClick={() => setOpenKey(null)}
                className="nav-link account-nav-link"
              >
                <AccountIcon aria-hidden="true" className="h-4 w-4" />
                {accountLabel}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
