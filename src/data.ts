import { GeneratorPreset } from "./types";

export const DECADE_PRESETS = [
  { id: "1970s", label: "1970s", description: "Polaroid, vinyl, wood paneling, warm saturation", icon: "📻" },
  { id: "1980s", label: "1980s", description: "CRT flicker, neon arcade, cassettes, boomboxes", icon: "📟" },
  { id: "1990s", label: "1990s", description: "Blockbuster VHS, translucent tech, jewel cases, retro snacks", icon: "🎮" },
  { id: "2000s", label: "2000s", description: "Silver flip phones, MP3 players, early web portals", icon: "📱" },
  { id: "2010s", label: "2010s", description: "Early touch devices, retro gaming revival, tumblr aesthetics", icon: "🎧" }
];

export const THEME_PRESETS: GeneratorPreset[] = [
  {
    id: "blockbuster",
    label: "Blockbuster Friday Night",
    theme: "Renting a VHS tape at Blockbuster with candy box",
    icon: "📼",
    description: "The distinct clicky smell of black plastic cases and scanning barcodes."
  },
  {
    id: "cartoons",
    label: "Saturday Morning Cartoons",
    theme: "Preparing cereal on the carpet watching bulky CRT morning cartoons",
    icon: "🥣",
    description: "Golden cereal dust, colorful milk bowls, and commercial breaks."
  },
  {
    id: "midnight-gaming",
    label: "Late Night Gaming Blockade",
    theme: "Sitting cross-legged playing Gameboy or Nintendo in pixelated cathode glow",
    icon: "🕹️",
    description: "Blowing on console cartridge contacts and sound clicks."
  },
  {
    id: "cassette-mixtape",
    label: "Recording the Radio Mixtape",
    theme: "Holding tape buttons down simultaneously waiting for custom mixtape radio track",
    icon: "🎚️",
    description: "Pencil-wound cassette tape spooling on an analog stereo hub."
  },
  {
    id: "flip-phone-texting",
    label: "T9 Flip Phone Secrets",
    theme: "T9 texting on a Nokia or silver Motorola Razr underneath school desk",
    icon: "📳",
    description: "Pixel numbers, light-up plastic buttons, and low-res graphics."
  },
  {
    id: "lunchbox-gains",
    label: "The Ultimate 90s Lunchbox",
    theme: "Opening a metal Thermos lunchbox with Dunkaroos and a Capri Sun",
    icon: "🥪",
    description: "Peeling the foil of a fruit-snack pack with sticky fingers."
  },
  {
    id: "pc-dialup",
    label: "Windows 95 Dial-Up Initial",
    theme: "Logging into AOL messenger with standard dialup static scream in pitch dark",
    icon: "🖥️",
    description: "The high-pitched electronic digital squeals of handshake static."
  },
  {
    id: "album-listening",
    label: "Browsing the CD Rack",
    theme: "Flipping plastic CD jewel cases on a heavy wire rack at Tower Records",
    icon: "💿",
    description: "Clacking plastic jewel cases with neon marker annotations."
  }
];

export const AUDIENCE_PRESETS = [
  { id: "millennials", label: "Millennials", description: "Aged 25 to 40 (Nostalgia peak)", icon: "🥑" },
  { id: "gen_x", label: "Gen X", description: "Aged 41 to 55 (Early tech edge)", icon: "🎸" },
  { id: "boomers_genx", label: "Boomers & Early Gen X", description: "Aged 55+ (70s vinyl & retro focus)", icon: "🌻" }
];

export const REGION_PRESETS = [
  { id: "us_canada", label: "United States & Canada", description: "Dunkaroos, Blockbuster VHS, CRT Super Nintendo", code: "🇺🇸🇨🇦" },
  { id: "uk_suburban", label: "United Kingdom & Ireland", description: "Beano comics, micro-pubs, VHS recorders, retro crisps", code: "🇬🇧🇮🇪" },
  { id: "australia_nz", label: "Australia & New Zealand", description: "After-school milo, retro video rentals, corner shops", code: "🇦🇺🇳🇿" },
  { id: "europe_continental", label: "Continental Europe", description: "Secam television monitors, retro cartridges, local magazines", code: "🇪🇺" }
];

export const RETRO_LOADING_PHRASES = [
  "Rewinding cassette mixtape track...",
  "Powering on the cathode-ray tube...",
  "Calibrating analog tracker scanlines...",
  "Blowing dust from cartridge system contacts...",
  "Searching database for vintage Western relics...",
  "Formatting 9-pin joystick port controllers...",
  "Adjusting rabbit-ear signal transmitters...",
  "Peeling the foil back off the vintage toaster pastry...",
  "Connecting via 56k dialup handshake sound...",
  "Flipping the vinyl LP sleeve to side-B...",
  "Shaking the retro polaroid print negative..."
];
