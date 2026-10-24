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
import {
  getGamingChannels,
  platformLabels,
  validatePlatformUrl,
} from "../../data/ecosystem";
import useBrands from "../../hooks/useBrands";
import aboutPortrait from "../../assets/ocvoivoii-about.jpeg";

const milestones = [
  {
    title: "Xây dựng Ocvoivoii Gaming",
    description:
      "Một nơi chia sẻ trải nghiệm chơi game, những pha xử lý và câu chuyện trong mỗi buổi livestream.",
    Icon: Gamepad2,
    id: "xay-dung-gaming",
  },
  {
    title: "Xây dựng Hang Ocvoivoii",
    description:
      "Từ những người xem xa lạ thành một cộng đồng có thể trò chuyện, tìm đồng đội và chơi cùng nhau.",
    Icon: Users,
    id: "ket-noi-cong-dong",
  },
  {
    title: "Ốc Thượng Đài lên sóng",
    description:
      "Tạo sân chơi cộng đồng để người tham gia được thi đấu, giao lưu và có khoảnh khắc của riêng mình.",
    Icon: Trophy,
    id: "oc-thuong-dai",
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
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <aside className="glass-panel min-w-0 self-start overflow-hidden p-5 sm:p-7 lg:col-span-4">
          <p className="eyebrow mb-5">Người chơi · Người kể chuyện</p>

          <div className="relative h-[320px] overflow-hidden rounded-2xl bg-slate-950/50 sm:h-[380px] lg:h-[360px]">
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

        <article className="glass-panel relative min-w-0 overflow-hidden p-7 sm:p-9 lg:col-span-8">
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

        <article className="glass-panel relative min-w-0 overflow-hidden p-7 sm:p-9 lg:col-span-8">
          <p className="eyebrow">Những điều đang xây dựng</p>
          <h2 className="text-2xl font-black text-white">Cột mốc của Ốc</h2>
          <ol className="mt-8">
            {milestones.map(
              ({ id, dateLabel, title, description, Icon }, index) => (
                <li
                  key={id}
                  className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0 sm:gap-x-6"
                >
                  {index < milestones.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[23px] top-12 w-px bg-gradient-to-b from-purple-400/50 to-cyan-400/20"
                    />
                  )}

                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/30 bg-slate-900 text-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.08)]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 pt-1">
                    {dateLabel && (
                      <p className="mb-2 text-xs font-semibold tracking-wide text-cyan-300">
                        {dateLabel}
                      </p>
                    )}

                    <h3 className="text-lg font-bold leading-7 text-white">
                      {title}
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                      {description}
                    </p>
                  </div>
                </li>
              ),
            )}
          </ol>
        </article>

        <article className="glass-panel min-w-0 self-start p-7 lg:col-span-5">
          <p className="eyebrow">Ngoài những trận game</p>

          <h2 className="text-2xl font-black text-white">
            Những góc khác của Ốc
          </h2>

          <div className="mt-5 divide-y divide-white/10">
            {brands
              .filter((brand) => brand.group === "main")
              .map((brand) => {
                const platforms = (brand.platforms ?? []).filter(
                  (platform) =>
                    brand.links?.[platform] &&
                    validatePlatformUrl(platform, brand.links[platform]),
                );

                return (
                  <div
                    key={brand.id}
                    className="min-w-0 py-4 first:pt-0 last:pb-0"
                  >
                    <h3 className="text-base font-bold text-white">
                      {brand.name}
                    </h3>

                    {platforms.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {platforms.map((platform) => (
                          <ExternalLink
                            key={platform}
                            href={brand.links[platform]}
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
                          >
                            <PlatformIcon
                              platform={platform}
                              className="h-4 w-4 shrink-0"
                            />
                            {platformLabels[platform] ?? platform}
                          </ExternalLink>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        Kênh đang cập nhật liên kết.
                      </p>
                    )}
                  </div>
                );
              })}
          </div>

          <Link
            to="/ecosystem"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-purple-200 transition hover:text-cyan-200"
          >
            Khám phá toàn bộ hệ sinh thái
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </article>

        <article className="glass-panel min-w-0 self-start p-7 lg:col-span-7">
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
