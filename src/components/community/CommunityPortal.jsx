import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { db } from "../../firebase";
import Fields from "./Fields";
import useCommunitySessions from "./useCommunitySessions";
import {
  COMMUNITY_EVENTS,
  EVENT_IDS,
  registrationFields,
  feedbackFields,
  validateAnswers,
  normalizeAnswers,
  communityError,
  formatTime,
} from "./model";

function SessionForm({ session, feedback }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [receipt, setReceipt] = useState("");

  const lock = useRef(false);
  const form = useRef(null);
  const success = useRef(null);

  const fields = feedback
    ? feedbackFields(values.role)
    : registrationFields(session.eventId);

  const event = COMMUNITY_EVENTS.find((item) => item.id === session.eventId);

  const open = feedback ? session.feedbackOpen : session.registrationOpen;

  useEffect(() => {
    if (!busy) return;

    const timer = setTimeout(() => setSlow(true), 10000);

    return () => clearTimeout(timer);
  }, [busy]);

  useEffect(() => {
    if (receipt) success.current?.focus();
  }, [receipt]);

  function change(name, value) {
    setValues((current) => {
      const next = { ...current, [name]: value };

      if (name === "role") {
        for (const key of [
          "formatRating",
          "adminRating",
          "issues",
          "solutions",
          "streamRating",
          "casterRating",
          "retention",
        ]) {
          delete next[key];
        }
      }

      return next;
    });

    setErrors({});
    setError("");
  }

  async function submit(eventObject) {
    eventObject.preventDefault();

    if (lock.current) return;

    const problems = validateAnswers(fields, values, session.eventId, feedback);

    setErrors(problems);

    if (Object.keys(problems).length) {
      form.current?.elements.namedItem(Object.keys(problems)[0])?.focus();
      return;
    }

    if (!open) {
      setError("Đợt này đã đóng nhận biểu mẫu.");
      return;
    }

    if (!navigator.onLine) {
      setError("Vui lòng kết nối mạng trước khi gửi.");
      return;
    }

    lock.current = true;
    setBusy(true);
    setSlow(false);
    setError("");

    try {
      const target = feedback
        ? "event_feedback"
        : session.eventId === EVENT_IDS.NIGHT_MARKET
          ? "night_market_registrations"
          : "event_registrations";

      const payload = {
        schemaVersion: 1,
        sessionId: session.id,
        eventId: session.eventId,
        rulesVersion: session.rulesVersion,
        answers: normalizeAnswers(fields, values),
        createdAt: serverTimestamp(),
        ...(!feedback
          ? {
              status: "pending",
              roleVerified: false,
            }
          : {}),
      };

      const result = await addDoc(collection(db, target), payload);

      setReceipt(result.id);
    } catch (submissionError) {
      setError(communityError(submissionError));
    } finally {
      lock.current = false;
      setBusy(false);
      setSlow(false);
    }
  }

  if (receipt) {
    return (
      <div
        ref={success}
        tabIndex={-1}
        role="status"
        className="glass-panel p-8 text-center"
      >
        <h2 className="text-2xl font-black text-cyan-300">
          Đã nhận {feedback ? "góp ý" : "đăng ký"} của bạn!
        </h2>

        <p className="mt-4 text-sm leading-7 text-slate-300">
          {feedback
            ? "Cảm ơn bạn đã giúp Ốc Thượng Đài tốt hơn."
            : "BTC sẽ kiểm tra thông tin. Thông báo này chưa phải xác nhận suất chính thức."}
        </p>

        <p className="my-6 break-all text-sm text-slate-400">
          Mã biên nhận: {receipt}
        </p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setReceipt("");
            setValues({});
            setErrors({});
          }}
        >
          Gửi biểu mẫu mới
        </button>
      </div>
    );
  }

  return (
    <form
      ref={form}
      onSubmit={submit}
      noValidate
      className="glass-panel space-y-6 p-6 sm:p-8"
      aria-busy={busy}
    >
      <h2 className="text-2xl font-black">{session.title}</h2>

      <p className="text-sm text-slate-400">
        Lịch: {formatTime(session.startsAt)} · Giờ Việt Nam
      </p>

      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
        {session.rulesSummary}
      </p>

      {!feedback && event?.kind === "tournament" && (
        <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-4 text-sm leading-7">
          Điều kiện xét cấp role <strong>Ốc Tráng Sĩ</strong>: level Discord tối
          thiểu <strong>{session.minimumDiscordLevel}</strong>, áp dụng theo quy
          chế {session.rulesVersion}.
          <p>
            Khai báo trong form cần được MOD kiểm tra trên Discord. Website chưa
            tự cấp role.
          </p>
          <Link
            to={event.rulesPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 underline"
          >
            Đọc quy chế giải đấu
          </Link>
        </div>
      )}

      {!feedback && session.eventId === EVENT_IDS.NIGHT_MARKET && (
        <p className="rounded-xl border border-purple-400/25 p-4 text-sm leading-7 text-purple-200">
          Bạn tự đăng nhập và chia sẻ màn hình qua Discord. Không gửi tài khoản,
          mật khẩu, mã OTP hoặc mã khôi phục trong biểu mẫu.
        </p>
      )}

      {!open && (
        <p role="alert" className="text-amber-300">
          Đợt này đã đóng nhận biểu mẫu.
        </p>
      )}

      <fieldset disabled={busy || !open} className="min-w-0 space-y-6">
        <legend className="sr-only">Thông tin biểu mẫu</legend>

        <Fields
          fields={fields}
          values={values}
          errors={errors}
          onChange={change}
        />

        <p className="text-xs leading-6 text-slate-400">
          Thông tin được gửi riêng đến BTC để xử lý{" "}
          {feedback ? "góp ý" : "đăng ký"}. Không nhập thông tin bảo mật tài
          khoản.
        </p>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={busy || !open}
        >
          {busy && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}

          {busy ? "Đang gửi…" : feedback ? "Gửi đánh giá" : "Gửi đăng ký"}
        </button>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm leading-7 text-rose-300">
          {error}
        </p>
      )}

      <p role="status" className="text-sm text-slate-400">
        {busy
          ? slow
            ? "Kết nối đang chậm. Giữ trang mở và chờ xác nhận, đừng gửi lại."
            : "Đang chờ máy chủ xác nhận…"
          : ""}
      </p>
    </form>
  );
}

export default function CommunityPortal({ feedback = false }) {
  const { items, loading, error } = useCommunitySessions();

  const [selectedId, setSelectedId] = useState("");

  const sessions = items.filter((session) =>
    feedback
      ? session.eventId !== EVENT_IDS.NIGHT_MARKET && session.feedbackOpen
      : session.registrationOpen,
  );

  const selected = sessions.find((session) => session.id === selectedId);

  return (
    <section className="page-container py-14">
      <p className="eyebrow">Hang Ocvoivoii · Cùng chơi, cùng lớn</p>

      <h1 className="page-title">
        {feedback
          ? "Khảo sát & đánh giá Ốc Thượng Đài"
          : "Chọn kèo. Ghi tên. Lên sàn."}
      </h1>

      <div className="my-6 flex flex-wrap gap-4 text-sm text-cyan-300">
        <Link to="/register" className="underline">
          Đăng ký hoạt động
        </Link>
        <Link to="/feedback" className="underline">
          Gửi đánh giá giải đấu
        </Link>
      </div>

      {loading && (
        <p role="status">
          Đang tải các đợt hoạt động. Nếu chờ lâu, hãy kiểm tra mạng và tải lại
          trang.
        </p>
      )}

      {error && (
        <p role="alert" className="text-rose-300">
          {error}
        </p>
      )}

      {!loading && !error && sessions.length === 0 && (
        <p className="glass-panel p-6">
          Hiện chưa có đợt {feedback ? "khảo sát" : "đăng ký"} đang mở. Theo dõi
          thông báo tiếp theo của Ốc nhé.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              aria-pressed={session.id === selectedId}
              onClick={() => setSelectedId(session.id)}
              className={`glass-panel w-full p-5 text-left transition hover:border-cyan-400/50 ${
                selectedId === session.id
                  ? "border-cyan-400 ring-1 ring-cyan-400/40"
                  : ""
              }`}
            >
              <span className="block text-xs text-cyan-300">
                {
                  COMMUNITY_EVENTS.find((event) => event.id === session.eventId)
                    ?.title
                }
              </span>

              <span className="mt-2 block font-bold">{session.title}</span>

              <span className="mt-2 block text-xs text-slate-400">
                {formatTime(session.startsAt)}
              </span>
            </button>
          ))}
        </div>

        <div className="min-w-0">
          {selected ? (
            <SessionForm
              key={`${selected.id}-${selected.rulesVersion}-${feedback}`}
              session={selected}
              feedback={feedback}
            />
          ) : (
            sessions.length > 0 && (
              <p className="glass-panel p-8 text-slate-300">
                Chọn một đợt hoạt động để bắt đầu.
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}
