import type { CSSProperties } from "react";
import { SKELS, type Background, type Item, type Mood, type Palette, type Radius, type Density, type Region, type Skeleton, type Step, type TypePairing } from "@/data/catalog";
import s from "./demo.module.css";

// Plain join, not cn(): CSS-module names are hashed and Tailwind merging must not touch them.
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

// The prototype's rcss(): a region's box in % plus its index for staggered animations.
export function regionStyle(r: Region, i: number): CSSProperties {
  return { left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%`, "--i": i } as CSSProperties;
}

function Mini({ regions }: { regions: Region[] }) {
  return (
    <div aria-hidden className={s.mini}>
      {regions.map((r, i) => (
        <i key={i} className={cx(s.mrg, s[`k-${r[4]}`])} style={regionStyle(r, i)} />
      ))}
    </div>
  );
}

/** The live preview at the top of an option card, chosen by the layer's `view`. */
export function OptionPreview({ step, item }: { step: Step; item: Item }) {
  switch (step.view) {
    case "purpose": {
      // A purpose shows the first skeleton that fits it.
      const sk = SKELS.find((k) => k.fit.includes(item.id));
      return <Mini regions={sk ? sk.regions : []} />;
    }
    case "skel":
      return <Mini regions={(item as Skeleton).regions} />;
    case "mood": {
      const m = item as Mood;
      return (
        <div aria-hidden className={s.sws}>
          {[m.bg, m.surf, m.ink, m.acc].map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </div>
      );
    }
    case "swatch":
      return <div aria-hidden className={s.swatch} style={{ background: (item as Palette).hex }} />;
    case "type": {
      const t = item as TypePairing;
      return (
        <div aria-hidden className={s.typ}>
          <span className={s.th} style={{ fontFamily: t.h }}>
            Headline
          </span>
          <span className={s.tb} style={{ fontFamily: t.b }}>
            Body text reads like this.
          </span>
        </div>
      );
    }
    case "radius":
      return (
        <div aria-hidden className={s.rad}>
          <i style={{ borderRadius: `${(item as Radius).px}px` }} />
        </div>
      );
    case "density":
      return (
        <div aria-hidden className={s.den} style={{ gap: `${(item as Density).gap}px` }}>
          <i />
          <i />
          <i />
        </div>
      );
    case "bg": {
      const b = item as Background;
      return <div aria-hidden className={cx(s.demo, s[b.demo])} style={{ background: b.bg }} />;
    }
    case "demo":
      return (
        <div aria-hidden className={cx(s.demo, item.demo && s[item.demo])}>
          <span className={s.d1}>{item.label ?? ""}</span>
          <span className={s.d2}>{item.label2 ?? ""}</span>
          <span className={s.d3}>{item.label3 ?? ""}</span>
        </div>
      );
    default:
      return null;
  }
}
