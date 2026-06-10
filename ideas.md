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

---

# Future Features & Roadmap Brainstorm

> Last updated: June 2026
> Use this section as the living backlog. Pick items from here when credits are available.

---

## Priority 1 — Trust & Conversion (do these first)

### Roadmap Section
A horizontal or vertical timeline showing the project's milestones. Gives visitors confidence the project is moving and gives them a reason to return.
- **Milestones to show:** Testnet Live ✓ → Mainnet Launch → Governance Module → CEX/DEX Listing → Mobile Worker App → Cross-chain Expansion
- **Design idea:** Glowing node-and-line timeline matching the particle aesthetic. Completed nodes in cyan, upcoming in muted slate, with a pulsing "current" node.

### FAQ Accordion
Answers the top objections before the download CTA. Reduces drop-off significantly.
- Suggested questions:
  - Is it safe to run the worker on my PC?
  - What hardware do I need? (minimum specs)
  - How much GWC can I earn per day?
  - How are rewards calculated and verified?
  - When can I trade or sell GWC?
  - What is Polygon Amoy Testnet and when does mainnet launch?
  - Is GWC open source? Can I audit the code?
  - How do I claim my rewards?

### Tokenomics Breakdown
A visual showing the token supply split. Reinforces the "real value" story from the About section.
- **Suggested split to display:** Reward Pool (60%), Community Treasury (20%), Team/Dev (10% vested 2yr), Ecosystem Grants (10%)
- **Design idea:** Animated donut chart in cyan/emerald with a legend. Or a simple card grid with large percentage numbers.

---

## Priority 2 — Engagement & Growth

### Email / Wallet Waitlist Form
Capture early supporters before mainnet. Already wired to the backend — just needs a DB table and tRPC mutation.
- Input: wallet address (required) + email (optional)
- On submit: save to DB, send owner notification, show a "You're on the list" confirmation with position number
- Bonus: show a live counter of "X wallets registered" to create social proof

### Mobile Navigation Drawer
The current nav is desktop-only (`hidden md:flex`). A hamburger menu for mobile makes the site fully usable on phones — important since crypto audiences are heavily mobile.
- Slide-in drawer from the right with all nav links
- Closes on link click or outside tap

### Social Proof / Community Bar
A thin strip between the Hero and About sections showing:
- GitHub stars count (fetched live from GitHub API)
- Discord/Telegram member count
- "X workers active in the last 24h" (from coordinator API)

---

## Priority 3 — Worker Dashboard (requires auth)

A protected `/dashboard` route for logged-in workers. The backend auth is already wired.

### Dashboard Features
- **My Stats card:** Tasks completed, average accuracy score, estimated pending GWC
- **Wallet Linkage:** Let the user save their Polygon wallet address to their account so rewards auto-associate
- **Task History table:** Paginated list of submitted tasks with hash, accuracy, timestamp, reward status
- **Earnings chart:** Line chart of daily GWC earned over the last 30 days
- **Leaderboard rank:** Show the user's current rank vs. the global leaderboard

### Worker Setup Wizard
Replace the current static "Run a Worker" section with an interactive step-by-step wizard:
1. Download the client
2. Enter your wallet address
3. Run the installer
4. Verify connection (ping the coordinator live)
5. Done — show live task counter

---

## Priority 4 — Content & SEO

### Blog / Updates Feed
A simple markdown-powered news section so the team can post network updates without redeploying.
- Store posts in the DB (title, slug, content, published_at)
- Admin-only write access via the role system already in the template
- Public `/blog` route with post list and individual post pages
- Bonus: RSS feed for subscribers

### Network Explorer Page
A dedicated `/network` page with richer stats than the homepage band:
- Real-time task queue depth chart (last 24h)
- Top 20 worker leaderboard with pagination
- Recent results feed (task hash, accuracy, timestamp)
- Network health indicators (coordinator uptime, avg task time)

### SEO & Meta Tags
- Add Open Graph tags (og:title, og:description, og:image) for link previews on Twitter/Discord
- Generate a custom OG image showing the GWC logo + "Earn GWC by advancing AI research"
- Add structured data (JSON-LD) for the project as a SoftwareApplication

---

## Priority 5 — Monetisation & Ecosystem

### GWC Faucet Page
A testnet faucet that drips a small amount of GWC to new wallets so they can test claiming rewards without waiting for an epoch. Builds familiarity with the token before mainnet.

### Referral System
- Each user gets a unique referral link (`?ref=WALLET`)
- Referred workers earn a 5% bonus on their first epoch
- Referrer earns a 2% bonus for 30 days
- Track referrals in the DB, display in the dashboard

### Staking / Locking Mechanism (post-mainnet)
- Workers who lock GWC for 30/90/180 days get a reward multiplier (1.1x / 1.25x / 1.5x)
- Creates buy pressure and reduces circulating supply
- Requires a new smart contract — plan for post-mainnet

### Partner / Integration Section
A "Built on GWC" or "Powered by" section showing projects that use the research outputs from the network. Even placeholder logos with "Coming Soon" builds credibility.

---

## Design & UX Improvements

- **Dark/light mode toggle** — Some users prefer light mode; easy to add with the existing ThemeProvider
- **Smooth scroll progress bar** — A thin cyan line at the top of the page that fills as the user scrolls
- **Section entrance animations** — Use IntersectionObserver to trigger `.animate-fade-up` only when sections enter the viewport (currently they all fire on load)
- **Cursor glow effect** — A subtle radial gradient that follows the cursor, common in crypto/tech landing pages
- **Video background option** — Replace or supplement the static hero image with a looping MP4 of a neural network training visualization
- **Glassmorphism upgrade** — Increase blur and add subtle colour tints to glass cards on hover for a more premium feel

---

## Technical Debt & Infrastructure

- **Proxy the coordinator API server-side** — Replace direct `fetch(COORDINATOR_URL/...)` calls in the frontend with tRPC procedures that cache results in the DB. Makes the page resilient to coordinator downtime and hides the raw IP.
- **Rate limiting on the API** — Add express-rate-limit to `/api/trpc` to prevent abuse
- **Error monitoring** — Integrate Sentry (free tier) for frontend and server error tracking
- **Automated DB backups** — Schedule a daily export of the DB to S3
- **CI/CD pipeline** — GitHub Actions workflow that runs `pnpm test` and `pnpm check` on every push

---

## Stretch Goals

- **Mobile worker app** — React Native app that runs a lightweight worker on Android/iOS using the device's idle compute
- **Browser extension** — A Chrome/Firefox extension that runs micro-tasks in the background while the user browses
- **AI model marketplace** — Once enough architectures have been discovered, publish the best ones as downloadable model weights that developers can use
- **DAO governance portal** — On-chain voting for GWC holders to decide network parameters, reward weights, and research directions
- **Cross-chain bridge** — Bring GWC to Ethereum mainnet, Base, or Arbitrum once the token has enough liquidity

---

## New Ideas — Viral, Technical & Monetisation

### Viral / Growth Mechanics
- **"Proof of Contribution" NFT badges** — Milestone-based free mints (100 tasks, 1000 tasks, top 10 leaderboard). Shareable on Twitter, costs nothing on Polygon, creates organic marketing.
- **Live "tasks running right now" ticker** — Real-time counter in the hero that increments as tasks complete. Makes the network feel alive. Zero backend work needed — coordinator API already exposes this.
- **Share your rank button** — One-click pre-filled tweet: "I'm rank #12 on the GWC network." Crypto communities love this. Include a generated screenshot card.

### Developer / Technical Audience
- **API docs page** — Publish the coordinator API as a public REST reference. Lets third-party developers build their own worker clients, dashboards, or integrations.
- **Worker benchmarking tool** — Web page where you paste your PC specs and it estimates expected tasks/day and GWC earnings. Pure JavaScript, no backend. Extremely shareable.
- **Embed widget** — A small `<iframe>` snippet showing live network stats that any website can embed. Like a GitHub stars badge but for the GWC network.

### Community & Retention
- **Weekly epoch summary emails** — After each 24h epoch, automatically email workers a summary: tasks completed, GWC earned, rank change, network highlights.
- **"Network milestone" announcements** — When the network hits round numbers (1,000 tasks, 10,000 tasks), auto-post to a public feed and notify all registered wallets.
- **Worker "seasons"** — Time-boxed 2-week competitions with a bonus reward pool for the top 10 workers. Resets the leaderboard, gives lapsed workers a reason to return.

### Credibility & Legitimacy
- **Audit trail page** — Public log of every epoch: total tasks, total rewards, Merkle root hash, Polygonscan transaction link. Proves the system works. Huge trust signal.
- **"How the science works" explainer** — Plain-English page on neural architecture search with a visualisation of the search space. Positions GWC as serious research, not a memecoin.
- **Press kit page** — Logo files, brand colours, one-liner descriptions, founder quotes. Makes it easy for journalists and crypto media to cover the project correctly.

### Monetisation (Longer Term)
- **Research results marketplace** — Companies pay GWC tokens to access the best-performing neural architectures discovered by the network. Creates a direct economic loop.
- **Priority task queue** — Organisations pay GWC to push custom architecture search tasks to the front of the queue. Workers get a bonus multiplier for priority tasks.
- **White-label worker** — License the worker software to universities or research labs who want to run their own distributed compute network.

---

## Funding & Crowdfunding Strategy

### Why Kickstarter Doesn't Fit
Kickstarter is built around physical products and creative projects. Their terms prohibit financial instruments, and crypto tokens get campaigns flagged or removed. The audience is also wrong — not the crypto/AI research community.

### Better Alternatives

**Token Presale / Public Sale** — The standard crypto approach. Sell a portion of GWC supply at a fixed price before mainnet. Platforms: Fjord Foundry (formerly Copper Launch) or DaoMaker. Risk: regulatory scrutiny depending on jurisdiction.

**Gitcoin Grants** — Quadratic funding rounds for open-source crypto and AI projects. The community votes with small donations and a matching pool amplifies popular projects. GWC's open-source, public-good positioning is a perfect fit. Should be done regardless of other routes — builds community credibility.

**Crypto Launchpad** — Binance Launchpad, DAO Maker, Polkastarter, TrustPad. They vet projects and run token sales to their existing user bases. Brings distribution but takes a cut and requires meeting listing criteria.

**Grants (Free Money, No Dilution)** — Several foundations fund exactly what GWC is building:
- Polygon Foundation grants (GWC is already on Polygon — natural fit)
- Ethereum Foundation ESP (Ecosystem Support Program)
- Filecoin Foundation / Protocol Labs (funds decentralised compute research)
- Gitcoin Grants matching pools

**Angel / VC Round** — Crypto-focused VCs: Multicoin Capital, Pantera, Spartan Group, Delphi Digital. Brings money, connections, and exchange relationships. Tradeoff is dilution and milestone pressure.

### Recommended Two-Track Approach

**Track A — Community (do now, free):** Apply for a Gitcoin Grant and a Polygon Foundation grant. Write a one-page project summary, link to GitHub, and submit. Even small amounts carry credibility signals and real community engagement.

**Track B — Presale (do when ready):** Once mainnet is closer and tokenomics are finalised, run a small community presale via Fjord Foundry. Cap it conservatively, whitelist early supporters from the waitlist, use funds for exchange listing fees and smart contract audits.

### Site Feature: "Support the Project" Page
A dedicated page with grant links, a community fundraising tracker, and a clear breakdown of how funds are used. Builds transparency and trust with potential backers.
