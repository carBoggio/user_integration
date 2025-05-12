// src/config/walletConfig.ts - Configuración detallada y personalizada de wallets

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // Wallets específicas (las más populares primero)
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  trustWallet,
  okxWallet,
  phantomWallet,
  
  // Wallets regionales populares 
  bitgetWallet,
  tokenPocketWallet,
  
  // Mobile-friendly wallets
  valoraWallet,
  omniWallet,
  
  // Hardware wallets
  ledgerWallet,
  
  // Safe Multi-sig
  safeWallet,
  
  // Generic wallets (siempre incluir estos)
  injectedWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { megaEth } from '../components/Chains'; // Importamos la cadena personalizada

// Obtén el Project ID desde variables de entorno
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'TU_PROJECT_ID';

// Función para obtener la configuración completa de RainbowKit
export const getWalletConfig = () => {
  return getDefaultConfig({
    appName: 'MegaLucky', // Nombre de tu aplicación
    projectId: WALLET_CONNECT_PROJECT_ID,
    
    // Configurar cadenas disponibles (primero aparece MegaETH como principal)
    chains: [megaEth, mainnet],
    
    // Configurar transports (endpoints RPC)
    transports: {
      [megaEth.id]: http('https://carrot.megaeth.com/rpc'),
      [mainnet.id]: http(),
    },
    
    // Uso de la nueva API de conectores con wallets agrupadas
    wallets: [
      {
        groupName: 'Recomendadas',
        wallets: [
          metaMaskWallet,
          rainbowWallet,
          coinbaseWallet,
          // Habilitar Coinbase Smart Wallet (opcional)
          // { ...coinbaseWallet, preference: 'smartWalletOnly' },
        ],
      },
      {
        groupName: 'Populares',
        wallets: [
          trustWallet,
          okxWallet,
          phantomWallet,
          ledgerWallet,
          omniWallet,
        ],
      },
      {
        groupName: 'Otras opciones',
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
    
    // Opciones adicionales
    ssr: true, // Soporte para Server-Side Rendering
  });
};

// Exportar la configuración lista para usar
export const config = getWalletConfig();
export default config;