import type { SheetRow } from "@/lib/picks";

export function BuildSheet({ rows, onGo }: { rows: SheetRow[]; onGo: (stepIndex: number) => void }) {
  return (
    <section aria-labelledby="build-sheet-title" className="rounded-xl border border-line bg-surface p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 id="build-sheet-title" className="font-display text-panel-title font-bold">
          Build sheet
        </h2>
        <span className="text-small text-muted-2">click a row to change it</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {rows.length === 0 && (
          <p className="px-2 py-1.5 text-small text-muted-2">
            Nothing picked yet. Start with Purpose: what job is this site for?
          </p>
        )}
        {rows.map((r) => (
          <button
            key={r.stepIndex}
            type="button"
            onClick={() => onGo(r.stepIndex)}
            className="flex min-h-11 items-baseline gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-150 ease-out hover:bg-surface-hover"
          >
            <span className="w-24 shrink-0 text-small text-muted-2">{r.step}</span>
            <b className="text-small font-medium">{r.value}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
