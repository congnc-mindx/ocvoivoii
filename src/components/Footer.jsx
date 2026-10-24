// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Gamepad2, Heart } from "lucide-react";
import { navigation } from "../config/site";
import PlatformIcon from "./icons/PlatformIcon";

import useBrands from "../hooks/useBrands";
import { getGamingChannels } from "../data/ecosystem";

export default function Footer() {
  const { brands } = useBrands();
  const socialChannels = getGamingChannels(brands);
  const ecosystemDirectory = brands.filter((brand) => brand.group === "main");
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950">
      <div className="page-container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-lg text-xl font-black text-white"
          >
            <Gamepad2 aria-hidden="true" className="h-6 w-6 text-purple-300" />
            Ocvoivoii<span className="text-cyan-300">.</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            Chơi hết mình, vui hết cỡ. Một góc nhỏ dành cho game, những câu
            chuyện và cộng đồng luôn sẵn sàng lên kèo cùng Ốc.
          </p>

          <ul
            aria-label="Kết nối mạng xã hội"
            className="mt-5 flex flex-wrap gap-3"
          >
            {socialChannels.map((channel) => (
              <li key={channel.id}>
                {channel.url ? (
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${channel.label} — mở trong tab mới`}
                    className="social-icon-link"
                  >
                    <PlatformIcon platform={channel.id} className="h-5 w-5" />
                  </a>
                ) : (
                  <span
                    aria-label={`${channel.label} — sắp cập nhật`}
                    aria-disabled="true"
                    className="social-icon-link opacity-40"
                  >
                    <PlatformIcon platform={channel.id} className="h-5 w-5" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Khám phá</h2>
          <ul className="mt-5 space-y-3">
            {navigation.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="rounded text-sm text-slate-400 transition hover:text-cyan-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Hệ sinh thái của Ốc</h2>
          <ul className="mt-5 space-y-3">
            {ecosystemDirectory.map((item) => (
              <li key={item.id}>
                <Link
                  to="/ecosystem"
                  className="rounded text-sm text-slate-400 transition hover:text-cyan-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/ecosystem"
            className="mt-5 inline-flex rounded text-sm font-semibold text-cyan-300"
          >
            Xem toàn bộ hệ sinh thái
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Ocvoivoii. Chơi vui, sống chất.</p>
          <p className="inline-flex items-center gap-2">
            Được tạo nên cùng cộng đồng
            <Heart aria-hidden="true" className="h-4 w-4 text-purple-300" />
          </p>
        </div>
      </div>
    </footer>
  );
}
