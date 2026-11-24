"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type RailStep = {
  id: string;
  name: string;
  layer: string;
  /** Current pick shown under the name, e.g. "Dashboard / analytics" or "—". */
  chosen: string;
  done: boolean;
};

export function Rail({
  steps,
  activeIndex,
  onSelect,
}: {
  steps: RailStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const navRef = useRef<HTMLElement>(null);

  // Keep the active step visible inside the rail's own scroll, never the page's:
  // centred in the phone strip, and within view in the sticky desktop column
  // (so "Next layer" down to Export doesn't leave it hidden). Re-run on resize.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const centre = () => {
      const btn = nav.querySelector<HTMLElement>('[aria-current="step"]');
      if (!btn) return;
      if (nav.scrollWidth > nav.clientWidth) {
        nav.scrollLeft = btn.offsetLeft - (nav.clientWidth - btn.offsetWidth) / 2;
      } else if (nav.scrollHeight > nav.clientHeight) {
        const top = btn.offsetTop - 8;
        const bottom = btn.offsetTop + btn.offsetHeight + 8;
        if (top < nav.scrollTop) nav.scrollTop = top;
        else if (bottom > nav.scrollTop + nav.clientHeight) nav.scrollTop = bottom - nav.clientHeight;
      }
    };
    centre();
    const ro = new ResizeObserver(centre);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [activeIndex]);

  return (
    // 818px = rail and main flex bases (250 + 520) + one 16px gap + 16px padding each side:
    // below it main wraps under the rail, and a sticky rail would slide over it.
    <nav
      ref={navRef}
      aria-label="Design layers"
      className="relative min-w-[220px] flex-[0_1_250px] rounded-xl border border-line bg-surface p-2.5 max-[760px]:flex max-[760px]:flex-[1_1_100%] max-[760px]:gap-1 max-[760px]:overflow-x-auto max-[760px]:p-1.5 min-[818px]:sticky min-[818px]:top-4 min-[818px]:max-h-[calc(100dvh-32px)] min-[818px]:overflow-y-auto"
    >
      {steps.map((s, i) => {
        const active = i === activeIndex;
        const showLayer = i === 0 || steps[i - 1].layer !== s.layer;
        return (
          <div key={s.id} className="max-[760px]:shrink-0">
            {showLayer && <div className="eyebrow px-2.5 pt-3 pb-1 text-muted-2 max-[760px]:hidden">{s.layer}</div>}
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              onClick={() => onSelect(i)}
              className={cn(
                "flex min-h-11 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 ease-out max-[760px]:w-auto max-[760px]:max-w-[200px]",
                active ? "bg-ink text-surface" : "hover:bg-surface-hover",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-sm text-eyebrow font-semibold",
                  active ? "bg-surface text-ink" : s.done ? "bg-brand text-surface" : "bg-line text-ink-soft",
                )}
              >
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-col">
                <b className="text-label font-semibold">{s.name}</b>
                <small className={cn("truncate text-small", active ? "text-chrome-text" : "text-muted-2")}>
                  {s.chosen}
                </small>
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
