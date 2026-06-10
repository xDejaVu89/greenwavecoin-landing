# GreenWaveCoin — AI Research Network

GreenWaveCoin (GWC) is a distributed neural architecture search network. Run a lightweight worker on your PC, contribute to real AI research, and earn GWC tokens automatically.

---

## What It Does

The GreenWaveCoin network distributes neural architecture search (NAS) tasks across volunteer worker nodes. Each worker tests candidate neural network configurations, reports accuracy results back to the coordinator, and earns GWC tokens proportional to their contribution within each epoch.

---

## Stack

- **Frontend:** React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend:** Express 4 + tRPC 11
- **Database:** MySQL (Drizzle ORM)
- **Auth:** OAuth 2.0
- **Chain:** Polygon (Amoy Testnet → Mainnet)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The dev server runs on `http://localhost:3000`.

---

## Project Structure

```
client/
  src/
    pages/        ← Page-level components
    components/   ← Reusable UI components
    hooks/        ← Custom hooks
    lib/          ← Utilities
drizzle/          ← Database schema & migrations
server/
  db.ts           ← Query helpers
  routers.ts      ← tRPC procedures
shared/           ← Shared types & constants
```

---

## Worker Download

The Windows worker client is available on the [Releases](../../releases) page.

**Requirements:** Windows 10+, any modern CPU, ~50 MB disk space.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT
