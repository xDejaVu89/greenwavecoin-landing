/**
 * GreenWaveCoin — Grants & Funding Page
 * Covers: Polygon Foundation grant application, Gitcoin, other funding sources.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ExternalLink, Copy, Check, Github,
  Zap, Globe, FileText, Users, DollarSign, Award,
  ChevronDown, ChevronUp, Mail
} from "lucide-react";

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 p-1 rounded hover:opacity-80 transition-opacity"
      style={{ color: "#06b6d4" }}
      title="Copy to clipboard"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────────
function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(6,182,212,0.2)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: "rgba(7,20,40,0.9)" }}
      >
        <span className="font-semibold" style={{ color: "#f0f9ff", fontFamily: "Syne, sans-serif" }}>{title}</span>
        {open ? <ChevronUp size={16} style={{ color: "#06b6d4" }} /> : <ChevronDown size={16} style={{ color: "#06b6d4" }} />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2" style={{ background: "rgba(7,20,40,0.6)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Grants() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(2,11,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
              <ArrowLeft size={15} /> Home
            </a>
            <div className="w-px h-5" style={{ background: "rgba(51,65,85,0.6)" }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
                <Award size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Grants & Funding</span>
            </div>
          </div>
          <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2" style={{ borderColor: "rgba(51,65,85,0.5)", color: "#64748b", background: "transparent" }}>
              <Github size={14} /> GitHub
            </Button>
          </a>
        </div>
      </nav>

      <div className="container pt-28 pb-20 max-w-4xl">

        {/* Header */}
        <div className="mb-12">
          <Badge className="mb-4" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>
            Open Source Funding
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Support the{" "}
            <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              GreenWaveCoin
            </span>{" "}
            Network
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "#94a3b8" }}>
            GreenWaveCoin is a public-good infrastructure project — open source, community governed, and designed to make AI research accessible to everyone.
            Below are the active funding channels and grant applications we are pursuing to sustain and grow the network.
          </p>
        </div>

        {/* Funding channels overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: <Globe size={20} />, label: "Polygon Foundation", status: "Applying", color: "#8b5cf6" },
            { icon: <Users size={20} />, label: "Gitcoin Grants", status: "Planned", color: "#06b6d4" },
            { icon: <DollarSign size={20} />, label: "Community Presale", status: "Planned", color: "#10b981" },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-5 flex items-center gap-4" style={{ background: "rgba(7,20,40,0.8)", border: `1px solid ${c.color}30` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15`, color: c.color }}>
                {c.icon}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "#f0f9ff" }}>{c.label}</div>
                <div className="text-xs mt-0.5" style={{ color: c.color }}>{c.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Grant applications */}
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
          Grant Applications
        </h2>

        <div className="space-y-4 mb-12">

          {/* Polygon Foundation */}
          <Collapsible title="Polygon Foundation — Community Grants Programme" defaultOpen={true}>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3 mb-2">
                <Badge style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)" }}>Active Application</Badge>
                <Badge style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>Polygon Ecosystem</Badge>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                The Polygon Foundation Community Grants Programme funds open-source projects that build on or strengthen the Polygon ecosystem.
                GreenWaveCoin is a strong candidate: the GWC token is deployed on Polygon Mainnet, all reward distributions happen on-chain via a verified smart contract,
                and the project is fully open source under an MIT licence.
              </p>

              <div className="rounded-lg p-4 space-y-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8b5cf6" }}>Application Draft</div>

                {[
                  { label: "Project Name", value: "GreenWaveCoin (GWC)" },
                  { label: "Category", value: "DeFi Infrastructure / Decentralised Compute" },
                  { label: "Network", value: "Polygon Mainnet" },
                  { label: "Token Contract", value: "0x74e4F6597095d0807b77D7080E93B77331513585" },
                  { label: "GitHub", value: "https://github.com/xDejaVu89/greenwavecoin" },
                  { label: "Requested Amount", value: "$10,000 – $25,000 USD equivalent in MATIC/POL" },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3">
                    <span className="text-xs w-32 flex-shrink-0 pt-0.5" style={{ color: "#64748b" }}>{row.label}</span>
                    <span className="text-xs font-mono flex-1" style={{ color: "#f0f9ff" }}>
                      {row.value}
                      <CopyButton text={row.value} />
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg p-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8b5cf6" }}>Project Description (copy-ready)</div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#94a3b8" }}>
{`GreenWaveCoin is an open-source, decentralised compute network that distributes neural architecture search (NAS) tasks to volunteer workers running on consumer hardware. Workers contribute idle CPU cycles to evaluate candidate neural network architectures against benchmark datasets. Each completed evaluation is cryptographically verified and recorded on-chain. Workers are rewarded with GWC tokens at the end of each 24-hour epoch, with distribution proportional to the number of verified tasks completed.

The project runs on Polygon because of its low transaction fees, fast finality, and strong developer tooling. The GWC ERC-20 token and the reward pool contract are both deployed on Polygon Mainnet and verified on Polygonscan.

Grant funds would be used for: (1) a professional smart contract security audit, (2) exchange listing fees to establish a liquid market for GWC, (3) infrastructure costs for the coordinator server, and (4) developer bounties to attract open-source contributors.

All code is MIT-licensed and publicly available on GitHub. The project has no venture capital backing and is entirely community-funded.`}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(`GreenWaveCoin is an open-source, decentralised compute network that distributes neural architecture search (NAS) tasks to volunteer workers running on consumer hardware. Workers contribute idle CPU cycles to evaluate candidate neural network architectures against benchmark datasets. Each completed evaluation is cryptographically verified and recorded on-chain. Workers are rewarded with GWC tokens at the end of each 24-hour epoch, with distribution proportional to the number of verified tasks completed.\n\nThe project runs on Polygon because of its low transaction fees, fast finality, and strong developer tooling. The GWC ERC-20 token and the reward pool contract are both deployed on Polygon Mainnet and verified on Polygonscan.\n\nGrant funds would be used for: (1) a professional smart contract security audit, (2) exchange listing fees to establish a liquid market for GWC, (3) infrastructure costs for the coordinator server, and (4) developer bounties to attract open-source contributors.\n\nAll code is MIT-licensed and publicly available on GitHub. The project has no venture capital backing and is entirely community-funded.`)}
                  className="mt-3 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  <Copy size={12} /> Copy description
                </button>
              </div>

              <a
                href="https://polygon.technology/grants"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff" }}
              >
                Apply on Polygon Foundation <ExternalLink size={14} />
              </a>
            </div>
          </Collapsible>

          {/* Gitcoin */}
          <Collapsible title="Gitcoin Grants — Quadratic Funding Round">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                Gitcoin Grants uses quadratic funding — small donations from many community members are amplified by a matching pool.
                This means a project with 500 donors of $1 each can receive more matching funds than a project with 5 donors of $100 each.
                It rewards broad community support, which aligns perfectly with GreenWaveCoin's decentralised ethos.
              </p>
              <div className="rounded-lg p-4 space-y-2" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(6,182,212,0.2)" }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#06b6d4" }}>How to support us on Gitcoin</div>
                <ol className="text-sm space-y-2" style={{ color: "#94a3b8" }}>
                  <li className="flex gap-2"><span style={{ color: "#06b6d4" }}>1.</span> Visit <a href="https://grants.gitcoin.co" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#06b6d4" }}>grants.gitcoin.co</a> during an active funding round.</li>
                  <li className="flex gap-2"><span style={{ color: "#06b6d4" }}>2.</span> Search for "GreenWaveCoin" or "GWC".</li>
                  <li className="flex gap-2"><span style={{ color: "#06b6d4" }}>3.</span> Even a $1 donation significantly increases the matching amount due to quadratic mechanics.</li>
                  <li className="flex gap-2"><span style={{ color: "#06b6d4" }}>4.</span> Share the grant link on social media — every new unique donor multiplies the impact.</li>
                </ol>
              </div>
              <a
                href="https://grants.gitcoin.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}
              >
                Visit Gitcoin Grants <ExternalLink size={14} />
              </a>
            </div>
          </Collapsible>

          {/* Community Presale */}
          <Collapsible title="Community Token Presale — Fjord Foundry">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                Once the smart contract audit is complete and mainnet deployment is ready, a small community presale will be conducted via Fjord Foundry (formerly Copper Launch).
                Early supporters will be able to purchase GWC tokens at a fixed price before the public launch.
                Proceeds will fund the exchange listing, ongoing infrastructure, and developer bounties.
              </p>
              <div className="rounded-lg p-4" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#10b981" }}>Planned Allocation</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Smart contract audit", pct: "30%" },
                    { label: "Exchange listing fees", pct: "25%" },
                    { label: "Coordinator infrastructure", pct: "25%" },
                    { label: "Developer bounties", pct: "20%" },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center">
                      <span style={{ color: "#94a3b8" }}>{r.label}</span>
                      <span className="font-mono font-bold" style={{ color: "#10b981" }}>{r.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs" style={{ color: "#475569" }}>
                Register on the waitlist at the bottom of the home page to be notified when the presale opens.
              </p>
            </div>
          </Collapsible>

        </div>

        {/* Contact */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(6,182,212,0.2)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
            <Mail size={22} className="text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Partnership or Grant Enquiries</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "#94a3b8" }}>
            If you represent a grant programme, research institution, or organisation interested in partnering with GreenWaveCoin,
            please reach out via GitHub Discussions or open an issue on the repository.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://github.com/xDejaVu89/greenwavecoin/discussions" target="_blank" rel="noopener noreferrer">
              <Button className="gap-2" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
                <Github size={16} /> GitHub Discussions
              </Button>
            </a>
            <a href="https://github.com/xDejaVu89/greenwavecoin/issues/new" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2" style={{ borderColor: "rgba(6,182,212,0.4)", color: "#06b6d4", background: "transparent" }}>
                <FileText size={16} /> Open an Issue
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
