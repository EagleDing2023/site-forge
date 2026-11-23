import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { Item, Step } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { OptionPreview } from "./option-preview";

export function OptionCard({
  step,
  item,
  selected,
  fits,
  onPick,
}: {
  step: Step;
  item: Item;
  selected: boolean;
  fits: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPick}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-surface text-left transition-[border-color,box-shadow,transform] duration-150 ease-out",
        selected
          ? "border-2 border-brand p-[9px] shadow-selected"
          : "border-line p-2.5 hover:-translate-y-px hover:border-line-strong hover:shadow-hover",
      )}
    >
      <OptionPreview step={step} item={item} />
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
    <span className={cn("rounded-full px-[7px] py-0.5 text-badge font-semibold", className)}>{children}</span>
  );
}
