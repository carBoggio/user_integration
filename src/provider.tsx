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


declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}


 const config = getDefaultConfig({
   appName: 'RainbowKit demo',
   projectId: 'YOUR_PROJECT_ID',
   chains: [mainnet],
   transports: {
     [mainnet.id]: http(),
   },
 })

const queryClient = new QueryClient()





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
