# GreenWaveCoin — Project TODO

## Already Completed
- [x] Deep space landing page (particle hero, stats, how-it-works, leaderboard, worker setup)
- [x] About section (mission pillars + GWC token perks)
- [x] tRPC + auth + database template upgrade
- [x] Windows .exe download with SHA-256 checksum
- [x] Codebase cleaned for public GitHub (no AI markers)

## Phase 2 — Landing Page Sections
- [x] Roadmap timeline section (glowing node-and-line, milestones with status)
- [x] FAQ accordion section (8 questions covering safety, hardware, earnings, trading)
- [x] Tokenomics section (animated donut chart + allocation breakdown)

## Phase 3 — Wallet Waitlist
- [x] DB table: waitlist (id, walletAddress, email, createdAt, position)
- [x] tRPC mutation: waitlist.join (validate wallet, save, notify owner)
- [x] tRPC query: waitlist.count (public — show total registrations)
- [x] Waitlist section on homepage (form + live counter + confirmation state)

## Phase 4 — UX Improvements
- [x] Mobile navigation drawer (hamburger menu, all nav links)
- [x] Scroll progress bar (thin cyan line at top of page)
- [ ] Section entrance animations (IntersectionObserver, fade-up on scroll)

## Phase 5 — Worker Dashboard
- [x] DB table: workerProfiles (userId, walletAddress)
- [x] tRPC procedures: dashboard.getProfile, dashboard.setWallet
- [x] Protected /dashboard route (redirects to login if unauthenticated)
- [x] Network stats cards
- [x] Wallet linkage form (save Polygon wallet address)
- [x] Leaderboard rank display with "you" highlight
- [x] Quick links (GitHub, Polygonscan, Download)

## Phase 6 — SEO & Social
- [x] Open Graph meta tags (og:title, og:description, og:image)
- [x] Twitter card meta tags
- [x] JSON-LD structured data (SoftwareApplication)
- [x] Canonical URL tag
- [x] Keywords meta tag

## Phase 7 — Network Explorer Page
- [x] /network route
- [x] Live network stats (coordinator API)
- [x] Full leaderboard (paginated, 25 per page)
- [x] Network health indicator banner
- [x] Polygonscan links per wallet

## Phase 8 — Blog / Updates Feed
- [x] DB table: posts (id, title, slug, content, excerpt, publishedAt, authorId)
- [x] tRPC procedures: blog.list, blog.getBySlug, blog.create (admin only)
- [x] /blog route (post list with empty state)
- [x] /blog/:slug route (individual post with markdown rendering)
- [x] Admin: create post form (role-gated, auto-slug)

## Phase 9 — Footer & Navigation
- [x] Expanded footer with 4-column grid (Explore, Tools, Links)
- [x] Footer links to /network, /dashboard, /blog

## Remaining / Future
- [x] Section entrance animations (IntersectionObserver, fade-up on scroll)
- [x] Server-side coordinator proxy (cache leaderboard in DB for resilience)
- [x] "Share your rank" tweet button on dashboard
- [x] CONTRIBUTING.md for open source contributors
- [x] Polygon Foundation grant application page
- [x] Live tasks running ticker in hero

## Phase 10 — Server-side Coordinator Proxy
- [x] DB table: networkCache (key, value JSON, updatedAt)
- [x] Server cron: fetch coordinator every 5 min, store in DB
- [x] tRPC procedures: network.getStats, network.getLeaderboard (serve from cache)
- [x] Update Home.tsx, Network.tsx, Dashboard.tsx to use tRPC instead of direct fetch

## Phase 11 — Grant Application Page
- [x] /grants route
- [x] Polygon Foundation grant application form (pre-filled, printable)
- [x] Links to Gitcoin Grants and other funding sources
- [x] "Support the Project" section with donation/grant info
