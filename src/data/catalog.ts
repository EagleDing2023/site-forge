// Site Forge catalog: 155 options across 15 layers.
// Converted from site-forge-handoff/data/catalog.js. The content is fixed:
// never change an id, name, description, prompt, fit list, library or demo class.
// catalog.test.ts checks this file deep-equals the original.

/** Fields every option can have (spec.md, "Data model"). */
export type Item = {
  id: string;
  name: string;
  desc: string;
  prompt?: string;
  kw?: string;
  /** Purpose ids this option suits; drives "Fits a <purpose>" sorting. */
  fit?: string[];
  lib?: string;
  /** A Signature effect: more than one per page triggers the warning. */
  heavy?: boolean;
  /** CSS class of the option's live demo. */
  demo?: string;
  label?: string;
  label2?: string;
  label3?: string;
};

/** [x%, y%, w%, h%, kind, label] */
export type Region = [number, number, number, number, string, string];

export type Purpose = Item & { kw: string; prompt: string };
export type Skeleton = Item & { fit: string[]; regions: Region[]; prompt: string; kw: string };
export type TypePairing = Item & { h: string; b: string; hn: string; bn: string; mono?: string };
export type Mood = Item & {
  fit: string[];
  bg: string; surf: string; ink: string; muted: string; line: string; acc: string;
  /** TypePairing id */
  type: string;
  r: number;
  sh: string;
};
export type Palette = Item & { hex: string };
export type Radius = Item & { px: number; pill?: boolean };
export type Density = Item & { d: number; gap: number };
export type DemoItem = Item & { demo: string; prompt: string };

export type StepKind = "single" | "multi" | "export";
export type Step = {
  id: string;
  name: string;
  layer: string;
  title: string;
  hint: string;
  analogy: string;
  items: Item[];
  kind: StepKind;
  view: string;
  fitted?: boolean;
};

/** Step id → item id (single) or item ids (multi). */
export type Picks = Record<string, string | string[]>;

export const PURPOSES: Purpose[] = [
 {id:'dash',name:'Dashboard / analytics',desc:'Watch numbers change and spot problems fast.',kw:'metrics charts kpi admin stocks tracker finance monitoring',prompt:'Purpose: a dashboard for watching key numbers. Scanning speed beats decoration; the most important metric is the biggest thing on screen.'},
 {id:'saas',name:'SaaS workspace / tool',desc:'Get daily work done inside one app.',kw:'productivity app tool crud project manager crm',prompt:'Purpose: a work tool people use every day. Fast, quiet, keyboard-friendly; chrome stays out of the way of the content.'},
 {id:'landing',name:'Landing / marketing page',desc:'Explain one product and get the sign-up.',kw:'homepage startup launch hero waitlist product page',prompt:'Purpose: a landing page that explains one product and drives one action. One clear headline, one primary CTA, proof below.'},
 {id:'shop',name:'Online shop',desc:'Browse, compare and buy.',kw:'ecommerce store cart product checkout retail',prompt:'Purpose: an online shop. Product imagery leads, price and Add to cart are always obvious, checkout has no surprises.'},
 {id:'editorial',name:'Blog / magazine',desc:'Read long-form writing comfortably.',kw:'articles news content newsletter writing reading',prompt:'Purpose: long-form reading. Comfortable measure (60–75 characters), strong type hierarchy, minimal chrome.'},
 {id:'portfolio',name:'Portfolio / showcase',desc:'Show off work and get hired.',kw:'personal artist resume case study designer creative',prompt:'Purpose: a portfolio that shows work first. Big visuals, little text, one way to get in touch.'},
 {id:'booking',name:'Booking / step-by-step flow',desc:'Walk anyone through a task one step at a time.',kw:'wizard form onboarding checkout appointment survey quiz',prompt:'Purpose: a guided flow anyone can finish. One question per screen, big tap targets, clear progress and a visible Back.'},
 {id:'social',name:'Social / community feed',desc:'Post, react and follow people.',kw:'feed forum community posts comments followers',prompt:'Purpose: a social feed. The post is the hero; actions (reply, like, share) are small and consistent.'},
 {id:'ai',name:'AI chat / agent app',desc:'Talk to a model and review what it does.',kw:'chatbot llm assistant agent copilot gpt claude',prompt:'Purpose: an AI chat or agent app. Conversation in the centre, streaming text, clear states for thinking, tool use and approval.'},
 {id:'docs',name:'Docs / knowledge base',desc:'Find the answer and copy the code.',kw:'documentation wiki help guide reference api',prompt:'Purpose: documentation. Search first, three-column reading layout, copyable code blocks.'},
 {id:'playful',name:'Game / playful app',desc:'Have fun and feel rewarded.',kw:'game kids quiz toy interactive fun reward',prompt:'Purpose: a playful app. Big friendly controls, bouncy feedback, rewards you can see.'},
 {id:'directory',name:'Directory / marketplace',desc:'Search a big catalogue and filter it down.',kw:'listings search filter marketplace map catalogue',prompt:'Purpose: a searchable catalogue. Search and filters are the main tool; results are dense and comparable.'}
];
function SK(id: string, name: string, desc: string, fit: string[], regions: Region[], prompt: string): Skeleton {return {id:id,name:name,desc:desc,fit:fit,regions:regions,prompt:prompt,kw:'layout skeleton structure'};}
const NAV: Region = [0,0,100,9,'nav','Top nav'];
export const SKELS: Skeleton[] = [
 SK('shell','Sidebar app shell','Left nav, top bar, panels. The classic work app.',['dash','saas','ai'],[[0,0,17,100,'side','Navigation'],[17,0,83,9,'nav','Top bar · search · account'],[19,12,79,22,'hero','Overview'],[19,37,38,60,'card','Panel'],[59,37,39,60,'table','List']],'Layout: fixed left sidebar (240px) with navigation, top bar with search and account menu, main area with an overview strip above two panels. Sidebar collapses into a drawer below 768px.'),
 SK('table','Sidebar + data table','Filters on top, one big table.',['dash','saas','directory'],[[0,0,17,100,'side','Navigation'],[17,0,83,9,'nav','Top bar'],[19,12,79,8,'input','Filters · sort · search'],[19,23,79,74,'table','Data table']],'Layout: sidebar navigation, a filter bar (search, filters, sort), and one full-width data table with a sticky header and row actions. The table scrolls inside its own box on mobile.'),
 SK('hero','Top nav + hero','Headline, one CTA, features below.',['landing','saas','portfolio','playful'],[NAV,[8,16,84,30,'hero','One clear headline that says what it does'],[34,50,32,8,'cta','Get started'],[8,64,26,32,'card','Benefit'],[37,64,26,32,'card','Benefit'],[66,64,26,32,'card','Benefit']],'Layout: top navigation, a hero with one headline, one sentence and one primary CTA, then a section of benefits. Not three identical icon cards: vary their size or use real screenshots.'),
 SK('bento','Bento grid','Mixed-size tiles, Apple-style.',['landing','portfolio','dash','saas'],[NAV,[4,13,44,45,'media','Big tile'],[50,13,22,21,'card','Tile'],[74,13,22,21,'card','Tile'],[50,37,46,21,'card','Wide tile'],[4,61,30,35,'card','Tile'],[36,61,60,35,'media','Wide visual']],'Layout: a bento grid of mixed-size tiles (one large, several small, one wide), each tile showing one idea with a real visual. Collapses to one column on mobile.'),
 SK('split','Split screen','Visual on one half, action on the other.',['booking','saas','landing'],[[0,0,50,100,'media','Visual'],[56,25,38,14,'hero','Welcome back'],[56,43,38,7,'input','Email'],[56,53,38,7,'input','Password'],[56,64,38,8,'cta','Continue']],'Layout: 50/50 split screen: a full-height visual on the left, a short focused form on the right. On mobile the visual becomes a short banner above the form.'),
 SK('gallery','Card grid gallery','Search bar, then an even grid of cards.',['directory','shop','portfolio','playful'],[NAV,[4,12,92,7,'input','Search + filter chips'],[4,23,20,33,'card','Item'],[28,23,20,33,'card','Item'],[52,23,20,33,'card','Item'],[76,23,20,33,'card','Item'],[4,60,20,36,'card','Item'],[28,60,20,36,'card','Item'],[52,60,20,36,'card','Item'],[76,60,20,36,'card','Item']],'Layout: search bar with filter chips, then a responsive card grid (4 columns desktop, 2 tablet, 1 phone). Every card is clickable and shows the same fields in the same places.'),
 SK('masonry','Masonry','Pinterest-style columns of uneven height.',['portfolio','editorial','social'],[NAV,[4,12,29,40,'media','Image'],[4,55,29,41,'media','Image'],[36,12,29,25,'media','Image'],[36,40,29,56,'media','Image'],[68,12,28,46,'media','Image'],[68,61,28,35,'media','Image']],'Layout: masonry grid of images with uneven heights in 3 columns (2 on tablet, 1 on phone); hover shows title and action.'),
 SK('feed','Feed + side rails','Centre column of posts, rails either side.',['social','editorial'],[[0,0,22,100,'side','Navigation'],[25,4,50,14,'input','Composer'],[25,21,50,36,'card','Post'],[25,60,50,37,'card','Post'],[78,4,20,40,'card','Trending'],[78,47,20,30,'card','Who to follow']],'Layout: three columns: left navigation, a centre feed (max 600px) with a composer on top, right rail for trends and suggestions. Rails hide on mobile and a bottom tab bar appears.'),
 SK('chat','Chat workspace','History on the left, conversation in the middle.',['ai'],[[0,0,20,100,'side','Chat history'],[22,3,76,9,'nav','Model · title'],[30,16,50,12,'card','Assistant'],[48,31,42,9,'chat','You'],[30,43,58,24,'card','Assistant'],[26,84,68,11,'input','Message…']],'Layout: chat workspace: collapsible history sidebar, header with model picker, centred conversation (max 760px), message box pinned to the bottom with attach and send.'),
 SK('wizard','Wizard / stepper','One question per screen with progress.',['booking','saas','playful'],[[0,0,100,9,'nav','Logo · Step 2 of 4'],[25,14,50,5,'nav','Progress'],[25,23,50,10,'hero','What do you need?'],[25,36,50,10,'input','Option A'],[25,49,50,10,'input','Option B'],[25,62,50,10,'input','Option C'],[55,80,20,8,'cta','Next']],'Layout: a stepper flow: progress indicator at top, one question per screen in a centred column (max 560px), large selectable options, Back and Next pinned at the bottom.'),
 SK('docs','Docs three-column','Section nav, article, on-this-page.',['docs'],[NAV,[0,9,18,91,'side','Sections'],[22,13,54,10,'hero','Page title'],[22,26,54,30,'text','Article'],[22,59,54,24,'media','Code block'],[80,13,18,40,'side','On this page']],'Layout: docs three-column: left section tree, centre article (max 720px), right on-this-page table of contents that tracks scroll. Search in the top nav opens with ⌘K.'),
 SK('kanban','Kanban board','Columns of cards you drag between.',['saas'],[NAV,[2,12,23,85,'side','To do'],[27,12,23,85,'side','Doing'],[52,12,23,85,'side','Review'],[77,12,21,85,'side','Done'],[4,20,19,16,'card','Card'],[4,39,19,16,'card','Card'],[29,20,19,22,'card','Card'],[54,20,19,16,'card','Card'],[79,20,17,16,'card','Card']],'Layout: kanban board: horizontally scrolling columns of draggable cards, a count on each column header, quick-add at the bottom of each column.'),
 SK('masterdetail','List + detail','Inbox style: list on the left, item on the right.',['saas','ai','social'],[[0,0,6,100,'side',''],[6,0,30,100,'table','List'],[38,4,58,10,'hero','Selected item'],[38,17,58,79,'text','Detail']],'Layout: master-detail: narrow icon rail, a scrollable list, and a detail pane for the selected item. On mobile the list and detail become two screens.'),
 SK('map','Map + results','Results list beside a map.',['directory','booking'],[[0,0,100,9,'nav','Search · dates · filters'],[0,9,34,91,'table','Results'],[34,9,66,91,'media','Map']],'Layout: search bar on top, results list on the left, interactive map on the right; hovering a result highlights its pin. On mobile, map and list toggle.'),
 SK('editor','Canvas editor','Toolbar, layers, canvas, inspector.',['saas','playful'],[[0,0,100,8,'nav','Toolbar'],[0,8,14,92,'side','Layers'],[16,12,64,84,'media','Canvas'],[82,8,18,92,'side','Inspector']],'Layout: editor: top toolbar, left layers panel, central canvas, right inspector for the selected object. Panels collapse to keep the canvas big.'),
 SK('story','Long-scroll story','Big statement, sticky visual, chapters.',['landing','editorial','portfolio'],[NAV,[10,14,80,26,'hero','A big statement in a few words'],[10,44,38,52,'media','Sticky visual'],[52,44,38,15,'text','Chapter 1'],[52,63,38,15,'text','Chapter 2'],[52,82,38,14,'text','Chapter 3']],'Layout: long-scroll story: a big opening statement, then chapters where a sticky visual on one side changes as the text scrolls past on the other.'),
 SK('product','Product detail','Gallery on the left, buy box on the right.',['shop'],[NAV,[4,13,50,83,'media','Gallery'],[58,13,38,10,'hero','Name · price'],[58,26,38,14,'text','Options'],[58,43,38,8,'cta','Add to cart'],[58,55,38,41,'text','Details · reviews']],'Layout: product page: image gallery left, sticky buy box right (name, price, options, Add to cart), details and reviews below. On mobile the Add to cart bar sticks to the bottom.'),
 SK('pricing','Pricing / compare','Three tiers, the middle one highlighted.',['landing','saas','shop'],[NAV,[20,13,60,12,'hero','Simple pricing'],[6,30,28,62,'card','Starter'],[36,28,28,66,'chat','Pro · most popular'],[66,30,28,62,'card','Team'],[40,82,20,7,'cta','Choose Pro']],'Layout: pricing page: three tiers side by side with the recommended one highlighted, a monthly/yearly toggle, and a feature comparison table below.'),
 SK('command','Command-first minimal','A search box is the whole interface.',['ai','docs','saas'],[[0,0,100,7,'nav',''],[30,28,40,10,'input','Search or ask anything'],[30,41,40,32,'table','Results']],'Layout: minimal command-first screen: a large centred search/command box, results appear beneath it, everything reachable from the keyboard.'),
 SK('profile','Personal showcase','Big intro, then a few projects.',['portfolio'],[NAV,[4,13,92,34,'hero','Name — what I make, in one line'],[4,51,44,45,'media','Project'],[52,51,44,45,'media','Project']],'Layout: personal showcase: big intro with name and one-line pitch, then large project tiles that open case studies, contact at the bottom.')
];
export const TYPES: TypePairing[] = [
 {id:'geist',name:'Geist + Geist Mono',desc:'Crisp, technical, modern product.',h:"'Geist',sans-serif",b:"'Geist',sans-serif",hn:'Geist',bn:'Geist',mono:'Geist Mono'},
 {id:'grotesk',name:'Space Grotesk + Inter',desc:'Techy headlines, neutral body.',h:"'Space Grotesk',sans-serif",b:"'Inter',sans-serif",hn:'Space Grotesk',bn:'Inter'},
 {id:'instrument',name:'Instrument Serif + Inter',desc:'Editorial elegance on a clean body.',h:"'Instrument Serif',serif",b:"'Inter',sans-serif",hn:'Instrument Serif',bn:'Inter'},
 {id:'fraunces',name:'Fraunces + DM Sans',desc:'Warm, soft serif with friendly body.',h:"'Fraunces',serif",b:"'DM Sans',sans-serif",hn:'Fraunces',bn:'DM Sans'},
 {id:'playfair',name:'Playfair Display + Manrope',desc:'High-contrast luxury serif.',h:"'Playfair Display',serif",b:"'Manrope',sans-serif",hn:'Playfair Display',bn:'Manrope'},
 {id:'plex',name:'IBM Plex Mono + Plex Sans',desc:'Engineered, data-heavy, honest.',h:"'IBM Plex Mono',monospace",b:"'IBM Plex Sans',sans-serif",hn:'IBM Plex Mono',bn:'IBM Plex Sans'},
 {id:'bricolage',name:'Bricolage Grotesque + DM Sans',desc:'Characterful, a little quirky.',h:"'Bricolage Grotesque',sans-serif",b:"'DM Sans',sans-serif",hn:'Bricolage Grotesque',bn:'DM Sans'},
 {id:'sora',name:'Sora + Inter',desc:'Geometric, futuristic, clean.',h:"'Sora',sans-serif",b:"'Inter',sans-serif",hn:'Sora',bn:'Inter'},
 {id:'outfit',name:'Outfit',desc:'Round and friendly, one family.',h:"'Outfit',sans-serif",b:"'Outfit',sans-serif",hn:'Outfit',bn:'Outfit'},
 {id:'jetbrains',name:'JetBrains Mono + Inter',desc:'Developer tool, terminal energy.',h:"'JetBrains Mono',monospace",b:"'Inter',sans-serif",hn:'JetBrains Mono',bn:'Inter'},
 {id:'pixel',name:'Silkscreen + Space Mono',desc:'Retro pixel game.',h:"'Silkscreen',monospace",b:"'Space Mono',monospace",hn:'Silkscreen',bn:'Space Mono'}
];
export const MOODS: Mood[] = [
 {id:'clean',name:'Clean product',desc:'Crisp light UI, hairline borders, calm.',fit:['saas','dash','docs','directory'],bg:'#F7F8FA',surf:'#FFFFFF',ink:'#111827',muted:'#6B7280',line:'#E5E7EB',acc:'#2F6BFF',type:'geist',r:8,sh:'0 1px 2px rgba(17,24,39,.06)'},
 {id:'glass',name:'Glass / Apple-like',desc:'Frosted panels over soft colour.',fit:['landing','ai','portfolio'],bg:'#DDE6F3',surf:'#FFFFFF',ink:'#0B1220',muted:'#475569',line:'rgba(255,255,255,.75)',acc:'#0A84FF',type:'sora',r:18,sh:'0 8px 30px rgba(15,23,42,.12)'},
 {id:'editorial',name:'Editorial',desc:'Serif headlines, paper white, thin rules.',fit:['editorial','portfolio','docs'],bg:'#FBFAF7',surf:'#FFFFFF',ink:'#1A1A1A',muted:'#5F5B54',line:'#E4E0D8',acc:'#C2410C',type:'instrument',r:2,sh:'none'},
 {id:'swiss',name:'Swiss minimal',desc:'Strict grid, black and white, one accent.',fit:['portfolio','landing','directory'],bg:'#FFFFFF',surf:'#FFFFFF',ink:'#000000',muted:'#555555',line:'#111111',acc:'#FF3B00',type:'grotesk',r:0,sh:'none'},
 {id:'terminal',name:'Dense terminal',desc:'Dark, mono, compact, information-first.',fit:['dash','ai','docs'],bg:'#0B0D0E',surf:'#121517',ink:'#D6F5DD',muted:'#7C8A80',line:'#1F2A24',acc:'#3DDC84',type:'jetbrains',r:4,sh:'none'},
 {id:'luxe',name:'Dark luxe',desc:'Near-black with a warm metallic accent.',fit:['shop','landing','portfolio'],bg:'#0E0D0C',surf:'#181614',ink:'#F3EEE6',muted:'#A39C91',line:'#2A2622',acc:'#C9A86A',type:'playfair',r:6,sh:'0 10px 30px rgba(0,0,0,.4)'},
 {id:'brutal',name:'Neo-brutalist',desc:'Thick borders, hard offset shadows, loud.',fit:['playful','landing','directory'],bg:'#FFF7D6',surf:'#FFFFFF',ink:'#000000',muted:'#222222',line:'#000000',acc:'#FF5A1F',type:'grotesk',r:0,sh:'4px 4px 0 #000'},
 {id:'playful',name:'Soft playful',desc:'Pastels, big radius, bouncy.',fit:['playful','booking','social'],bg:'#FFF1F6',surf:'#FFFFFF',ink:'#2B1B3D',muted:'#6E5A80',line:'#F3D6E4',acc:'#E2408F',type:'outfit',r:22,sh:'0 6px 0 rgba(43,27,61,.08)'},
 {id:'organic',name:'Warm organic',desc:'Earthy, soft, human.',fit:['shop','booking','editorial'],bg:'#F3EFE7',surf:'#FBF8F2',ink:'#2E2A24',muted:'#6E665A',line:'#DED6C8',acc:'#5F7F4E',type:'fraunces',r:14,sh:'0 2px 10px rgba(46,42,36,.08)'},
 {id:'pixel',name:'Retro pixel',desc:'Chunky pixels, arcade colours.',fit:['playful'],bg:'#1D1B2E',surf:'#2A2742',ink:'#FFF5D6',muted:'#B8B0D9',line:'#4A4570',acc:'#FFCC33',type:'pixel',r:0,sh:'4px 4px 0 #0E0C1A'},
 {id:'clay',name:'Clay / soft 3D',desc:'Pillowy, tactile, soft shadows.',fit:['playful','ai','landing'],bg:'#E9EEF6',surf:'#F3F6FB',ink:'#22304A',muted:'#66738C',line:'#DCE3EE',acc:'#5B7CFA',type:'bricolage',r:20,sh:'6px 6px 14px #C9D2E0, -6px -6px 14px #FFFFFF'},
 {id:'datadark',name:'Data dark',desc:'Deep navy with neon data accents.',fit:['dash','ai','saas'],bg:'#0A0F1E',surf:'#111830',ink:'#E6ECFF',muted:'#8A96B8',line:'#1E2846',acc:'#22D3EE',type:'sora',r:10,sh:'0 0 0 1px #1E2846'}
];
export const PALETTES: Palette[] = [
 {id:'blue',name:'Electric blue',hex:'#2F6BFF',desc:'Trustworthy, product-y.'},
 {id:'orange',name:'Signal orange',hex:'#FF5A1F',desc:'Energetic, gets attention.'},
 {id:'green',name:'Emerald',hex:'#0E9F6E',desc:'Growth, money, success.'},
 {id:'red',name:'Crimson',hex:'#E5484D',desc:'Bold, urgent, passionate.'},
 {id:'violet',name:'Violet',hex:'#7C5CFF',desc:'Creative, a little magic.'},
 {id:'lime',name:'Acid lime',hex:'#A3E635',desc:'Loud, youthful, techy on dark.'},
 {id:'amber',name:'Amber',hex:'#F5A524',desc:'Warm, optimistic.'},
 {id:'teal',name:'Teal',hex:'#0EA5A4',desc:'Calm, clinical, fresh.'},
 {id:'pink',name:'Hot pink',hex:'#EC4899',desc:'Playful, fashion, pop.'},
 {id:'gold',name:'Muted gold',hex:'#C9A86A',desc:'Premium, quiet luxury.'},
 {id:'mono',name:'Ink only',hex:'#111111',desc:'No colour: type and space do the work.'}
];
export const RADII: Radius[] = [
 {id:'r0',name:'Sharp · 0px',px:0,desc:'Editorial, Swiss, brutalist.'},
 {id:'r4',name:'Subtle · 4px',px:4,desc:'Serious tools, dense UIs.'},
 {id:'r8',name:'Standard · 8px',px:8,desc:'The safe modern default.'},
 {id:'r14',name:'Soft · 14px',px:14,desc:'Friendly, consumer apps.'},
 {id:'r22',name:'Round · 22px',px:22,desc:'Playful, Apple-ish cards.'},
 {id:'rpill',name:'Pill buttons · 20px cards',px:20,pill:true,desc:'Capsule buttons and chips.'}
];
export const DENS: Density[] = [
 {id:'compact',name:'Compact',d:0.7,gap:5,desc:'More on screen. Dashboards, tables, pro tools.'},
 {id:'comfy',name:'Comfortable',d:1,gap:9,desc:'Balanced default for most apps.'},
 {id:'airy',name:'Airy',d:1.4,gap:14,desc:'Lots of whitespace. Landing pages, portfolios.'}
];
function D(id: string, name: string, desc: string, demo: string, prompt: string, o?: Partial<Item>): DemoItem {return {id:id,name:name,desc:desc,demo:demo,prompt:prompt,...o};}
export const BUTTONS: DemoItem[] = [
 D('solid','Solid','Filled with the accent. The default primary.','b-solid','Primary buttons: solid accent fill, accent-foreground text, token radius, slight brighten on hover, scale 0.97 on press.',{label:'Get started'}),
 D('tonal','Tonal / soft','Tinted background, accent text.','b-tonal','Secondary buttons: tonal style (accent at ~15% opacity background, accent text), no border.',{label:'Save draft'}),
 D('outline','Outline','Border only. Good for secondary actions.','b-outline','Secondary buttons: 1.5px accent outline, transparent fill, faint tint on hover.',{label:'Learn more'}),
 D('ghost','Ghost / text','No box until hover. Toolbars, tertiary.','b-ghost','Tertiary buttons: ghost style, accent text, tinted background only on hover.',{label:'Cancel'}),
 D('pill','Pill','Fully rounded capsule.','b-pill','Buttons are pill-shaped (fully rounded), solid accent fill.',{label:'Join waitlist',fit:['landing','playful','social']}),
 D('glass','Glass','Frosted translucent button over colour.','b-glass','Buttons over imagery use a glass style: white at ~28% opacity, 1px white/60% border, backdrop-filter blur(10px), pill shape.',{label:'Watch film',fit:['landing','portfolio','ai']}),
 D('brutal','Neo-brutal','Thick border and a hard offset shadow.','b-brutal','Buttons are neo-brutalist: 2px ink border, 4px 4px 0 ink shadow, no radius; on press translate(3px,3px) and shrink the shadow.',{label:'Play now',fit:['playful','landing']}),
 D('lift','Hover lift','Rises with a coloured shadow on hover.','b-lift','Primary buttons lift on hover: translateY(-2px) and an accent-tinted shadow, 200ms ease-out.',{label:'Start free trial'}),
 D('shimmer','Shimmer / shine','A light sweep runs across it.','b-shimmer','Hero CTA has a shine sweep: a diagonal light gradient animates across it every ~2.5s (respect prefers-reduced-motion).',{label:'Claim offer',lib:'Magic UI',fit:['landing','shop']}),
 D('magnetic','Magnetic','Leans toward the cursor.','b-magnetic','Hero CTA is magnetic: it drifts up to 8px toward the cursor when it is near, springs back on leave (Motion).',{label:'Say hello',lib:'Motion',fit:['portfolio','landing']})
];
export const CARDS: DemoItem[] = [
 D('border','Bordered flat','1px border, no shadow. Calm and dense.','c-border','Cards: surface background, 1px border token, no shadow, token radius.',{fit:['saas','dash','docs','directory']}),
 D('shadow','Soft elevated','Floats on a soft shadow.','c-shadow','Cards: no border, soft elevation shadow (0 8px 24px at ~12%), lift 3px on hover.'),
 D('glass','Glass panel','Frosted, see-through.','c-glass','Cards are glass panels: surface at ~55% opacity, backdrop-filter blur(12px), 1px white/65% border. Only over a colourful background.',{fit:['landing','ai','portfolio']}),
 D('bento','Bento tiles','Mixed sizes in one grid.','c-bento','Cards are bento tiles: one CSS grid with mixed spans, larger radius than buttons, each tile one idea with a real visual.',{fit:['landing','portfolio','dash']}),
 D('spotlight','Spotlight','A glow follows the cursor.','c-spotlight','Cards have a spotlight hover: a radial accent glow follows the pointer inside the card on dark backgrounds.',{lib:'Aceternity',fit:['landing','ai']}),
 D('tilt','3D tilt','Tilts toward the pointer.','c-tilt','Feature cards tilt in 3D toward the pointer (max 8deg), with a subtle glare.',{lib:'Motion',fit:['portfolio','playful','shop']}),
 D('brutal','Brutal block','Thick border + offset shadow.','c-brutal','Cards: 2px ink border, 5px 5px 0 ink shadow, no radius; hover nudges up-left.',{fit:['playful','directory']}),
 D('media','Media card','Image on top, text below.','c-media','Cards: image on top (16:9, object-cover), title and meta below, whole card is the link.',{fit:['shop','editorial','directory','portfolio']}),
 D('beam','Border beam','A light travels round the edge.','c-beam','The one featured card has an animated border beam: a short accent light that travels around its edge.',{lib:'Magic UI',fit:['landing','saas']})
];
export const NAVS: DemoItem[] = [
 D('top','Top bar','Logo left, links, action right. Sticky.','n-top','Navigation: sticky top bar, logo left, 3–5 links centre, primary action right; collapses to a menu button on mobile.',{fit:['landing','shop','editorial','portfolio']}),
 D('float','Floating pill nav','A capsule floating over the page.','n-float','Navigation: a floating pill-shaped bar centred near the top with blur behind it; it shrinks slightly on scroll.',{fit:['landing','portfolio','ai']}),
 D('sidebar','Collapsible sidebar','Full labels that fold to icons.','n-sidebar','Navigation: left sidebar (240px) with grouped links that collapses to a 64px icon rail; state remembered.',{fit:['saas','dash','docs']}),
 D('rail','Icon rail','Narrow strip of icons.','n-rail','Navigation: 56px icon rail with tooltips and an active indicator; Lucide icons.',{fit:['saas','ai']}),
 D('tabbar','Bottom tab bar','Mobile-first, 4–5 tabs.','n-tabbar','Mobile navigation: bottom tab bar with 4–5 Lucide icons and labels, active tab in accent, safe-area padding.',{fit:['social','playful','booking']}),
 D('tabs','Sliding tabs','Underline glides to the active tab.','n-tabs','Section tabs with an underline indicator that slides to the active tab (Motion layoutId).',{label:'Overview Activity Settings',fit:['saas','dash']}),
 D('crumb','Breadcrumbs','Where am I, how do I go up.','n-crumb','Breadcrumbs above the page title for any page deeper than 2 levels.',{label:'Home / Projects / Alpha',fit:['docs','saas','shop']}),
 D('mega','Mega menu','Big dropdown panel of links.','n-mega','Top nav with a mega menu: hovering a section opens a wide panel of grouped links with short descriptions.',{fit:['shop','landing']}),
 D('dock','Dock','macOS-style icons that magnify.','n-dock','A bottom dock of app icons that magnify on hover (Motion springs).',{lib:'Magic UI',fit:['portfolio','playful']})
];
export const INPUTS: DemoItem[] = [
 D('outline','Outlined field','Bordered box, accent ring on focus.','i-outline','Text inputs: outlined, 1.5px border, accent focus ring (3px at 20%), label above.',{label:'you@email.com'}),
 D('filled','Filled field','Tinted fill, underline accent.','i-filled','Text inputs: filled style, tinted background, 2px bottom border that turns accent on focus.',{label:'Full name'}),
 D('underline','Underline only','Minimal, editorial.','i-underline','Text inputs: underline only; the accent line grows from left on focus.',{label:'Your answer',fit:['editorial','portfolio']}),
 D('float','Floating label','Label shrinks into the border.','i-float','Text inputs use floating labels that move into the border on focus or when filled.',{label:'Card number',label2:'Email',fit:['booking','shop']}),
 D('search','Search with ⌘K hint','Search field showing the shortcut.','i-search','Search input with a magnifier icon and a ⌘K hint badge; ⌘K focuses it from anywhere.',{label:'Search…',label2:'⌘K',fit:['docs','saas','directory']}),
 D('seg','Segmented control','Pick one of 2–4 options.','i-seg','Use a segmented control (sliding thumb) for 2–4 mutually exclusive options instead of a dropdown.',{label:'Day Week Month',fit:['dash','booking']}),
 D('toggle','Switch','On/off with a sliding knob.','i-toggle','Boolean settings use switches with a spring knob, never checkboxes for instant settings.'),
 D('otp','OTP code input','Separate boxes for a code.','i-otp','One-time codes use a segmented OTP input (input-otp) with auto-advance and paste support.',{label:'4',label2:'2',label3:'',lib:'input-otp',fit:['booking','saas']})
];
export const DATA: DemoItem[] = [
 D('table','Data table','Sticky header, zebra rows, sort.','dd-table','Data tables: sticky header, sortable columns, zebra rows, row hover, right-aligned numbers with tabular figures (TanStack Table).',{lib:'TanStack Table',fit:['dash','saas','directory']}),
 D('stat','Stat tile + sparkline','A big number with its trend.','dd-stat','Key metrics: one large number, change % in accent, and a sparkline. Do not repeat the same stat elsewhere.',{label:'12,480',fit:['dash','saas']}),
 D('line','Area chart','Trend over time.','dd-line','Trends: area chart with a soft accent fill, one series highlighted, tooltips on hover (Recharts).',{lib:'Recharts',fit:['dash']}),
 D('bar','Bar chart','Compare a few categories.','dd-bar','Comparisons: bar chart, bars in accent, others muted, values labelled at the bar ends.',{lib:'Recharts',fit:['dash']}),
 D('time','Timeline / activity','What happened, in order.','dd-time','Activity: vertical timeline with dot markers, newest first, relative times ("2h ago").',{fit:['saas','social','dash']}),
 D('avatars','Avatar stack','Who is here or involved.','dd-avatars','People: overlapping avatar stack with a +N count; hover shows names.',{fit:['saas','social']}),
 D('badges','Status pills','Live, draft, error at a glance.','dd-badges','Statuses use small pill badges with distinct lightness, not colour alone (Live / Draft / Error).',{label:'Live',label2:'Draft',label3:'Error'}),
 D('ring','Progress ring','Percent complete in a circle.','dd-ring','Completion: progress ring with the percentage in the centre.',{fit:['playful','booking','dash']}),
 D('heat','Heatmap / calendar','Activity across days.','dd-heat','Activity over time: GitHub-style calendar heatmap with an accent ramp.',{fit:['dash','social','playful']})
];
export const FEED: DemoItem[] = [
 D('toast','Toasts','Stacking notifications that slide in.','f-toast','Notifications: Sonner toasts, bottom-right, stacked and expandable on hover, auto-dismiss after 4s.',{label:'Saved',label2:'Copied',lib:'Sonner'}),
 D('skel','Skeleton loading','Grey shapes shimmer while loading.','f-skel','Loading states: skeletons shaped like the real content with a shimmer, never a lone spinner.'),
 D('progress','Progress bar','Shows how far along.','f-progress','Long tasks show a determinate progress bar; uploads show percent.'),
 D('empty','Empty state','What to do when there is nothing yet.','f-empty','Every list has an empty state: a short line saying what goes here plus one action button.',{label:'Nothing here yet'}),
 D('valid','Inline validation','Errors right under the field.','f-valid','Forms validate inline on blur: red border, short message under the field, gentle shake on submit error.',{label2:'Required'}),
 D('modal','Modal dialog','Focused popup with a dimmed page.','f-modal','Confirmations use a modal dialog (Radix Dialog): dimmed backdrop, scale-in, focus trapped, Esc closes.',{lib:'Radix'}),
 D('sheet','Side sheet','Panel slides in from the right.','f-sheet','Details and edit forms open in a side sheet from the right (shadcn Sheet).',{lib:'shadcn',fit:['saas','dash','directory']}),
 D('drawer','Bottom drawer','Drag up from the bottom on mobile.','f-drawer','On mobile, menus and filters open in a draggable bottom drawer (Vaul) with a handle; flick down to close.',{lib:'Vaul',fit:['shop','social','booking','playful']}),
 D('pop','Popover menu','Small menu next to a button.','f-pop','Row and card actions live in a "⋯" popover menu instead of a row of buttons.',{label:'Actions'}),
 D('tip','Tooltip','Short hint on hover.','f-tip','Icon-only buttons get tooltips after a 300ms delay.',{label:'Share',label2:'Copy link'}),
 D('cmdk','⌘K command palette','Search and run any action.','f-cmdk','Add a ⌘K command palette (cmdk): search pages and actions, keyboard navigation, recent items.',{lib:'cmdk',fit:['saas','docs','ai','dash']})
];
export const FX: DemoItem[] = [
 D('lift','Hover lift','Cards rise on hover.','e-lift','Interactive cards lift 4–6px with a deeper shadow on hover, 200ms ease-out.'),
 D('spring','Spring press','Bouncy, physical motion.','e-spring','UI motion uses springs (Motion: stiffness ~400, damping ~30): buttons scale to 0.97 on press and spring back.',{lib:'Motion',fit:['playful','social']}),
 D('reveal','Scroll reveal','Sections fade up as they enter.','e-reveal','Sections fade up 12px as they enter the viewport, once, 500ms, staggered 80ms (Motion whileInView).',{lib:'Motion',fit:['landing','portfolio','editorial']}),
 D('stagger','Staggered list','Items arrive one after another.','e-stagger','Lists animate in with a 40ms stagger on first load only.',{lib:'Motion'}),
 D('ticker','Number ticker','Numbers roll to their value.','e-ticker','Changing numbers animate digit by digit (NumberFlow) with tabular figures.',{lib:'NumberFlow',fit:['dash','shop','landing']}),
 D('split','Text reveal','Headline wipes or splits in.','e-split','The hero headline reveals word by word (GSAP SplitText or Motion), once on load.',{label:'Build faster',lib:'GSAP',fit:['landing','portfolio']}),
 D('marquee','Logo marquee','Endless scrolling strip.','e-marquee','A logo/testimonial marquee scrolls slowly and pauses on hover; masks fade the edges.',{label:'NOVA · ORBIT · KITE · LUMEN · ATLAS',lib:'Magic UI',fit:['landing','saas']}),
 D('pblur','Progressive blur','Content blurs under a header or edge.','e-pblur','Use progressive blur where content scrolls under the sticky header or fades at a list edge (backdrop-filter with a gradient mask).',{fit:['ai','landing','portfolio']}),
 D('glass','Glassmorphism','Frosted panels over colour.','e-glass','Floating panels use glassmorphism: translucent surface, backdrop blur 12–16px, thin light border; keep text contrast 4.5:1.',{fit:['landing','ai']}),
 D('spot','Spotlight cursor','A glow follows the pointer.','e-spot','The hero has a cursor-following spotlight glow on a dark background.',{label2:'Spotlight',lib:'Aceternity',heavy:true,fit:['landing','ai']}),
 D('aurora','Aurora background','Slow blurred colour blobs.','e-aurora','The hero background is a slow aurora: 2–3 blurred accent blobs drifting (CSS only, paused for reduced motion).',{lib:'Aceternity',heavy:true,fit:['landing','ai','portfolio']}),
 D('dots','Dot grid background','Subtle pattern behind content.','e-dots','Section backgrounds use a faint dot grid pattern that fades out toward the edges.',{lib:'Magic UI',fit:['saas','landing','docs']}),
 D('grain','Grain texture','Film grain for warmth.','e-grain','Add a subtle grain/noise overlay (~6% opacity) to large colour areas for a tactile feel.',{fit:['editorial','portfolio','shop']}),
 D('para','Parallax layers','Layers move at different speeds.','e-para','Hero visual uses 3 parallax layers moving at different speeds on scroll (Motion useScroll).',{lib:'Motion',heavy:true,fit:['landing','portfolio']}),
 D('sticky','Sticky scroll story','Visual pins while text scrolls.','e-sticky','Scrollytelling: a visual pins on one side and changes per chapter as text scrolls (GSAP ScrollTrigger).',{lib:'GSAP',heavy:true,fit:['landing','editorial']}),
 D('tilted','Tilted 3D screenshot','Your app shown at an angle.','e-tilted','Show the product as a tilted 3D screenshot (rotateX ~20deg) that straightens as you scroll.',{heavy:true,fit:['landing','saas']}),
 D('tilt3d','3D tilt hover','Cards tilt toward the cursor.','e-tilt3d','Feature cards tilt toward the pointer in 3D (max 8deg) with a glare highlight.',{lib:'Motion',fit:['portfolio','playful','shop']}),
 D('layout','Shared layout animation','Things morph to their new place.','e-layout','When items reorder, expand or change size, animate the layout (Motion layout / layoutId) instead of jumping.',{lib:'Motion',fit:['saas','dash']}),
 D('ptrans','Page transitions','Pages cross-fade and slide.','e-ptrans','Route changes use the View Transitions API: a quick 200ms cross-fade with a slight slide.',{fit:['portfolio','shop','editorial']}),
 D('cursor','Custom cursor','A ring that trails the pointer.','e-cursor','Desktop only: a custom cursor ring that trails the pointer and grows over links.',{heavy:true,fit:['portfolio']}),
 D('shine','Shine sweep','A light passes over a surface.','e-shine','The featured card has a slow diagonal shine sweep every few seconds.',{lib:'Magic UI',fit:['shop','landing']}),
 D('confetti','Confetti burst','Celebrate a win.','e-confetti','On success (goal reached, purchase), fire a short confetti burst (canvas-confetti).',{lib:'canvas-confetti',heavy:true,fit:['playful','booking']}),
 D('type','Typewriter text','Text types itself out.','e-type','The hero subline types itself out once with a blinking caret.',{label:'Ask me anything…',fit:['ai','portfolio']}),
 D('scrollbar','Scroll progress bar','Thin bar shows reading progress.','e-scrollbar','Long articles show a thin accent reading-progress bar at the top.',{fit:['editorial','docs']})
];
export const STEPS: Step[] = [
 {id:'purpose',name:'Purpose',layer:'Role',title:'What is this site for?',hint:'Pick the job. Every later layer sorts itself around this choice.',analogy:'Character: main hero, support, or comic relief? The role decides the body type.',items:PURPOSES,kind:'single',view:'purpose'},
 {id:'skeleton',name:'Skeleton',layer:'Body',title:'Pick the skeleton (layout)',hint:'The structure of the main screen. The ones that fit your purpose are shown first.',analogy:'Character: body type and proportions. Silhouette before details.',items:SKELS,kind:'single',view:'skel',fitted:true},
 {id:'mood',name:'Mood',layer:'Look',title:'Pick the overall mood',hint:'Sets colours, type and shape in one go. You can override each in the next layers.',analogy:'Character: art style. Same body, very different feel.',items:MOODS,kind:'single',view:'mood',fitted:true},
 {id:'palette',name:'Accent colour',layer:'Look',title:'Pick one accent colour',hint:'One strong colour, used for the primary action and key highlights. Skip to keep the mood default.',analogy:'Character: eye and signature colour.',items:PALETTES,kind:'single',view:'swatch'},
 {id:'type',name:'Typography',layer:'Look',title:'Pick a font pairing',hint:'Heading font + body font. Skip to keep the mood default.',analogy:'Character: face and hair. Gives the personality.',items:TYPES,kind:'single',view:'type'},
 {id:'radius',name:'Corner radius',layer:'Look',title:'How round are the corners?',hint:'Radius carries a lot of personality. Sharp feels serious; round feels friendly.',analogy:'Character: sharp or soft features.',items:RADII,kind:'single',view:'radius'},
 {id:'density',name:'Density',layer:'Look',title:'How tight is the spacing?',hint:'Compact fits more on screen; airy feels premium.',analogy:'Character: stance. Compact and ready, or relaxed.',items:DENS,kind:'single',view:'density'},
 {id:'buttons',name:'Buttons',layer:'Outfit',title:'Primary button style',hint:'The most-clicked thing on the site. Hover and press them.',analogy:'Character: shoes. Small, but everyone notices.',items:BUTTONS,kind:'single',view:'demo',fitted:true},
 {id:'cards',name:'Cards',layer:'Outfit',title:'Card style',hint:'How grouped content sits on the page.',analogy:'Character: the main outfit.',items:CARDS,kind:'single',view:'demo',fitted:true},
 {id:'nav',name:'Navigation',layer:'Outfit',title:'Navigation pattern',hint:'How people move around.',analogy:'Character: belt and straps. Holds everything together.',items:NAVS,kind:'single',view:'demo',fitted:true},
 {id:'inputs',name:'Inputs',layer:'Outfit',title:'Form controls (pick any)',hint:'Pick every control your app needs. Multi-select.',analogy:'Character: gloves. What you touch the world with.',items:INPUTS,kind:'multi',view:'demo',fitted:true},
 {id:'data',name:'Data display',layer:'Gear',title:'How data is shown (pick any)',hint:'Tables, numbers, charts. Multi-select.',analogy:'Character: tools and inventory.',items:DATA,kind:'multi',view:'demo',fitted:true},
 {id:'feedback',name:'Feedback & overlays',layer:'Gear',title:'Feedback and overlays (pick any)',hint:'Toasts, loading, dialogs, drawers. The details that make a product feel finished.',analogy:'Character: reactions and expressions.',items:FEED,kind:'multi',view:'demo',fitted:true},
 {id:'fx',name:'Motion & effects',layer:'Signature',title:'Signature moves (pick any)',hint:'Effects marked Signature are showstoppers. Use one per page.',analogy:'Character: the signature weapon or move. One that people remember.',items:FX,kind:'multi',view:'demo',fitted:true},
 {id:'export',name:'Export',layer:'Done',title:'Export',hint:'',analogy:'',items:[],kind:'export',view:'export'}
];
