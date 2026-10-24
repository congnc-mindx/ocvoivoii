import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { auth } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import SessionStatus from "../auth/SessionStatus";
const errors = {
  "auth/invalid-email": "Địa chỉ email không hợp lệ.",
  "auth/invalid-credential": "Email hoặc mật khẩu chưa chính xác.",
  "auth/user-not-found": "Email hoặc mật khẩu chưa chính xác.",
  "auth/wrong-password": "Email hoặc mật khẩu chưa chính xác.",
  "auth/user-disabled": "Tài khoản đã bị vô hiệu hóa.",
  "auth/too-many-requests": "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.",
  "auth/network-request-failed": "Không thể kết nối. Vui lòng kiểm tra mạng.",
  "auth/operation-not-allowed":
    "Phương thức đăng nhập chưa được bật trong Firebase.",
};
export default function Login() {
  const { user, loading, error: sessionError, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef(null);
  const submitting = useRef(false);
  if (loading || sessionError) return <SessionStatus />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (user) return <SessionStatus />;
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy("login");
    setError("");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch (failure) {
      setError(errors[failure.code] || "Chưa thể đăng nhập. Vui lòng thử lại.");
    } finally {
      submitting.current = false;
      setBusy("");
    }
  }
  async function resetPassword() {
    if (submitting.current || !emailRef.current.reportValidity()) return;
    submitting.current = true;
    setBusy("reset");
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage(
        "Nếu email có tài khoản phù hợp, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư của bạn.",
      );
    } catch (failure) {
      if (failure.code === "auth/user-not-found")
        setMessage(
          "Nếu email có tài khoản phù hợp, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư của bạn.",
        );
      else
        setError(
          errors[failure.code] || "Chưa thể gửi yêu cầu. Vui lòng thử lại.",
        );
    } finally {
      submitting.current = false;
      setBusy("");
    }
  }
  return (
    <section className="page-container flex min-h-[75vh] items-center justify-center py-14">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8">
        <span className="icon-tile">
          <LockKeyhole aria-hidden="true" className="h-7 w-7" />
        </span>
        <p className="eyebrow mt-6">Không gian quản trị</p>
        <h1 className="text-3xl font-black text-white">Chào mừng trở lại.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          Đăng nhập bằng tài khoản đã được cấp quyền quản trị Ocvoivoii.
        </p>
        <form onSubmit={submit} aria-busy={Boolean(busy)} className="mt-7">
          <fieldset disabled={Boolean(busy)} className="space-y-5">
            <legend className="sr-only">Thông tin đăng nhập</legend>
            <div>
              <label htmlFor="login-email" className="field-label">
                Email
              </label>
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                name="email"
                autoComplete="username"
                required
                maxLength={254}
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="field-label">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={show ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="field-input pr-14"
                />
                <button
                  type="button"
                  aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={show}
                  aria-controls="login-password"
                  onClick={() => setShow((value) => !value)}
                  className="absolute inset-y-1 right-1 flex w-11 items-center justify-center rounded-lg text-slate-400"
                >
                  {show ? (
                    <EyeOff aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <Eye aria-hidden="true" className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm leading-7 text-rose-200"
              >
                {error}
              </p>
            )}
            {message && (
              <p
                role="status"
                className="rounded-xl border border-cyan-300/25 bg-cyan-300/5 p-4 text-sm leading-7 text-cyan-100"
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={Boolean(busy)}
              className="btn-primary w-full"
            >
              {busy === "login" ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin"
                  />
                  Đang đăng nhập…
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetPassword}
              disabled={Boolean(busy)}
              className="min-h-11 w-full rounded-lg text-sm font-semibold text-cyan-300"
            >
              {busy === "reset" ? "Đang gửi yêu cầu…" : "Quên mật khẩu?"}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
