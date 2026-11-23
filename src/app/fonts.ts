import {
  Bricolage_Grotesque,
  DM_Sans,
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Manrope,
  Outfit,
  Playfair_Display,
  Silkscreen,
  Sora,
  Space_Grotesk,
  Space_Mono,
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

/** Every font's CSS variable class, applied once on <html>. */
export const fontVariables = [
  spaceGrotesk, inter, jetbrainsMono,
  geist, geistMono, instrumentSerif, fraunces, dmSans, playfair, manrope,
  plexMono, plexSans, bricolage, sora, outfit, silkscreen, spaceMono,
]
  .map((f) => f.variable)
  .join(" ");
