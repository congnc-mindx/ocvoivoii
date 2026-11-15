import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LogIn, UserRound, X } from "lucide-react";
import useBrands from "../../hooks/useBrands";
import { getGamingChannels } from "../../data/ecosystem";
import { connectGoogle, disconnectPlayer, getPlayerProfile, observePlayer, playerAuthReady, playerError } from "../../features/player/firebase";
import { discordInvite } from "../../features/player/profile";
import PlayerProfileForm from "./PlayerProfileForm";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.5 6.1-8.7 6.1-15Z"/>
      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-5l-6.6-5.1a12.4 12.4 0 0 1-18.4-6.5H5.7v5.2A20 20 0 0 0 24 44Z"/>
      <path fill="#FBBC05" d="M12.5 27.4a12 12 0 0 1 0-6.8v-5.2H5.7a20 20 0 0 0 0 17.2Z"/>
      <path fill="#EA4335" d="M24 11.9c3 0 5.6 1 7.6 3l5.7-5.7A19.2 19.2 0 0 0 24 4 20 20 0 0 0 5.7 15.4l6.8 5.2A12 12 0 0 1 24 11.9Z"/>
    </svg>
  );
}

function ProfileFormWithInvite(props) {
  const { brands } = useBrands();
  const community = getGamingChannels(brands).find(item => item.id === "discord")?.url;
  const invite = discordInvite(import.meta.env.VITE_DISCORD_INVITE_URL) || discordInvite(community);
  return <PlayerProfileForm {...props} invite={invite} />;
}

function LinkedPlayer({ user }) {
  const [profile, setProfile] = useState(undefined);
  const [problem, setProblem] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    let active = true;
    getPlayerProfile(user.uid).then(
      data => { if (active) setProfile(data); },
      error => { if (active) setProblem(playerError(error)); },
    );
    return () => { active = false; };
  }, [user.uid, attempt]);

  async function logout() {
    setLeaving(true);
    try { await disconnectPlayer(); }
    catch (error) { setProblem(playerError(error)); }
    finally { setLeaving(false); }
  }

  return (
    <>
      <div className="mb-6 pr-9">
        <p className="eyebrow">Tài khoản tuyển thủ</p>
        <h2 id="player-access-title" className="text-2xl font-black text-white">{profile ? editing ? "Cập nhật hồ sơ" : "Hồ sơ của bạn" : profile === null ? "Hoàn tất đăng ký" : "Đang kiểm tra hồ sơ"}</h2>
        <p className="mt-2 break-all text-sm text-slate-300">{user.email}</p>
        {profile === null && <p className="mt-2 text-sm leading-6 text-slate-400">Google đã kết nối. Điền hồ sơ một lần để dùng khi đăng ký giải.</p>}
      </div>
      {problem && (
        <div className="mb-4 rounded-xl border border-rose-400/25 p-4">
          <p role="alert" className="text-sm text-rose-300">{problem}</p>
          {profile === undefined && <button type="button" className="btn-secondary mt-3" onClick={() => { setProblem(""); setAttempt(n => n + 1); }}>Thử lại</button>}
        </div>
      )}
      {profile === undefined && !problem && <p role="status" className="text-sm text-slate-400">Đang tải dữ liệu…</p>}
      {(profile === null || editing) && (
        <ProfileFormWithInvite user={user} existing={profile}
          onCancel={() => setEditing(false)}
          onSaved={data => { setProfile(data); setEditing(false); setSaved(true); }} />
      )}
      {profile && !editing && (
        <>
          {saved && <p role="status" className="mb-4 flex gap-2 text-sm text-emerald-300"><CheckCircle2 className="size-5" aria-hidden="true" />Đã lưu hồ sơ tuyển thủ.</p>}
          <dl className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
            {[["Họ và tên", profile.fullName], ["Ingame + Tagline", profile.riotId], ["Rank", profile.rank], ["Vai trò", profile.role]].map(([label, value]) => (
              <div key={label} className="min-w-0"><dt className="text-xs text-slate-400">{label}</dt><dd className="break-words text-sm font-semibold text-white">{value}</dd></div>
            ))}
          </dl>
          <button type="button" className="btn-secondary mt-4" onClick={() => { setEditing(true); setSaved(false); }}>Chỉnh sửa hồ sơ</button>
        </>
      )}
      {!editing && <button type="button" className="mt-4 block text-sm font-semibold text-slate-400 hover:text-white" onClick={logout} disabled={leaving}>{leaving ? "Đang đăng xuất…" : profile === null ? "Dùng tài khoản Google khác" : "Đăng xuất"}</button>}
    </>
  );
}

export default function PlayerAccess() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!playerAuthReady);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const dialog = useRef(null);

  useEffect(() => {
    if (!playerAuthReady) return;
    return observePlayer(
      next => { setUser(next); setReady(true); },
      error => { setProblem(playerError(error)); setReady(true); },
    );
  }, []);

  async function google() {
    if (busy) return;
    setBusy(true);
    setProblem("");
    try { await connectGoogle(); }
    catch (error) { setProblem(playerError(error)); }
    finally { setBusy(false); }
  }

  function open() {
    if (!dialog.current?.open) dialog.current?.showModal();
  }

  return (
    <>
      <button className="btn-secondary player-access-trigger whitespace-nowrap" onClick={open} type="button" aria-haspopup="dialog">
        {user ? <UserRound className="size-4 shrink-0" aria-hidden="true" /> : <LogIn className="size-4 shrink-0" aria-hidden="true" />}
        {user ? "Tài khoản" : "Đăng nhập"}
      </button>
      <dialog ref={dialog} className="player-access-dialog" aria-labelledby="player-access-title">
        <button aria-label="Đóng" type="button" className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg border border-white/10 hover:bg-white/10" onClick={() => dialog.current?.close()}>
          <X className="size-5" aria-hidden="true" />
        </button>
        {user ? <LinkedPlayer key={user.uid} user={user} /> : (
          <div className="max-w-md">
            <p className="eyebrow">Hang Ocvoivoii</p>
            <h2 id="player-access-title" className="pr-10 text-2xl font-black text-white">Đăng nhập hoặc đăng ký</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Dùng tài khoản Google của bạn. Nếu đây là lần đầu, bạn sẽ điền hồ sơ tuyển thủ sau khi kết nối.</p>
            <button className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-slate-100 disabled:opacity-60" type="button" disabled={busy || !ready || !playerAuthReady} onClick={google}>
              <GoogleIcon />{busy ? "Đang kết nối…" : !ready ? "Đang kiểm tra phiên…" : "Tiếp tục với Google"}
            </button>
            {!playerAuthReady && <p role="alert" className="mt-3 text-sm text-rose-300">Website chưa kết nối Firebase.</p>}
            {problem && <p role="alert" className="mt-3 text-sm text-rose-300">{problem}</p>}
            <p className="mt-4 text-xs leading-5 text-slate-400">Bạn không cần tạo mật khẩu riêng cho Hang Ocvoivoii.</p>
          </div>
        )}
      </dialog>
    </>
  );
}
