// Pure picker logic, ported from the prototype's DCLogic component
// (pickItem, the rail/sheet/missing builders in renderVals).
import { PURPOSES, STEPS, type Item, type Picks, type Step } from "@/data/catalog";

export const LAST_STEP = STEPS.length - 1;

export function byId<T extends Item>(list: T[], id: string | undefined): T | undefined {
  return id === undefined ? undefined : list.find((x) => x.id === id);
}

/** Picked item ids for a step, in the order they were picked. */
export function pickedIds(picks: Picks, step: Step): string[] {
  const v = picks[step.id];
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

export function isPicked(picks: Picks, step: Step, itemId: string): boolean {
  return pickedIds(picks, step).includes(itemId);
}

/**
 * Single layers: set the pick and move on to the next layer.
 * Multi layers: toggle the item and stay.
 */
export function applyPick(
  picks: Picks,
  stepIndex: number,
  itemId: string,
): { picks: Picks; step: number } {
  const s = STEPS[stepIndex];
  if (s.kind === "multi") {
    const cur = pickedIds(picks, s);
    const next = cur.includes(itemId) ? cur.filter((id) => id !== itemId) : [...cur, itemId];
    return { picks: { ...picks, [s.id]: next }, step: stepIndex };
  }
  return { picks: { ...picks, [s.id]: itemId }, step: Math.min(stepIndex + 1, LAST_STEP) };
}

export function isDone(picks: Picks, step: Step): boolean {
  return step.kind !== "export" && pickedIds(picks, step).length > 0;
}

/** The small line under each rail step. */
export function railLabel(picks: Picks, step: Step): string {
  if (step.kind === "export") return "DESIGN.md · prompt · tokens";
  if (step.kind === "multi") {
    const n = pickedIds(picks, step).length;
    return n ? `${n} picked` : "—";
  }
  const it = byId(step.items, pickedIds(picks, step)[0]);
  if (it) return it.name;
  return step.id === "palette" || step.id === "type" ? "mood default" : "—";
}

export function pickCount(picks: Picks): number {
  return STEPS.reduce((n, s) => n + (s.kind === "export" ? 0 : pickedIds(picks, s).length), 0);
}

export function purposeOf(picks: Picks): Item | undefined {
  const v = picks.purpose;
  return typeof v === "string" ? byId(PURPOSES, v) : undefined;
}

/**
 * An option fits a purpose when its `fit` names the purpose or any purpose in
 * its `like` list. Most v2 purposes have no options of their own and borrow
 * their parents' (Fintech is like Dashboard and SaaS).
 */
export function fitsPurpose(item: Item, purposeId: string | undefined): boolean {
  if (!purposeId || !item.fit) return false;
  const like = byId(PURPOSES, purposeId)?.like ?? [];
  return item.fit.includes(purposeId) || like.some((id) => item.fit!.includes(id));
}

/**
 * "Fits a <purpose>" first, then the rest. Only for `fitted` layers with a
 * purpose picked; otherwise everything lands in `others`.
 */
export function splitByFit(step: Step, purposeId: string | undefined): { fits: Item[]; others: Item[] } {
  if (!step.fitted || !purposeId) return { fits: [], others: step.items };
  const fits: Item[] = [];
  const others: Item[] = [];
  for (const it of step.items) (fitsPurpose(it, purposeId) ? fits : others).push(it);
  return { fits, others };
}

export type SheetRow = { stepIndex: number; step: string; value: string };

export function sheetRows(picks: Picks): SheetRow[] {
  const rows: SheetRow[] = [];
  STEPS.forEach((s, i) => {
    if (s.kind === "export") return;
    const names = pickedIds(picks, s).map((id) => byId(s.items, id)?.name ?? id);
    if (names.length) rows.push({ stepIndex: i, step: s.name, value: names.join(", ") });
  });
  return rows;
}

/** Picked Signature options: the background (if it is one), then effects in pick order. 2+ triggers the warning. */
export function heavyPicks(picks: Picks): Item[] {
  return ["background", "fx"].flatMap((id) => {
    const step = STEPS.find((s) => s.id === id)!;
    return pickedIds(picks, step)
      .map((x) => byId(step.items, x))
      .filter((x): x is Item => !!x?.heavy);
  });
}

/** Single layers left unpicked (they fall back to the mood's defaults). */
export function missingSteps(picks: Picks): string[] {
  return STEPS.filter((s) => s.kind === "single" && !picks[s.id]).map((s) => s.name);
}

export function nextLabel(stepIndex: number): string {
  if (stepIndex >= STEPS.length - 2) return "Finish → build sheet";
  return STEPS[stepIndex].kind === "multi" ? "Next layer" : "Skip / next";
}

export type ForgeState = { step: number; picks: Picks };
export const EMPTY_STATE: ForgeState = { step: 0, picks: {} };

/**
 * Parse saved state from localStorage. Anything malformed or stale (an id
 * no longer in the catalog) is dropped rather than trusted.
 */
export function parseSaved(raw: string | null): ForgeState {
  if (!raw) return EMPTY_STATE;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_STATE;
  }
  if (typeof data !== "object" || data === null) return EMPTY_STATE;
  const { step, picks } = data as { step?: unknown; picks?: unknown };
  const savedPicks = typeof picks === "object" && picks !== null ? (picks as Record<string, unknown>) : {};

  const clean: Picks = {};
  for (const s of STEPS) {
    const v = savedPicks[s.id];
    const known = (id: unknown): id is string => typeof id === "string" && !!byId(s.items, id);
    if (s.kind === "single" && known(v)) clean[s.id] = v;
    if (s.kind === "multi" && Array.isArray(v)) {
      const ids = [...new Set(v.filter(known))];
      if (ids.length) clean[s.id] = ids;
    }
  }
  const okStep = typeof step === "number" && Number.isInteger(step) && step >= 0 && step <= LAST_STEP;
  return { step: okStep ? step : 0, picks: clean };
}
