import { createConfig, http } from "wagmi";
import type { Chain } from "wagmi/chains";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

// Determine chain based on environment
const chainId = import.meta.env.VITE_CHAIN_ID
  ? Number(import.meta.env.VITE_CHAIN_ID)
  : 11155111; // Default to Sepolia for dev

const chains: readonly [Chain, ...Chain[]] =
  chainId === 1 ? [mainnet] : [sepolia];
const defaultChain = chainId === 1 ? mainnet : sepolia;

// WalletConnect connector from wagmi/connectors is deprecated
// To use WalletConnect, install @wagmi/connectors package and import from there
const connectors = [injected(), coinbaseWallet({ appName: "GoldenCity" })];

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export { chains, defaultChain };
