import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BUTTONS, CARDS, MOODS, NAVS, SKELS } from "@/data/catalog";
import { previewCaption, previewClasses, previewSkeleton } from "./preview";
import { userTokens } from "./tokens";

const css = readFileSync(new URL("../components/preview.module.css", import.meta.url), "utf8");

describe("previewSkeleton", () => {
  it("uses Top nav + hero until a skeleton is picked", () => {
    expect(previewSkeleton({}).id).toBe("hero");
  });
  it("follows the picked skeleton", () => {
    expect(previewSkeleton({ skeleton: "bento" }).id).toBe("bento");
  });
});

describe("previewClasses", () => {
  it("with no picks: only the default mood", () => {
    expect(previewClasses({}, userTokens({}))).toEqual([`m-${MOODS[0].id}`]);
  });

  it("matches the prototype's order and filters effects without a preview style", () => {
    const picks = { mood: "glass", cards: "beam", buttons: "tonal", radius: "rpill", nav: "float", fx: ["aurora", "parallax", "grain", "glass"] };
    expect(previewClasses(picks, userTokens(picks))).toEqual([
      "m-glass", "c-beam", "b-tonal", "b-pill", "n-float", "fx-glass", "fx-aurora", "fx-grain",
    ]);
  });
});

describe("previewCaption", () => {
  it("flags the sample skeleton", () => {
    expect(previewCaption({}, userTokens({}))).toMatch(/\(sample skeleton until you pick one\)$/);
  });
  it("names skeleton, mood, type and radius", () => {
    const picks = { skeleton: "shell", mood: "editorial" };
    const t = userTokens(picks);
    expect(previewCaption(picks, t)).toBe(`${SKELS[0].name} · ${t.mood.name} · ${t.type.name} · ${t.r}px radius`);
  });
});

describe("preview.module.css", () => {
  it("never reads app tokens", () => {
    expect(css).not.toMatch(/--color-|--font-(display|sans|mono)|--radius/);
  });

  it("defines the keyframes it uses (modules hash them per file)", () => {
    expect(css).toMatch(/@keyframes sweep/);
    expect(css).toMatch(/@keyframes fadeUp/);
  });

  it("has a rule for each region kind used by the skeletons that needs one", () => {
    for (const k of ["side", "nav", "hero", "cta", "media", "chat", "table", "input", "card"]) {
      expect(css, k).toMatch(new RegExp(`\\.k-${k}\\b`));
    }
  });

  it("only references class names that exist in the catalog", () => {
    const ids = (list: { id: string }[]) => new Set(list.map((x) => x.id));
    const groups: Record<string, Set<string>> = { c: ids(CARDS), b: ids(BUTTONS), n: ids(NAVS), m: ids(MOODS) };
    for (const [, g, id] of css.matchAll(/\.([cbnm])-([a-z0-9]+)/g)) expect(groups[g].has(id), `${g}-${id}`).toBe(true);
  });
});
