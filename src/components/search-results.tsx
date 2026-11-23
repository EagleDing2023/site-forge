import type { Picks } from "@/data/catalog";
import { isPicked, purposeOf } from "@/lib/picks";
import { searchOptions } from "@/lib/search";
import { OptionCard } from "./option-card";

export function SearchResults({
  query,
  picks,
  onPick,
}: {
  query: string;
  picks: Picks;
  onPick: (stepIndex: number, itemId: string) => void;
}) {
  const hits = searchOptions(query);
  const purposeId = purposeOf(picks)?.id;

  return (
    <>
      <div className="eyebrow text-brand-ink">Search · all layers</div>
      <h1 className="mt-1.5 mb-1.5 font-display text-page-title font-bold tracking-[-0.02em]">
        {hits.length} {hits.length === 1 ? "match" : "matches"} for “{query.trim()}”
      </h1>
      <p className="mb-4 max-w-[720px] text-muted-foreground">
        Click any result to pick it. Single-choice layers move you on to the next layer.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {hits.map(({ stepIndex, step, item }) => (
          <OptionCard
            // Ids repeat across layers (a "docs" purpose and a "docs" skeleton).
            key={`${step.id}:${item.id}`}
            showLayer
            step={step}
            item={item}
            fits={!!(step.fitted && purposeId && item.fit?.includes(purposeId))}
            selected={isPicked(picks, step, item.id)}
            onPick={() => onPick(stepIndex, item.id)}
          />
        ))}
      </div>
    </>
  );
}
