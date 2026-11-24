"use client";

import { Check } from "lucide-react";
import { useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { Item, Step } from "@/data/catalog";
import { useOnScreen } from "@/lib/use-on-screen";
import { cn } from "@/lib/utils";
import demo from "./demo.module.css";
import { OptionPreview } from "./option-preview";

export const PREVIEW_HINT = "Click to preview · double-click to choose";

// Two clicks within this window count as a double-click. Timed by hand rather than
// with the dblclick event, which touch browsers don't fire reliably on a double-tap.
const DOUBLE_MS = 500;

export function OptionCard({
  step,
  item,
  selected,
  fits,
  onPick,
  onConfirm,
  showLayer = false,
}: {
  step: Step;
  item: Item;
  selected: boolean;
  fits: boolean;
  /** Click: preview a single-choice option, or toggle a multi-choice one. */
  onPick: () => void;
  /** Double-click or Enter on a single-choice option: choose it and move on. */
  onConfirm: () => void;
  /** Search results name the layer each option comes from. */
  showLayer?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { onScreen, seen } = useOnScreen(ref);
  const lastClick = useRef(0);
  const single = step.kind === "single";

  const handleClick = (e: MouseEvent) => {
    if (!single) return onPick();
    // detail is the click count: 2 is the browser's own double-click (OS speed setting),
    // 1 is a single click or tap (timed here), 0 is a keyboard press (never a double).
    // The timer resets after a confirm, so a triple-click can't confirm twice.
    const isDouble = e.detail === 2 || (e.detail === 1 && e.timeStamp - lastClick.current < DOUBLE_MS);
    lastClick.current = isDouble || e.detail === 0 ? 0 : e.timeStamp;
    if (isDouble) onConfirm();
    else onPick();
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    // Enter would otherwise fire a click (a preview). Space still previews.
    if (single && e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      onConfirm();
    }
  };
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={
        cn(
          // Off-screen cards skip layout and paint. 168px = a typical 190px card minus padding and border (the size is for the content box).
          // touch-manipulation: a double-tap chooses instead of zooming the page.
          "flex touch-manipulation flex-col gap-2 rounded-lg border bg-surface text-left transition-[border-color,box-shadow,transform] duration-150 ease-out [content-visibility:auto] [contain-intrinsic-size:auto_168px]",
          selected
            ? "border-[3px] border-brand p-2 shadow-selected"
            : "border-line p-2.5 hover:-translate-y-px hover:border-line-strong hover:shadow-hover",
        ) + (onScreen ? "" : ` ${demo.paused}`) // outside cn(): hashed module names must not be merged
      }
    >
      {showLayer && <span className="eyebrow text-muted-2">{step.name}</span>}
      <OptionPreview step={step} item={item} loadFonts={seen} />
      <span className="flex items-center justify-between gap-1.5 text-label font-semibold">
        {item.name}
        {selected && (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-surface">
            <Check aria-hidden className="size-3" strokeWidth={2} />
          </span>
        )}
      </span>
      <span className="text-small text-muted-foreground">{item.desc}</span>
      {(fits || item.heavy || item.lib) && (
        <span className="flex flex-wrap gap-1">
          {fits && <Badge className="bg-fit-bg text-fit-ink">Fits</Badge>}
          {item.heavy && <Badge className="bg-brand-tint text-sig-ink">Signature</Badge>}
          {item.lib && <Badge className="bg-lib-bg text-lib-ink">{item.lib}</Badge>}
        </span>
      )}
    </button>
  );
}

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-badge font-semibold", className)}>{children}</span>
  );
}
