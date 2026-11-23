import type { ReactNode } from "react";
import { STEPS, type Item, type Picks } from "@/data/catalog";
import { heavyPicks, isPicked, missingSteps, nextLabel, purposeOf, splitByFit } from "@/lib/picks";
import { OptionCard } from "./option-card";
import { buttonPrimary, buttonSecondary } from "./ui-button";

type Props = {
  stepIndex: number;
  picks: Picks;
  onPick: (itemId: string) => void;
  onGo: (stepIndex: number) => void;
};

export function StepPanel({ stepIndex, picks, onPick, onGo }: Props) {
  const step = STEPS[stepIndex];
  if (step.kind === "export") return <ExportHeader picks={picks} onBack={() => onGo(stepIndex - 1)} />;

  const purpose = purposeOf(picks);
  const { fits, others } = splitByFit(step, purpose?.id);
  const heavy = step.id === "fx" ? heavyPicks(picks) : [];

  const grid = (items: Item[], isFit: boolean) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {items.map((it) => (
        <OptionCard
          key={it.id}
          step={step}
          item={it}
          fits={isFit}
          selected={isPicked(picks, step, it.id)}
          onPick={() => onPick(it.id)}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="eyebrow text-brand-ink">
        Layer {stepIndex + 1} · {step.layer}
      </div>
      <h1 className="mt-1.5 mb-1.5 font-display text-page-title font-bold tracking-[-0.02em]">{step.title}</h1>
      <p className="mb-1 max-w-[720px] text-muted-foreground">{step.hint}</p>
      <p className="mb-[18px] text-small text-muted-2">{step.analogy}</p>

      {step.fitted && !purpose && (
        <Warn>
          Pick a Purpose first and this layer will sort itself: the options that fit your site&apos;s job rise to the
          top.
        </Warn>
      )}

      {fits.length > 0 && (
        <>
          <SectionTitle label={`Fits a ${purpose!.name.toLowerCase()}`} meta={`${fits.length} options · recommended`} />
          {grid(fits, true)}
        </>
      )}

      <SectionTitle label={fits.length ? "Other options" : "Options"} meta={`${others.length} options`} />
      {grid(others, false)}

      {heavy.length > 1 && (
        <Warn>
          <b>One standout moment per page.</b> You&apos;ve picked {heavy.length} signature effects (
          {heavy.map((h) => h.name).join(", ")}). Keep one as the star and drop the rest, or assign each to a different
          page in the prompt.
        </Warn>
      )}

      <div className="mt-[22px] flex flex-wrap justify-between gap-2.5">
        <button type="button" className={buttonSecondary} onClick={() => onGo(stepIndex - 1)}>
          Back
        </button>
        <button type="button" className={buttonPrimary} onClick={() => onGo(stepIndex + 1)}>
          {nextLabel(stepIndex)}
        </button>
      </div>
    </>
  );
}

// Step 7 adds the three tabs and Copy below this header.
function ExportHeader({ picks, onBack }: { picks: Picks; onBack: () => void }) {
  const missing = missingSteps(picks);
  return (
    <>
      <div className="eyebrow text-brand-ink">Layer {STEPS.length} · Done</div>
      <h1 className="mt-1.5 mb-1.5 font-display text-page-title font-bold tracking-[-0.02em]">
        Your build sheet, ready for Claude Code
      </h1>
      <p className="mb-1 max-w-[720px] text-muted-foreground">
        Three files. Put DESIGN.md and tokens.css in your project root, then paste the prompt into Claude Code.
      </p>
      <p className="text-small text-muted-2">
        {missing.length ? `Not picked yet (mood defaults used): ${missing.join(", ")}.` : "Every layer picked."}
      </p>
      <div className="mt-[22px] flex flex-wrap justify-between gap-2.5">
        <button type="button" className={buttonSecondary} onClick={onBack}>
          Back to effects
        </button>
      </div>
    </>
  );
}

function SectionTitle({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="mt-[18px] mb-2.5 flex items-center gap-2 text-small font-semibold text-ink-soft">
      {label}
      <span className="font-mono text-eyebrow font-normal text-muted-2">{meta}</span>
    </div>
  );
}

function Warn({ children }: { children: ReactNode }) {
  return <div className="mt-3.5 rounded-md bg-warn-bg px-3.5 py-3 text-small text-warn-ink">{children}</div>;
}
