import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Gamepad2,
  Music2,
  Mountain,
  ShoppingBag,
  Heart,
  Users,
  Play,
} from "lucide-react";
import { platformLabels, validatePlatformUrl } from "../../data/ecosystem";
import PlatformIcon from "../icons/PlatformIcon";

const brandIcons = {
  "ocvoivoii-gaming": Gamepad2,
  "oc-du-ky": Mountain,
  zwhis: Music2,
  "oc-ban-rong": ShoppingBag,
  "chuyen-miu-va-oc": Heart,
  "hang-ocvoivoii-music": Music2,
};
export default function BrandCard({ brand, compact = false }) {
  const Icon =
    brandIcons[brand.id] || (brand.group === "friends" ? Play : Users);
  const platforms = Array.isArray(brand.platforms) ? brand.platforms : [];
  const links = platforms.filter(
    (platform) =>
      brand.links?.[platform] &&
      validatePlatformUrl(platform, brand.links[platform]),
  );
  return (
    <article
      className={`glass-panel card-hover flex min-w-0 flex-col ${compact ? "p-5" : "p-6 sm:p-7"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="icon-tile">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        {brand.id === "ocvoivoii-gaming" && (
          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            Điểm hẹn chính
          </span>
        )}
        {brand.group === "friends" && (
          <span className="text-xs text-slate-400">Kênh bạn bè</span>
        )}
      </div>
      <h3 className="mt-5 break-words text-xl font-black text-white">
        {brand.name}
      </h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-400">
        {brand.description}
      </p>
      <div className="mt-auto pt-6">
        {links.length ? (
          <div className="flex flex-wrap gap-2">
            {links.map((platform) => (
              <a
                key={platform}
                href={brand.links[platform]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <PlatformIcon
                  platform={platform}
                  className="h-4 w-4 shrink-0"
                />
                {platformLabels[platform] || platform}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="sr-only"> (mở trong tab mới)</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs leading-6 text-slate-400">
            Liên kết kênh sẽ được cập nhật.
          </p>
        )}
        {brand.id === "ocvoivoii-gaming" && (
          <Link
            to="/rules"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-purple-200"
          >
            Khám phá Ốc Thượng Đài
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
