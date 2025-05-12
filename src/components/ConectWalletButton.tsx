import React, { useState, useEffect } from 'react';
import { Button, Spinner, Avatar, Tooltip } from "@heroui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';

// Función para acortar la dirección de la wallet
const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Componente para mostrar cuando hay un problema de conexión
const ConnectionHelper: React.FC = () => {
  return (
    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Consejos para conectar tu wallet:</h4>
      <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300 space-y-1">
        <li>Asegúrate de que tu extensión MetaMask esté desbloqueada</li>
        <li>Revisa si hay una notificación pendiente en tu wallet</li>
        <li>Si usas una wallet móvil, escanea el código QR correctamente</li>
        <li>Si el problema persiste, actualiza la página e intenta nuevamente</li>
      </ul>
    </div>
  );
};

const ConnectWalletButton: React.FC = () => {
  // Usar useAccount de wagmi para acceder a la dirección de wallet conectada
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading: isConnectLoading, pendingConnector } = useConnect();
  
  // Estado para controlar el tiempo de conexión
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  
  // Efecto para detectar si la conexión está tomando demasiado tiempo
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let helperTimeoutId: NodeJS.Timeout;
    
    if (isConnectLoading && pendingConnector) {
      timeoutId = setTimeout(() => {
        setConnectionTimeout(true);
      }, 8000); // Mostrar mensaje después de 8 segundos
      
      helperTimeoutId = setTimeout(() => {
        setShowHelper(true);
      }, 15000); // Mostrar ayuda después de 15 segundos
    } else {
      setConnectionTimeout(false);
      setShowHelper(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (helperTimeoutId) clearTimeout(helperTimeoutId);
    };
  }, [isConnectLoading, pendingConnector]);

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;
          const hasConnectionIssue = isConnectLoading && connectionTimeout;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onPress={openConnectModal}
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
                        {isConnectLoading ? (
                          <>
                            <Spinner size="sm" color="secondary" />
                            <Tooltip content={connectionTimeout ? "Verifica que tu wallet esté abierta y desbloqueada" : "Esperando confirmación de la wallet..."}>
                              <span>{connectionTimeout ? "Verifica tu wallet" : "Conectando..."}</span>
                            </Tooltip>
                          </>
                        ) : (
                          <span>{error ? "Error al conectar" : "Connect Wallet"}</span>
                        )}
                      </div>
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      onPress={openChainModal}
                      radius="full"
                      color="danger"
                      className="relative overflow-hidden border-0 font-medium"
                      disableRipple
                    >
                      <span className="text-sm">Red incorrecta</span>
                    </Button>
                  );
                }

                return (
                  <Button
                    onPress={openAccountModal}
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
                    
                    {/* Contenido del botón cuando está conectado */}
                    <div className="flex items-center gap-2 px-4 py-1">
                      {/* Pequeño indicador de cadena */}
                      {chain.hasIcon && (
                        <div className="w-3 h-3 rounded-full overflow-hidden">
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: '100%', height: '100%' }}
                            />
                          )}
                        </div>
                      )}
                      
                      {/* Identicon/avatar del usuario */}
                      <Avatar 
                        src={`https://effigy.im/a/${account.address}.svg`} 
                        size="sm" 
                        className="border-1 border-white"
                      />
                      
                      {/* Dirección acortada */}
                      <span className="text-sm font-medium">
                        {account.displayName || shortenAddress(account.address)}
                      </span>
                    </div>
                  </Button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {/* Mostrar guía de ayuda si la conexión tarda demasiado */}
      {showHelper && (
        <ConnectionHelper />
      )}
    </>
  );
};

export default ConnectWalletButton;