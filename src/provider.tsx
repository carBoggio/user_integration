import type { NavigateOptions } from "react-router-dom";
import '@rainbow-me/rainbowkit/styles.css'
import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import ThemeProvider from "./providers/themeProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { megaEth } from "./components/Chains";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}


 const config = getDefaultConfig({
   appName: 'RainbowKit demo',
   projectId: import.meta.env.VITE_PROJECT_ID || '',
   chains: [megaEth, mainnet],
   transports: {
    [mainnet.id]: http(),
    [megaEth.id]: http('https://carrot.megaeth.com/rpc'), // Add transport for megaEth
   },
 })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refresh when changing window (optional)
      retry: 1, // Try once more if a query fails (optional)
    },
  },
});





export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HeroUIProvider navigate={navigate} useHref={useHref}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </HeroUIProvider> 
        </RainbowKitProvider>
         

      </QueryClientProvider>
       
    </WagmiProvider>

  );
}
