import { cn } from "@/lib/utils";

export type RailStep = {
  id: string;
  name: string;
  layer: string;
  /** Current pick shown under the name, e.g. "Dashboard / analytics" or "—". */
  chosen: string;
  done: boolean;
};

export function Rail({ steps, activeIndex }: { steps: RailStep[]; activeIndex: number }) {
  return (
    <nav
      aria-label="Design layers"
      className="min-w-[220px] flex-[0_1_250px] rounded-xl border border-line bg-surface p-2.5 max-[760px]:flex-[1_1_100%]"
    >
      {steps.map((s, i) => {
        const active = i === activeIndex;
        const showLayer = i === 0 || steps[i - 1].layer !== s.layer;
        return (
          <div key={s.id}>
            {showLayer && <div className="eyebrow px-2.5 pt-3 pb-1 text-muted-2">{s.layer}</div>}
            <button
              type="button"
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex min-h-11 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 ease-out",
                active ? "bg-ink text-surface" : "hover:bg-surface-hover",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-sm text-[11px] font-semibold",
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
