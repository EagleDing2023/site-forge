import { describe, expect, it } from "vitest";
import { STEPS } from "@/data/catalog";
import {
  applyPick,
  heavyPicks,
  missingSteps,
  nextLabel,
  parseSaved,
  pickCount,
  railLabel,
  sheetRows,
  splitByFit,
} from "./picks";

const idx = (id: string) => STEPS.findIndex((s) => s.id === id);
const step = (id: string) => STEPS[idx(id)];

describe("applyPick", () => {
  it("single pick sets the value and opens the next layer", () => {
    const r = applyPick({}, idx("purpose"), "dash");
    expect(r.picks).toEqual({ purpose: "dash" });
    expect(r.step).toBe(idx("skeleton"));
  });

  it("every single pick advances by one layer", () => {
    STEPS.forEach((s, i) => {
      if (s.kind !== "single") return;
      expect(applyPick({}, i, s.items[0].id).step).toBe(i + 1);
    });
  });

  it("multi pick toggles and stays on the layer", () => {
    const a = applyPick({}, idx("fx"), "aurora");
    expect(a).toEqual({ picks: { fx: ["aurora"] }, step: idx("fx") });
    const b = applyPick(a.picks, idx("fx"), "para");
    expect(b.picks.fx).toEqual(["aurora", "para"]);
    expect(applyPick(b.picks, idx("fx"), "aurora").picks.fx).toEqual(["para"]);
  });

  it("does not mutate the input", () => {
    const picks = { fx: ["aurora"] };
    applyPick(picks, idx("fx"), "para");
    expect(picks).toEqual({ fx: ["aurora"] });
  });
});

describe("splitByFit", () => {
  it("Dashboard puts Sidebar app shell, Sidebar + data table and Bento grid under Fits", () => {
    const names = splitByFit(step("skeleton"), "dash").fits.map((x) => x.name);
    expect(names).toEqual(expect.arrayContaining(["Sidebar app shell", "Sidebar + data table", "Bento grid"]));
  });

  it("keeps every item exactly once", () => {
    const { fits, others } = splitByFit(step("fx"), "landing");
    expect(fits.length + others.length).toBe(step("fx").items.length);
  });

  it("no purpose or unfitted layer: everything in others", () => {
    expect(splitByFit(step("skeleton"), undefined).fits).toEqual([]);
    expect(splitByFit(step("palette"), "dash").fits).toEqual([]);
  });
});

describe("labels and rows", () => {
  it("rail labels", () => {
    expect(railLabel({}, step("purpose"))).toBe("—");
    expect(railLabel({}, step("palette"))).toBe("mood default");
    expect(railLabel({ purpose: "dash" }, step("purpose"))).toBe("Dashboard / analytics");
    expect(railLabel({ fx: ["aurora", "para"] }, step("fx"))).toBe("2 picked");
    expect(railLabel({}, step("export"))).toBe("DESIGN.md · prompt · tokens");
  });

  it("counts singles and each multi item", () => {
    expect(pickCount({ purpose: "dash", fx: ["aurora", "para"] })).toBe(3);
  });

  it("build sheet lists picks in layer order with names", () => {
    expect(sheetRows({ fx: ["aurora", "para"], purpose: "dash" })).toEqual([
      { stepIndex: idx("purpose"), step: "Purpose", value: "Dashboard / analytics" },
      { stepIndex: idx("fx"), step: "Motion & effects", value: "Aurora background, Parallax layers" },
    ]);
  });

  it("Aurora + Parallax are both Signature effects", () => {
    expect(heavyPicks({ fx: ["aurora", "glass", "para"] }).map((x) => x.name)).toEqual([
      "Aurora background",
      "Parallax layers",
    ]);
  });

  it("missing lists unpicked single layers only", () => {
    const m = missingSteps({ purpose: "dash" });
    expect(m).not.toContain("Purpose");
    expect(m).toContain("Skeleton");
    expect(m).not.toContain("Inputs");
  });

  it("next button label", () => {
    expect(nextLabel(idx("purpose"))).toBe("Skip / next");
    expect(nextLabel(idx("inputs"))).toBe("Next layer");
    expect(nextLabel(idx("fx"))).toBe("Finish → build sheet");
  });
});

describe("parseSaved", () => {
  it("round-trips valid state", () => {
    const s = { step: 3, picks: { purpose: "dash", fx: ["aurora"] } };
    expect(parseSaved(JSON.stringify(s))).toEqual(s);
  });

  it("returns empty state for missing or broken data", () => {
    for (const raw of [null, "", "not json", "42", "null", "[]"]) {
      expect(parseSaved(raw)).toEqual({ step: 0, picks: {} });
    }
  });

  it("drops unknown ids, wrong shapes and bad step numbers", () => {
    const raw = JSON.stringify({
      step: 99,
      picks: { purpose: "nope", skeleton: ["shell"], fx: ["aurora", "ghost", 5, "aurora"], extra: "x" },
    });
    expect(parseSaved(raw)).toEqual({ step: 0, picks: { fx: ["aurora"] } });
  });
});
