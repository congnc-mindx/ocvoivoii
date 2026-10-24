// src/pages/About.jsx
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Headphones,
  Mic2,
  Monitor,
  Trophy,
  Users,
} from "lucide-react";
import PageIntro from "../PageIntro";
import ExternalLink from "../ExternalLink";
import PlatformIcon from "../icons/PlatformIcon";
import { getGamingChannels } from "../../data/ecosystem";
import useBrands from "../../hooks/useBrands";
import BrandCard from "../ecosystem/BrandCard";

const milestones = [
  {
    title: "Xây dựng Ocvoivoii Gaming",
    description:
      "Một nơi chia sẻ trải nghiệm chơi game, những pha xử lý và câu chuyện trong mỗi buổi livestream.",
    Icon: Gamepad2,
  },
  {
    title: "Kết nối Hang Ocvoivoii",
    description:
      "Từ những người xem xa lạ thành một cộng đồng có thể trò chuyện, tìm đồng đội và chơi cùng nhau.",
    Icon: Users,
  },
  {
    title: "Mang Ốc Thượng Đài lên sóng",
    description:
      "Tạo sân chơi cộng đồng để người tham gia được thi đấu, giao lưu và có khoảnh khắc của riêng mình.",
    Icon: Trophy,
  },
];

const setup = [
  { label: "Bộ xử lý", value: "Intel Core i5-14600K", Icon: Cpu },
  {
    label: "Card đồ họa",
    value: "MSI RTX 3060 Ventus 2X OC 12GB",
    Icon: Monitor,
  },
  {
    label: "Bộ nhớ",
    value: "Kingston Fury Beast RGB 64GB DDR4 3600",
    Icon: Cpu,
  },
  { label: "Lưu trữ", value: "Kingston KC3000 1TB", Icon: Cpu },
  {
    label: "Màn hình chính",
    value: "LG UltraGear 27G610A-B · QHD · 200Hz",
    Icon: Monitor,
  },
  { label: "Chuột", value: "Logitech G304 / G305", Icon: Gamepad2 },
  { label: "Tai nghe", value: "Razer BlackShark V2 X USB", Icon: Headphones },
];

export default function About() {
  const { brands } = useBrands();
  const socialChannels = getGamingChannels(brands);
  return (
    <section className="page-container py-14 lg:py-20">
      <PageIntro
        eyebrow="Phía sau màn hình"
        title="Chào bạn, mình là Ốc."
        description="Một người thích game, những chuyến đi và việc kể lại những trải nghiệm đó theo cách gần gũi nhất."
      />

      <div className="grid gap-5 lg:grid-cols-12">
        <article className="glass-panel relative overflow-hidden p-7 sm:p-9 lg:col-span-8">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl"
          />
          <div className="relative">
            <span className="icon-tile">
              <Mic2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <h2 className="mt-6 text-2xl font-black text-white">
              Hành trình Ocvoivoii
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-slate-300 sm:text-base">
              <p>
                Mình là Nguyễn Chí Công, được mọi người biết đến với cái tên
                Ocvoivoii. Mình làm nội dung gaming, livestream và tổ chức những
                hoạt động để mọi người có thêm cơ hội chơi cùng nhau.
              </p>
              <p>
                VALORANT là một phần quen thuộc của kênh. Ngoài những trận đấu,
                mình thích chia sẻ các tình huống vui, những lần xử lý chưa tới
                và cả quá trình từng chút một chơi tốt hơn.
              </p>
              <p>
                Với mình, một buổi lên sóng đáng nhớ không chỉ nằm ở thắng thua.
                Đó còn là lúc có người ghé vào trò chuyện, một nhóm tìm được
                đồng đội hay cả phòng cùng bật cười.
              </p>
            </div>
            <Link to="/register" className="btn-primary mt-7">
              Hẹn gặp trên sàn đấu
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </article>

        <aside className="glass-panel flex flex-col justify-between bg-gradient-to-br from-purple-500/15 to-cyan-400/5 p-7 lg:col-span-4">
          <div>
            <div
              aria-hidden="true"
              className="flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-300/20 bg-slate-950/50 text-3xl font-black text-cyan-200"
            >
              ỐC
            </div>
            <p className="eyebrow mt-7">Người chơi · Người kể chuyện</p>
            <h2 className="text-2xl font-black text-white">Ocvoivoii</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Chơi hết mình, giữ sự chân thành và luôn dành một chỗ cho những
              câu chuyện của cộng đồng.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Gaming", "Livestream", "Du lịch", "Âm nhạc"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </aside>

        <article className="glass-panel p-7 lg:col-span-5">
          <p className="eyebrow">Những điều đang xây dựng</p>
          <h2 className="text-2xl font-black text-white">Cột mốc của Ốc</h2>
          <ol className="mt-7 space-y-7">
            {milestones.map(({ title, description, Icon }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="icon-tile shrink-0">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold leading-6 text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="glass-panel p-7 lg:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Góc làm việc</p>
              <h2 className="text-2xl font-black text-white">Trang thiết bị</h2>
            </div>
            <Monitor aria-hidden="true" className="h-7 w-7 text-cyan-300" />
          </div>

          <dl className="mt-7 divide-y divide-white/10">
            {setup.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[145px_1fr]"
              >
                <dt className="flex items-center gap-2 text-sm text-slate-400">
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-purple-300"
                  />
                  {label}
                </dt>
                <dd className="text-sm font-medium leading-6 text-slate-200">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="glass-panel p-7 lg:col-span-12">
          <p className="eyebrow">Ngoài những trận game</p>
          <h2 className="text-2xl font-black text-white">
            Nhiều câu chuyện, cùng một người kể
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {brands
              .filter((brand) => brand.group === "main")
              .map((brand) => (
                <BrandCard key={brand.id} brand={brand} compact />
              ))}
          </div>
        </article>

        <article className="glass-panel p-7 lg:col-span-12">
          <p className="eyebrow">Không chỉ gặp nhau trên sóng</p>
          <h2 className="text-2xl font-black text-white">Kết nối với Ốc</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {socialChannels.map((channel) => (
              <ExternalLink
                key={channel.id}
                href={channel.url}
                className="btn-secondary flex-wrap"
              >
                <PlatformIcon
                  platform={channel.id}
                  className="h-5 w-5 text-cyan-300"
                />
                {channel.label}
              </ExternalLink>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
