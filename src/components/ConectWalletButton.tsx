import React, { useState, useEffect } from 'react';
import { Button, Spinner, Card } from "@heroui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Function to shorten the wallet address
const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ConnectWalletButton: React.FC = () => {
  // State for the UI
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
          // Connection state
          const ready = mounted;
          const connected = ready && account && chain;
          const connecting = connectModalOpen;
          
          // Effect to detect connection time
          useEffect(() => {
            let timeoutId: NodeJS.Timeout;
            let helperTimeoutId: NodeJS.Timeout;
            
            if (connecting) {
              timeoutId = setTimeout(() => {
                setConnectionTimeout(true);
              }, 8000); // Show message after 8 seconds
              
              helperTimeoutId = setTimeout(() => {
                setShowHelper(true);
              }, 15000); // Show help after 15 seconds
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
                        {/* Multicolor gradient border */}
                        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-pink-500 via-blue-500 to-blue-500"></span>
                        
                        {/* Inner background that changes according to theme */}
                        <span className="absolute inset-[1px] -z-10 rounded-full dark:bg-black bg-white"></span>
                        
                        {/* Button content */}
                        <div className="flex items-center gap-2 px-4 py-2">
                          {connecting ? (
                            <>
                              <Spinner size="sm" color="secondary" />
                              <span title={connectionTimeout ? "Check that your wallet is open and unlocked" : "Waiting for wallet confirmation..."}>
                                {connectionTimeout ? "Check your wallet" : "Connecting..."}
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
                      <span className="text-sm">Wrong network</span>
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
                    {/* Multicolor gradient border */}
                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-pink-500 via-blue-500 to-blue-500"></span>
                    
                    {/* Inner background that changes according to theme */}
                    <span className="absolute inset-[1px] -z-10 rounded-full dark:bg-black bg-white"></span>
                    
                    {/* Button content when connected */}
                    <div className="flex items-center gap-2 px-4 py-1">
                      {/* Small chain indicator */}
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
                      
                      {/* Avatar: We use the ENS avatar if it exists, or generate one based on the address */}
                      <img
                        src={account.ensAvatar || `https://effigy.im/a/${account.address}.svg`}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full border-1 border-white"
                      />
                      
                      {/* Name and balance */}
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

      {/* Show help guide if connection takes too long */}
      {showHelper && (
        <Card className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-sm">
          <h1 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Tips to connect your wallet:</h1>
          <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>Make sure your MetaMask extension is unlocked</li>
            <li>Check if there's a pending notification in your wallet</li>
            <li>If using a mobile wallet, scan the QR code correctly</li>
            <li>Sometimes the MetaMask window opens behind the browser</li>
            <li>Try refreshing the page and connecting again</li>
          </ul>
        </Card>
      )}
    </>
  );
};

export default ConnectWalletButton;