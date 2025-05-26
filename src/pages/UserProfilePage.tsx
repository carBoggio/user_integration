import { useEffect } from "react";
import { 
  Card, 
  CardBody, 
  Divider, 
  Image, 
  Chip, 
  Button,
  Spinner
} from "@heroui/react";

import { Clock, Ticket, Gift, Award, CheckCircle, XCircle, Wallet } from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { useTheme } from "@/providers/themeProvider";
import { useAccount, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLottery } from "../../lib/hooks/useLottery";

export default function UserProfilePage() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const {
    isLoading,
    error,
    
    currentLotteryId,
    
    
    userTickets,
    winningNumbers,
    isLotteryOpen,
    
    loadLotteryData,
    loadUserTickets,
    loadWinningNumbers,
    loadTotalPrizes
  } = useLottery();

  // Load user data when component mounts
  useEffect(() => {
    if (address) {
      loadLotteryData();
      loadUserTickets();
      loadWinningNumbers();
      loadTotalPrizes();
    }
  }, [address]);

  const getAvatarUrl = (address: string) => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to calculate matches between ticket and winning numbers
  const calculateMatches = (ticket: number[], winningNums: bigint[] | null) => {
    if (!winningNums) return 0;
    let matches = 0;
    for (let i = 0; i < ticket.length; i++) {
      if (ticket[i] === Number(winningNums[i])) {
        matches++;
      } else {
        break; // Stop counting after first mismatch since order matters
      }
    }
    return matches;
  };

  // Function to get prize tier text
  const getPrizeTierText = (matches: number) => {
    switch (matches) {
      case 6: return "Jackpot Winner!";
      case 5: return "5 Number Match";
      case 4: return "4 Number Match";
      case 3: return "3 Number Match";
      case 2: return "2 Number Match";
      case 1: return "1 Number Match";
      default: return "No Matches";
    }
  };

  // Function to get prize tier color
  const getPrizeTierColor = (matches: number) => {
    switch (matches) {
      case 6: return "success";
      case 5: return "primary";
      case 4: return "secondary";
      case 3: return "warning";
      case 2: return "default";
      case 1: return "default";
      default: return "default";
    }
  };

  return (
    <DefaultLayout>
      <div className="container py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Profile section */}
          <div className="md:col-span-1">
            {address ? (
              <Card className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Image 
                    src={getAvatarUrl(address)} 
                    className="w-24 h-24 mb-4 rounded-full"
                    alt="User avatar"
                  />
                  <h2 className="text-xl font-bold">{ensName || shortenAddress(address)}</h2>
                  <p className={`text-sm break-all ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {address}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Wallet size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-4">Connect Your Wallet</p>
                  <p className="text-default-500 mb-6">Connect your wallet to view your profile and tickets</p>
                  <ConnectButton />
                </div>
              </Card>
            )}
          </div>

          {/* Tickets section */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold relative inline-block">
                My Lottery Tickets
                <div className="absolute h-1 w-full bottom-[-4px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h2>
            </div>

            {address ? (
              isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center">
                    <XCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-xl font-semibold mb-2">Error Loading Tickets</p>
                    <p className="text-default-500">{error}</p>
                  </div>
                </Card>
              ) : userTickets.length > 0 ? (
                <div className="space-y-4">
                  {userTickets.map((ticket, index) => {
                    const matches = !isLotteryOpen && winningNumbers ? calculateMatches(ticket, winningNumbers) : 0;
                    return (
                      <Card key={index} className="overflow-hidden">
                        <CardBody>
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold mb-2">
                              MegaLucky Lottery #{currentLotteryId?.toString()}
                            </h3>
                            <div className="flex gap-2">
                              <Chip
                                color={isLotteryOpen ? "warning" : "success"}
                                variant="flat"
                                startContent={isLotteryOpen ? <Clock size={16} /> : <CheckCircle size={16} />}
                              >
                                {isLotteryOpen ? "Draw Pending" : "Draw Complete"}
                              </Chip>
                              {!isLotteryOpen && winningNumbers && (
                                <Chip
                                  color={getPrizeTierColor(matches)}
                                  variant="flat"
                                  startContent={matches > 0 ? <Award size={16} /> : undefined}
                                >
                                  {getPrizeTierText(matches)}
                                </Chip>
                              )}
                            </div>
                          </div>

                          <Divider className="my-4" />

                          <div className="flex flex-wrap gap-4">
                            <div>
                              <p className="text-sm text-default-500 mb-1">Your Numbers</p>
                              <div className="flex gap-2">
                                {ticket.map((number, idx) => (
                                  <div
                                    key={idx}
                                    className={`
                                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                                      ${!isLotteryOpen && winningNumbers && number === Number(winningNumbers[idx])
                                        ? 'bg-green-500 text-white'
                                        : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                                    `}
                                  >
                                    {number}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {!isLotteryOpen && winningNumbers && (
                              <div>
                                <p className="text-sm text-default-500 mb-1">Winning Numbers</p>
                                <div className="flex gap-2">
                                  {winningNumbers.map((number, idx) => (
                                    <div
                                      key={idx}
                                      className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold
                                        ${ticket[idx] === Number(number)
                                          ? 'bg-green-500 text-white'
                                          : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                                      `}
                                    >
                                      {Number(number)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {!isLotteryOpen && winningNumbers && (
                            <div className="mt-4">
                              <p className="text-sm text-default-500">
                                {matches > 0
                                  ? `Congratulations! You matched ${matches} number${matches > 1 ? 's' : ''} in sequence!`
                                  : "Better luck next time!"}
                              </p>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center">
                    <Ticket size={48} className="text-gray-400 mb-4" />
                    <p className="text-xl font-semibold mb-2">No Tickets Found</p>
                    <p className="text-default-500 mb-6">You haven't purchased any tickets yet</p>
                    <Button
                      color="primary"
                      variant="flat"
                      href="/lottery"
                      startContent={<Gift size={16} />}
                    >
                      Buy Tickets
                    </Button>
                  </div>
                </Card>
              )
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Wallet size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-2">Connect Wallet to View Tickets</p>
                  <p className="text-default-500 mb-6">You need to connect your wallet to view your tickets</p>
                  <ConnectButton />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 