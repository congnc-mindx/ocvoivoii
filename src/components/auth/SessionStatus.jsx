import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import useAuth from "../../hooks/useAuth";
export default function SessionStatus() {
  const { user, loading, error, retrySession, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function handleLogout() {
    setBusy(true);
    setMessage("");
    try {
      await logout();
    } catch {
      setMessage("Chưa thể đăng xuất. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <div
        role="status"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 text-center"
      >
        <Loader2
          aria-hidden="true"
          className="h-8 w-8 animate-spin text-cyan-300"
        />
        <p className="text-sm text-slate-300">
          {user
            ? "Đang xác minh quyền tài khoản…"
            : "Đang kiểm tra phiên đăng nhập…"}
        </p>
      </div>
    );
  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <div className="glass-panel p-7 text-center">
        <span className="icon-tile">
          <ShieldAlert aria-hidden="true" className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-2xl font-black text-white">
          {error
            ? "Chưa thể xác minh tài khoản"
            : "Tài khoản chưa có quyền quản trị"}
        </h1>
        <p
          role={error ? "alert" : undefined}
          className="mt-4 text-sm leading-7 text-slate-400"
        >
          {error ||
            "Tài khoản chưa được cấp quyền admin hoặc quyền đã bị tạm dừng."}
        </p>
        {user?.email && (
          <p className="mt-4 break-all text-sm text-cyan-200">{user.email}</p>
        )}
        {message && (
          <p role="alert" className="mt-4 text-rose-300">
            {message}
          </p>
        )}
        <div className="mt-7 flex flex-col gap-3">
          {error && (
            <button
              type="button"
              onClick={retrySession}
              disabled={busy}
              className="btn-primary"
            >
              Thử xác minh lại
            </button>
          )}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={busy}
              className="btn-secondary"
            >
              {busy ? "Đang đăng xuất…" : "Đăng xuất để đổi tài khoản"}
            </button>
          )}
          <Link to="/" className="btn-secondary">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
