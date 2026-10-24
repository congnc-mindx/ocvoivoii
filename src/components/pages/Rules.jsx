// src/pages/Rules.jsx
import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  ShieldCheck,
} from "lucide-react";
import PageIntro from "../PageIntro";
import { tournamentRules } from "../../data/tournamentRules";

const orderedRules = [...tournamentRules].sort((a, b) => a.order - b.order);

export default function Rules() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSections, setOpenSections] = useState({});
  const tabRefs = useRef([]);

  const requestedTab = searchParams.get("tab");
  const activeIndex = Math.max(
    0,
    orderedRules.findIndex((rule) => rule.id === requestedTab),
  );
  const activeRule = orderedRules[activeIndex];

  function selectTab(id) {
    setOpenSections({});
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", id);
    setSearchParams(nextParams, { replace: true, preventScrollReset: true });
  }

  function handleTabKeyDown(event, index) {
    let nextIndex;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % orderedRules.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + orderedRules.length) % orderedRules.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = orderedRules.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectTab(orderedRules[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  function toggleSection(id, initiallyOpen) {
    setOpenSections((current) => ({
      ...current,
      [id]: !(current[id] ?? initiallyOpen),
    }));
  }

  return (
    <section className="page-container py-14 lg:py-20">
      <PageIntro
        eyebrow="Ốc Thượng Đài"
        title="Hiểu luật. Chơi đẹp. Lên sàn."
        description="Tìm hiểu nguyên tắc chung và thể thức của từng giải trước khi gửi đăng ký."
      />

      <div
        role="tablist"
        aria-label="Nhóm quy chế giải đấu"
        className="mb-7 grid gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-2 md:grid-cols-3"
      >
        {orderedRules.map((rule, index) => (
          <button
            key={rule.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`rules-tab-${rule.id}`}
            role="tab"
            type="button"
            aria-selected={activeRule.id === rule.id}
            aria-controls={`rules-panel-${rule.id}`}
            tabIndex={activeRule.id === rule.id ? 0 : -1}
            onClick={() => selectTab(rule.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={`rounded-xl px-4 py-4 text-left text-sm font-bold transition md:text-center ${
              activeRule.id === rule.id
                ? "bg-purple-500/20 text-purple-100 ring-1 ring-purple-400/40"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="mb-1 block text-xs font-medium opacity-75">
              {index === 0
                ? "Dành cho mọi người"
                : index === 1
                  ? "Giải 5v5"
                  : "Giải 1v1"}
            </span>
            {rule.label}
          </button>
        ))}
      </div>

      {orderedRules.map((rule) => (
        <div
          key={rule.id}
          id={`rules-panel-${rule.id}`}
          role="tabpanel"
          aria-labelledby={`rules-tab-${rule.id}`}
          tabIndex={0}
          hidden={rule.id !== activeRule.id}
          className="rounded-2xl"
        >
          {rule.id === activeRule.id && (
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
              <div className="min-w-0">
                <div className="glass-panel p-6 sm:p-8">
                  <span className="icon-tile">
                    <ShieldCheck aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                    {rule.title}
                  </h2>
                  <p className="mt-4 text-sm leading-8 text-slate-400">
                    {rule.description}
                  </p>
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <Info
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300"
                    />
                    <p className="text-sm leading-7 text-slate-300">
                      {rule.notice}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {rule.sections.map((section, index) => {
                    const key = `${rule.id}-${section.id}`;
                    const initiallyOpen = index === 0;
                    const isOpen = openSections[key] ?? initiallyOpen;

                    return (
                      <section
                        key={key}
                        className="glass-panel overflow-hidden"
                      >
                        <h3>
                          <button
                            id={`heading-${key}`}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`content-${key}`}
                            onClick={() => toggleSection(key, initiallyOpen)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-bold text-white transition hover:bg-white/5 sm:px-6"
                          >
                            <span className="flex items-center gap-3">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-xs text-purple-200">
                                {index + 1}
                              </span>
                              {section.title}
                            </span>
                            <ChevronDown
                              aria-hidden="true"
                              className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </h3>

                        <div
                          id={`content-${key}`}
                          role="region"
                          aria-labelledby={`heading-${key}`}
                          hidden={!isOpen}
                          className="border-t border-white/10 px-5 py-5 sm:px-6"
                        >
                          <ul className="space-y-4">
                            {section.items.map((item) => (
                              <li key={item} className="flex items-start gap-3">
                                <Check
                                  aria-hidden="true"
                                  className="mt-1 h-4 w-4 shrink-0 text-cyan-300"
                                />
                                <span className="text-sm leading-7 text-slate-300">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>

              <aside className="glass-panel p-6 lg:sticky lg:top-26">
                <h2 className="text-lg font-bold text-white">
                  Thông tin nhanh
                </h2>
                <dl className="mt-5 divide-y divide-white/10">
                  {rule.facts.map((fact) => (
                    <div key={fact.label} className="py-4 first:pt-0">
                      <dt className="text-xs text-slate-400">{fact.label}</dt>
                      <dd className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link to="/register" className="btn-primary mt-6 w-full">
                  Đăng ký tham gia
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <p className="mt-4 text-xs leading-6 text-slate-400">
                  Ban tổ chức sẽ liên hệ để xác nhận suất và nội dung giải phù
                  hợp.
                </p>
              </aside>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
