"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { STEPS, type Picks } from "@/data/catalog";
import { buildExport, type ExportTab } from "@/lib/export";
import { missingSteps } from "@/lib/picks";
import { userTokens } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { buttonSecondary } from "./ui-button";

const TABS: { id: ExportTab; label: string }[] = [
  { id: "md", label: "DESIGN.md" },
  { id: "prompt", label: "Prompt for Claude Code" },
  { id: "css", label: "tokens.css" },
];

type CopyState = "" | "ok" | "fail";

export function ExportPanel({ picks, onBack }: { picks: Picks; onBack: () => void }) {
  const [tab, setTab] = useState<ExportTab>("md");
  const [copied, setCopied] = useState<CopyState>("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showCopied = (state: CopyState) => {
    clearTimeout(timer.current);
    setCopied(state);
    if (state === "ok") timer.current = setTimeout(() => setCopied(""), 2000);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const missing = missingSteps(picks);
  const text = buildExport(picks, userTokens(picks))[tab];

  const copy = () => {
    // clipboard is undefined outside secure contexts (plain http on a LAN IP).
    if (!navigator.clipboard) return showCopied("fail");
    navigator.clipboard.writeText(text).then(
      () => showCopied("ok"),
      () => showCopied("fail"),
    );
  };

  return (
    <>
      <div className="eyebrow text-brand-ink">Layer {STEPS.length} · Done</div>
      <h1 className="mt-1.5 mb-1.5 font-display text-page-title font-bold tracking-[-0.02em]">
        Your build sheet, ready for Claude Code
      </h1>
      <p className="mb-1 max-w-[720px] text-muted-foreground">
        Three files. Put DESIGN.md and tokens.css in your project root, then paste the prompt into Claude Code.
      </p>
      <p className="mb-3 text-small text-muted-2">
        {missing.length ? `Not picked yet (mood defaults used): ${missing.join(", ")}.` : "Every layer picked."}
      </p>

      <div className="mt-1.5 mb-3 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => {
              setTab(t.id);
              showCopied("");
            }}
            className={cn(
              "min-h-11 rounded-full border px-3.5 text-label font-semibold transition-colors duration-150 ease-out",
              tab === t.id
                ? "border-ink bg-ink text-surface"
                : "border-line-strong bg-surface text-ink hover:bg-surface-hover",
            )}
          >
            {t.label}
          </button>
        ))}
        <button type="button" className={cn(buttonSecondary, "ml-auto inline-flex items-center gap-2")} onClick={copy}>
          {copied === "ok" ? (
            <Check aria-hidden className="size-4" strokeWidth={2} />
          ) : (
            <Copy aria-hidden className="size-4" strokeWidth={2} />
          )}
          {copied === "ok" ? "Copied" : copied === "fail" ? "Select the text and copy" : "Copy"}
        </button>
      </div>

      <textarea
        readOnly
        aria-label="Export text"
        value={text}
        className="min-h-[420px] w-full resize-y rounded-md border border-line bg-surface-hover p-3.5 font-mono text-small text-ink"
      />

      <div className="mt-6 flex flex-wrap justify-between gap-2.5">
        <button type="button" className={buttonSecondary} onClick={onBack}>
          Back to effects
        </button>
      </div>
    </>
  );
}
