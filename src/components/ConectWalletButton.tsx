import React, { useState } from 'react';
import { Button, Spinner } from "@heroui/react";

// Función para obtener una dirección de wallet (mock por ahora)
const getWalletAddress = (): Promise<string> => {
  return new Promise((resolve) => {
    // Simular tiempo de conexión
    setTimeout(() => {
      // Dirección mockeada de wallet
      resolve("0x8E35d7D6E4983274d5622A9e0E6a6421F7d3F6C6");
    }, 2000);
  });
};

// Función para acortar la dirección de la wallet
const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ConnectWalletButton: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    if (walletAddress) return; // Ya está conectado
    
    setIsConnecting(true);
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      radius="full"
      className="relative overflow-hidden border-0 dark:text-white text-black font-medium"
      style={{
        background: "transparent", 
        boxShadow: "none"
      }}
      disableRipple
    >
      {/* Borde con gradiente multicolor */}
      <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-pink-500 via-blue-500 to-blue-500"></span>
      
      {/* Fondo interior que cambia según el tema */}
      <span className="absolute inset-[1px] -z-10 rounded-full dark:bg-black bg-white"></span>
      
      {/* Contenido del botón */}
      <div className="flex items-center gap-2 px-4 py-2">
        {isConnecting ? (
          <>
            <Spinner size="sm" color="secondary" />
            <span>Connecting...</span>
          </>
        ) : walletAddress ? (
          <span>{shortenAddress(walletAddress)}</span>
        ) : (
          <span>Connect Wallet</span>
        )}
      </div>
    </Button>
  );
};

export default ConnectWalletButton;