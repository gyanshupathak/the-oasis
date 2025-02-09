"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'The Oasis',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base , baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiConfig>
    </QueryClientProvider>
  );
}
