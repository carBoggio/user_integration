import { Chain } from '@rainbow-me/rainbowkit'

export const megaEth = {
    id: 6342,
    name: 'MEGA Testnet',
    iconUrl: 'https://img.cryptorank.io/coins/mega_eth1736756550892.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'MEGA Testnet Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://carrot.megaeth.com/rpc'] },
    },
    blockExplorers: {
      default: { name: 'MegaExplorer', url: 'https://megaexplorer.xyz' },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11', // Usando la misma dirección que en el ejemplo, reemplázala si es diferente
        blockCreated: 1, // Asumiendo que es el bloque inicial, ajústalo según sea necesario
      },
    },
  } as const satisfies Chain