"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import type { Picks } from "@/data/catalog";
import { previewBackground, previewCaption, previewClasses, previewSkeleton } from "@/lib/preview";
import type { UserTokens } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { regionStyle } from "./option-preview";
import s from "./preview.module.css";

// Plain join, not cn(): CSS-module names are hashed and Tailwind merging must not touch them.
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** The "mannequin": the chosen skeleton redrawn in the user's tokens and outfit picks. */
export function LivePreview({ picks, tokens }: { picks: Picks; tokens: UserTokens }) {
  const [squint, setSquint] = useState(false);
  const sk = previewSkeleton(picks);
  const caption = previewCaption(picks, tokens);

  return (
    <section aria-labelledby="live-preview-title" className="rounded-xl border border-line bg-surface p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 id="live-preview-title" className="font-display text-panel-title font-bold">
          Live preview
        </h2>
        <button
          type="button"
          aria-pressed={squint}
          onClick={() => setSquint((v) => !v)}
          className={cn(
            "flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-small transition-colors duration-150 ease-out",
            squint ? "border-ink bg-ink text-surface" : "border-line-strong bg-surface text-ink hover:bg-surface-hover",
          )}
        >
          <Eye size={14} strokeWidth={2} aria-hidden />
          Squint test
        </button>
      </div>
      <div
        role="img"
        aria-label={`Preview: ${caption}`}
        className={cx("border border-line", s.mq, ...previewClasses(picks, tokens).map((c) => s[c]), squint && s.squint)}
        style={{ background: previewBackground(picks) }}
      >
        {sk.regions.map((r, i) => (
          // Index keys on purpose: regions are reused across skeletons so they animate into the new layout.
          <div key={i}className={cx(s.rg, s[`k-${r[4]}`])} style={regionStyle(r, i)}>
            <span className={s.rl}>{r[5]}</span>
            <i className={s.lines} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-small text-muted-2">{caption}</p>
    </section>
  );
}
