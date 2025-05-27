// src/config/walletConfig.ts - Detailed and customized wallet configuration

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // Specific wallets (most popular first)
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  trustWallet,
  okxWallet,
  phantomWallet,
  
  // Popular regional wallets 
  bitgetWallet,
  tokenPocketWallet,
  
  // Mobile-friendly wallets
  valoraWallet,
  omniWallet,
  
  // Hardware wallets
  ledgerWallet,
  
  // Safe Multi-sig
  safeWallet,
  
  // Generic wallets (always include these)
  injectedWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { megaEth } from '../components/Chains'; // Import the custom chain

// Get the Project ID from environment variables
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'TU_PROJECT_ID';

// Function to get the complete RainbowKit configuration
export const getWalletConfig = () => {
  return getDefaultConfig({
    appName: 'MegaLucky', // Your application name
    projectId: WALLET_CONNECT_PROJECT_ID,
    
    // Configure available chains (MegaETH appears first as main)
    chains: [megaEth, mainnet],
    
    // Configure transports (RPC endpoints)
    transports: {
      [megaEth.id]: http('https://carrot.megaeth.com/rpc'),
      [mainnet.id]: http(),
    },
    
    // Use of the new connector API with grouped wallets
    wallets: [
      {
        groupName: 'Recommended',
        wallets: [
          metaMaskWallet,
          rainbowWallet,
          coinbaseWallet,
          // Enable Coinbase Smart Wallet (optional)
          // { ...coinbaseWallet, preference: 'smartWalletOnly' },
        ],
      },
      {
        groupName: 'Popular',
        wallets: [
          trustWallet,
          okxWallet,
          phantomWallet,
          ledgerWallet,
          omniWallet,
        ],
      },
      {
        groupName: 'Other options',
        wallets: [
          bitgetWallet,
          tokenPocketWallet,
          valoraWallet,
          safeWallet,
         
          injectedWallet,
          walletConnectWallet,
        ],
      }
    ],
    
    // Additional options
    ssr: true, // Support for Server-Side Rendering
  });
};

// Export the ready-to-use configuration
export const config = getWalletConfig();
export default config;