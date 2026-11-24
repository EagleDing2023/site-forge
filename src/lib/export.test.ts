import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as v1 from "../../site-forge-handoff/data/catalog.js";
import { BACKGROUNDS, CHARTS, DATA, FX, ICONS, INPUTS, MOODS, PURPOSES, SECTIONS, type Item, type Picks, type Step } from "@/data/catalog";
import { SECTION_ORDER, buildExport, capitalise, orderSections, type ExportFiles } from "./export";
import { userTokens } from "./tokens";

// Golden reference: the prototype's own <script> block, run unchanged. Only
// its DCLogic base class (the canvas runtime) is stubbed.
const html = readFileSync(new URL("../../site-forge-handoff/refs/prototype.dc.html", import.meta.url), "utf8");
const script = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)![1];
type Proto = { state: { picks: Picks }; tokens(): unknown; buildExport(t: unknown): ExportFiles };
const Component = new Function(
  "DCLogic",
  `${script}\nreturn Component;`,
)(class { constructor(public props: unknown) {} }) as new (props: unknown) => Proto;

function reference(picks: Picks): ExportFiles {
  const c = new Component({});
  c.state.picks = picks;
  const { md, prompt, css } = c.buildExport(c.tokens());
  return { md: fixPurposeLine(md, picks), prompt, css };
}

// Intentional divergence (Eagle, step 8): the prototype writes the purpose
// line as "SaaS workspace / tool. a work tool…", a lower-case letter after a
// full stop. We capitalise it, so the expected output gets the same fix.
// Everything else must still match the prototype byte for byte.
function fixPurposeLine(md: string, picks: Picks): string {
  const p = PURPOSES.find((x) => x.id === picks.purpose);
  if (!p) return md;
  const rest = p.prompt.replace("Purpose: ", "");
  return md.replace(`## 1. Purpose\n${p.name}. ${rest}`, `## 1. Purpose\n${p.name}. ${capitalise(rest)}`);
}

// The prototype only knows the v1 catalog, so golden pick sets use v1 layers
// and options only (v2 kept every v1 item unchanged; catalog.test.ts checks).
const V1_STEPS = v1.STEPS as Step[];

const ours = (picks: Picks) => buildExport(picks, userTokens(picks));

// Small seeded PRNG so failures reproduce.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function randomPicks(r: () => number): Picks {
  const picks: Picks = {};
  for (const s of V1_STEPS) {
    if (s.kind === "single" && r() < 0.75) picks[s.id] = s.items[Math.floor(r() * s.items.length)].id;
    if (s.kind === "multi" && r() < 0.75) {
      // Random subset in random order: pick order changes the output.
      const ids = s.items.map((i) => i.id).sort(() => r() - 0.5);
      picks[s.id] = ids.slice(0, Math.floor(r() * (ids.length + 1)));
    }
  }
  return picks;
}

describe("buildExport matches the prototype byte for byte", () => {
  it("with nothing picked", () => {
    expect(ours({})).toEqual(reference({}));
  });

  it("with each option picked on its own", () => {
    for (const s of V1_STEPS)
      for (const it of s.items) {
        const picks: Picks = { [s.id]: s.kind === "multi" ? [it.id] : it.id };
        expect(ours(picks), `${s.id}/${it.id}`).toEqual(reference(picks));
      }
  });

  it("with Mono accent on every mood (the dark-mood flip)", () => {
    for (const m of v1.MOODS) {
      const picks: Picks = { mood: m.id, palette: "mono" };
      expect(ours(picks), m.id).toEqual(reference(picks));
    }
  });

  it("with every option in every layer picked", () => {
    const picks: Picks = {};
    for (const s of V1_STEPS) {
      if (s.kind === "single") picks[s.id] = s.items[s.items.length - 1].id;
      if (s.kind === "multi") picks[s.id] = s.items.map((i) => i.id);
    }
    expect(ours(picks)).toEqual(reference(picks));
  });

  it("over 1000 random pick sets", () => {
    const r = rng(20261123);
    for (let n = 0; n < 1000; n++) {
      const picks = randomPicks(r);
      expect(ours(picks), JSON.stringify(picks)).toEqual(reference(picks));
    }
  });
});

describe("DESIGN.md content (spec 'Done means')", () => {
  const picks: Picks = {
    purpose: "dash", skeleton: "shell", mood: MOODS[3].id,
    buttons: "solid", fx: ["aurora", "para"], data: ["stat"],
  };
  const { md } = ours(picks);
  const t = userTokens(picks);

  it("capitalises the purpose prompt after the name", () => {
    expect(ours({ purpose: "saas" }).md).toContain("## 1. Purpose\nSaaS workspace / tool. A work tool people use every day.");
  });

  it("names the purpose and skeleton", () => {
    expect(md).toContain("## 1. Purpose\nDashboard / analytics.");
    expect(md).toContain("## 2. Layout skeleton\nSidebar app shell.");
  });

  it("lists every token value", () => {
    for (const v of [t.mood.bg, t.mood.surf, t.mood.ink, t.mood.muted, t.mood.line, t.acc, t.accInk, t.type.hn, t.type.bn, `${t.r}px`, t.mood.sh])
      expect(md).toContain(v);
  });

  it("includes picked prompt lines, libraries, rules and forbidden list", () => {
    for (const id of ["aurora", "para"]) expect(md).toContain(FX.find((f) => f.id === id)!.prompt);
    expect(md).toContain("## 8. Libraries");
    expect(md).toContain("## 9. Rules");
    expect(md).toContain("## 10. Forbidden");
  });
});

describe("v2 layers in the export", () => {
  const sec = (id: string) => SECTIONS.find((s) => s.id === id)!;

  it("orders page sections top to bottom: announcement, hero ... CTA, footer; ties keep pick order", () => {
    const ids = orderSections(["foot-simple", "faq-accordion", "price-3tier", "hero-center", "announce", "cta-band", "feat-3col", "feat-grid"].map(sec)).map((s) => s.id);
    expect(ids).toEqual(["announce", "hero-center", "feat-3col", "feat-grid", "price-3tier", "faq-accordion", "cta-band", "foot-simple"]);
  });

  it("every section category has a place in the order", () => {
    // A new category would silently fall back to "before the CTA"; make that a decision, not an accident.
    const missing = SECTIONS.map((s) => s.kw.replace("section block ", "")).filter((k) => !SECTION_ORDER.includes(k));
    expect(missing).toEqual([]);
  });

  it("writes Page sections under section 2, numbered, with each prompt line", () => {
    const { md } = ours({ sections: ["foot-simple", "hero-center"] });
    expect(md).toContain(`### Page sections (top to bottom)\n1. ${sec("hero-center").name}: ${sec("hero-center").prompt}\n2. ${sec("foot-simple").name}: ${sec("foot-simple").prompt}\n`);
    expect(md.indexOf("### Page sections")).toBeGreaterThan(md.indexOf("## 2. Layout skeleton"));
    expect(md.indexOf("### Page sections")).toBeLessThan(md.indexOf("## 3. Look"));
  });

  it("writes Background and Icons and imagery under Look", () => {
    const b = BACKGROUNDS[4];
    const icons = ICONS.filter((i) => ["phosphor", "st-duotone", "img-3d"].includes(i.id));
    const { md } = ours({ background: b.id, icons: icons.map((i) => i.id) });
    const look = md.slice(md.indexOf("## 3. Look"), md.indexOf("## 4. Components"));
    expect(look).toContain(`### Background\n- ${b.name}: ${b.prompt}\n`);
    for (const i of icons) expect(look).toContain(`- ${i.name}: ${i.prompt}`);
  });

  it("writes Charts under Data display, creating the section if only charts are picked", () => {
    const c = CHARTS[0];
    const { md } = ours({ charts: [c.id] });
    expect(md).toContain(`## 5. Data display\n### Charts\n- ${c.name}: ${c.prompt}\n`);
    const withData = ours({ data: ["stat"], charts: [c.id] }).md;
    expect(withData).toMatch(/## 5\. Data display\n- [^\n]+\n\n### Charts\n/);
  });

  it("a Signature background is the signature moment; Signature effects become second signatures", () => {
    const mesh = BACKGROUNDS.find((b) => b.id === "mesh")!;
    const aurora = FX.find((f) => f.id === "aurora")!;
    const lift = FX.find((f) => f.id === "lift")!;
    expect(mesh.heavy && aurora.heavy && !lift.heavy).toBe(true);
    const { md, prompt } = ours({ background: "mesh", fx: ["aurora", "lift"] });
    expect(md).toContain(`## 7. Motion and effects\nSignature moment (the ONE standout effect): ${mesh.name} — ${mesh.prompt}\n`);
    expect(md).toContain(`- (second signature: use on a different page) ${aurora.name}: ${aurora.prompt}`);
    expect(md).toContain(`- ${lift.name}: ${lift.prompt}`);
    expect(prompt).toContain(`The single signature moment is: ${mesh.name}. Put it on the main page only.`);
  });

  it("a plain background leaves the first Signature effect as the signature moment", () => {
    const aurora = FX.find((f) => f.id === "aurora")!;
    const { md, prompt } = ours({ background: "plain", fx: ["lift", "aurora", "para"] });
    expect(md).toContain(`Signature moment (the ONE standout effect): ${aurora.name} — ${aurora.prompt}`);
    expect(md).toContain("- (second signature: use on a different page) Parallax layers:");
    expect(prompt).toContain(`The single signature moment is: ${aurora.name}.`);
  });

  it("a Signature background alone is still the signature moment", () => {
    const { md } = ours({ background: "mesh" });
    expect(md).toContain("Signature moment (the ONE standout effect): Mesh gradient — ");
    expect(md).not.toContain("second signature");
  });

  it("the picked icon set replaces Lucide in Libraries, Rules and the install list", () => {
    const { md, prompt } = ours({ icons: ["st-thin", "phosphor"] });
    expect(md).toContain("- Phosphor icons\n");
    expect(md).not.toContain("Lucide");
    expect(md).toContain("- Icons: Phosphor only. No emoji as icons.");
    expect(prompt).toContain("Install and use these instead of hand-building: Phosphor icons.");
  });

  it("falls back to Lucide when no icon set is picked", () => {
    const { md, prompt } = ours({ icons: ["st-thin", "img-3d"] });
    expect(md).toContain("- Lucide icons\n");
    expect(md).toContain("- Icons: Lucide only.");
    expect(prompt).not.toContain("Install");
  });

  it("libraries and the install list include the new libraries", () => {
    const withLib = (list: Item[], lib: string) => list.find((x) => x.lib === lib)!.id;
    const picks: Picks = {
      charts: [withLib(CHARTS, "visx"), withLib(CHARTS, "lightweight-charts")],
      fx: [withLib(FX, "dnd-kit")],
      inputs: [withLib(INPUTS, "Tiptap")],
      data: [withLib(DATA, "Shiki")],
    };
    const { md, prompt } = ours(picks);
    for (const l of ["visx", "lightweight-charts", "dnd-kit", "Tiptap", "Shiki"]) {
      expect(md).toContain(`- ${l}\n`);
      expect(prompt).toMatch(new RegExp(`Install and use these instead of hand-building: [^\\n]*${l}`));
    }
  });
});
