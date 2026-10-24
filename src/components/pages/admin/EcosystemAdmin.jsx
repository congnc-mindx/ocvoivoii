import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, EyeOff, Loader2, Plus } from "lucide-react";
import useBrands from "../../../hooks/useBrands";
import { defaultBrands, ecosystemGroups } from "../../../data/ecosystem";
import { initializeBrands } from "../../../services/ecosystem";
import BrandEditor from "../../admin/BrandEditor";

export default function EcosystemAdmin() {
  const { brands, loading, error, reload } = useBrands("admin");
  const [selectedId, setSelectedId] = useState("");
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [dirty, setDirty] = useState(false);
  const selected = brands.find((brand) => brand.id === selectedId) || brands[0];
  const missingDefaults = defaultBrands.some(
    (brand) => !brands.some((entry) => entry.id === brand.id),
  );
  async function initialize() {
    if (initializing) return;
    if (!navigator.onLine) {
      setActionError("Vui lòng kết nối mạng trước khi khởi tạo.");
      return;
    }
    setInitializing(true);
    setMessage("");
    setActionError("");
    try {
      const count = await initializeBrands();
      setMessage(
        count
          ? `Đã thêm ${count} mục. Các mục đã có được giữ nguyên.`
          : "Danh mục đã đủ, không có mục nào bị ghi đè.",
      );
    } catch {
      setActionError(
        "Chưa thể khởi tạo. Hãy kiểm tra Firestore Rules và quyền admin.",
      );
    } finally {
      setInitializing(false);
    }
  }
  function select(id) {
    if (id === selected?.id) return;
    if (
      dirty &&
      !window.confirm(
        "Bạn có thay đổi chưa lưu. Chuyển sang mục khác và bỏ các thay đổi này?",
      )
    )
      return;
    setDirty(false);
    setSelectedId(id);
    setMessage("");
    setActionError("");
  }
  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="eyebrow">Quản trị nội dung</p>
          <h1 className="page-title">Hệ sinh thái.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Cập nhật thương hiệu, dự án chung và kênh bạn bè. Thay đổi được hiển
            thị sau khi lưu, không cần deploy lại.
          </p>
        </div>
        <Link to="/ecosystem" className="btn-secondary shrink-0">
          Xem trang công khai
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      {message && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-cyan-300/25 bg-cyan-300/5 p-4 text-sm text-cyan-100"
        >
          {message}
        </p>
      )}
      {actionError && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-200"
        >
          {actionError}
        </p>
      )}
      {loading ? (
        <p
          role="status"
          className="mt-8 flex items-center gap-3 text-slate-400"
        >
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
          Đang tải danh mục…
        </p>
      ) : error ? (
        <div role="alert" className="glass-panel mt-8 p-6">
          <p className="text-sm text-slate-300">{error}</p>
          <button type="button" onClick={reload} className="btn-secondary mt-5">
            Thử tải lại
          </button>
        </div>
      ) : (
        <>
          {missingDefaults && (
            <div className="glass-panel mt-7 flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-white">
                  {brands.length
                    ? "Bổ sung danh mục mặc định"
                    : "Khởi tạo 8 mục đầu tiên"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Bốn thương hiệu chính, hai dự án chung và hai kênh bạn bè. Chỉ
                  tạo mục còn thiếu.
                </p>
              </div>
              <button
                type="button"
                disabled={initializing}
                onClick={initialize}
                className="btn-primary shrink-0"
              >
                {initializing ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                  />
                ) : (
                  <Plus aria-hidden="true" className="h-4 w-4" />
                )}
                {initializing ? "Đang khởi tạo…" : "Khởi tạo danh mục"}
              </button>
            </div>
          )}
          {brands.length > 0 && (
            <div className="mt-8 grid items-start gap-5 xl:grid-cols-[220px_1fr]">
              <nav
                aria-label="Chọn danh mục chỉnh sửa"
                className="glass-panel p-3"
              >
                {ecosystemGroups.map((group) => (
                  <div key={group.id} className="mb-4 last:mb-0">
                    <h2 className="px-3 py-2 text-xs font-semibold text-slate-400">
                      {group.title}
                    </h2>
                    {brands
                      .filter((brand) => brand.group === group.id)
                      .map((brand) => (
                        <button
                          key={brand.id}
                          type="button"
                          aria-pressed={selected?.id === brand.id}
                          onClick={() => select(brand.id)}
                          className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-sm transition ${selected?.id === brand.id ? "bg-purple-500/15 text-purple-100" : "text-slate-300 hover:bg-white/5"}`}
                        >
                          {brand.name}
                          {!brand.visible && (
                            <>
                              <EyeOff
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0"
                              />
                              <span className="sr-only">Đang ẩn</span>
                            </>
                          )}
                        </button>
                      ))}
                  </div>
                ))}
              </nav>
              {selected && (
                <BrandEditor
                  key={`${selected.id}-${selected.updatedAt?.seconds}-${selected.updatedAt?.nanoseconds}`}
                  brand={selected}
                  onDirty={setDirty}
                  onSaved={setMessage}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
