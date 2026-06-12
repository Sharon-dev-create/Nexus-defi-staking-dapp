export const protocolMetrics = [
  { label: "Total Value Locked", value: "$428.6M", delta: "+12.8%" },
  { label: "Rewards Distributed", value: "$37.2M", delta: "+8.4%" },
  { label: "Active Stakers", value: "86,420", delta: "+4.1%" },
  { label: "Average APY", value: "9.84%", delta: "+1.2%" },
];

export const dashboardStats = [
  { label: "Wallet Balance", value: "42.836 ETH", footnote: "$158,493.22" },
  { label: "Available Rewards", value: "1.284 NXS", footnote: "$3,942.10" },
  { label: "Current APY", value: "10.42%", footnote: "Auto-adjusting" },
  { label: "Total Staked", value: "38.500 ETH", footnote: "$142,455.00" },
  { label: "Auto-Compound", value: "Enabled", footnote: "Next in 4h 18m" },
];

export const portfolioCards = [
  { title: "Staked Assets", value: "$142,455", detail: "38.5 ETH across 3 strategies" },
  { title: "Asset Allocation", value: "68 / 22 / 10", detail: "ETH, stETH, USDC vaults" },
  { title: "Pending Rewards", value: "$3,942", detail: "Claimable with no cooldown" },
  { title: "Historical Earnings", value: "$18,736", detail: "+14.2% since inception" },
];

export const chartSeries = {
  tvl: [18, 28, 25, 44, 52, 48, 64, 72, 86, 92, 101, 116],
  rewards: [8, 14, 21, 26, 35, 42, 49, 58, 62, 73, 84, 96],
  apy: [46, 52, 48, 61, 58, 66, 64, 70, 74, 69, 76, 81],
  earnings: [12, 20, 18, 31, 36, 42, 55, 59, 66, 74, 80, 91],
};

export const transactions = [
  {
    type: "Stake",
    status: "Completed",
    timestamp: "2 min ago",
    amount: "4.250 ETH",
    hash: "0x9f3a...2c18",
  },
  {
    type: "Auto-compound",
    status: "Active",
    timestamp: "18 min ago",
    amount: "0.084 NXS",
    hash: "0x14b8...a7e9",
  },
  {
    type: "Claim",
    status: "Pending",
    timestamp: "42 min ago",
    amount: "1.284 NXS",
    hash: "0x63de...819c",
  },
  {
    type: "Unstake",
    status: "Completed",
    timestamp: "3 hr ago",
    amount: "1.000 ETH",
    hash: "0xa45d...f302",
  },
];

export const allocation = [
  { name: "ETH Secure", value: "68%", width: "68%", color: "bg-primary-interactive" },
  { name: "stETH Yield", value: "22%", width: "22%", color: "bg-emerald-bright" },
  { name: "USDC Reserve", value: "10%", width: "10%", color: "bg-gold" },
];
