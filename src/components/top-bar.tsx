import { Search } from "lucide-react";

const chromeButton =
  "min-h-11 rounded-md border border-chrome-line px-3.5 text-label font-normal text-surface transition-colors duration-150 ease-out hover:bg-chrome-raised";

export function TopBar({ pickCount }: { pickCount: number }) {
  return (
    <header data-chrome className="flex flex-wrap items-center gap-4 bg-chrome px-5 py-3.5 text-surface">
      <div className="flex items-center gap-2.5 font-display text-logo font-bold tracking-[-0.02em]">
        <i aria-hidden className="block size-[22px] rounded-[6px] bg-brand shadow-[6px_6px_0_rgb(255_255_255/0.13)]" />
        Site Forge
      </div>

      <label className="flex min-h-11 flex-[1_1_320px] items-center gap-2 rounded-md border border-chrome-line bg-chrome-raised px-3">
        <Search aria-hidden className="size-[18px] shrink-0 text-chrome-text" strokeWidth={2} />
        <input
          type="text"
          aria-label="Search every option"
          placeholder="Search everything: dashboard, glass, drawer, serif, scroll…"
          className="min-h-[42px] min-w-0 flex-1 bg-transparent text-body text-surface outline-none placeholder:text-chrome-text"
        />
        <span className="rounded-[5px] border border-chrome-line px-1.5 py-0.5 font-mono text-eyebrow text-chrome-text">
          all layers
        </span>
      </label>

      <button type="button" className={chromeButton}>
        Build sheet · {pickCount} picks
      </button>
      <button type="button" className={chromeButton}>
        Start over
      </button>
    </header>
  );
}
