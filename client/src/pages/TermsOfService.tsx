/**
 * GreenWaveCoin — Terms of Service Page
 * Design: Deep Space / Cosmic Research
 */

import { Zap } from "lucide-react";

const LAST_UPDATED = "June 12, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "#e2e8f0" }}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2" style={{ color: "#cbd5e1" }}>{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Terms of Service</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="py-14 px-6">
        <div className="max-w-3xl mx-auto space-y-12">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing the GreenWaveCoin website at{" "}
              <a href="https://greenwavecoin.com" className="hover:underline" style={{ color: "#06b6d4" }}>greenwavecoin.com</a>{" "}
              ("Site") or running the GreenWaveCoin Worker application ("Worker"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
            </p>
            <p>
              GreenWaveCoin is an open-source, decentralized compute network. These Terms govern your use of the Site, the Worker application, and any related services (collectively, the "Service").
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              GreenWaveCoin operates a distributed compute network on the Polygon blockchain. Contributors ("Workers") run the GreenWaveCoin Worker application on their personal computers, donating idle CPU cycles to neural architecture search (NAS) AI research tasks. In return, Workers earn GWC tokens distributed via on-chain Merkle proof claims.
            </p>
            <SubSection title="2.1 GWC Token">
              <p>
                GWC is a utility token on the Polygon Mainnet used to reward compute contributions. GWC is not an investment product, security, or financial instrument. Holding GWC does not confer ownership, equity, profit-sharing rights, or any claim against GreenWaveCoin or its contributors.
              </p>
            </SubSection>
            <SubSection title="2.2 Compute Contributions">
              <p>
                By running the Worker, you voluntarily donate idle CPU resources to the GreenWaveCoin network. You may stop contributing at any time by closing the Worker application. Earned but unclaimed rewards remain claimable on-chain for the duration specified in the smart contract.
              </p>
            </SubSection>
          </Section>

          <Section title="3. Eligibility">
            <p>You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are at least 18 years old.</li>
              <li>You have the legal capacity to enter into these Terms in your jurisdiction.</li>
              <li>Your use of the Service does not violate any applicable laws or regulations in your jurisdiction.</li>
              <li>You are not located in, or a citizen or resident of, any country subject to comprehensive U.S. sanctions or where cryptocurrency activities are prohibited.</li>
            </ul>
          </Section>

          <Section title="4. User Responsibilities">
            <SubSection title="4.1 Wallet Security">
              <p>
                You are solely responsible for the security of your Polygon-compatible wallet and private keys. GreenWaveCoin has no ability to recover lost wallets or reverse on-chain transactions. Never share your private key with anyone.
              </p>
            </SubSection>
            <SubSection title="4.2 Acceptable Use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Attempt to manipulate, exploit, or defraud the reward distribution system.</li>
                <li>Submit false, fabricated, or manipulated task results to the coordinator.</li>
                <li>Reverse-engineer, decompile, or tamper with the smart contracts in a manner that harms other participants.</li>
                <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
                <li>Interfere with or disrupt the integrity or performance of the coordinator server or network.</li>
              </ul>
            </SubSection>
            <SubSection title="4.3 Hardware and Electricity">
              <p>
                You are responsible for any costs associated with running the Worker, including electricity consumption and hardware wear. GreenWaveCoin is not liable for any hardware damage, increased electricity bills, or other costs incurred from running the Worker.
              </p>
            </SubSection>
          </Section>

          <Section title="5. Token Rewards and Claims">
            <p>
              GWC token rewards are calculated based on validated compute contributions per epoch (approximately 24-hour periods). Reward amounts are determined solely by the coordinator's validation logic and the on-chain smart contract parameters.
            </p>
            <p>
              GreenWaveCoin makes no guarantee of any specific reward amount, token price, or return on compute contribution. Reward rates may change based on network participation, epoch parameters, and governance decisions. Unclaimed rewards expire as specified in the RewardEscrowV2 smart contract.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              GreenWaveCoin is open-source software released under the MIT License. The source code is publicly available at{" "}
              <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#06b6d4" }}>github.com/xDejaVu89/greenwavecoin</a>.
              You are free to use, modify, and distribute the code in accordance with the MIT License.
            </p>
            <p>
              The GreenWaveCoin name, logo, and branding are not covered by the MIT License and may not be used without prior written permission.
            </p>
          </Section>

          <Section title="7. Disclaimers and Risk Warnings">
            <SubSection title="7.1 No Financial Advice">
              <p>
                Nothing on this Site or in the Service constitutes financial, investment, legal, or tax advice. You should consult qualified professionals before making any decisions related to cryptocurrency.
              </p>
            </SubSection>
            <SubSection title="7.2 Cryptocurrency Risk">
              <p>
                Cryptocurrency tokens, including GWC, are highly volatile and speculative. The value of GWC may decrease to zero. Past performance is not indicative of future results. You may lose any value associated with GWC tokens.
              </p>
            </SubSection>
            <SubSection title="7.3 Smart Contract Risk">
              <p>
                The GreenWaveCoin smart contracts have not been formally audited by a third-party security firm. Smart contracts may contain bugs or vulnerabilities. You interact with the smart contracts at your own risk.
              </p>
            </SubSection>
            <SubSection title="7.4 Service Availability">
              <p>
                GreenWaveCoin is provided "as is" without warranty of any kind. We do not guarantee uninterrupted availability of the coordinator server, website, or network. The Service may be modified, suspended, or discontinued at any time without notice.
              </p>
            </SubSection>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, GreenWaveCoin and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, loss of tokens, or hardware damage, arising out of or related to your use of the Service.
            </p>
            <p>
              In no event shall GreenWaveCoin's total liability to you exceed the total amount of GWC tokens earned by you through the Service in the thirty (30) days preceding the event giving rise to the claim.
            </p>
          </Section>

          <Section title="9. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless GreenWaveCoin and its contributors from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Service, your violation of these Terms, or your violation of any applicable law.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration or in the courts of competent jurisdiction.
            </p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Service after any changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:gwc@greenwavecoin.com" className="hover:underline" style={{ color: "#06b6d4" }}>gwc@greenwavecoin.com</a>.
            </p>
          </Section>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid rgba(6,182,212,0.08)" }}>
        <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "#334155" }}>
          <a href="/privacy" className="hover:text-[#06b6d4] transition-colors">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" className="hover:text-[#06b6d4] transition-colors" style={{ color: "#06b6d4" }}>Terms of Service</a>
          <span>·</span>
          <p>© 2026 GreenWaveCoin</p>
        </div>
      </footer>

    </div>
  );
}
