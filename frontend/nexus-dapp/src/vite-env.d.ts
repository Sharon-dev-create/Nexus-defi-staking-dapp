/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ETH_STAKING_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  ethereum?: import("./lib/ethStaking").EthereumProvider;
}
