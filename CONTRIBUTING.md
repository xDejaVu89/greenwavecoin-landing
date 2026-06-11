# Contributing to GreenWaveCoin

Thank you for your interest in contributing to GreenWaveCoin. This project is fully open source and community contributions are welcome across all areas — the worker client, coordinator server, smart contracts, and this landing site.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Smart Contract Contributions](#smart-contract-contributions)

---

## Code of Conduct

This project follows a simple standard: be respectful, be constructive, and assume good intent. Harassment, discrimination, or personal attacks of any kind will not be tolerated. If you witness or experience a violation, please open a private issue or contact the maintainers directly.

---

## How to Contribute

There are many ways to contribute beyond writing code:

- **Bug reports** — If you find a bug in the worker client, coordinator, or website, open an issue with as much detail as possible.
- **Documentation** — Improving the README, adding inline code comments, or writing guides for new contributors.
- **Testing** — Running the worker on different hardware configurations and reporting performance or compatibility issues.
- **Translations** — Helping translate the landing page or documentation into other languages.
- **Research** — Suggesting improvements to the neural architecture search methodology or benchmark datasets.
- **Code** — Fixing bugs, implementing features from the issue tracker, or improving performance.

---

## Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** v8 or higher (`npm install -g pnpm`)
- **Git**

### Landing Site (this repository)

```bash
# Clone the repository
git clone https://github.com/xDejaVu89/greenwavecoin.git
cd greenwavecoin

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The site will be available at `http://localhost:3000`.

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values. The coordinator URL defaults to the public testnet coordinator — you do not need to run your own coordinator for frontend development.

### Running Tests

```bash
pnpm test
```

Tests are written with Vitest. All new backend procedures should include a corresponding test in `server/*.test.ts`.

### Database Changes

If your contribution requires a schema change:

```bash
# Edit drizzle/schema.ts, then push the migration
pnpm db:push
```

---

## Project Structure

```
client/src/pages/     — Page-level React components
client/src/components/ — Reusable UI components
server/routers.ts     — tRPC API procedures
server/db.ts          — Database query helpers
drizzle/schema.ts     — Database schema (Drizzle ORM)
```

The coordinator server and worker client live in separate repositories linked from the main README.

---

## Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`.
2. **Name your branch** descriptively: `fix/leaderboard-pagination`, `feat/mobile-nav`, `docs/setup-guide`.
3. **Write tests** for any new backend logic.
4. **Keep commits focused** — one logical change per commit, with a clear message.
5. **Open a pull request** against `main` with a description of what you changed and why.
6. **Link any related issues** in the PR description using `Closes #123`.

Pull requests that introduce breaking changes, modify the smart contracts, or change the reward calculation logic require a more thorough review and may need to go through a community discussion first.

---

## Reporting Bugs

Open a GitHub issue with the following information:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behaviour vs. actual behaviour
- Your operating system and relevant version numbers (Node.js, worker client version, etc.)
- Any relevant logs or error messages

For security vulnerabilities, **do not open a public issue**. Contact the maintainers privately so the issue can be patched before disclosure.

---

## Suggesting Features

Open a GitHub issue with the label `enhancement`. Describe:

- The problem you are trying to solve
- Your proposed solution
- Any alternatives you considered

For large features (new pages, protocol changes, new reward mechanisms), it is worth opening a discussion issue first to get feedback before investing significant time in implementation.

---

## Smart Contract Contributions

The GWC token and escrow contracts are deployed on Polygon Amoy Testnet and verified on Polygonscan. Any proposed changes to the smart contracts must:

1. Be accompanied by a full test suite using Hardhat or Foundry.
2. Include a security analysis explaining potential attack vectors and mitigations.
3. Be reviewed by at least two community members before being considered for deployment.
4. Go through a testnet deployment and observation period before any mainnet consideration.

Contract addresses are listed in the main README.

---

## Questions?

If you are unsure where to start or have questions about the codebase, open a GitHub Discussion or reach out via the community channels listed in the README. We are happy to help new contributors get oriented.
