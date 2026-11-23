"use client";

import { useState } from "react";
import { STEPS } from "@/data/catalog";
import { useForge } from "@/lib/forge-store";
import { LAST_STEP, isDone, pickCount, railLabel, sheetRows } from "@/lib/picks";
import { userTokenVars, userTokens } from "@/lib/tokens";
import { BuildSheet } from "./build-sheet";
import { LivePreview } from "./live-preview";
import { Rail } from "./rail";
import { SearchResults } from "./search-results";
import { StepPanel } from "./step-panel";
import { TopBar } from "./top-bar";

export function SiteForge() {
  const forge = useForge();
  const { step, picks } = forge;
  const tokens = userTokens(picks);
  // Not persisted: a refresh lands on the current layer, not a stale search.
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  // As in the prototype, any navigation leaves search, and so does a
  // single-choice pick (it opens the next layer). A multi pick stays so you
  // can keep toggling results.
  const goTo = (i: number) => {
    setQuery("");
    forge.goTo(i);
  };
  const reset = () => {
    setQuery("");
    forge.reset();
  };
  const pick = (stepIndex: number, itemId: string) => {
    if (STEPS[stepIndex].kind === "single") setQuery("");
    forge.pick(stepIndex, itemId);
  };

  const railSteps = STEPS.map((s) => ({
    id: s.id,
    name: s.name,
    layer: s.layer,
    chosen: railLabel(picks, s),
    done: isDone(picks, s),
  }));

  return (
    // User tokens live here as plain CSS variables; only demo/preview CSS reads them.
    <div className="min-h-screen" style={userTokenVars(tokens)}>
      <TopBar
        query={query}
        onQuery={setQuery}
        pickCount={pickCount(picks)}
        onBuildSheet={() => goTo(LAST_STEP)}
        onStartOver={reset}
      />
      <div className="flex flex-wrap items-start gap-4 p-4">
        <Rail steps={railSteps} activeIndex={searching ? -1 : step} onSelect={goTo} />
        <main className="min-w-0 flex-[999_1_520px] rounded-xl border border-line bg-surface p-6 max-[760px]:p-4">
          {searching ? (
            <SearchResults query={query} picks={picks} onPick={pick} />
          ) : (
            <StepPanel stepIndex={step} picks={picks} onPick={(id) => pick(step, id)} onGo={goTo} />
          )}
        </main>
        <aside className="flex min-w-0 max-w-[520px] flex-[1_1_380px] flex-col gap-4 max-[760px]:max-w-none">
          <LivePreview picks={picks} tokens={tokens} />
          <BuildSheet rows={sheetRows(picks)} onGo={goTo} />
        </aside>
      </div>
    </div>
  );
}
