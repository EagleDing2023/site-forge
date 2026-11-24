// The three export files, ported line for line from the prototype's
// buildExport(). export.test.ts runs the prototype's own code against this
// and requires byte-identical output for v1 picks (bar one deliberate fix, the
// capitalised purpose line), so change neither without the other.
// v2 layers (sections, background, charts, icons) only add lines when picked,
// as ### subsections, so the numbered sections and v1 output never shift.
import {
  BACKGROUNDS, BUTTONS, CARDS, CHARTS, DATA, FEED, FX, ICONS, INPUTS, NAVS, PURPOSES, SECTIONS, SKELS,
  type Item, type Picks, type Section,
} from "@/data/catalog";
import { byId, heavyPicks } from "./picks";
import type { UserTokens } from "./tokens";

export type ExportFiles = { md: string; prompt: string; css: string };
export type ExportTab = keyof ExportFiles;

const one = (picks: Picks, id: string) => {
  const v = picks[id];
  return typeof v === "string" ? v : undefined;
};

function many<T extends Item>(list: T[], picks: Picks, id: string): T[] {
  const v = picks[id];
  const ids = Array.isArray(v) ? v : [];
  return ids.map((x) => byId(list, x)).filter((x): x is T => !!x);
}

// Not in the prototype: it wrote "tool. a work tool". See export.test.ts.
export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Libraries the prompt says to install, and component catalogues to adapt.
const INSTALL = [
  "Sonner", "Vaul", "cmdk", "NumberFlow", "Motion", "Recharts", "TanStack Table", "input-otp", "canvas-confetti", "GSAP",
  "Embla", "dnd-kit", "Tiptap", "Shiki", "visx", "lightweight-charts", "cobe",
];
const CATALOGUES = ["Magic UI", "Aceternity"];

// Top-to-bottom order of page sections, by the category in their kw
// ("section block <category>"). The announcement bar sits above the hero;
// the footer is always last. Unknown categories go just before the CTA.
export const SECTION_ORDER = [
  "announcement bar", "hero", "logos", "security / trust", "stats", "features", "how it works", "get started steps",
  "integrations", "code snippet section", "gallery", "product grid section", "menu section", "comparison",
  "case studies grid", "testimonials", "awards / press", "team", "pricing", "roadmap / timeline", "blog",
  "upcoming events", "locations", "faq", "contact", "newsletter", "download / install", "sign-in", "cta", "footer",
];

function sectionRank(s: Section): number {
  const i = SECTION_ORDER.indexOf(s.kw.replace("section block ", ""));
  return i === -1 ? SECTION_ORDER.indexOf("cta") - 0.5 : i;
}

/** Picked sections in page order; ties keep pick order (Array.sort is stable). */
export function orderSections(picked: Section[]): Section[] {
  return [...picked].sort((a, b) => sectionRank(a) - sectionRank(b));
}

export function buildExport(picks: Picks, t: UserTokens): ExportFiles {
  const purpose = byId(PURPOSES, one(picks, "purpose"));
  const sk = byId(SKELS, one(picks, "skeleton"));
  const m = t.mood;
  const btn = byId(BUTTONS, one(picks, "buttons"));
  const card = byId(CARDS, one(picks, "cards"));
  const nav = byId(NAVS, one(picks, "nav"));
  const ins = many(INPUTS, picks, "inputs");
  const dat = many(DATA, picks, "data");
  const fb = many(FEED, picks, "feedback");
  const fx = many(FX, picks, "fx");
  // Same rule as the one-standout-moment warning: a Signature background first, then effects
  // in pick order. With v1 picks (no background) this is the first Signature effect, as before.
  const sig = heavyPicks(picks)[0];
  const secs = orderSections(many(SECTIONS, picks, "sections"));
  const bg = byId(BACKGROUNDS, one(picks, "background"));
  const charts = many(CHARTS, picks, "charts");
  const icons = many(ICONS, picks, "icons");
  // Icon sets are the icon options with a library; the first one picked replaces Lucide.
  const iconSet = icons.find((x) => x.lib)?.lib ?? "Lucide";

  // Insertion order matters: it is the order libraries appear in the output.
  const libs: string[] = [];
  for (const x of [btn, card, nav, ...ins, ...dat, ...charts, ...fb, ...fx]) {
    if (x?.lib && !libs.includes(x.lib)) libs.push(x.lib);
  }
  const libList = ["shadcn/ui (restyled with these tokens)", iconSet + " icons", ...libs.filter((l) => l !== "shadcn")];
  const space = Math.round(8 * t.den.d);

  const L: string[] = [];
  L.push("# DESIGN.md", "", "Generated with Site Forge. Follow this file strictly. Do not invent colours, fonts, radii or effects that are not listed here; ask first.", "");
  L.push("## 1. Purpose", purpose ? purpose.name + ". " + capitalise(purpose.prompt.replace("Purpose: ", "")) : "(not picked)", "");
  L.push("## 2. Layout skeleton", sk ? sk.name + ". " + sk.prompt : "(not picked)", "");
  if (secs.length) {
    L.push("### Page sections (top to bottom)");
    secs.forEach((x, i) => L.push(i + 1 + ". " + x.name + ": " + x.prompt));
    L.push("");
  }
  L.push("## 3. Look", "Mood: " + m.name + " — " + m.desc, "");
  L.push("### Colour tokens");
  L.push("- background: " + m.bg, "- surface: " + m.surf, "- foreground (ink): " + m.ink, "- muted text: " + m.muted, "- border: " + m.line);
  L.push("- accent: " + t.acc + (t.pal ? " (" + t.pal.name + ")" : " (mood default)"), "- on-accent text: " + t.accInk);
  L.push("- Use the accent only for the primary action and key highlights. One strong colour.", "");
  L.push("### Typography", "- Headings: " + t.type.hn, "- Body: " + t.type.bn);
  if (t.type.mono) L.push("- Mono: " + t.type.mono);
  L.push("- Scale: 48 / 32 / 24 / 18 / 16 / 14 px. Body 16px, line-height 1.5. Tabular figures for numbers.", "");
  L.push("### Shape and space", "- Radius: " + t.r + "px" + (t.pill ? " (buttons and chips fully rounded)" : ""));
  L.push("- Density: " + t.den.name + " — base spacing unit " + space + "px; use multiples of it.");
  L.push("- Shadow: " + m.sh, "");
  if (bg) L.push("### Background", "- " + bg.name + ": " + bg.prompt, "");
  if (icons.length) {
    L.push("### Icons and imagery");
    for (const x of icons) L.push("- " + x.name + ": " + x.prompt);
    L.push("");
  }
  L.push("## 4. Components");
  if (btn) L.push("- Buttons — " + btn.name + ": " + btn.prompt);
  if (card) L.push("- Cards — " + card.name + ": " + card.prompt);
  if (nav) L.push("- Navigation — " + nav.name + ": " + nav.prompt);
  for (const x of ins) L.push("- Input — " + x.name + ": " + x.prompt);
  L.push("");
  if (dat.length || charts.length) {
    L.push("## 5. Data display");
    for (const x of dat) L.push("- " + x.name + ": " + x.prompt);
    if (dat.length) L.push("");
    if (charts.length) {
      L.push("### Charts");
      for (const x of charts) L.push("- " + x.name + ": " + x.prompt);
      L.push("");
    }
  }
  if (fb.length) {
    L.push("## 6. Feedback and overlays");
    for (const x of fb) L.push("- " + x.name + ": " + x.prompt);
    L.push("");
  }
  L.push("## 7. Motion and effects");
  if (sig) L.push("Signature moment (the ONE standout effect): " + sig.name + " — " + sig.prompt);
  for (const x of fx) {
    if (x !== sig) L.push("- " + (x.heavy ? "(second signature: use on a different page) " : "") + x.name + ": " + x.prompt);
  }
  if (!fx.length) L.push("- Keep motion minimal: 150–250ms ease-out on hover and state changes.");
  L.push("- Respect prefers-reduced-motion everywhere.", "");
  L.push("## 8. Libraries");
  for (const l of libList) L.push("- " + l);
  L.push("");
  L.push(
    "## 9. Rules",
    "- Icons: " + iconSet + " only. No emoji as icons.",
    "- One standout moment per page.",
    "- Restyle shadcn: change radius, colours and fonts to these tokens so it does not look like default shadcn.",
    "- Real content, no lorem ipsum. Every card and button does something.",
    "- Text contrast at least 4.5:1. Touch targets at least 44px. Works at phone width with no sideways scroll.",
    "- Squint test: blur the page; you should still see what it is for and what matters most.",
    "",
  );
  L.push(
    "## 10. Forbidden",
    "- Purple-to-blue gradient hero",
    "- Three identical icon/stat cards in a row",
    "- The same stat shown more than once",
    "- Gradient profile circles with initials",
    "- Emoji icons",
    "- Cards or buttons that do nothing",
  );

  const P: string[] = [];
  P.push("Read DESIGN.md in the project root first and follow it strictly. Use tokens.css for every colour, font, radius and shadow.", "");
  P.push("Build " + (purpose ? "a " + purpose.name.toLowerCase() : "the app") + ' using the "' + (sk ? sk.name : "chosen") + '" layout described in DESIGN.md section 2.');
  P.push("Stack: Next.js + Tailwind + shadcn/ui. Map tokens.css to the Tailwind theme and shadcn CSS variables before building any page.");
  const inst = libs.filter((l) => INSTALL.includes(l));
  if (iconSet !== "Lucide") inst.push(iconSet + " icons");
  if (inst.length) P.push("Install and use these instead of hand-building: " + inst.join(", ") + ".");
  const cat = libs.filter((l) => CATALOGUES.includes(l));
  if (cat.length) P.push("Adapt components from " + cat.join(" and ") + " via the shadcn CLI, then restyle them to the tokens.");
  if (sig) P.push("The single signature moment is: " + sig.name + ". Put it on the main page only.");
  P.push("", "Order: 1) tokens and theme, 2) layout skeleton with real placeholder content, 3) components, 4) effects last. Show me the page after step 2 before adding effects.");
  P.push("When done, run the squint test and check every item in DESIGN.md section 9.");

  const fams = [...new Set([t.type.hn, t.type.bn, ...(t.type.mono ? [t.type.mono] : [])])]
    .map((f) => "family=" + f.replace(/ /g, "+"))
    .join("&");
  const c: string[] = [];
  c.push("/* tokens.css — generated by Site Forge */");
  c.push('@import url("https://fonts.googleapis.com/css2?' + fams + '&display=swap");');
  c.push(":root {");
  c.push("  --background: " + m.bg + ";", "  --surface: " + m.surf + ";", "  --foreground: " + m.ink + ";", "  --muted-foreground: " + m.muted + ";", "  --border: " + m.line + ";");
  c.push("  --accent: " + t.acc + ";", "  --accent-foreground: " + t.accInk + ";");
  c.push("  --font-heading: '" + t.type.hn + "', sans-serif;", "  --font-body: '" + t.type.bn + "', sans-serif;");
  c.push("  --radius: " + t.r + "px;", "  --radius-button: " + (t.pill ? "999px" : t.r + "px") + ";");
  c.push("  --space: " + space + "px;", "  --shadow: " + m.sh + ";");
  c.push("  --ease-out: cubic-bezier(.22,1,.36,1);", "  --duration: 200ms;");
  c.push("}");

  return { md: L.join("\n"), prompt: P.join("\n"), css: c.join("\n") };
}
