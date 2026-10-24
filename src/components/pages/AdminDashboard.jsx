import { Link } from "react-router-dom";
import { Network, ShieldCheck, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <>
      <p className="eyebrow">Ocvoivoii · Trang quản trị</p>
      <h1 className="page-title">Chào mừng trở lại.</h1>
      <p className="mt-4 text-sm leading-7 text-slate-400">
        Cập nhật các nhánh và liên kết của hệ sinh thái ngay trên website.
      </p>
      <section className="glass-panel mt-8 p-6 sm:p-8">
        <span className="icon-tile">
          <Network aria-hidden="true" className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-white">
          Quản lý hệ sinh thái
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Sửa tên, mô tả, liên kết, thứ tự và trạng thái hiển thị của các thương
          hiệu, dự án chung và kênh bạn bè.
        </p>
        <Link to="/admin/ecosystem" className="btn-primary mt-6">
          Mở danh mục
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
      <section className="glass-panel mt-6 p-6 sm:p-8">
        <h2 className="flex items-center gap-3 text-xl font-bold text-white">
          <ShieldCheck aria-hidden="true" className="h-6 w-6 text-cyan-300" />
          Tài khoản quản trị
        </h2>
        <dl className="mt-6 divide-y divide-white/10">
          {[
            ["Email", user.email],
            ["UID tài khoản", user.uid],
            ["Vai trò", "Quản trị viên"],
            ["Trạng thái quyền", "Đang hoạt động"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 py-4 sm:grid-cols-[140px_1fr]"
            >
              <dt className="text-sm text-slate-400">{label}</dt>
              <dd className="break-all text-sm text-slate-200">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
