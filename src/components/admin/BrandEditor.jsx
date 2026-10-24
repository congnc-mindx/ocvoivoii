import { useRef, useState } from "react";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import {
  ecosystemGroups,
  platformLabels,
  validateBrand,
} from "../../data/ecosystem";
import { saveBrand } from "../../services/ecosystem";
import BrandCard from "../ecosystem/BrandCard";

export default function BrandEditor({ brand, onSaved, onDirty }) {
  const [draft, setDraft] = useState(() => ({
    ...brand,
    links: { ...brand.links },
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  function change(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    onDirty(true);
    setError("");
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const validation = validateBrand(draft);
    if (validation) {
      setError(validation);
      return;
    }
    if (!navigator.onLine) {
      setError("Bạn đang ngoại tuyến. Vui lòng kết nối mạng trước khi lưu.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      await saveBrand(draft);
      onDirty(false);
      onSaved(`Đã lưu ${draft.name.trim()}.`);
    } catch (failure) {
      setError(
        failure.message?.startsWith("Nội dung")
          ? failure.message
          : "Chưa thể lưu. Vui lòng kiểm tra kết nối và quyền quản trị rồi thử lại.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <form
        onSubmit={submit}
        aria-busy={busy}
        className="glass-panel p-5 sm:p-7"
      >
        <h2 className="text-xl font-bold text-white">{brand.name}</h2>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          Mã danh mục: {brand.id}
        </p>
        <fieldset disabled={busy} className="mt-6 space-y-5">
          <legend className="sr-only">Chỉnh sửa danh mục</legend>
          <div>
            <label htmlFor="brand-name" className="field-label">
              Tên hiển thị
            </label>
            <input
              id="brand-name"
              required
              maxLength={100}
              value={draft.name}
              onChange={(event) => change("name", event.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="brand-description" className="field-label">
              Mô tả
            </label>
            <textarea
              id="brand-description"
              required
              maxLength={600}
              rows={4}
              value={draft.description}
              onChange={(event) => change("description", event.target.value)}
              className="field-input resize-y"
            />
            <p className="mt-2 text-right text-xs text-slate-400">
              {draft.description.length}/600 ký tự
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="brand-group" className="field-label">
                Nhóm hiển thị
              </label>
              <select
                id="brand-group"
                value={draft.group}
                onChange={(event) => change("group", event.target.value)}
                className="field-input"
              >
                {ecosystemGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="brand-order" className="field-label">
                Thứ tự
              </label>
              <input
                id="brand-order"
                type="number"
                min={0}
                max={9999}
                step={1}
                required
                value={draft.order}
                onChange={(event) => change("order", event.target.value)}
                className="field-input"
              />
              <p className="mt-2 text-xs text-slate-400">
                Số nhỏ được xếp trước trong cùng nhóm.
              </p>
            </div>
          </div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <input
              type="checkbox"
              checked={draft.visible}
              onChange={(event) => change("visible", event.target.checked)}
              className="h-5 w-5 accent-purple-500"
            />
            {draft.visible ? (
              <Eye aria-hidden="true" className="h-4 w-4 text-cyan-300" />
            ) : (
              <EyeOff aria-hidden="true" className="h-4 w-4 text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-200">
              Hiển thị trên website
            </span>
          </label>
          <div className="border-t border-white/10 pt-5">
            <h3 className="font-bold text-white">Liên kết nền tảng</h3>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              Dùng liên kết HTTPS chính thức. Để trống những kênh chưa muốn hiển
              thị.
            </p>
            <div className="mt-5 space-y-4">
              {draft.platforms.map((platform) => (
                <div key={platform}>
                  <label htmlFor={`link-${platform}`} className="field-label">
                    {platformLabels[platform]}
                  </label>
                  <input
                    id={`link-${platform}`}
                    type="url"
                    maxLength={2048}
                    autoCapitalize="none"
                    spellCheck={false}
                    value={draft.links[platform] || ""}
                    onChange={(event) =>
                      change("links", {
                        ...draft.links,
                        [platform]: event.target.value,
                      })
                    }
                    className="field-input"
                  />
                </div>
              ))}
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
          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full sm:w-auto"
          >
            {busy ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Save aria-hidden="true" className="h-4 w-4" />
            )}
            {busy ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </fieldset>
      </form>
      <section aria-label="Xem trước thẻ danh mục">
        <h3 className="mb-4 text-sm font-semibold text-slate-400">
          Xem trước thẻ ·{" "}
          {draft.visible ? "Đang bật hiển thị" : "Đang ẩn khỏi website"}
        </h3>
        <BrandCard brand={draft} />
      </section>
    </div>
  );
}
