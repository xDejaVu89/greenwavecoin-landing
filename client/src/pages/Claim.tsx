/**
 * GWC Reward Claim Portal
 * Workers connect MetaMask, check their claimable GWC, and submit on-chain claims.
 */

import { useState, useEffect, useCallback } from "react";
import { createPublicClient, createWalletClient, custom, http, parseAbi, formatUnits } from "viem";
import { polygon } from "viem/chains";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Wallet, Coins, CheckCircle2, AlertCircle, Loader2,
  ExternalLink, ArrowRight, Zap, RefreshCw, ShieldCheck
} from "lucide-react";

const REWARD_POOL_ADDRESS = "0x6a5e4DE78a5Be75c308fCb5833ECC35412511D86" as const;
const GWC_TOKEN_ADDRESS = "0x11b48853Ce85Ebf4b1a0AEd9cbE1c951017E16F9" as const;
const COORDINATOR_URL = "http://167.99.233.130";

// RewardEscrowV2 ABI — Merkle-based claim with index
const REWARD_POOL_ABI = parseAbi([
  "function isClaimed(uint256 epoch, uint256 index) view returns (bool)",
  "function merkleRoots(uint256 epoch) view returns (bytes32)",
  "function epochTotals(uint256 epoch) view returns (uint256)",
  "function claim(uint256 epoch, uint256 index, address account, uint256 amount, bytes32[] proof) external",
]);

const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
]);

type ClaimData = {
  epochId: bigint;
  index: bigint;
  amount: bigint;  // in wei
  amountGwc: string;
  proof: `0x${string}`[];
  alreadyClaimed: boolean;
};

type TxState = "idle" | "pending" | "success" | "error";

async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) return null;
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
    return accounts[0] ?? null;
  } catch {
    return null;
  }
}

async function switchToPolygon(): Promise<boolean> {
  if (!window.ethereum) return false;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }],
    });
    return true;
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
            rpcUrls: ["https://polygon-rpc.com"],
            blockExplorerUrls: ["https://polygonscan.com"],
          }],
        });
        return true;
      } catch { return false; }
    }
    return false;
  }
}

async function fetchClaimData(wallet: string): Promise<{ epochId: number; index: number; cumulativeAmount: string; amountGwc: string; proof: string[] } | null> {
  try {
    const res = await fetch(`${COORDINATOR_URL}/api/rewards/proof?wallet=${wallet}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json() as { epochId: number; index: number; cumulativeAmount: string; amountGwc: string; proof: string[] };
  } catch {
    return null;
  }
}

export default function Claim() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [gwcBalance, setGwcBalance] = useState<string | null>(null);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [txState, setTxState] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const networkStats = trpc.network.getStats.useQuery(undefined, { retry: 2, retryDelay: 3000, retryOnMount: true });
  const latestEpoch = (networkStats.data as { data?: { current_epoch?: number } } | undefined)?.data?.current_epoch ?? null;

  const publicClient = createPublicClient({ chain: polygon, transport: http("https://polygon-rpc.com") });

  const loadOnChainData = useCallback(async (addr: string) => {
    try {
      const balance = await publicClient.readContract({
        address: GWC_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [addr as `0x${string}`],
      }) as bigint;
      setGwcBalance(formatUnits(balance, 18));
    } catch { /* ignore */ }
  }, []);

  const loadClaimData = useCallback(async (addr: string) => {
    setLoadingClaim(true);
    setError(null);
    try {
      const data = await fetchClaimData(addr);
      if (!data) {
        setClaimData(null);
        setError("No pending rewards found for this wallet. Make sure you've run the worker and your wallet is registered in the dashboard.");
        return;
      }

      const epochId = BigInt(data.epochId);
      const index = BigInt(data.index ?? 0);
      const amount = BigInt(data.cumulativeAmount);
      const amountGwc = data.amountGwc ?? "0";
      const proof = data.proof as `0x${string}`[];

      // Check if already claimed on-chain
      const alreadyClaimed = await publicClient.readContract({
        address: REWARD_POOL_ADDRESS,
        abi: REWARD_POOL_ABI,
        functionName: "isClaimed",
        args: [epochId, index],
      }) as boolean;

      setClaimData({ epochId, index, amount, amountGwc, proof, alreadyClaimed });
    } catch (e) {
      setError("Failed to load claim data. Please try again.");
      console.error(e);
    } finally {
      setLoadingClaim(false);
    }
  }, []);

  const handleConnect = async () => {
    const addr = await connectWallet();
    if (!addr) {
      setError("Could not connect wallet. Make sure MetaMask is installed.");
      return;
    }
    const switched = await switchToPolygon();
    if (!switched) {
      setError("Please switch to Polygon Mainnet in MetaMask.");
      return;
    }
    setWallet(addr);
    setChainId(137);
    await loadOnChainData(addr);
    await loadClaimData(addr);
  };

  const handleClaim = async () => {
    if (!wallet || !claimData || claimData.alreadyClaimed) return;
    setTxState("pending");
    setError(null);
    try {
      const walletClient = createWalletClient({
        chain: polygon,
        transport: custom(window.ethereum!),
      });
      const hash = await walletClient.writeContract({
        address: REWARD_POOL_ADDRESS,
        abi: REWARD_POOL_ABI,
        functionName: "claim",
        args: [claimData.epochId, claimData.index, wallet as `0x${string}`, claimData.amount, claimData.proof],
        account: wallet as `0x${string}`,
      });
      setTxHash(hash);
      setTxState("success");
      setTimeout(() => loadOnChainData(wallet), 3000);
    } catch (e: unknown) {
      const msg = (e as { shortMessage?: string; message?: string })?.shortMessage
        ?? (e as { message?: string })?.message
        ?? "Transaction failed";
      setError(msg);
      setTxState("error");
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccountsChanged = (accounts: unknown) => {
      const arr = accounts as string[];
      setWallet(arr[0] ?? null);
      setClaimData(null);
      setGwcBalance(null);
    };
    const onChainChanged = (id: unknown) => setChainId(parseInt(id as string, 16));
    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener("chainChanged", onChainChanged);
    };
  }, []);

  const isWrongNetwork = wallet !== null && chainId !== null && chainId !== 137;
  const claimableGWC = claimData && !claimData.alreadyClaimed ? parseFloat(claimData.amountGwc) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(2,11,24,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(6,182,212,0.1)",
        }}
      >
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}
            >
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
              GreenWaveCoin
            </span>
          </a>
          <a href="/" className="text-sm" style={{ color: "#64748b" }}>
            &larr; Back to Home
          </a>
        </div>
      </nav>

      <div className="container pt-32 pb-20 max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            className="mb-4"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            Reward Portal
          </Badge>
          <h1
            className="font-bold text-4xl mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Claim Your GWC Rewards
          </h1>
          <p className="text-lg" style={{ color: "#94a3b8" }}>
            Connect your worker wallet to check and claim your earned GWC tokens on Polygon.
          </p>
          {latestEpoch !== null && (
            <div
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#64748b",
              }}
            >
              <span>Latest epoch:</span>
              <span className="font-mono font-bold" style={{ color: "#06b6d4" }}>
                #{latestEpoch}
              </span>
            </div>
          )}
        </div>

        {/* Main card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(6,182,212,0.15)",
          }}
        >
          {/* Not connected */}
          {!wallet && (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}
              >
                <Wallet size={28} />
              </div>
              <h2
                className="font-bold text-xl mb-3"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Connect Your Wallet
              </h2>
              <p className="mb-8 text-sm" style={{ color: "#64748b" }}>
                Connect the same wallet address you registered in the worker dashboard.
              </p>
              <Button
                size="lg"
                onClick={handleConnect}
                className="gap-2 font-semibold"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #10b981)",
                  color: "#020b18",
                  border: "none",
                }}
              >
                <Wallet size={18} /> Connect MetaMask
              </Button>
              {!window.ethereum && (
                <p className="mt-4 text-sm" style={{ color: "#ef4444" }}>
                  MetaMask not detected.{" "}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Install MetaMask
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Wrong network */}
          {isWrongNetwork && (
            <div
              className="rounded-xl p-4 mb-6 flex items-start gap-3"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <AlertCircle
                size={18}
                style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <p className="font-semibold text-sm" style={{ color: "#ef4444" }}>
                  Wrong Network
                </p>
                <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                  Please switch to Polygon Mainnet in MetaMask.
                </p>
                <Button
                  size="sm"
                  className="mt-3 gap-1"
                  onClick={switchToPolygon}
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  Switch to Polygon
                </Button>
              </div>
            </div>
          )}

          {/* Connected */}
          {wallet && !isWrongNetwork && (
            <>
              {/* Wallet info bar */}
              <div
                className="rounded-xl p-4 mb-6 flex items-center justify-between"
                style={{
                  background: "rgba(6,182,212,0.05)",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}
                  >
                    <Wallet size={14} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "#64748b" }}>Connected Wallet</p>
                    <p
                      className="font-mono text-sm font-semibold"
                      style={{ color: "#f0f9ff" }}
                    >
                      {wallet.slice(0, 8)}...{wallet.slice(-6)}
                    </p>
                  </div>
                </div>
                {gwcBalance !== null && (
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "#64748b" }}>GWC Balance</p>
                    <p
                      className="font-mono text-sm font-semibold"
                      style={{ color: "#10b981" }}
                    >
                      {parseFloat(gwcBalance).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      GWC
                    </p>
                  </div>
                )}
              </div>

              {/* Loading */}
              {loadingClaim && (
                <div className="text-center py-12">
                  <Loader2
                    size={32}
                    className="animate-spin mx-auto mb-4"
                    style={{ color: "#06b6d4" }}
                  />
                  <p style={{ color: "#64748b" }}>Checking your rewards...</p>
                </div>
              )}

              {/* No rewards */}
              {!loadingClaim && claimData && claimData.alreadyClaimed && (
                <div className="text-center py-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(100,116,139,0.1)", color: "#64748b" }}
                  >
                    <Coins size={24} />
                  </div>
                  <p className="font-semibold mb-2">No Claimable Rewards</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    You have already claimed all available rewards for the current epoch.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => loadClaimData(wallet)}
                    style={{ borderColor: "rgba(6,182,212,0.3)", color: "#06b6d4" }}
                  >
                    <RefreshCw size={14} /> Refresh
                  </Button>
                </div>
              )}

              {/* Claimable */}
              {!loadingClaim &&
                claimData &&
                !claimData.alreadyClaimed &&
                txState !== "success" && (
                  <div>
                    <div
                      className="rounded-2xl p-6 mb-6 text-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.08))",
                        border: "1px solid rgba(16,185,129,0.25)",
                      }}
                    >
                      <p className="text-sm mb-2" style={{ color: "#64748b" }}>
                        Claimable GWC
                      </p>
                      <p
                        className="font-mono font-extrabold text-4xl mb-1"
                        style={{
                          color: "#10b981",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {claimableGWC.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </p>
                      <p className="text-sm" style={{ color: "#64748b" }}>
                        GWC &middot; Epoch #{claimData.epochId.toString()}
                      </p>
                    </div>

                    <div
                      className="flex items-start gap-3 rounded-xl p-4 mb-6"
                      style={{
                        background: "rgba(16,185,129,0.05)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      <ShieldCheck
                        size={16}
                        style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }}
                      />
                      <p className="text-xs" style={{ color: "#64748b" }}>
                        Your reward is verified by a Merkle proof generated from your
                        worker contribution data. The claim is processed entirely
                        on-chain — no intermediary holds your tokens.
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full gap-2 font-semibold"
                      onClick={handleClaim}
                      disabled={txState === "pending"}
                      style={{
                        background: "linear-gradient(135deg, #06b6d4, #10b981)",
                        color: "#020b18",
                        border: "none",
                      }}
                    >
                      {txState === "pending" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Confirming
                          Transaction...
                        </>
                      ) : (
                        <>
                          Claim{" "}
                          {claimableGWC.toLocaleString(undefined, {
                            maximumFractionDigits: 4,
                          })}{" "}
                          GWC <ArrowRight size={18} />
                        </>
                      )}
                    </Button>
                  </div>
                )}

              {/* Success */}
              {txState === "success" && txHash && (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h3
                    className="font-bold text-xl mb-2"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    Rewards Claimed!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                    Your GWC tokens have been sent to your wallet. It may take a few
                    seconds to appear.
                  </p>
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      color: "#10b981",
                    }}
                  >
                    <ExternalLink size={14} /> View on Polygonscan
                  </a>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  className="mt-4 rounded-xl p-4 flex items-start gap-3"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <AlertCircle
                    size={16}
                    style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}
                  />
                  <p className="text-sm" style={{ color: "#94a3b8" }}>{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: <Wallet size={16} />,
              title: "Connect Wallet",
              desc: "Use the same wallet you registered as your worker payout address.",
            },
            {
              icon: <Coins size={16} />,
              title: "Check Rewards",
              desc: "Your cumulative earnings are verified against the on-chain Merkle root.",
            },
            {
              icon: <CheckCircle2 size={16} />,
              title: "Claim On-Chain",
              desc: "One transaction sends your GWC directly to your wallet — no custodian.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(6,182,212,0.1)",
              }}
            >
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: "#06b6d4" }}
              >
                {c.icon}
                <span
                  className="font-semibold text-sm"
                  style={{ color: "#f0f9ff" }}
                >
                  {c.title}
                </span>
              </div>
              <p className="text-xs" style={{ color: "#64748b" }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
