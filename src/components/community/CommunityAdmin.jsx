import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Fields from "./Fields";
import useCommunitySessions from "./useCommunitySessions";
import {
  COMMUNITY_EVENTS,
  EVENT_IDS,
  STATUS,
  registrationFields,
  feedbackFields,
  communityError,
  formatTime,
} from "./model";

const createFields = [
  {
    name: "eventId",
    label: "Hoạt động",
    type: "select",
    required: true,
    options: COMMUNITY_EVENTS.map((event) => ({
      value: event.id,
      label: event.title,
    })),
  },
  {
    name: "title",
    label: "Tên đợt / mùa giải",
    type: "text",
    required: true,
    maxLength: 120,
  },
  {
    name: "startsAt",
    label: "Ngày giờ tổ chức (giờ Việt Nam)",
    type: "datetime-local",
    required: true,
  },
  {
    name: "minimumDiscordLevel",
    label: "Level Discord tối thiểu để xét cấp role Ốc Tráng Sĩ",
    type: "number",
    required: true,
    hint: "Nhập theo quy chế hiện hành; Night Market nhập 0.",
  },
  {
    name: "rulesVersion",
    label: "Phiên bản quy chế",
    type: "text",
    required: true,
    maxLength: 60,
    hint: "Mỗi lần đổi quy chế dùng một mã mới để đối chiếu hồ sơ.",
  },
  {
    name: "rulesSummary",
    label: "Điều kiện, lịch, phần thưởng và quy định của đợt",
    type: "textarea",
    required: true,
    maxLength: 6000,
  },
];

const targets = [
  {
    value: "event_registrations",
    label: "Đăng ký giải đấu",
  },
  {
    value: "night_market_registrations",
    label: "Đăng ký Night Market",
  },
  {
    value: "event_feedback",
    label: "Khảo sát & đánh giá",
  },
];

function RecordCard({ record, target }) {
  const [status, setStatus] = useState(record.status ?? "pending");
  const [verified, setVerified] = useState(record.roleVerified === true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const feedback = target === "event_feedback";

  const fields = feedback
    ? feedbackFields(record.answers.role)
    : registrationFields(record.eventId);

  function display(item) {
    const value = record.answers[item.name];

    if (item.type === "checkbox") {
      return value ? "Đã đồng ý" : "Chưa đồng ý";
    }

    if (item.options) {
      return (
        (Array.isArray(value) ? value : [String(value ?? "")])
          .map(
            (entry) =>
              item.options.find((choice) => choice.value === entry)?.label ??
              entry,
          )
          .join(", ") || "Không có"
      );
    }

    return String(value ?? "") || "Không có";
  }

  async function save() {
    setBusy(true);
    setMessage("");

    try {
      await updateDoc(doc(db, target, record.id), {
        status,
        roleVerified: verified,
        reviewedAt: serverTimestamp(),
      });

      setMessage("Đã lưu xét duyệt.");
    } catch (error) {
      setMessage(communityError(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="glass-panel min-w-0 space-y-4 p-5">
      <h3 className="break-all font-bold text-cyan-300">{record.id}</h3>

      <p className="text-xs text-slate-400">
        Gửi lúc: {formatTime(record.createdAt)} · Quy chế: {record.rulesVersion}
      </p>

      <dl className="space-y-3">
        {fields.map((item) => (
          <div key={item.name}>
            <dt className="text-xs text-slate-400">{item.label}</dt>

            <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">
              {display(item)}
            </dd>
          </div>
        ))}
      </dl>

      {!feedback && (
        <fieldset
          disabled={busy}
          className="space-y-4 border-t border-white/10 pt-4"
        >
          <legend className="sr-only">Xét duyệt hồ sơ</legend>

          {record.eventId !== EVENT_IDS.NIGHT_MARKET && (
            <label className="flex items-start gap-3 text-sm leading-6">
              <input
                type="checkbox"
                checked={verified}
                onChange={(event) => setVerified(event.target.checked)}
                className="mt-1 accent-cyan-400"
              />
              Tôi đã kiểm tra người đăng ký có role Ốc Tráng Sĩ trên Discord
            </label>
          )}

          <label className="block text-sm">
            Kết quả xét duyệt
            <select
              className="field-input mt-2 bg-slate-900"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUS.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={save}
            className="btn-secondary"
            disabled={busy}
          >
            {busy ? "Đang lưu…" : "Lưu xét duyệt"}
          </button>
        </fieldset>
      )}

      <p role="status" className="text-sm text-cyan-200">
        {message}
      </p>
    </article>
  );
}

export default function CommunityAdmin() {
  const { items, loading, error } = useCommunitySessions(true);

  const [values, setValues] = useState({
    minimumDiscordLevel: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState("");
  const [target, setTarget] = useState("event_registrations");
  const [records, setRecords] = useState([]);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState("");

  async function create(event) {
    event.preventDefault();

    if (busy) return;

    const level = Number(values.minimumDiscordLevel);
    const localTime = values.startsAt;
    const date = new Date(`${localTime}:00+07:00`);

    const invalid =
      !COMMUNITY_EVENTS.some((item) => item.id === values.eventId) ||
      !values.title?.trim() ||
      values.title.trim().length > 120 ||
      !values.rulesVersion?.trim() ||
      values.rulesVersion.trim().length > 60 ||
      !values.rulesSummary?.trim() ||
      values.rulesSummary.trim().length > 6000 ||
      !localTime ||
      Number.isNaN(date.getTime()) ||
      String(values.minimumDiscordLevel).trim() === "" ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 1000 ||
      (values.eventId !== EVENT_IDS.NIGHT_MARKET && level < 1);

    if (invalid) {
      setMessage(
        "Vui lòng nhập đủ thông tin; level giải đấu là số nguyên từ 1–1000.",
      );
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      await addDoc(collection(db, "event_sessions"), {
        eventId: values.eventId,
        title: values.title.trim(),
        startsAt: Timestamp.fromDate(date),
        minimumDiscordLevel:
          values.eventId === EVENT_IDS.NIGHT_MARKET ? 0 : level,
        rulesVersion: values.rulesVersion.trim(),
        rulesSummary: values.rulesSummary.trim(),
        visible: true,
        registrationOpen: false,
        feedbackOpen: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setValues({ minimumDiscordLevel: "" });
      setMessage("Đã tạo đợt. Kiểm tra quy chế rồi bật nhận đăng ký bên dưới.");
    } catch (creationError) {
      setMessage(communityError(creationError));
    } finally {
      setBusy(false);
    }
  }

  async function toggle(session, key) {
    if (busy) return;

    setBusy(true);
    setMessage("");

    try {
      await updateDoc(doc(db, "event_sessions", session.id), {
        [key]: !session[key],
        updatedAt: serverTimestamp(),
      });
    } catch (updateError) {
      setMessage(communityError(updateError));
    } finally {
      setBusy(false);
    }
  }

  async function loadRecords(event) {
    event.preventDefault();

    if (!selected || reading) return;

    setReading(true);
    setReadError("");
    setRecords([]);

    try {
      const snapshot = await getDocs(
        query(collection(db, target), where("sessionId", "==", selected)),
      );

      const result = snapshot.docs
        .map((document) => ({
          ...document.data(),
          id: document.id,
        }))
        .sort(
          (first, second) =>
            (first.createdAt?.toMillis() ?? 0) -
              (second.createdAt?.toMillis() ?? 0) ||
            first.id.localeCompare(second.id),
        );

      setRecords(result);
    } catch (loadError) {
      setReadError(communityError(loadError));
    } finally {
      setReading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Ốc Thượng Đài · Vận hành</p>
        <h1 className="page-title">Biểu mẫu cộng đồng</h1>
      </div>

      <form onSubmit={create} className="glass-panel space-y-5 p-6">
        <h2 className="text-xl font-bold">Tạo đợt hoạt động</h2>

        <fieldset disabled={busy} className="space-y-5">
          <legend className="sr-only">Cấu hình đợt</legend>

          <Fields
            fields={createFields}
            values={values}
            errors={{}}
            onChange={(name, value) =>
              setValues((current) => ({
                ...current,
                [name]: value,
              }))
            }
          />

          <button className="btn-primary" disabled={busy}>
            {busy ? "Đang lưu…" : "Tạo đợt mới"}
          </button>
        </fieldset>
      </form>

      <p role="status" className="text-sm text-cyan-200">
        {message}
      </p>

      {loading && <p>Đang tải các đợt…</p>}

      {error && (
        <p role="alert" className="text-rose-300">
          {error}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Các đợt đã tạo</h2>

        {items.map((session) => (
          <article key={session.id} className="glass-panel p-5">
            <h3 className="font-bold">{session.title}</h3>

            <p className="mt-2 text-sm text-slate-400">
              {formatTime(session.startsAt)} · Level cấp role:{" "}
              {session.minimumDiscordLevel} · Quy chế: {session.rulesVersion}
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7">
              {session.rulesSummary}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "visible",
                "registrationOpen",
                ...(session.eventId !== EVENT_IDS.NIGHT_MARKET
                  ? ["feedbackOpen"]
                  : []),
              ].map((key) => (
                <button
                  key={key}
                  disabled={busy}
                  type="button"
                  className="btn-secondary"
                  onClick={() => toggle(session, key)}
                >
                  {
                    {
                      visible: "Hiển thị",
                      registrationOpen: "Nhận đăng ký",
                      feedbackOpen: "Nhận đánh giá",
                    }[key]
                  }
                  : {session[key] ? "Bật" : "Tắt"}
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">Hồ sơ & khảo sát</h2>

        <p className="text-sm leading-7 text-slate-400">
          Hồ sơ xếp từ sớm đến muộn theo giờ máy chủ. BTC kiểm tra role và phân
          suất thủ công: Solo 16 suất, 5v5 10 suất; còn lại dự bị. Hệ thống chưa
          tự cấp role, chống đăng ký trùng hay tự chia suất.
        </p>

        <form onSubmit={loadRecords} className="glass-panel space-y-4 p-5">
          <label className="block text-sm">
            Đợt hoạt động
            <select
              required
              className="field-input mt-2 bg-slate-900"
              disabled={reading}
              value={selected}
              onChange={(event) => {
                setSelected(event.target.value);
                setRecords([]);
              }}
            >
              <option value="">Chọn đợt</option>
              {items.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            Loại hồ sơ
            <select
              className="field-input mt-2 bg-slate-900"
              disabled={reading}
              value={target}
              onChange={(event) => {
                setTarget(event.target.value);
                setRecords([]);
              }}
            >
              {targets.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-secondary" disabled={reading || !selected}>
            {reading ? "Đang tải…" : "Tải / làm mới danh sách"}
          </button>
        </form>

        {readError && (
          <p role="alert" className="text-rose-300">
            {readError}
          </p>
        )}

        <p className="text-sm text-slate-400">
          Số hồ sơ đã tải: {records.length}
        </p>

        <div className="grid items-start gap-5 xl:grid-cols-2">
          {records.map((record) => (
            <RecordCard
              key={`${target}-${record.id}`}
              record={record}
              target={target}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
