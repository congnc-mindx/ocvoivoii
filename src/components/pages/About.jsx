// src/pages/About.jsx
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Headphones,
  Mic2,
  Monitor,
} from "lucide-react";
import PageIntro from "../PageIntro";
import ExternalLink from "../ExternalLink";
import PlatformIcon from "../icons/PlatformIcon";
import { getGamingChannels } from "../../data/ecosystem";
import useBrands from "../../hooks/useBrands";
import aboutPortrait from "../../assets/ocvoivoii-about.jpeg";
import { milestones, catchphrases } from "../../data/about";

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
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <aside className="glass-panel flex min-w-0 flex-col self-stretch overflow-hidden p-5 sm:p-7 lg:col-span-4 lg:col-start-9 lg:row-start-1">
          <p className="eyebrow mb-5">Hề internet · Vua Guardian</p>

          <div className="relative h-[320px] shrink-0 overflow-hidden rounded-2xl bg-slate-950/50 sm:h-[380px] lg:h-auto lg:min-h-[320px] lg:flex-1">
            <img
              src={aboutPortrait}
              alt="Nguyễn Chí Công — Ocvoivoii"
              width={900}
              height={1200}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
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

        <article className="glass-panel relative min-w-0 self-stretch overflow-hidden p-7 sm:p-9 lg:col-span-8 lg:col-start-1 lg:row-start-1">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl"
          />
          <div className="relative">
            <div className="flex items-center gap-4">
              <span className="icon-tile shrink-0">
                <Mic2 aria-hidden="true" className="h-6 w-6" />
              </span>

              <h2 className="min-w-0 text-2xl font-black leading-tight text-white">
                Hành trình trở thành Ocvoivoii
              </h2>
            </div>
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
            <Link to="/ecosystem" className="btn-primary mt-7">
              Hiểu hơn về Ocvoivoii
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </article>

        <article
          aria-labelledby="about-timeline-title"
          className="glass-panel min-w-0 p-7 sm:p-9 lg:col-span-12 lg:col-start-1"
        >
          <p className="eyebrow">Từ những ngày đầu</p>

          <h2
            id="about-timeline-title"
            className="text-2xl font-black text-white"
          >
            Cột mốc của Ốc
          </h2>

          <ol className="mt-9">
            {milestones.map(
              ({ id, dateLabel, title, description, Icon }, index) => (
                <li
                  key={id}
                  className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 pb-10 last:pb-0 sm:gap-x-6"
                >
                  {index < milestones.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[23px] top-12 w-px bg-gradient-to-b from-purple-400/50 to-cyan-400/25"
                    />
                  )}

                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/30 bg-slate-900 text-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.08)]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 pt-1">
                    <h3 className="text-lg font-bold leading-7 text-white sm:text-xl">
                      {title}
                    </h3>

                    {dateLabel && (
                      <p className="mt-1 text-sm italic leading-6 text-cyan-200/80">
                        {dateLabel}
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-8 text-slate-400 sm:text-base">
                      {description}
                    </p>
                  </div>
                </li>
              ),
            )}
          </ol>
        </article>

        <article
          aria-labelledby="about-catchphrases-title"
          className="glass-panel flex min-w-0 flex-col self-stretch p-7 lg:col-span-5"
        >
          <p className="eyebrow">Những câu nói quen thuộc</p>

          <h2
            id="about-catchphrases-title"
            className="text-2xl font-black text-white"
          >
            Nghe là biết Ốc
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Có những câu nói xuất hiện nhiều đến mức thành quen. Ai hay ngồi
            trong khung chat chắc cũng từng nghe qua.
          </p>

          <ul className="mt-6 space-y-4">
            {catchphrases.map(({ id, text }, index) => (
              <li
                key={id}
                className="relative overflow-hidden rounded-2xl border border-purple-400/15 bg-gradient-to-br from-purple-500/10 to-cyan-400/5 p-5 transition hover:border-purple-400/35"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-3 select-none text-5xl font-black leading-none text-purple-300/15"
                >
                  ”
                </span>

                <p className="mb-3 text-xs font-semibold tracking-widest text-cyan-300/70">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <blockquote className="relative pr-5 text-lg font-bold leading-8 text-slate-100">
                  “{text}”
                </blockquote>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-panel min-w-0 self-stretch p-7 lg:col-span-7">
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
