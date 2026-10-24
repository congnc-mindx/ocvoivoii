import { Loader2 } from "lucide-react";
import PageIntro from "../PageIntro";
import BrandCard from "../ecosystem/BrandCard";
import useBrands from "../../hooks/useBrands";
import { ecosystemGroups } from "../../data/ecosystem";

export default function Ecosystem() {
  const { brands, loading, error, reload } = useBrands();
  return (
    <section className="page-container py-14 lg:py-20">
      <PageIntro
        eyebrow="Kết nối những câu chuyện"
        title="Thế giới của Ocvoivoii."
        description="Bắt đầu từ game, mở ra những chuyến đi, âm nhạc và các dự án được xây dựng cùng nhau."
      />
      {loading ? (
        <div
          role="status"
          className="flex items-center gap-3 py-12 text-slate-400"
        >
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
          Đang tải hệ sinh thái…
        </div>
      ) : error ? (
        <div role="alert" className="glass-panel p-7">
          <p className="text-sm leading-7 text-slate-300">{error}</p>
          <button type="button" onClick={reload} className="btn-secondary mt-5">
            Thử tải lại
          </button>
        </div>
      ) : brands.length ? (
        <div className="space-y-14">
          {ecosystemGroups.map((group) => {
            const entries = brands.filter((brand) => brand.group === group.id);
            if (!entries.length) return null;
            return (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <h2 id={`group-${group.id}`} className="section-title">
                  {group.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                  {group.description}
                </p>
                <div
                  className={`mt-7 grid gap-5 md:grid-cols-2 ${group.id === "main" ? "xl:grid-cols-2" : ""}`}
                >
                  {entries.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-8">
          <h2 className="text-xl font-bold text-white">
            Hẹn gặp những câu chuyện mới.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Danh mục hệ sinh thái đang được chuẩn bị. Bạn có thể tiếp tục khám
            phá nội dung Gaming trên trang chủ.
          </p>
        </div>
      )}
    </section>
  );
}
