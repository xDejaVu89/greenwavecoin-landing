/**
 * GreenWaveCoin — Worker Benchmarking Tool
 * Estimate your tasks/day and GWC earnings based on your hardware specs.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap, ArrowLeft, Cpu, BarChart3, Trophy, Share2,
  ChevronDown, Info, Download
} from "lucide-react";

const DOWNLOAD_EXE_URL = "https://github.com/xDejaVu89/greenwavecoin/releases/download/v1.0.0/GreenWaveCoin-Worker.exe";
const GITHUB_URL = "https://github.com/xDejaVu89/greenwavecoin";

// ─── CPU Presets ─────────────────────────────────────────────────────────────
const CPU_PRESETS = [
  { label: "Custom / Enter manually", cores: 0, ghz: 0, tasksPerCorePerHour: 0 },
  { label: "Intel Core i3 (2-core, 2.4 GHz)", cores: 2, ghz: 2.4, tasksPerCorePerHour: 18 },
  { label: "Intel Core i5 (4-core, 3.2 GHz)", cores: 4, ghz: 3.2, tasksPerCorePerHour: 22 },
  { label: "Intel Core i7 (8-core, 3.6 GHz)", cores: 8, ghz: 3.6, tasksPerCorePerHour: 26 },
  { label: "Intel Core i9 (12-core, 4.0 GHz)", cores: 12, ghz: 4.0, tasksPerCorePerHour: 30 },
  { label: "AMD Ryzen 5 (6-core, 3.6 GHz)", cores: 6, ghz: 3.6, tasksPerCorePerHour: 24 },
  { label: "AMD Ryzen 7 (8-core, 3.8 GHz)", cores: 8, ghz: 3.8, tasksPerCorePerHour: 27 },
  { label: "AMD Ryzen 9 (16-core, 4.2 GHz)", cores: 16, ghz: 4.2, tasksPerCorePerHour: 32 },
  { label: "Apple M1 (8-core, 3.2 GHz)", cores: 8, ghz: 3.2, tasksPerCorePerHour: 28 },
  { label: "Apple M2 (8-core, 3.5 GHz)", cores: 8, ghz: 3.5, tasksPerCorePerHour: 31 },
  { label: "Apple M3 Pro (12-core, 4.0 GHz)", cores: 12, ghz: 4.0, tasksPerCorePerHour: 35 },
  { label: "Raspberry Pi 4 (4-core, 1.8 GHz)", cores: 4, ghz: 1.8, tasksPerCorePerHour: 8 },
];

// Network assumptions (conservative estimates)
const NETWORK_WORKERS = 150;
const EPOCH_REWARD_POOL = 1000; // GWC per epoch
const HOURS_PER_DAY = 24;

function calcEstimates(cores: number, ghz: number, tasksPerCorePerHour: number, hoursPerDay: number) {
  // Scale tasks by GHz relative to baseline 3.0 GHz
  const ghzFactor = ghz / 3.0;
  const effectiveTasks = Math.round(cores * tasksPerCorePerHour * ghzFactor * hoursPerDay);

  // Estimate network total tasks (average worker ~200 tasks/day * 150 workers)
  const networkTotalTasks = NETWORK_WORKERS * 200;
  const shareOfNetwork = effectiveTasks / (networkTotalTasks + effectiveTasks);
  const gwcPerDay = shareOfNetwork * EPOCH_REWARD_POOL;
  const gwcPerMonth = gwcPerDay * 30;
  const gwcPerYear = gwcPerDay * 365;

  return {
    tasksPerDay: effectiveTasks,
    sharePercent: (shareOfNetwork * 100).toFixed(2),
    gwcPerDay: gwcPerDay.toFixed(1),
    gwcPerMonth: gwcPerMonth.toFixed(0),
    gwcPerYear: gwcPerYear.toFixed(0),
    rank: shareOfNetwork > 0.02 ? "Top 10%" : shareOfNetwork > 0.01 ? "Top 25%" : shareOfNetwork > 0.005 ? "Top 50%" : "Participant",
  };
}

export default function Benchmark() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [cores, setCores] = useState(4);
  const [ghz, setGhz] = useState(3.2);
  const [tasksPerCorePerHour, setTasksPerCorePerHour] = useState(22);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePresetChange = (idx: number) => {
    setSelectedPreset(idx);
    if (idx > 0) {
      const p = CPU_PRESETS[idx];
      setCores(p.cores);
      setGhz(p.ghz);
      setTasksPerCorePerHour(p.tasksPerCorePerHour);
    }
  };

  const results = calcEstimates(cores, ghz, tasksPerCorePerHour, hoursPerDay);

  const handleCalculate = () => setShowResults(true);

  const shareText = `I just benchmarked my PC for the GreenWaveCoin network!\n\n🖥️ ${cores}-core CPU @ ${ghz} GHz\n⚡ ~${results.tasksPerDay.toLocaleString()} tasks/day\n💰 ~${results.gwcPerDay} GWC/day (${results.gwcPerMonth} GWC/month)\n🏆 Estimated rank: ${results.rank}\n\nContribute idle CPU power to AI research and earn GWC tokens:\n${window.location.origin}\n\n#GreenWaveCoin #GWC #DeFi #AI`;

  const handleShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                <Cpu size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Worker Benchmarking Tool</span>
            </div>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-sm hidden sm:block" style={{ color: "#64748b" }}>
            View on GitHub →
          </a>
        </div>
      </nav>

      <div className="container pt-28 pb-20 max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4" }}>
            <Cpu size={12} /> Earnings Estimator
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #f0f9ff 0%, #06b6d4 60%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            How Much Can You Earn?
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
            Enter your CPU specs and see your estimated daily GWC earnings before you download the worker.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(6,182,212,0.2)" }}>

          {/* CPU Preset */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: "#94a3b8" }}>Select your CPU (or enter manually below)</label>
            <div className="relative">
              <select
                value={selectedPreset}
                onChange={e => handlePresetChange(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl text-sm appearance-none outline-none cursor-pointer"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(6,182,212,0.25)", color: "#f0f9ff" }}
              >
                {CPU_PRESETS.map((p, i) => (
                  <option key={i} value={i} style={{ background: "#071428" }}>{p.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#64748b" }} />
            </div>
          </div>

          {/* Manual Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "CPU Cores", value: cores, setter: setCores, min: 1, max: 64, step: 1, unit: "cores" },
              { label: "Clock Speed", value: ghz, setter: setGhz, min: 0.5, max: 6.0, step: 0.1, unit: "GHz" },
              { label: "Tasks/Core/Hr", value: tasksPerCorePerHour, setter: setTasksPerCorePerHour, min: 1, max: 60, step: 1, unit: "tasks" },
              { label: "Hours/Day", value: hoursPerDay, setter: setHoursPerDay, min: 1, max: 24, step: 1, unit: "hrs" },
            ].map(({ label, value, setter, min, max, step, unit }) => (
              <div key={label}>
                <label className="block text-xs mb-1.5" style={{ color: "#64748b" }}>{label}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={e => { setter(Number(e.target.value)); setSelectedPreset(0); setShowResults(false); }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.5)", color: "#f0f9ff", fontFamily: "JetBrains Mono, monospace" }}
                  />
                </div>
                <span className="text-xs mt-1 block" style={{ color: "#475569" }}>{unit}</span>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 mb-6 p-3 rounded-lg" style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)" }}>
            <Info size={14} className="mt-0.5 shrink-0" style={{ color: "#06b6d4" }} />
            <p className="text-xs" style={{ color: "#64748b" }}>
              Estimates assume a network of ~{NETWORK_WORKERS} active workers and a {EPOCH_REWARD_POOL} GWC/epoch reward pool. Actual earnings vary with network growth, your hardware performance, and uptime. These are indicative figures only.
            </p>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full py-3 text-base font-bold"
            style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}
          >
            <BarChart3 size={18} className="mr-2" /> Calculate My Earnings
          </Button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="rounded-2xl p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ background: "rgba(7,20,40,0.9)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={20} style={{ color: "#f59e0b" }} />
              <h2 className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Your Estimated Results</h2>
              <span className="ml-auto text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>{results.rank}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Tasks / Day", value: results.tasksPerDay.toLocaleString(), color: "#06b6d4", sub: `${cores} cores × ${hoursPerDay}h` },
                { label: "GWC / Day", value: results.gwcPerDay, color: "#10b981", sub: `${results.sharePercent}% of pool` },
                { label: "GWC / Month", value: results.gwcPerMonth, color: "#8b5cf6", sub: "30-day estimate" },
                { label: "GWC / Year", value: results.gwcPerYear, color: "#f59e0b", sub: "365-day estimate" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(51,65,85,0.4)" }}>
                  <div className="text-2xl font-black font-mono mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "#f0f9ff" }}>{s.label}</div>
                  <div className="text-xs" style={{ color: "#475569" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Share card */}
            <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(51,65,85,0.4)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "pre-line", lineHeight: 1.7 }}>
              {shareText}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleShare} className="flex-1 gap-2" style={{ background: "rgba(29,161,242,0.1)", border: "1px solid rgba(29,161,242,0.3)", color: "#1da1f2" }}>
                <Share2 size={15} /> Share on X
              </Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2" style={{ borderColor: "rgba(51,65,85,0.5)", color: "#94a3b8", background: "transparent" }}>
                {copied ? "✓ Copied!" : "Copy Text"}
              </Button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(16,185,129,0.08))", border: "1px solid rgba(6,182,212,0.2)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Ready to start earning?</h3>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>Download the worker, configure your wallet, and start contributing to AI research in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={DOWNLOAD_EXE_URL}>
              <Button className="gap-2 px-6" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
                <Download size={16} /> Download Worker (Windows)
              </Button>
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 px-6" style={{ borderColor: "rgba(6,182,212,0.3)", color: "#06b6d4", background: "transparent" }}>
                View Source on GitHub
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
