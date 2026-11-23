"use client";

import { STEPS } from "@/data/catalog";
import { useForge } from "@/lib/forge-store";
import { LAST_STEP, isDone, pickCount, railLabel, sheetRows } from "@/lib/picks";
import { userTokenVars, userTokens } from "@/lib/tokens";
import { BuildSheet } from "./build-sheet";
import { Rail } from "./rail";
import { StepPanel } from "./step-panel";
import { TopBar } from "./top-bar";

export function SiteForge() {
  const { step, picks, pick, goTo, reset } = useForge();

  const railSteps = STEPS.map((s) => ({
    id: s.id,
    name: s.name,
    layer: s.layer,
    chosen: railLabel(picks, s),
    done: isDone(picks, s),
  }));

  return (
    // User tokens live here as plain CSS variables; only demo/preview CSS reads them.
    <div className="min-h-screen" style={userTokenVars(userTokens(picks))}>
      <TopBar pickCount={pickCount(picks)} onBuildSheet={() => goTo(LAST_STEP)} onStartOver={reset} />
      <div className="flex flex-wrap items-start gap-4 p-4">
        <Rail steps={railSteps} activeIndex={step} onSelect={goTo} />
        <main className="min-w-0 flex-[999_1_520px] rounded-xl border border-line bg-surface p-6 max-[760px]:p-4">
          <StepPanel stepIndex={step} picks={picks} onPick={(id) => pick(step, id)} onGo={goTo} />
        </main>
        <aside className="flex min-w-0 max-w-[520px] flex-[1_1_380px] flex-col gap-4 max-[760px]:max-w-none">
          {/* Step 5: live preview card goes above the build sheet. */}
          <BuildSheet rows={sheetRows(picks)} onGo={goTo} />
        </aside>
      </div>
    </div>
  );
}
