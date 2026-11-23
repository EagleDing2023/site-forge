// User tokens: what the user's picks resolve to. Ported from the prototype's
// tokens() and lum(); step 7's buildExport reads this too, so keep it exact.
import type { CSSProperties } from "react";
import { DENS, MOODS, PALETTES, RADII, TYPES, type Density, type Mood, type Palette, type Picks, type Radius, type TypePairing } from "@/data/catalog";
import { byId } from "./picks";

export type UserTokens = {
  mood: Mood;
  pal: Palette | undefined;
  type: TypePairing;
  rad: Radius | undefined;
  den: Density;
  acc: string;
  accInk: string;
  r: number;
  pill: boolean;
};

/** WCAG relative luminance. Short hex (#FFF) returns 0.5, as in the prototype. */
export function lum(hex: string): number {
  const h = hex.replace("#", "");
  if (h.length < 6) return 0.5;
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const r = parseInt(h.substr(0, 2), 16) / 255;
  const g = parseInt(h.substr(2, 2), 16) / 255;
  const b = parseInt(h.substr(4, 2), 16) / 255;
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

const one = (picks: Picks, stepId: string) => {
  const v = picks[stepId];
  return typeof v === "string" ? v : undefined;
};

export function userTokens(picks: Picks): UserTokens {
  const mood = byId(MOODS, one(picks, "mood")) ?? MOODS[0];
  const pal = byId(PALETTES, one(picks, "palette"));
  const type = byId(TYPES, one(picks, "type")) ?? byId(TYPES, mood.type)!;
  const rad = byId(RADII, one(picks, "radius"));
  const den = byId(DENS, one(picks, "density")) ?? DENS[1];
  let acc = pal ? pal.hex : mood.acc;
  // "Mono" accent on a dark mood would be black on black: flip to near-white.
  if (pal && pal.id === "mono" && lum(mood.bg) < 0.2) acc = "#F5F5F5";
  return {
    mood, pal, type, rad, den, acc,
    accInk: lum(acc) > 0.45 ? "#0B0B0B" : "#FFFFFF",
    r: rad ? rad.px : mood.r,
    pill: rad ? !!rad.pill : false,
  };
}

/** The user-token CSS variables set on the app root. Only demo/preview CSS reads them. */
export function userTokenVars(t: UserTokens): CSSProperties {
  return {
    "--bg": t.mood.bg,
    "--surf": t.mood.surf,
    "--ink": t.mood.ink,
    "--muted": t.mood.muted,
    "--line": t.mood.line,
    "--acc": t.acc,
    "--accInk": t.accInk,
    "--hf": t.type.h,
    "--bf": t.type.b,
    "--rc": `${t.r}px`,
    "--sh": t.mood.sh,
    "--d": String(t.den.d),
  } as CSSProperties;
}
