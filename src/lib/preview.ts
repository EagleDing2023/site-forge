// Live preview ("mannequin") logic, ported from the prototype's renderVals (mqCls, caption).
import { BACKGROUNDS, SKELS, type Picks, type Skeleton } from "@/data/catalog";
import { byId } from "./picks";
import type { UserTokens } from "./tokens";

const one = (picks: Picks, id: string) => {
  const v = picks[id];
  return typeof v === "string" ? v : undefined;
};

/** Effects the preview can draw. Other effects have no preview style. */
const PREVIEW_FX = ["glass", "aurora", "dots", "lift", "reveal", "grain"];

/** The chosen skeleton, or the "Top nav + hero" sample until one is picked. */
export function previewSkeleton(picks: Picks): Skeleton {
  return byId(SKELS, one(picks, "skeleton")) ?? SKELS[2];
}

/**
 * The picked Background's CSS value for the preview frame, or undefined for the
 * plain --bg. Applied inline, so it wins over the Aurora / Dot grid effect styles.
 */
export function previewBackground(picks: Picks): string | undefined {
  return byId(BACKGROUNDS, one(picks, "background"))?.bg;
}

/** Class names for the preview root, in the prototype's order. Keys of preview.module.css. */
export function previewClasses(picks: Picks, t: UserTokens): string[] {
  const fx = Array.isArray(picks.fx) ? picks.fx : [];
  const cards = one(picks, "cards");
  const buttons = one(picks, "buttons");
  const nav = one(picks, "nav");
  return [
    `m-${t.mood.id}`,
    cards && `c-${cards}`,
    buttons && `b-${buttons}`,
    t.pill && "b-pill",
    nav && `n-${nav}`,
    ...PREVIEW_FX.filter((id) => fx.includes(id)).map((id) => `fx-${id}`),
  ].filter((c): c is string => !!c);
}

export function previewCaption(picks: Picks, t: UserTokens): string {
  const sample = one(picks, "skeleton") ? "" : " (sample skeleton until you pick one)";
  return `${previewSkeleton(picks).name} · ${t.mood.name} · ${t.type.name} · ${t.r}px radius${sample}`;
}
