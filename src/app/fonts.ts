import {
  Archivo,
  Archivo_Black,
  Atkinson_Hyperlegible,
  Baloo_2,
  Bebas_Neue,
  Bricolage_Grotesque,
  Cormorant_Garamond,
  Crimson_Pro,
  DM_Sans,
  DM_Serif_Display,
  EB_Garamond,
  Figtree,
  Fraunces,
  Geist,
  Geist_Mono,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Lato,
  Lexend,
  Libre_Baskerville,
  Lora,
  Manrope,
  Merriweather,
  Mulish,
  Newsreader,
  Nunito,
  Nunito_Sans,
  Oswald,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Quicksand,
  Red_Hat_Display,
  Red_Hat_Text,
  Righteous,
  Rubik,
  Silkscreen,
  Sora,
  Source_Sans_3,
  Space_Grotesk,
  Space_Mono,
  Syne,
  Unbounded,
  Urbanist,
  VT323,
  Work_Sans,
  Young_Serif,
  Zilla_Slab,
} from "next/font/google";

// App chrome fonts: preloaded.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--ff-space-grotesk" });
const inter = Inter({ subsets: ["latin"], variable: "--ff-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--ff-jetbrains-mono" });

// User type-pairing fonts: only needed once a demo uses them, so not preloaded.
const geist = Geist({ subsets: ["latin"], preload: false, variable: "--ff-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], preload: false, variable: "--ff-geist-mono" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-instrument-serif" });
const fraunces = Fraunces({ subsets: ["latin"], preload: false, axes: ["opsz"], variable: "--ff-fraunces" });
const dmSans = DM_Sans({ subsets: ["latin"], preload: false, variable: "--ff-dm-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], preload: false, variable: "--ff-playfair-display" });
const manrope = Manrope({ subsets: ["latin"], preload: false, variable: "--ff-manrope" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], preload: false, weight: ["400", "600"], variable: "--ff-ibm-plex-mono" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], preload: false, variable: "--ff-ibm-plex-sans" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], preload: false, variable: "--ff-bricolage-grotesque" });
const sora = Sora({ subsets: ["latin"], preload: false, variable: "--ff-sora" });
const outfit = Outfit({ subsets: ["latin"], preload: false, variable: "--ff-outfit" });
const silkscreen = Silkscreen({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-silkscreen" });
const spaceMono = Space_Mono({ subsets: ["latin"], preload: false, weight: ["400", "700"], variable: "--ff-space-mono" });

// Catalog v2 type pairings. Not preloaded: the browser fetches a family's file only when
// text in that family is drawn, and off-screen cards are not drawn (content-visibility),
// so each family loads when a Typography card or the preview first needs it.
const v2interTight = Inter_Tight({ subsets: ["latin"], preload: false, variable: "--ff-inter-tight" });
const v2plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], preload: false, variable: "--ff-plus-jakarta-sans" });
const v2dmSerifDisplay = DM_Serif_Display({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-dm-serif-display" });
const v2cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], preload: false, variable: "--ff-cormorant-garamond" });
const v2libreBaskerville = Libre_Baskerville({ subsets: ["latin"], preload: false, variable: "--ff-libre-baskerville" });
const v2sourceSansThree = Source_Sans_3({ subsets: ["latin"], preload: false, variable: "--ff-source-sans-3" });
const v2ebGaramond = EB_Garamond({ subsets: ["latin"], preload: false, variable: "--ff-eb-garamond" });
const v2lora = Lora({ subsets: ["latin"], preload: false, variable: "--ff-lora" });
const v2nunitoSans = Nunito_Sans({ subsets: ["latin"], preload: false, variable: "--ff-nunito-sans" });
const v2merriweather = Merriweather({ subsets: ["latin"], preload: false, variable: "--ff-merriweather" });
const v2newsreader = Newsreader({ subsets: ["latin"], preload: false, variable: "--ff-newsreader" });
const v2youngSerif = Young_Serif({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-young-serif" });
const v2ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], preload: false, weight: ["400", "600", "700"], variable: "--ff-ibm-plex-serif" });
const v2syne = Syne({ subsets: ["latin"], preload: false, variable: "--ff-syne" });
const v2archivoBlack = Archivo_Black({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-archivo-black" });
const v2archivo = Archivo({ subsets: ["latin"], preload: false, variable: "--ff-archivo" });
const v2unbounded = Unbounded({ subsets: ["latin"], preload: false, variable: "--ff-unbounded" });
const v2bebasNeue = Bebas_Neue({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-bebas-neue" });
const v2oswald = Oswald({ subsets: ["latin"], preload: false, variable: "--ff-oswald" });
const v2lato = Lato({ subsets: ["latin"], preload: false, weight: ["400", "700"], variable: "--ff-lato" });
const v2hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], preload: false, variable: "--ff-hanken-grotesk" });
const v2urbanist = Urbanist({ subsets: ["latin"], preload: false, variable: "--ff-urbanist" });
const v2figtree = Figtree({ subsets: ["latin"], preload: false, variable: "--ff-figtree" });
const v2redHatDisplay = Red_Hat_Display({ subsets: ["latin"], preload: false, variable: "--ff-red-hat-display" });
const v2redHatText = Red_Hat_Text({ subsets: ["latin"], preload: false, variable: "--ff-red-hat-text" });
const v2lexend = Lexend({ subsets: ["latin"], preload: false, variable: "--ff-lexend" });
const v2atkinsonHyperlegible = Atkinson_Hyperlegible({ subsets: ["latin"], preload: false, weight: ["400", "700"], variable: "--ff-atkinson-hyperlegible" });
const v2nunito = Nunito({ subsets: ["latin"], preload: false, variable: "--ff-nunito" });
const v2quicksand = Quicksand({ subsets: ["latin"], preload: false, variable: "--ff-quicksand" });
const v2balooTwo = Baloo_2({ subsets: ["latin"], preload: false, variable: "--ff-baloo-2" });
const v2righteous = Righteous({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-righteous" });
const v2poppins = Poppins({ subsets: ["latin"], preload: false, weight: ["400", "600", "700"], variable: "--ff-poppins" });
const v2zillaSlab = Zilla_Slab({ subsets: ["latin"], preload: false, weight: ["400", "600", "700"], variable: "--ff-zilla-slab" });
const v2vtthreetwothree = VT323({ subsets: ["latin"], preload: false, weight: "400", variable: "--ff-vt323" });
const v2instrumentSans = Instrument_Sans({ subsets: ["latin"], preload: false, variable: "--ff-instrument-sans" });
const v2workSans = Work_Sans({ subsets: ["latin"], preload: false, variable: "--ff-work-sans" });
const v2crimsonPro = Crimson_Pro({ subsets: ["latin"], preload: false, variable: "--ff-crimson-pro" });
const v2rubik = Rubik({ subsets: ["latin"], preload: false, variable: "--ff-rubik" });
const v2mulish = Mulish({ subsets: ["latin"], preload: false, variable: "--ff-mulish" });

/** Every font's CSS variable class, applied once on <html>. */
export const fontVariables = [
  spaceGrotesk, inter, jetbrainsMono,
  geist, geistMono, instrumentSerif, fraunces, dmSans, playfair, manrope,
  plexMono, plexSans, bricolage, sora, outfit, silkscreen, spaceMono,
  v2interTight,
  v2plusJakartaSans,
  v2dmSerifDisplay,
  v2cormorantGaramond,
  v2libreBaskerville,
  v2sourceSansThree,
  v2ebGaramond,
  v2lora,
  v2nunitoSans,
  v2merriweather,
  v2newsreader,
  v2youngSerif,
  v2ibmPlexSerif,
  v2syne,
  v2archivoBlack,
  v2archivo,
  v2unbounded,
  v2bebasNeue,
  v2oswald,
  v2lato,
  v2hankenGrotesk,
  v2urbanist,
  v2figtree,
  v2redHatDisplay,
  v2redHatText,
  v2lexend,
  v2atkinsonHyperlegible,
  v2nunito,
  v2quicksand,
  v2balooTwo,
  v2righteous,
  v2poppins,
  v2zillaSlab,
  v2vtthreetwothree,
  v2instrumentSans,
  v2workSans,
  v2crimsonPro,
  v2rubik,
  v2mulish,
]
  .map((f) => f.variable)
  .join(" ");
