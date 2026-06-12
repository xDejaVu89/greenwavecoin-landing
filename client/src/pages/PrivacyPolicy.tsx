/**
 * GreenWaveCoin — Privacy Policy Page
 * Design: Deep Space / Cosmic Research
 */

import { Zap, Github } from "lucide-react";

const LAST_UPDATED = "June 12, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "#020b18", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: "rgba(2,11,24,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <a href="/" className="flex items-center gap-2 font-bold text-white" style={{ fontFamily: "Syne, sans-serif", textDecoration: "none" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
            <Zap size={14} className="text-white" />
          </div>
          GreenWaveCoin
        </a>
        <a href="/" className="text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>
          ← Back to Home
        </a>
      </nav>

      {/* ── Hero ── */}
      <div className="py-16 px-6" style={{ borderBottom: "1px solid rgba(6,182,212,0.08)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4" }}>
            Legal
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="py-14 px-6">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Introduction */}
          <Section title="1. Introduction">
            <p>
              GreenWaveCoin ("we", "us", or "our") operates the website at{" "}
              <a href="https://greenwavecoin.com" className="hover:underline" style={{ color: "#06b6d4" }}>greenwavecoin.com</a>{" "}
              and the GreenWaveCoin Worker desktop application (collectively, the "Service"). This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
            </p>
            <p>
              GreenWaveCoin is a decentralized, open-source project. We are committed to collecting only the minimum data necessary to operate the network and will never sell your personal information to third parties.
            </p>
          </Section>

          {/* Information We Collect */}
          <Section title="2. Information We Collect">
            <SubSection title="2.1 Worker Client (Desktop Application)">
              <p>When you run the GreenWaveCoin Worker on your computer, the following data is transmitted to our coordinator server:</p>
              <ul>
                <li><strong>Wallet address</strong> — your Polygon-compatible wallet address, used solely to attribute completed compute tasks and distribute GWC token rewards.</li>
                <li><strong>Hardware identifiers</strong> — a pseudonymous worker ID derived from your machine to track task assignment and completion. This ID does not contain personally identifiable information.</li>
                <li><strong>Task results</strong> — the output of neural architecture search (NAS) computations performed by your CPU. These are scientific data, not personal data.</li>
                <li><strong>Performance metrics</strong> — CPU utilisation, tasks completed, and uptime, used to calculate reward amounts and display leaderboard statistics.</li>
              </ul>
              <p>The Worker does <strong>not</strong> collect, transmit, or store: browsing history, files on your computer, keystrokes, screenshots, microphone or camera data, or any other personal information beyond what is listed above.</p>
            </SubSection>

            <SubSection title="2.2 Website">
              <p>When you visit greenwavecoin.com, we may collect:</p>
              <ul>
                <li><strong>Analytics data</strong> — page views, referrer URLs, browser type, and approximate geographic region (country level), collected via privacy-respecting analytics. No cookies are set for tracking purposes.</li>
                <li><strong>Waitlist submissions</strong> — if you submit your email address to join the waitlist, we store that address to send you project updates. You may unsubscribe at any time.</li>
                <li><strong>Wallet address</strong> — if you connect a wallet on the Claim page, your address is read client-side to look up your reward proof. We do not store wallet addresses submitted via the website.</li>
              </ul>
            </SubSection>

            <SubSection title="2.3 Smart Contracts">
              <p>
                All on-chain interactions (token transfers, staking, reward claims) are recorded permanently on the Polygon blockchain. Blockchain data is public and immutable by design. We have no ability to modify or delete on-chain records. Your wallet address and transaction history are publicly visible on{" "}
                <a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#06b6d4" }}>Polygonscan</a>.
              </p>
            </SubSection>
          </Section>

          {/* How We Use Information */}
          <Section title="3. How We Use Your Information">
            <p>We use the information collected for the following purposes:</p>
            <ul>
              <li><strong>Reward distribution</strong> — to calculate and distribute GWC token rewards to workers based on completed tasks.</li>
              <li><strong>Network operations</strong> — to assign tasks, monitor coordinator health, and maintain the integrity of the distributed compute network.</li>
              <li><strong>Leaderboard and statistics</strong> — to display anonymised or pseudonymous network statistics on the website dashboard.</li>
              <li><strong>Communication</strong> — to send project updates to waitlist subscribers who have opted in.</li>
              <li><strong>Security</strong> — to detect and prevent abuse, Sybil attacks, or fraudulent task submissions.</li>
            </ul>
            <p>We do <strong>not</strong> use your information for advertising, profiling, or any purpose unrelated to operating the GreenWaveCoin network.</p>
          </Section>

          {/* Data Sharing */}
          <Section title="4. Data Sharing and Disclosure">
            <p>We do not sell, rent, or trade your personal information. We may share information only in the following limited circumstances:</p>
            <ul>
              <li><strong>Public blockchain</strong> — wallet addresses and transaction data are inherently public on Polygon Mainnet.</li>
              <li><strong>Open-source transparency</strong> — aggregated, non-personal network statistics (total tasks, active workers, GWC distributed) are published publicly as part of our open-source ethos.</li>
              <li><strong>Legal requirements</strong> — if required by applicable law, regulation, or valid legal process, we may disclose information to the extent legally compelled.</li>
              <li><strong>Infrastructure providers</strong> — we use third-party hosting and infrastructure services that process data on our behalf under appropriate data processing agreements.</li>
            </ul>
          </Section>

          {/* Data Retention */}
          <Section title="5. Data Retention">
            <p>
              Coordinator server logs (worker IDs, task results, performance metrics) are retained for a maximum of 90 days, after which they are deleted or anonymised. Waitlist email addresses are retained until you unsubscribe. Blockchain data is permanent and outside our control.
            </p>
          </Section>

          {/* Your Rights */}
          <Section title="6. Your Rights">
            <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
              <li><strong>Deletion</strong> — request deletion of your personal data from our off-chain systems (note: on-chain data cannot be deleted).</li>
              <li><strong>Correction</strong> — request correction of inaccurate personal data.</li>
              <li><strong>Opt-out</strong> — unsubscribe from waitlist emails at any time by replying "unsubscribe" or using the link in any email.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:greenwavecoin@gmail.com" className="hover:underline" style={{ color: "#06b6d4" }}>greenwavecoin@gmail.com</a>.
            </p>
          </Section>

          {/* Cookies */}
          <Section title="7. Cookies and Tracking">
            <p>
              The GreenWaveCoin website does not use advertising cookies or third-party tracking pixels. We may use a minimal session cookie for authentication purposes if you log in. Our analytics are configured to respect "Do Not Track" browser signals and do not fingerprint individual users.
            </p>
          </Section>

          {/* Children */}
          <Section title="8. Children's Privacy">
            <p>
              The Service is not directed at children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
            </p>
          </Section>

          {/* Security */}
          <Section title="9. Security">
            <p>
              We implement reasonable technical and organisational measures to protect your information against unauthorised access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage is 100% secure. You use the Service at your own risk.
            </p>
            <p>
              The GreenWaveCoin smart contracts have not yet undergone a formal third-party security audit. Use the network with caution and only contribute idle compute resources you are comfortable sharing.
            </p>
          </Section>

          {/* Third-party links */}
          <Section title="10. Third-Party Links">
            <p>
              The website may contain links to external sites (GitHub, Polygonscan, QuickSwap, etc.). This Privacy Policy does not apply to those sites. We encourage you to review the privacy policies of any third-party services you visit.
            </p>
          </Section>

          {/* Changes */}
          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page and, for material changes, notify waitlist subscribers by email. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          {/* Contact */}
          <Section title="12. Contact Us">
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="mt-4 p-5 rounded-xl" style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#06b6d4" }}>GreenWaveCoin</p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Email: <a href="mailto:greenwavecoin@gmail.com" className="hover:underline" style={{ color: "#06b6d4" }}>greenwavecoin@gmail.com</a></p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>X / Twitter: <a href="https://x.com/GreenWaveCoin" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#06b6d4" }}>@GreenWaveCoin</a></p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>GitHub: <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#06b6d4" }}>xDejaVu89/greenwavecoin</a></p>
            </div>
          </Section>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="py-10 px-6" style={{ borderTop: "1px solid rgba(6,182,212,0.1)", background: "#020b18" }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#334155" }}>© 2026 GreenWaveCoin. Open source under MIT License.</p>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs hover:text-[#06b6d4] transition-colors" style={{ color: "#475569" }}>Home</a>
            <a href="/privacy" className="text-xs" style={{ color: "#06b6d4" }}>Privacy Policy</a>
            <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-[#06b6d4] transition-colors" style={{ color: "#475569" }}>GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ── Helper components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0", borderBottom: "1px solid rgba(6,182,212,0.15)", paddingBottom: "0.75rem" }}>
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-base font-semibold mb-3" style={{ color: "#cbd5e1" }}>{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
        {children}
      </div>
    </div>
  );
}
