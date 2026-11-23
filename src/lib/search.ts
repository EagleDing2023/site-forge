// Global search, ported from the prototype's renderVals: a case-insensitive
// substring match over name, description, keywords, library, and the layer's
// own step name and group (so "colour" lists every palette).
import { STEPS, type Item, type Step } from "@/data/catalog";

export type SearchHit = { stepIndex: number; step: Step; item: Item };

export function searchOptions(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  STEPS.forEach((step, stepIndex) => {
    for (const item of step.items) {
      const hay = [item.name, item.desc, item.kw ?? "", item.lib ?? "", step.name, step.layer].join(" ").toLowerCase();
      if (hay.includes(q)) hits.push({ stepIndex, step, item });
    }
  });
  return hits;
}
