import { describe, expect, it } from "vitest";
import { lum, userTokenVars, userTokens } from "./tokens";

describe("userTokens", () => {
  it("defaults: first mood, its type pairing, comfortable density", () => {
    const t = userTokens({});
    expect(t.mood.id).toBe("clean");
    expect(t.type.id).toBe("geist");
    expect(t.den.id).toBe("comfy");
    expect(t.acc).toBe(t.mood.acc);
    expect(t.r).toBe(t.mood.r);
    expect(t.pill).toBe(false);
  });

  it("palette, type, radius and density picks override the mood", () => {
    const t = userTokens({ mood: "clean", palette: "lime", type: "fraunces", radius: "rpill", density: "airy" });
    expect(t.acc).toBe("#A3E635");
    expect(t.accInk).toBe("#0B0B0B"); // light accent gets dark text
    expect(t.type.id).toBe("fraunces");
    expect(t.r).toBe(20);
    expect(t.pill).toBe(true);
    expect(t.den.d).toBe(1.4);
  });

  it("Ink only on a dark mood flips to near-white", () => {
    expect(userTokens({ mood: "terminal", palette: "mono" }).acc).toBe("#F5F5F5");
    expect(userTokens({ mood: "clean", palette: "mono" }).acc).toBe("#111111");
  });

  it("dark accent gets white text", () => {
    expect(userTokens({ palette: "blue" }).accInk).toBe("#FFFFFF");
  });

  it("lum matches WCAG endpoints and the short-hex fallback", () => {
    expect(lum("#000000")).toBe(0);
    expect(lum("#FFFFFF")).toBeCloseTo(1);
    expect(lum("#FFF")).toBe(0.5);
  });

  it("CSS variables use the prototype's names and units", () => {
    expect(userTokenVars(userTokens({ mood: "terminal", density: "compact" }))).toEqual({
      "--bg": "#0B0D0E",
      "--surf": "#121517",
      "--ink": "#D6F5DD",
      "--muted": "#7C8A80",
      "--line": "#1F2A24",
      "--acc": "#3DDC84",
      "--accInk": "#0B0B0B",
      "--hf": "'JetBrains Mono',monospace",
      "--bf": "'Inter',sans-serif",
      "--rc": "4px",
      "--sh": "none",
      "--d": "0.7",
    });
  });
});
