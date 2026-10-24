import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useBrands from "../../hooks/useBrands";
import BrandCard from "./BrandCard";

export default function EcosystemPreview() {
  const { brands, loading, error } = useBrands();
  const featured = brands.filter((brand) => brand.group === "main");
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="page-container py-12"
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Ngoài những trận game</p>
          <h2 id="ecosystem-heading" className="section-title">
            Ốc còn đi đâu, làm gì?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Những chuyến đi, âm nhạc và các dự án mang dấu ấn riêng của Ốc.
          </p>
        </div>
        <Link to="/ecosystem" className="btn-secondary shrink-0">
          Toàn bộ hệ sinh thái
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      {loading ? (
        <p role="status" className="mt-7 text-sm text-slate-400">
          Đang tải các nhánh của Ốc…
        </p>
      ) : error ? (
        <p role="status" className="mt-7 text-sm text-slate-400">
          Danh mục đang được cập nhật.
        </p>
      ) : featured.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((brand) => (
            <BrandCard key={brand.id} brand={brand} compact />
          ))}
        </div>
      ) : (
        <p className="mt-7 text-sm text-slate-400">
          Các nhánh sẽ sớm được giới thiệu tại đây.
        </p>
      )}
    </section>
  );
}
