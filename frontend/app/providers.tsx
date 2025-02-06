"use client"

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const baseSepolia = {
  id: 84531,
  name: "Base Sepolia",
  network: "base-sepolia",
  rpcUrls: {
    default: "https://base-sepolia.g.alchemy.com/v2/c9luSIn-9uUW-b79ay_Pf6pVf8rlc3i3",
  },
};

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '9d628ef11571314fe46f64250f60e9d9',
  chains: [mainnet, polygon, optimism, arbitrum, base , base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};