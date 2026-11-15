import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { discordIdError, normalizeDiscordId, playerFields, validatePlayerProfile } from "../../features/player/profile";
import { playerError, savePlayerProfile } from "../../features/player/firebase";

const discordStep = ["discordId", "discordJoined"];

function DiscordHelp({ invite }) {
  return (
    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/5 p-4">
      <p className="text-sm font-semibold text-white">Hang Ocvoivoii</p>
      <p className="mt-1 text-xs leading-6 text-slate-300">Nếu chưa tham gia, hãy vào server trước. Bạn có thể quay lại đây mà không mất thông tin đã nhập.</p>
      {invite ? (
        <a href={invite} target="_blank" rel="noopener noreferrer" className="my-2 inline-flex min-h-10 items-center gap-2 font-semibold text-cyan-300 underline">
          Mở lời mời Discord <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      ) : <p className="my-2 text-xs text-amber-200">Chưa có link mời trên web. Nếu đã vào server, bạn vẫn có thể tiếp tục.</p>}
      <details className="border-t border-white/10 pt-2 text-sm">
        <summary className="cursor-pointer py-2 font-semibold text-violet-200">Không biết lấy ID Discord ở đâu?</summary>
        <ol className="ml-4 list-decimal space-y-1 pb-2 text-xs leading-6 text-slate-300">
          <li>Trong Discord, vào Cài đặt → Nâng cao (Advanced) → bật Chế độ nhà phát triển (Developer Mode).</li>
          <li>Mở hồ sơ của chính bạn. Trên máy tính, nhấp chuột phải vào tên của bạn; trên điện thoại, mở menu dấu ba chấm trong hồ sơ.</li>
          <li>Chọn <strong>Sao chép ID người dùng</strong> (Copy User ID), rồi quay lại và dán vào ô bên dưới.</li>
        </ol>
        <a href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID" target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-xs text-cyan-300 underline">Xem hướng dẫn có hình của Discord ↗</a>
      </details>
    </div>
  );
}

export default function PlayerProfileForm({ user, existing, invite, onSaved, onCancel }) {
  const [fields, setFields] = useState(() => existing ?? { fullName: user.displayName ?? "", discordJoined: false });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [discordTouched, setDiscordTouched] = useState(false);
  const formRef = useRef(null);
  const heading = useRef(null);
  const target = useRef(null);
  const lock = useRef(false);

  useLayoutEffect(() => {
    if (!target.current) return;
    const field = formRef.current?.elements.namedItem(target.current);
    (field ?? heading.current)?.focus();
    target.current = null;
  }, [step, errors]);

  function update(name, value) {
    setFields(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined, ...(name === "riotId" ? { trackerUrl: undefined } : {}) }));
    setProblem("");
  }

  function change(event) {
    const { name, value, checked, type } = event.currentTarget;
    update(name, type === "checkbox" ? checked : value);
  }

  function move(next) {
    target.current = "step-heading";
    setErrors({});
    setProblem("");
    setStep(next);
  }

  async function submit(event) {
    event.preventDefault();
    if (lock.current) return;
    const { data, errors: next } = validatePlayerProfile(fields);
    const key = Object.keys(next).find(name => step === 1 || !discordStep.includes(name));
    if (key) {
      target.current = key;
      if (step === 1 && !discordStep.includes(key)) setStep(0);
      setErrors(next);
      return;
    }
    if (step === 0) { move(1); return; }
    setProblem("");
    lock.current = true;
    setBusy(true);
    try {
      await savePlayerProfile(user.uid, data);
      onSaved(data);
    } catch (error) { setProblem(playerError(error)); }
    finally { setBusy(false); lock.current = false; }
  }

  const id = normalizeDiscordId(fields.discordId);
  const idError = errors.discordId || (discordTouched && id ? discordIdError(id) : "");
  const idLooksValid = /^\d{17,20}$/.test(id);

  return (
    <form ref={formRef} noValidate onSubmit={submit} aria-busy={busy}>
      <div className="mb-5 grid grid-cols-2 gap-2 text-xs font-semibold" aria-label="Tiến độ hồ sơ">
        {["Thông tin thi đấu", "Kết nối Discord"].map((label, index) => (
          <div key={label} aria-current={index === step ? "step" : undefined} className={`rounded-xl border px-3 py-2 ${index === step ? "border-violet-400/40 bg-violet-500/15 text-violet-100" : "border-white/10 text-slate-400"}`}>{index + 1}. {label}</div>
        ))}
      </div>
      <h3 ref={heading} tabIndex={-1} className="mb-3 font-bold text-white">{step === 0 ? "Thông tin của bạn" : "Discord của bạn"}</h3>
      <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">{step === 0 ? "Thông tin tuyển thủ" : "Kết nối Discord"}</legend>
        {step === 0 ? playerFields.filter(({ name }) => name !== "discordId").map(({ name, label, options, wide, ...props }) => {
          const fieldId = "player-" + name;
          const hint = name === "trackerUrl" ? "Dán link trang hồ sơ VALORANT trên Tracker.gg; link phải khớp Ingame + Tagline." : "";
          const attributes = {
            id: fieldId, name, value: fields[name] ?? "", onChange: change, required: true,
            "aria-invalid": Boolean(errors[name]),
            "aria-describedby": [hint && fieldId + "-hint", errors[name] && fieldId + "-error"].filter(Boolean).join(" ") || undefined,
            className: "field-input w-full",
          };
          return (
            <div key={name} className={wide ? "min-w-0 sm:col-span-2" : "min-w-0"}>
              <label className="field-label" htmlFor={fieldId}>{label}</label>
              {options ? (
                <select {...attributes}>
                  <option value="">— Chưa chọn —</option>
                  {options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : <input {...attributes} {...props} type={props.type ?? "text"} />}
              {hint && <p id={fieldId + "-hint"} className="mt-1 text-xs leading-5 text-slate-400">{hint}</p>}
              {errors[name] && <p id={fieldId + "-error"} className="mt-1 text-xs text-rose-300">{errors[name]}</p>}
            </div>
          );
        }) : (
          <div className="space-y-4 sm:col-span-2">
            <DiscordHelp invite={invite} />
            <div>
              <label htmlFor="player-discordId" className="field-label">ID người dùng Discord</label>
              <input id="player-discordId" name="discordId" type="text" inputMode="numeric" autoComplete="off" spellCheck={false}
                value={fields.discordId ?? ""} onChange={change} onBlur={() => { setDiscordTouched(true); if (id !== (fields.discordId ?? "")) update("discordId", id); }}
                onPaste={event => {
                  const pasted = normalizeDiscordId(event.clipboardData.getData("text"));
                  if (/^\d{17,20}$/.test(pasted)) { event.preventDefault(); update("discordId", pasted); }
                }}
                placeholder="Dán ID dạng số" required aria-invalid={Boolean(idError)}
                aria-describedby={idError ? "discord-id-hint discord-id-error" : "discord-id-hint"}
                className="field-input w-full font-mono" />
              <p id="discord-id-hint" className="mt-1 text-xs leading-5 text-slate-400">ID là dãy 17–20 chữ số. Dán ID người dùng của bạn, thay vì @username hoặc ID máy chủ.</p>
              {idError && <p id="discord-id-error" role="alert" className="mt-1 text-xs text-rose-300">{idError}</p>}
              {idLooksValid && !idError && <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300"><Check className="size-3.5" aria-hidden="true" />ID đúng định dạng.</p>}
            </div>
            <div className="rounded-xl border border-white/10 p-3">
              <label className="flex items-start gap-3 text-sm font-semibold leading-6">
                <input name="discordJoined" type="checkbox" checked={fields.discordJoined === true} onChange={change}
                  aria-invalid={Boolean(errors.discordJoined)} aria-describedby={errors.discordJoined ? "discord-join-error" : undefined}
                  className="mt-1 size-4 shrink-0 accent-violet-400" />
                Tôi đã tham gia server Hang Ocvoivoii
              </label>
              {errors.discordJoined && <p id="discord-join-error" className="ml-7 mt-1 text-xs text-rose-300">{errors.discordJoined}</p>}
            </div>
            <p className="text-xs leading-5 text-slate-400">Thông tin dùng để điền hồ sơ dự giải sau này. Thông tin liên hệ được giữ riêng tư.</p>
          </div>
        )}
        {problem && <p role="alert" className="text-sm text-rose-300 sm:col-span-2">{problem} Thông tin bạn nhập vẫn còn; bạn có thể thử lưu lại.</p>}
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {step === 1 && <button type="button" className="btn-secondary" onClick={() => move(0)}><ArrowLeft className="size-4" aria-hidden="true" /> Quay lại</button>}
          <button className="btn-primary flex-1" type="submit">
            {step === 0 ? <>Tiếp tục <ChevronRight className="size-4" aria-hidden="true" /></> : busy ? "Đang lưu…" : existing ? "Lưu thay đổi" : "Hoàn tất đăng ký"}
          </button>
          {existing && <button type="button" className="btn-secondary" onClick={onCancel}>Hủy sửa</button>}
        </div>
      </fieldset>
    </form>
  );
}
