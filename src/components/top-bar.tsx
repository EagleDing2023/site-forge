"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

const chromeButton =
  "min-h-11 rounded-md border border-chrome-line px-3.5 text-label font-normal text-surface transition-colors duration-150 ease-out hover:bg-chrome-raised";

export function TopBar({
  query,
  onQuery,
  pickCount,
  onBuildSheet,
  onStartOver,
}: {
  query: string;
  onQuery: (q: string) => void;
  pickCount: number;
  onBuildSheet: () => void;
  onStartOver: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // Ctrl+K is the browser's address-bar search otherwise
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header data-chrome className="flex flex-wrap items-center gap-4 bg-chrome px-5 py-3.5 text-surface">
      <div className="flex items-center gap-2.5 font-display text-logo font-bold tracking-[-0.02em]">
        <i aria-hidden className="block size-[22px] rounded-sm bg-brand shadow-[6px_6px_0_rgb(255_255_255/0.13)]" />
        Site Forge
      </div>

      <label className="flex min-h-11 flex-[1_1_320px] items-center gap-2 rounded-md border border-chrome-line bg-chrome-raised px-3">
        <Search aria-hidden className="size-[18px] shrink-0 text-chrome-text" strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search every option"
          placeholder="Search everything: dashboard, glass, drawer, serif, scroll…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onQuery("");
          }}
          className="min-h-[42px] min-w-0 flex-1 bg-transparent text-body text-surface outline-none placeholder:text-chrome-text"
        />
        <span className="rounded-sm border border-chrome-line px-1.5 py-0.5 font-mono text-eyebrow text-chrome-text">
          all layers
        </span>
      </label>

      <button type="button" className={chromeButton} onClick={onBuildSheet}>
        Build sheet · {pickCount} picks
      </button>
      <button type="button" className={chromeButton} onClick={onStartOver}>
        Start over
      </button>
    </header>
  );
}
