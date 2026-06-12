export type HexString = `0x${string}`;

export type EthereumProvider = {
  request<T = unknown>(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<T>;
  on?: (event: "accountsChanged" | "chainChanged", listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: "accountsChanged" | "chainChanged", listener: (...args: unknown[]) => void) => void;
};

export type StakePosition = {
  stakeId: bigint;
  amount: bigint;
  stakedAt: bigint;
  rewardsClaimed: bigint;
  withdrawn: boolean;
  claimableRewards: bigint;
};

export type ContractStats = {
  totalStaked: bigint;
  totalRewardsPaid: bigint;
  totalPenaltiesCollected: bigint;
  contractBalance: bigint;
};

const ETHER = 10n ** 18n;

const SELECTORS = {
  stake: "0x3a4b66f1",
  claimRewards: "0x0962ef79",
  unstake: "0x2e17de78",
  totalStaked: "0x817b1cd2",
  totalRewardsPaid: "0x74958e35",
  totalPenaltiesCollected: "0x7eaacdb0",
  getContractBalance: "0x6f9fb98a",
  userStakes: "0xb5d5b5fa",
  getClaimableRewards: "0x533f852e",
} as const;

export function getBrowserProvider(): EthereumProvider | null {
  return window.ethereum ?? null;
}

export function getConfiguredContractAddress(): HexString | null {
  const address = import.meta.env.VITE_ETH_STAKING_ADDRESS;

  if (typeof address !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return null;
  }

  return address as HexString;
}

export function parseEth(value: string): bigint {
  const trimmed = value.trim();

  if (!/^\d+(\.\d{0,18})?$/.test(trimmed)) {
    throw new Error("Enter a valid ETH amount with up to 18 decimals.");
  }

  const [whole, fractional = ""] = trimmed.split(".");
  return BigInt(whole) * ETHER + BigInt(fractional.padEnd(18, "0"));
}

export function formatEth(value: bigint, decimals = 4): string {
  const whole = value / ETHER;
  const fractional = value % ETHER;

  if (decimals === 0 || fractional === 0n) {
    return whole.toString();
  }

  const fraction = fractional.toString().padStart(18, "0").slice(0, decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function weiToHex(value: bigint): HexString {
  return `0x${value.toString(16)}` as HexString;
}

function encodeUint(value: bigint | number): string {
  return BigInt(value).toString(16).padStart(64, "0");
}

function encodeAddress(address: string): string {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function decodeWords(data: HexString): string[] {
  const raw = data.replace(/^0x/, "");
  return raw.match(/.{1,64}/g) ?? [];
}

function decodeUint(data: HexString): bigint {
  return data === "0x" ? 0n : BigInt(data);
}

function decodeStake(data: HexString): Omit<StakePosition, "claimableRewards"> {
  const [stakeId, amount, stakedAt, rewardsClaimed, withdrawn] = decodeWords(data);

  return {
    stakeId: BigInt(`0x${stakeId}`),
    amount: BigInt(`0x${amount}`),
    stakedAt: BigInt(`0x${stakedAt}`),
    rewardsClaimed: BigInt(`0x${rewardsClaimed}`),
    withdrawn: BigInt(`0x${withdrawn}`) === 1n,
  };
}

async function call(provider: EthereumProvider, contractAddress: HexString, data: HexString): Promise<HexString> {
  return provider.request<HexString>({
    method: "eth_call",
    params: [{ to: contractAddress, data }, "latest"],
  });
}

async function sendTransaction(
  provider: EthereumProvider,
  from: HexString,
  contractAddress: HexString,
  data: HexString,
  value?: bigint
): Promise<HexString> {
  return provider.request<HexString>({
    method: "eth_sendTransaction",
    params: [
      {
        from,
        to: contractAddress,
        data,
        ...(value !== undefined ? { value: weiToHex(value) } : {}),
      },
    ],
  });
}

export async function requestAccounts(provider: EthereumProvider): Promise<HexString[]> {
  return provider.request<HexString[]>({ method: "eth_requestAccounts" });
}

export async function getAccounts(provider: EthereumProvider): Promise<HexString[]> {
  return provider.request<HexString[]>({ method: "eth_accounts" });
}

export async function getChainId(provider: EthereumProvider): Promise<HexString> {
  return provider.request<HexString>({ method: "eth_chainId" });
}

export async function getWalletBalance(provider: EthereumProvider, account: HexString): Promise<bigint> {
  const balance = await provider.request<HexString>({
    method: "eth_getBalance",
    params: [account, "latest"],
  });

  return BigInt(balance);
}

export async function getContractStats(
  provider: EthereumProvider,
  contractAddress: HexString
): Promise<ContractStats> {
  const [totalStaked, totalRewardsPaid, totalPenaltiesCollected, contractBalance] = await Promise.all([
    call(provider, contractAddress, SELECTORS.totalStaked),
    call(provider, contractAddress, SELECTORS.totalRewardsPaid),
    call(provider, contractAddress, SELECTORS.totalPenaltiesCollected),
    call(provider, contractAddress, SELECTORS.getContractBalance),
  ]);

  return {
    totalStaked: decodeUint(totalStaked),
    totalRewardsPaid: decodeUint(totalRewardsPaid),
    totalPenaltiesCollected: decodeUint(totalPenaltiesCollected),
    contractBalance: decodeUint(contractBalance),
  };
}

export async function getStakePositions(
  provider: EthereumProvider,
  contractAddress: HexString,
  account: HexString,
  maxPositions = 25
): Promise<StakePosition[]> {
  const positions: StakePosition[] = [];

  for (let index = 0; index < maxPositions; index += 1) {
    try {
      const stakeData = await call(
        provider,
        contractAddress,
        `${SELECTORS.userStakes}${encodeAddress(account)}${encodeUint(index)}` as HexString
      );
      const stake = decodeStake(stakeData);
      const rewardData = stake.withdrawn
        ? "0x0"
        : await call(
            provider,
            contractAddress,
            `${SELECTORS.getClaimableRewards}${encodeAddress(account)}${encodeUint(index)}` as HexString
          );

      positions.push({
        ...stake,
        claimableRewards: decodeUint(rewardData as HexString),
      });
    } catch {
      break;
    }
  }

  return positions;
}

export async function stakeEth(
  provider: EthereumProvider,
  contractAddress: HexString,
  account: HexString,
  amount: bigint
): Promise<HexString> {
  return sendTransaction(provider, account, contractAddress, SELECTORS.stake, amount);
}

export async function claimRewards(
  provider: EthereumProvider,
  contractAddress: HexString,
  account: HexString,
  stakeId: bigint
): Promise<HexString> {
  return sendTransaction(
    provider,
    account,
    contractAddress,
    `${SELECTORS.claimRewards}${encodeUint(stakeId)}` as HexString
  );
}

export async function unstake(
  provider: EthereumProvider,
  contractAddress: HexString,
  account: HexString,
  stakeId: bigint
): Promise<HexString> {
  return sendTransaction(provider, account, contractAddress, `${SELECTORS.unstake}${encodeUint(stakeId)}` as HexString);
}

export async function waitForTransaction(provider: EthereumProvider, hash: HexString): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const receipt = await provider.request<unknown>({
      method: "eth_getTransactionReceipt",
      params: [hash],
    });

    if (receipt !== null) {
      return;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 2000));
  }

  throw new Error("Transaction submitted, but confirmation timed out. Refresh once it is mined.");
}
