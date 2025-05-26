import React, { useState, useEffect } from 'react';
import { Button, Spinner, Card } from "@heroui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Función para acortar la dirección de la wallet
const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ConnectWalletButton: React.FC = () => {
  // Estado para la UI
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

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
          connectModalOpen
        }) => {
          // Estado de conexión
          const ready = mounted;
          const connected = ready && account && chain;
          const connecting = connectModalOpen;
          
          // Efecto para detectar tiempo de conexión
          useEffect(() => {
            let timeoutId: NodeJS.Timeout;
            let helperTimeoutId: NodeJS.Timeout;
            
            if (connecting) {
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
          }, [connecting]);

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
                    <div className="flex flex-col">
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
                          {connecting ? (
                            <>
                              <Spinner size="sm" color="secondary" />
                              <span title={connectionTimeout ? "Verifica que tu wallet esté abierta y desbloqueada" : "Esperando confirmación de la wallet..."}>
                                {connectionTimeout ? "Verifica tu wallet" : "Conectando..."}
                              </span>
                            </>
                          ) : (
                            <span>Connect Wallet</span>
                          )}
                        </div>
                      </Button>
                    </div>
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
                      
                      {/* Avatar: Usamos el ENS avatar si existe, o generamos uno basado en la dirección */}
                      <img
                        src={account.ensAvatar || `https://effigy.im/a/${account.address}.svg`}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full border-1 border-white"
                      />
                      
                      {/* Nombre y balance */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {account.displayName || shortenAddress(account.address)}
                        </span>
                        {account.displayBalance && (
                          <span className="text-xs opacity-80">
                            {account.displayBalance}
                          </span>
                        )}
                      </div>
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
        <Card className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-sm">
          <h1 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Consejos para conectar tu wallet:</h1>
          <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>Asegúrate de que tu extensión MetaMask esté desbloqueada</li>
            <li>Revisa si hay una notificación pendiente en tu wallet</li>
            <li>Si usas una wallet móvil, escanea el código QR correctamente</li>
            <li>A veces la ventana de MetaMask se abre detrás del navegador</li>
            <li>Intenta actualizar la página y conectar nuevamente</li>
          </ul>
        </Card>
      )}
    </>
  );
};

export default ConnectWalletButton;