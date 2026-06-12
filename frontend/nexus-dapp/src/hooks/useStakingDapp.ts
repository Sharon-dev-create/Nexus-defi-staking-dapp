import { useCallback, useEffect, useMemo, useState } from "react";
import {
  claimRewards,
  formatEth,
  getAccounts,
  getBrowserProvider,
  getChainId,
  getConfiguredContractAddress,
  getContractStats,
  getStakePositions,
  getWalletBalance,
  parseEth,
  requestAccounts,
  stakeEth,
  type ContractStats,
  type HexString,
  type StakePosition,
  unstake,
  waitForTransaction,
} from "../lib/ethStaking";

const EMPTY_STATS: ContractStats = {
  totalStaked: 0n,
  totalRewardsPaid: 0n,
  totalPenaltiesCollected: 0n,
  contractBalance: 0n,
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Something went wrong.";
}

export function useStakingDapp() {
  const contractAddress = useMemo(() => getConfiguredContractAddress(), []);
  const [account, setAccount] = useState<HexString | null>(null);
  const [chainId, setChainId] = useState<HexString | null>(null);
  const [walletBalance, setWalletBalance] = useState(0n);
  const [stats, setStats] = useState<ContractStats>(EMPTY_STATS);
  const [positions, setPositions] = useState<StakePosition[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const provider = getBrowserProvider();
  const hasWallet = provider !== null;
  const isContractReady = contractAddress !== null;

  const refresh = useCallback(
    async (nextAccount = account) => {
      if (provider === null || nextAccount === null) {
        return;
      }

      const [nextChainId, nextBalance] = await Promise.all([
        getChainId(provider),
        getWalletBalance(provider, nextAccount),
      ]);

      setChainId(nextChainId);
      setWalletBalance(nextBalance);

      if (contractAddress === null) {
        setStats(EMPTY_STATS);
        setPositions([]);
        return;
      }

      const [nextStats, nextPositions] = await Promise.all([
        getContractStats(provider, contractAddress),
        getStakePositions(provider, contractAddress, nextAccount),
      ]);

      setStats(nextStats);
      setPositions(nextPositions);
    },
    [account, contractAddress, provider]
  );

  const connect = useCallback(async () => {
    if (provider === null) {
      setError("No injected wallet found. Install MetaMask or another EIP-1193 wallet.");
      return;
    }

    setIsConnecting(true);
    setError("");
    setStatus("Requesting wallet access...");

    try {
      const accounts = await requestAccounts(provider);
      const nextAccount = accounts[0] ?? null;
      setAccount(nextAccount);
      setStatus(nextAccount ? "Wallet connected." : "No wallet account selected.");
      await refresh(nextAccount);
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      setStatus("");
    } finally {
      setIsConnecting(false);
    }
  }, [provider, refresh]);

  const runTransaction = useCallback(
    async (label: string, action: () => Promise<HexString>) => {
      setIsBusy(true);
      setError("");
      setStatus(`${label} transaction waiting for wallet confirmation...`);

      try {
        const hash = await action();
        setStatus(`Transaction submitted: ${hash.slice(0, 10)}...${hash.slice(-6)}. Waiting for confirmation...`);
        await waitForTransaction(provider!, hash);
        setStatus(`${label} confirmed.`);
        await refresh();
      } catch (nextError) {
        setError(getErrorMessage(nextError));
        setStatus("");
      } finally {
        setIsBusy(false);
      }
    },
    [provider, refresh]
  );

  const submitStake = useCallback(
    async (amount: string) => {
      if (provider === null) {
        await connect();
        return;
      }

      if (account === null) {
        await connect();
        return;
      }

      if (contractAddress === null) {
        setError("Set VITE_ETH_STAKING_ADDRESS in the frontend env file before staking.");
        return;
      }

      const wei = parseEth(amount);

      if (wei <= 0n) {
        setError("Stake amount must be greater than zero.");
        return;
      }

      await runTransaction("Stake", () => stakeEth(provider, contractAddress, account, wei));
    },
    [account, connect, contractAddress, provider, runTransaction]
  );

  const submitClaim = useCallback(
    async (stakeId: bigint) => {
      if (provider === null || account === null) {
        await connect();
        return;
      }

      if (contractAddress === null) {
        setError("Set VITE_ETH_STAKING_ADDRESS in the frontend env file before claiming.");
        return;
      }

      await runTransaction("Claim", () => claimRewards(provider, contractAddress, account, stakeId));
    },
    [account, connect, contractAddress, provider, runTransaction]
  );

  const submitUnstake = useCallback(
    async (stakeId: bigint) => {
      if (provider === null || account === null) {
        await connect();
        return;
      }

      if (contractAddress === null) {
        setError("Set VITE_ETH_STAKING_ADDRESS in the frontend env file before unstaking.");
        return;
      }

      await runTransaction("Unstake", () => unstake(provider, contractAddress, account, stakeId));
    },
    [account, connect, contractAddress, provider, runTransaction]
  );

  useEffect(() => {
    if (provider === null) {
      return;
    }

    getAccounts(provider)
      .then(async (accounts) => {
        const nextAccount = accounts[0] ?? null;
        setAccount(nextAccount);

        if (nextAccount !== null) {
          await refresh(nextAccount);
        }
      })
      .catch(() => undefined);
  }, [provider, refresh]);

  useEffect(() => {
    if (provider?.on === undefined) {
      return;
    }

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = (args[0] as HexString[] | undefined) ?? [];
      const nextAccount = accounts[0] ?? null;
      setAccount(nextAccount);
      setStatus(nextAccount ? "Wallet account changed." : "Wallet disconnected.");
      void refresh(nextAccount);
    };

    const handleChainChanged = (...args: unknown[]) => {
      setChainId(args[0] as HexString);
      setStatus("Network changed.");
      void refresh();
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);

    return () => {
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
      provider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [provider, refresh]);

  return {
    account,
    chainId,
    contractAddress,
    error,
    formatEth,
    hasWallet,
    isBusy,
    isConnecting,
    isContractReady,
    positions,
    refresh,
    stats,
    status,
    submitClaim,
    submitStake,
    submitUnstake,
    walletBalance,
  };
}

export type StakingDappState = ReturnType<typeof useStakingDapp>;
