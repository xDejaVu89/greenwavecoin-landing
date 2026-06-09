# GreenWaveCoin Landing Page — Design Brainstorm

## Context
GreenWaveCoin is a distributed AI algorithm research network. Users run a worker on their PC, it tests neural network architectures, and they earn GWC tokens. Think: Folding@Home meets crypto meets AI research.

---

<response>
<text>
**Design Movement: Dark Terminal / Biopunk**

**Core Principles:**
- Raw, technical authenticity — this is real infrastructure, not a consumer app
- High contrast monochromatic base with a single vivid accent (electric green)
- Data-forward: network stats, leaderboard, and live metrics are the hero
- Asymmetric grid with intentional tension

**Color Philosophy:**
- Background: near-black `#0a0f0a` (very dark green-tinted black)
- Surface: `#111a11` (dark forest)
- Accent: `#00ff88` (electric mint — the "green wave")
- Secondary: `#1aff8c` glow
- Text: `#e8f5e8` (off-white with green tint)
- Muted: `#4a7a4a`

**Layout Paradigm:**
- Left-rail navigation with a persistent stats sidebar on the right
- Hero section is a full-bleed terminal animation showing live network activity
- Content flows in a two-column asymmetric grid (60/40 split)

**Signature Elements:**
- Animated ASCII-style network graph in the hero
- Monospace font for all data/numbers (JetBrains Mono)
- Subtle scanline texture overlay on dark sections
- Green "pulse" glow on active stats

**Interaction Philosophy:**
- Hover states reveal deeper data (tooltips with raw numbers)
- Buttons have a terminal-cursor blink effect
- Stats counter-animate on scroll into view

**Animation:**
- Hero: typewriter effect for tagline, then network nodes appear one by one
- Stats: count-up animation when scrolled into view
- Cards: subtle lift with green border glow on hover

**Typography System:**
- Display: Space Grotesk Bold (headings)
- Body: Inter Regular (readable prose)
- Data: JetBrains Mono (all numbers, addresses, stats)
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Design Movement: Brutalist Data Dashboard**

**Core Principles:**
- Bold, unapologetic structure — thick borders, raw grid, no softness
- Information density is a feature, not a bug
- High-contrast black and white with a single warm amber accent
- Typography does the heavy lifting

**Color Philosophy:**
- Background: pure white `#ffffff`
- Borders: `#000000` (thick, 2–3px)
- Accent: `#f59e0b` (amber — warmth against cold structure)
- Text: `#000000`
- Data highlight: `#fef3c7` (pale amber fill)

**Layout Paradigm:**
- Newspaper-style editorial grid — unequal columns, overlapping type
- Hero is a giant typographic statement, not an image
- Stats displayed in a dense ticker-tape style horizontal band
- No rounded corners anywhere

**Signature Elements:**
- Oversized section numbers (01, 02, 03) as structural dividers
- Thick horizontal rules between sections
- Monospace data blocks with visible borders

**Typography System:**
- Display: DM Serif Display (editorial weight)
- Body: IBM Plex Mono (everything in mono for technical feel)
- Accent labels: uppercase tracking-widest
</text>
<probability>0.06</probability>
</response>

<response>
<text>
**Design Movement: Deep Space / Cosmic Research**

**Core Principles:**
- The network is distributed across the world — lean into the cosmic scale
- Deep navy and teal palette evoking ocean depth and space
- Flowing, organic shapes contrasting with precise data displays
- Premium feel: this is serious science, not a meme coin

**Color Philosophy:**
- Background: `#020b18` (deep space navy)
- Surface: `#071428` (dark ocean)
- Primary accent: `#06b6d4` (cyan — the "wave" in GreenWave)
- Secondary: `#10b981` (emerald green — the "green" in GreenWave)
- Text: `#f0f9ff` (ice white)
- Muted: `#475569`

**Layout Paradigm:**
- Full-width hero with a subtle animated particle network (nodes = workers)
- Horizontal scroll sections for "How It Works" steps
- Stats in a floating glassmorphism card band
- Leaderboard as a glowing table with rank highlights

**Signature Elements:**
- Particle network animation in hero (dots connected by lines = the AI research network)
- Glassmorphism cards with `backdrop-blur` and subtle border glow
- Gradient text for key headings (cyan to green)

**Interaction Philosophy:**
- Smooth parallax on scroll
- Cards float slightly on hover with a glow intensification
- CTA button pulses gently

**Animation:**
- Hero: particle network builds in over 2 seconds
- Stats: smooth count-up on scroll
- Section entrances: fade-up with 60ms stagger

**Typography System:**
- Display: Syne Bold (geometric, futuristic)
- Body: Inter (clean, readable)
- Data: JetBrains Mono (numbers and addresses)
</text>
<probability>0.09</probability>
</response>

---

## Selected Approach: Deep Space / Cosmic Research

The deep space aesthetic is the strongest fit for GreenWaveCoin because:
1. It visually represents the distributed, global nature of the network
2. The cyan/green dual accent perfectly maps to the "GreenWave" brand
3. The particle network animation in the hero IS the product — workers as nodes
4. It communicates scientific credibility without being cold or corporate
