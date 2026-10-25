// src/pages/Home.jsx
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Crosshair,
  Gamepad2,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import useYouTubeVideos from "../../hooks/useYouTubeVideos";
import useBrands from "../../hooks/useBrands";
import { getGamingChannels } from "../../data/ecosystem";
import ExternalLink from "../ExternalLink";
import PlatformIcon from "../icons/PlatformIcon";
import EcosystemPreview from "../ecosystem/EcosystemPreview";

export default function Home() {
  const { brands } = useBrands();
  const {
    videos,
    channelUrl,
    loading: videosLoading,
    error: videosError,
    retry: retryVideos,
  } = useYouTubeVideos();
  const socialChannels = getGamingChannels(brands);
  const youtube = socialChannels.find((channel) => channel.id === "youtube");

  return (
    <>
      <section
        aria-labelledby="home-heading"
        className="relative isolate overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="hero-grid absolute inset-0" />
          <div className="absolute -left-36 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="page-container grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <span className="status-badge">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50 motion-reduce:animate-none" />
                <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              Mùa giải mới đang khởi tranh
            </span>

            <p className="eyebrow mt-7">Chào mừng đến với Ocvoivoii</p>

            <h1
              id="home-heading"
              className="text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl xl:text-7xl"
            >
              Chơi hết mình.
              <br />
              <span className="gradient-text">Vui hết cỡ.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Từ những pha xử lý khó đỡ đến các trận đấu căng thẳng. Cùng Ốc
              khám phá game, kết nối đồng đội và tạo nên những khoảnh khắc đáng
              nhớ.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary">
                Đăng ký ngay
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <Link to="/rules" className="btn-secondary">
                Xem quy chế giải
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <li className="inline-flex items-center gap-2">
                <Gamepad2
                  aria-hidden="true"
                  className="h-4 w-4 text-cyan-300"
                />
                Cùng chơi game
              </li>
              <li className="inline-flex items-center gap-2">
                <Users aria-hidden="true" className="h-4 w-4 text-purple-300" />
                Cùng kết nối
              </li>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck
                  aria-hidden="true"
                  className="h-4 w-4 text-cyan-300"
                />
                Cùng chơi đẹp
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-full bg-purple-500/15 blur-3xl"
            />

            <div className="glass-panel relative overflow-hidden p-7 sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Đấu trường cộng đồng
                </p>
                <Sparkles
                  aria-hidden="true"
                  className="h-5 w-5 text-cyan-300"
                />
              </div>

              <div
                aria-hidden="true"
                className="relative my-10 flex h-48 items-center justify-center"
              >
                <div className="absolute h-44 w-44 rotate-12 rounded-[2.5rem] border border-purple-400/30 bg-purple-500/5" />
                <div className="absolute h-44 w-44 -rotate-12 rounded-[2.5rem] border border-cyan-300/25 bg-cyan-400/5" />
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-purple-300/30 bg-gradient-to-br from-purple-500/25 to-cyan-400/10 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
                  <Trophy
                    className="h-16 w-16 text-purple-200"
                    strokeWidth={1.5}
                  />
                </div>
                <Crosshair className="absolute right-2 top-1 h-7 w-7 text-cyan-300/70" />
              </div>

              <p className="text-sm font-bold tracking-[0.15em] text-cyan-300">
                ỐC THƯỢNG ĐÀI
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white">
                Kèo đã lên.
                <br />
                Bạn sẵn sàng chưa?
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Đánh đơn hay cùng đồng đội, hãy mang tinh thần chơi đẹp. Phần
                còn lại để những trận đấu lên tiếng.
              </p>
              <Link
                to="/register"
                className="btn-secondary mt-7 w-full justify-between"
              >
                Giành một chỗ trên sàn đấu
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EcosystemPreview />

      <section
        id="videos"
        aria-labelledby="videos-heading"
        className="page-container py-16 lg:py-20"
      >
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Bật lên và tận hưởng</p>
            <h2 id="videos-heading" className="section-title">
              Video mới từ Ocvoivoii Gaming
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Những video mới nhất từ kênh của Ốc, được cập nhật tự động.
            </p>
          </div>

          <ExternalLink
            href={channelUrl || youtube?.url}
            className="btn-secondary shrink-0"
          >
            <PlatformIcon
              platform="youtube"
              className="h-5 w-5 text-cyan-300"
            />
            Kênh YouTube của Ốc
          </ExternalLink>
        </div>
        {videosLoading && (
          <p role="status" className="mb-6 text-sm text-slate-400">
            Đang tải video mới…
          </p>
        )}

        {videosError && (
          <div role="alert" className="glass-panel mb-6 p-5">
            <p className="text-sm leading-7 text-slate-300">{videosError}</p>

            <button
              type="button"
              onClick={retryVideos}
              className="btn-secondary mt-4"
            >
              Thử tải lại
            </button>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.id}
              className="glass-panel card-hover overflow-hidden"
            >
              <div className="aspect-video bg-slate-950">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                  title={video.title}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-xs font-medium text-purple-300">
                  <Play aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  Đăng ngày{" "}
                  {new Date(video.publishedAt).toLocaleDateString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </p>
                <h3 className="mt-3 text-lg font-bold leading-7 text-white">
                  {video.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div className="glass-panel mt-12 flex flex-col justify-between gap-6 p-7 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-white">
              Muốn biết người đứng sau những chiếc kèo?
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Ghé xem hành trình, câu chuyện và góc làm việc của Ốc.
            </p>
          </div>
          <Link to="/about" className="btn-secondary shrink-0">
            Làm quen với Ốc
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
