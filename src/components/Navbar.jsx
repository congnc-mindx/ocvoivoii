import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Gamepad2, Menu, X } from "lucide-react";
import PlayerAccess from "./player/PlayerAccess";
import { headerNavigation } from "../config/site";

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

function NavigationGroup({ label, items, pathname, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const groupRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();
  const active = items.some(({ to }) => to === pathname);

  useEffect(() => {
    if (!expanded) return undefined;
    function closeOutside(event) {
      if (!groupRef.current?.contains(event.target)) setExpanded(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [expanded]);

  return (
    <li
      ref={groupRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      }}
      onKeyDown={(event) => {
        if (expanded && event.key === "Escape") {
          event.stopPropagation();
          setExpanded(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
        className={`${linkClass({ isActive: active })} flex! w-full items-center justify-between gap-2 text-left whitespace-nowrap`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <ul
        id={panelId}
        hidden={!expanded}
        className="ml-4 mt-1 space-y-1 rounded-xl border border-white/10 bg-slate-900 p-1.5 xl:absolute xl:top-full xl:left-0 xl:ml-0 xl:mt-2 xl:min-w-52 xl:shadow-xl xl:shadow-black/40"
      >
        {items.map(({ to, label: itemLabel }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={linkClass}
              onClick={() => {
                setExpanded(false);
                onNavigate?.();
              }}
            >
              {itemLabel}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
}

function NavigationLinks({ pathname, onNavigate }) {
  return headerNavigation.map(({ to, label, items }) =>
    items ? (
      <NavigationGroup
        key={label}
        label={label}
        items={items}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    ) : (
      <li key={to}>
        <NavLink to={to} end className={linkClass} onClick={onNavigate}>
          {label}
        </NavLink>
      </li>
    ),
  );
}

export default function Navbar() {
  const location = useLocation();
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
    const media = window.matchMedia("(min-width: 1280px)");
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
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl"
    >
      <div className="page-container flex h-20 items-center justify-between gap-2 sm:gap-4">
        <Link
          to="/"
          aria-label="Ocvoivoii — Trang chủ"
          onClick={() => setOpenKey(null)}
          className="flex shrink-0 items-center gap-3 rounded-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl sm:h-11 sm:w-11 border border-purple-400/30 bg-purple-500/15 text-purple-300">
            <Gamepad2 aria-hidden="true" className="h-6 w-6" />
          </span>
          <span className="text-base font-black tracking-tight sm:text-xl text-white">
            Ocvoi<span className="text-cyan-300">voii</span>
            <span className="text-purple-400">.</span>
          </span>
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            <NavigationLinks key={location.key} pathname={pathname} />
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <PlayerAccess />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
            onClick={() => setOpenKey(open ? null : location.key)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white xl:hidden"
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
        className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-slate-950 px-5 py-4 xl:hidden"
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-2">
          {open && (
            <NavigationLinks
              key={location.key}
              pathname={pathname}
              onNavigate={() => setOpenKey(null)}
            />
          )}
        </ul>
      </nav>
    </header>
  );
}
