import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight, 
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  DatabaseZap,
  Gem, 
  Layers3,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "./components/Button";
import { ChartCard } from "./components/ChartCard";
import { GlassCard } from "./components/GlassCard";
import { MetricCard } from "./components/MetricCard";
import {
  allocation,
  chartSeries,
  dashboardStats,
  portfolioCards,
  protocolMetrics,
  transactions,
} from "./data/mockData";
import { getBrowserProvider, requestAccounts, shortenAddress } from "./lib/ethStaking";        

const navLinks = ["Home", "Stake", "Dashboard", "Analytics", "Docs"];

const SEPOLIA_CHAIN_ID = "";

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary-electric">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-text-primary md:text-[32px]">{title}</h2>
      <p className="mt-4 text-base leading-8 text-text-secondary md:text-lg">{copy}</p>
    </div>
  );
}

function Navigation({ walletConnected, walletAddress, onConnect }: { walletConnected: boolean;
  walletAddress?: string; onConnect: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/80 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label="Nexus Protocol home">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary-electric/30 bg-primary-interactive/20 shadow-glow">
            <DatabaseZap className="h-5 w-5 text-primary-electric" />
          </span>
          <span>
            <span className="block text-lg font-semibold text-text-primary">Nexus</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">
              Protocol
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-border-subtle bg-surface-100/70 p-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-white/5 hover:text-text-primary"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button onClick={onConnect} aria-label="Connect wallet">
            <Wallet className="h-4 w-4" />
            {walletConnected && walletAddress ? shortenAddress(walletAddress) : "Connect Wallet"}
          </Button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-border-subtle text-text-primary md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border-subtle bg-surface-100 px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="rounded-xl px-3 py-3 text-text-secondary hover:bg-white/5 hover:text-text-primary"
                onClick={() => setOpen(false)}
              >
                {link}
              </a>
            ))}
            <Button onClick={onConnect} className="mt-2 w-full">
              <Wallet className="h-4 w-4" />
              {walletConnected && walletAddress ? shortenAddress(walletAddress) : "Connect Wallet"}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

function Hero({ walletConnected, onConnect }: { walletConnected: boolean; onConnect: () => Promise<void>; }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { x: [0, 24, -10, 0], y: [0, -20, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-12rem] top-12 h-96 w-96 rounded-full bg-radial-blue blur-2xl"
      />
      <motion.div
        aria-hidden="true"
        animate={prefersReducedMotion ? undefined : { x: [0, -18, 16, 0], y: [0, 18, -14, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-10rem] top-36 h-96 w-96 rounded-full bg-radial-emerald blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-3 py-2 text-sm text-text-secondary backdrop-blur-xl">
              <ShieldCheck className="h-4 w-4 text-emerald-bright" />
              Audited staking infrastructure for liquid capital
            </div>
            <h1 className="mt-7 max-w-4xl text-[42px] font-bold leading-[1.05] text-text-primary md:text-5xl">
              Put Your Assets to Work
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              Stake blue-chip assets into transparent reward vaults engineered for disciplined
              yield, deep liquidity, and institutional-grade risk controls.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onConnect}>
                <CircleDollarSign className="h-4 w-4" />
                {walletConnected ? "Stake Now" : "Connect to Stake"}
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById("analytics")?.scrollIntoView()}>
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <GlassCard className="relative overflow-hidden p-5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-electric to-transparent" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Protocol solvency</p>
                  <p className="mt-2 font-mono text-3xl font-semibold text-text-primary">108.34%</p>
                </div>
                <span className="rounded-full border border-emerald-bright/30 bg-emerald-bright/10 px-3 py-1 font-mono text-xs text-emerald-bright">
                  Live
                </span>
              </div>
              <div className="mt-8 space-y-5">
                {["Slashing Coverage", "Oracle Confidence", "Liquidity Buffer"].map((label, index) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{label}</span>
                      <span className="font-mono text-text-primary">{[96, 99, 87][index]}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-400">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${[96, 99, 87][index]}%` }}
                        transition={{ duration: 0.9, delay: 0.2 + index * 0.12 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-interactive to-emerald-bright"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border-subtle bg-background/50 p-4">
                  <p className="text-xs text-text-muted">Validator Set</p>
                  <p className="mt-2 font-mono text-xl text-text-primary">142</p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-background/50 p-4">
                  <p className="text-xs text-text-muted">Epoch Yield</p>
                  <p className="mt-2 font-mono text-xl text-text-primary">$812K</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {protocolMetrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StakingDashboard() {
  const [autoCompound, setAutoCompound] = useState(true);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  return (
    <section id="stake" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Staking Console"
          title="Capital-efficient vault access"
          copy="Manage deposits, rewards, exits, and compounding from one responsive control plane."
        />

        <GlassCard className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dashboardStats.map((stat, index) => (
              <MetricCard key={stat.label} {...stat} delay={index * 0.05} />
            ))}
          </div>

          <div id="dashboard" className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <GlassCard className="h-full">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-text-primary">Stake Assets</h3>
                  <span className="rounded-full border border-primary-electric/30 bg-primary-interactive/10 px-3 py-1 font-mono text-xs text-primary-electric">
                    ETH Vault
                  </span>
                </div>
                <form className="mt-6 space-y-5">
                  <label className="block">
                    <span className="text-sm font-medium text-text-secondary">Token</span>
                    <button
                      type="button"
                      className="mt-2 flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-background/60 px-4 py-4 text-left text-text-primary"
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-electric text-sm font-bold text-background">
                          ETH
                        </span>
                        Ethereum
                      </span>
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    </button>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-text-secondary">Amount</span>
                    <div className="mt-2 flex rounded-2xl border border-border-subtle bg-background/60 p-2 focus-within:border-primary-interactive">
                      <input
                        value={stakeAmount}
                        onChange={(event) => setStakeAmount(event.target.value)}
                        inputMode="decimal"
                        placeholder="0.00"
                        aria-label="Stake amount"
                        className="min-w-0 flex-1 bg-transparent px-3 font-mono text-2xl text-text-primary outline-none placeholder:text-text-muted"
                      />
                      <button
                        type="button"
                        onClick={() => setStakeAmount("42.836")}
                        className="rounded-full border border-border-subtle px-4 py-2 font-mono text-sm text-primary-electric transition hover:border-primary-interactive"
                      >
                        MAX
                      </button>
                    </div>
                  </label>
                  <Button className="w-full" type="button">
                    <LockKeyhole className="h-4 w-4" />
                    Stake Now
                  </Button>
                </form>
              </GlassCard>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <GlassCard>
                <h3 className="text-2xl font-semibold text-text-primary">Unstake</h3>
                <label className="mt-5 block">
                  <span className="text-sm font-medium text-text-secondary">Amount</span>
                  <input
                    value={unstakeAmount}
                    onChange={(event) => setUnstakeAmount(event.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    aria-label="Unstake amount"
                    className="mt-2 w-full rounded-2xl border border-border-subtle bg-background/60 px-4 py-4 font-mono text-2xl text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-interactive"
                  />
                </label>
                <Button variant="ghost" className="mt-5 w-full" type="button">
                  Unstake
                </Button>
              </GlassCard>
              <GlassCard>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-text-primary">Claim Rewards</h3>
                    <p className="mt-2 text-text-muted">Pending rewards</p>
                  </div>
                  <p className="font-mono text-xl text-emerald-bright">1.284 NXS</p>
                </div>
                <Button variant="secondary" className="mt-6 w-full" type="button">
                  <Gem className="h-4 w-4" />
                  Claim Rewards
                </Button>
              </GlassCard>
            </div>

            <div className="lg:col-span-3">
              <GlassCard className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-text-primary">Auto-Compound</h3>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      Rewards roll into the selected vault at the next protocol epoch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoCompound((value) => !value)}
                    className={`relative h-8 w-14 rounded-full border transition ${
                      autoCompound
                        ? "border-emerald-bright bg-emerald-bright/20"
                        : "border-border-strong bg-surface-400"
                    }`}
                    aria-pressed={autoCompound}
                    aria-label="Toggle auto-compound"
                  >
                    <motion.span
                      animate={{ x: autoCompound ? 24 : 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-text-primary"
                    >
                      {autoCompound ? <Check className="h-3.5 w-3.5 text-background" /> : null}
                    </motion.span>
                  </button>
                </div>
                <div className="mt-8 space-y-4">
                  {["MEV-aware routing", "Validator diversification", "Daily reward sweep"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                      <ShieldCheck className="h-4 w-4 text-emerald-bright" />
                      {item}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function PortfolioSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Portfolio"
          title="Position intelligence at a glance"
          copy="Monitor allocations, unrealized rewards, and capital flow without leaving the protocol surface."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {portfolioCards.map((card, index) => (
            <GlassCard key={card.title} delay={index * 0.08}>
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-text-muted">{card.detail}</p>
                </div>
                <p className="font-mono text-3xl font-semibold text-text-primary">{card.value}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold text-text-primary">Asset Allocation</h3>
              <p className="mt-2 text-text-muted">Strategy exposure by active capital.</p>
            </div>
            <span className="font-mono text-sm text-text-secondary">Risk target: Balanced</span>
          </div>
          <div className="mt-8 overflow-hidden rounded-full bg-surface-400">
            <div className="flex h-4">
              {allocation.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ width: 0 }}
                  whileInView={{ width: item.width }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  className={item.color}
                />
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {allocation.map((item) => (
              <div key={item.name} className="rounded-xl border border-border-subtle bg-background/50 p-4">
                <p className="text-sm text-text-muted">{item.name}</p>
                <p className="mt-2 font-mono text-xl text-text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section id="analytics" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Analytics"
          title="Institutional market telemetry"
          copy="Track protocol health, reward velocity, APY stability, and account-level earnings curves."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="TVL Chart" value="$428.6M" series={chartSeries.tvl} />
          <ChartCard title="Rewards Growth" value="$37.2M" series={chartSeries.rewards} accent="emerald" />
          <ChartCard title="APY History" value="9.84%" series={chartSeries.apy} accent="gold" />
          <ChartCard title="User Earnings" value="$18,736" series={chartSeries.earnings} accent="blue" />
        </div>
      </div>
    </section>
  );
}

function TransactionHistory() {
  const statusClasses = {
    Active: "border-primary-electric/30 bg-primary-interactive/10 text-primary-electric",
    Pending: "border-gold/30 bg-gold/10 text-gold",
    Completed: "border-emerald-bright/30 bg-emerald-bright/10 text-emerald-bright",
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Activity"
          title="Transparent transaction history"
          copy="Every protocol action is surfaced with status, timing, amount, and verifiable transaction hash."
        />
        <GlassCard className="overflow-hidden p-0">
          <div className="grid grid-cols-12 border-b border-border-subtle px-5 py-4 text-xs uppercase tracking-[0.18em] text-text-muted">
            <span className="col-span-4 md:col-span-3">Event</span>
            <span className="hidden md:col-span-2 md:block">Status</span>
            <span className="col-span-4 md:col-span-2">Timestamp</span>
            <span className="col-span-4 md:col-span-2">Amount</span>
            <span className="hidden md:col-span-3 md:block">Transaction Hash</span>
          </div>
          <div className="divide-y divide-border-subtle">
            {transactions.map((transaction, index) => (
              <motion.div
                key={`${transaction.type}-${transaction.hash}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="grid grid-cols-12 items-center gap-3 px-5 py-5"
              >
                <div className="col-span-4 flex items-center gap-3 md:col-span-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border-subtle bg-white/5">
                    {transaction.type === "Stake" ? (
                      <Layers3 className="h-4 w-4 text-primary-electric" />
                    ) : transaction.type === "Claim" ? (
                      <Gem className="h-4 w-4 text-emerald-bright" />
                    ) : transaction.type === "Unstake" ? (
                      <ArrowUpRight className="h-4 w-4 text-gold" />
                    ) : (
                      <Clock3 className="h-4 w-4 text-primary-electric" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-text-primary">{transaction.type}</span>
                </div>
                <div className="hidden md:col-span-2 md:block">
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-xs ${
                      statusClasses[transaction.status as keyof typeof statusClasses]
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <span className="col-span-4 text-sm text-text-secondary md:col-span-2">
                  {transaction.timestamp}
                </span>
                <span className="col-span-4 font-mono text-sm text-text-primary md:col-span-2">
                  {transaction.amount}
                </span>
                <span className="hidden font-mono text-sm text-text-muted md:col-span-3 md:block">
                  {transaction.hash}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function DocsSection() {
  const resources = [
    { title: "Protocol Docs", detail: "Vault mechanics, lifecycle states, and integration references." },
    { title: "Risk Framework", detail: "Validator policy, oracle quorum design, and liquidity controls." },
    { title: "Security Reports", detail: "Audit summaries, monitoring scope, and incident response process." },
  ];

  return (
    <section id="docs" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Docs"
          title="Built for transparent diligence"
          copy="Protocol resources are organized around risk, capital movement, and operational accountability."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {resources.map((resource, index) => (
            <GlassCard key={resource.title} delay={index * 0.08}>
              <h3 className="text-2xl font-semibold text-text-primary">{resource.title}</h3>
              <p className="mt-4 min-h-16 leading-7 text-text-secondary">{resource.detail}</p>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-primary-electric transition hover:text-primary-electric/80"
              >
                Open resource
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress ] = useState<string>("");
  const [wallet, setWallet] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string>("");

  const function switchToSepolia() {
    if(!window.ethereum) return false;

    try {
      await window.ethereum.request({
        methos: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID}],
      });

      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }

  const connectWallet = async () => {
  try {
    const provider = getBrowserProvider();

    if (!provider) {
      alert("Please install MetaMask")
      return;
    }

    const accounts = await requestAccounts(provider);

    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
    }
  }
  catch (error){
    console.error(error);
    alert("Wallet connection failed")
  }
  };

  const securityFacts = useMemo(
    () => [
      "Proof-of-reserve attestations",
      "Multi-oracle APY validation",
      "Non-custodial staking flow",
      "Continuous risk monitoring",
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navigation walletConnected={walletConnected} walletAddress={walletAddress} onConnect={connectWallet} />
      <main>
        <Hero walletConnected={walletConnected} onConnect={connectWallet} />

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {securityFacts.map((fact, index) => (
              <motion.div
                key={fact}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-100/70 p-4 backdrop-blur-xl"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-bright" />
                <span className="text-sm text-text-secondary">{fact}</span>
              </motion.div>
            ))}
          </div>
        </section>
        <StakingDashboard />
        <PortfolioSection />
        <AnalyticsSection />
        <TransactionHistory />
        <DocsSection />
      </main>
      <footer className="border-t border-border-subtle px-4 py-8 text-center text-sm text-text-muted sm:px-6 lg:px-8">
        Nexus Protocol manages mock institutional staking data for interface demonstration.
      </footer>
    </div>
  );
}

export default App;
