import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
} from "viem";
import { sepolia } from "viem/chains";

export const CONTRACT_ADDRESS: Address =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";


export const stakingAbi = [
  {
    name: "stake",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "unstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "stakeId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "claimRewards",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "stakeId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getUserStakes",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "stakeId", type: "uint256" },
          { name: "amount", type: "uint256" },
          { name: "stakedAt", type: "uint256" },
          { name: "rewardsClaimed", type: "uint256" },
          { name: "withdrawn", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "getClaimableRewards",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "stakeId", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getTreasuryStats",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "currentTotalStaked", type: "uint256" },
      { name: "currentTotalRewardsPaid", type: "uint256" },
      { name: "currentTotalPenaltiesCollected", type: "uint256" },
    ],
  },
  {
    name: "totalStaked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;


export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});