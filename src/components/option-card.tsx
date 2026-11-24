"use client";

import { Check } from "lucide-react";
import { useRef, type ReactNode } from "react";
import type { Item, Step } from "@/data/catalog";
import { useOnScreen } from "@/lib/use-on-screen";
import { cn } from "@/lib/utils";
import demo from "./demo.module.css";
import { OptionPreview } from "./option-preview";

export function OptionCard({
  step,
  item,
  selected,
  fits,
  onPick,
  showLayer = false,
}: {
  step: Step;
  item: Item;
  selected: boolean;
  fits: boolean;
  onPick: () => void;
  /** Search results name the layer each option comes from. */
  showLayer?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { onScreen, seen } = useOnScreen(ref);
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onClick={onPick}
      className={
        cn(
          // Off-screen cards skip layout and paint. 168px = a typical 190px card minus padding and border (the size is for the content box).
          "flex flex-col gap-2 rounded-lg border bg-surface text-left transition-[border-color,box-shadow,transform] duration-150 ease-out [content-visibility:auto] [contain-intrinsic-size:auto_168px]",
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
