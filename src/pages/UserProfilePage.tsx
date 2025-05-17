import { useState, useEffect } from "react";
import { 
  Avatar, 
  Skeleton, 
  Divider, 
  Card, 
  CardBody, 
  CardFooter, 
  Image, 
  Chip, 
  Button,
  Spinner,
  Tab,
  Tabs,
  Badge
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Clock, ExternalLink, Mail, Ticket, Gift, Award, CheckCircle, XCircle, Wallet } from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { useTheme } from "@/providers/themeProvider";
import { calculateTimeLeft } from "@/components/Raffle";
import { useGetUserLotteryNumbers } from "@/actions/getUserLotteryNumbers";
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function UserProfilePage() {
  const { getUserLotteryNumbers, tickets: lotteryTickets, lotteryResult, isLoading: isLoadingTickets, error: ticketsError } = useGetUserLotteryNumbers();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Rainbow Kit wallet connection
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Only load tickets if wallet is connected
    if (isConnected) {
      getUserLotteryNumbers();
    }
  }, [isConnected]);

  useEffect(() => {
    if (!lotteryResult || lotteryResult.hasEnded) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(lotteryResult.drawDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [lotteryResult, timeLeft]);

  const formatTimeValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  const goToLottery = () => {
    navigate('/lottery');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get appropriate color and text for match category
  const getMatchCategoryInfo = (matchCategory: number | undefined) => {
    if (matchCategory === undefined) return { color: "default", text: "No matches" };
    
    switch(matchCategory) {
      case 0:
        return { color: "danger", text: "No matches" };
      case 1:
        return { color: "warning", text: "Match 1" };
      case 2:
        return { color: "warning", text: "Match 2" };
      case 3:
        return { color: "success", text: "Match 3" };
      case 4:
        return { color: "success", text: "Match 4" };
      case 5:
        return { color: "primary", text: "Match 5" };
      case 6:
        return { color: "secondary", text: "Jackpot!" };
      default:
        return { color: "default", text: "Unknown" };
    }
  };
  
  const hasLotteryTickets = lotteryTickets.length > 0;

  // Shortened wallet address display
  const shortenAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Generate avatar URL from address using Ethereum avatar service
  const getAvatarUrl = (address: string | undefined) => {
    if (!address) return '';
    return `https://effigy.im/a/${address}.svg`;
  };

  return (
    <DefaultLayout>
      <div className="py-8 container">
        <h1 className="text-3xl font-bold relative inline-block mb-8">
          My Profile
          <div className="absolute h-1 w-full bottom-[-8px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección del perfil - 1/4 del ancho en escritorio */}
          <div className="md:col-span-1">
            {isConnected ? (
              <Card className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar 
                    src={getAvatarUrl(address)} 
                    size="lg" 
                    className="w-24 h-24 mb-4"
                  />
                  <h2 className="text-xl font-bold">{ensName || shortenAddress(address)}</h2>
                  <p className={`text-sm break-all ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {address}
                  </p>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      color="danger"
                      variant="flat"
                      onPress={() => disconnect()}
                    >
                      Disconnect
                    </Button>
                    <Button 
                      size="sm" 
                      color="primary"
                      variant="flat"
                      onPress={() => goToLottery()}
                      startContent={<Ticket size={14} />}
                    >
                      Buy Tickets
                    </Button>
                  </div>
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

          {/* Sección de tickets - 3/4 del ancho en escritorio */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold relative inline-block">
                My Lottery Tickets
                <div className="absolute h-1 w-full bottom-[-4px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h2>
            </div>

            {!isConnected ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Ticket size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-4">Connect Wallet to View Tickets</p>
                  <p className="text-default-500 mb-6">Your lottery tickets will appear here after connecting your wallet</p>
                  <ConnectButton />
                </div>
              </Card>
            ) : isLoadingTickets ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="rounded-lg w-full">
                    <div className="h-36 rounded-lg bg-default-300"></div>
                  </Skeleton>
                ))}
              </div>
            ) : hasLotteryTickets ? (
              <div className="space-y-4">
                {!lotteryResult.hasEnded && (
                  <Card className="mb-4 p-4 bg-gradient-to-r from-purple-800/10 to-blue-800/10">
                    <div className="flex flex-col items-center">
                      <p className="text-lg font-semibold mb-2">Draw closes in:</p>
                      <p className="text-2xl font-bold">
                        {formatTimeValue(timeLeft.days)}d {formatTimeValue(timeLeft.hours)}h {formatTimeValue(timeLeft.minutes)}m {formatTimeValue(timeLeft.seconds)}s
                      </p>
                      <p className="text-sm mt-1">
                        {new Date(lotteryResult.drawDate).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </Card>
                )}
                
                {lotteryTickets.map((ticket) => {
                  const matchInfo = getMatchCategoryInfo(ticket.matchCategory);
                  
                  return (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between">
                          <h3 className="text-xl font-bold mb-2">MegaLucky Lottery</h3>
                          <div className="flex gap-2">
                            <Chip
                              color="secondary"
                              variant="flat"
                              size="sm"
                            >
                              Lottery
                            </Chip>
                            
                            {lotteryResult.hasEnded && (
                              <Chip
                                color={matchInfo.color as any}
                                variant="solid"
                                size="sm"
                              >
                                {matchInfo.text}
                              </Chip>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm mb-3">
                          <Clock size={16} className="mr-1" />
                          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Draw date: {formatDate(ticket.drawDate)}
                          </span>
                        </div>
                        
                        <Divider className="my-3" />
                        
                        <div className="mb-3">
                          <p className="text-sm font-semibold mb-2">Your lottery numbers:</p>
                          <div className="flex flex-wrap gap-2">
                            {ticket.ticketNumbers.map((number, index) => {
                              // Check if this number matches winning number at same position
                              const isMatch = lotteryResult.hasEnded && 
                                lotteryResult.winningNumbers && 
                                lotteryResult.winningNumbers[index] === number;
                                
                              // Find the index of the first mismatch
                              const firstMismatchIndex = lotteryResult.hasEnded && lotteryResult.winningNumbers ? 
                                ticket.ticketNumbers.findIndex((num, idx) => num !== lotteryResult.winningNumbers![idx]) : -1;
                              
                              // Determine color based on matching state
                              let chipColor;
                              if (!lotteryResult.hasEnded) {
                                chipColor = "bg-purple-500 text-white"; // Default for active lottery
                              } else if (isMatch) {
                                chipColor = "bg-green-500 text-white"; // Matching numbers
                              } else if (firstMismatchIndex !== -1 && index < firstMismatchIndex) {
                                chipColor = "bg-yellow-500 text-white"; // Numbers before first mismatch
                              } else if (firstMismatchIndex !== -1 && index > firstMismatchIndex) {
                                chipColor = "bg-blue-500 text-white"; // Numbers after first mismatch
                              } else {
                                chipColor = "bg-yellow-500 text-white"; // First mismatch (typically yellow)
                              }
                              
                              return (
                                <div key={index} className="relative">
                                  <Chip 
                                    className={chipColor}
                                  >
                                    {number}
                                  </Chip>
                                  {lotteryResult.hasEnded && (
                                    <span className="absolute -top-1 -right-1">
                                      {isMatch ? 
                                        <CheckCircle size={12} className="text-green-500 bg-white rounded-full" /> : 
                                        <XCircle size={12} className="text-red-500 bg-white rounded-full" />}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {lotteryResult.hasEnded && lotteryResult.winningNumbers && (
                          <div className="mb-3">
                            <p className="text-sm font-semibold mb-2">Winning numbers:</p>
                            <div className="flex flex-wrap gap-2">
                              {lotteryResult.winningNumbers.map((number, index) => (
                                <Chip 
                                  key={index} 
                                  className="bg-green-500 text-white"
                                >
                                  {number}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="text-sm">
                            <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Purchased:
                            </span>{" "}
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(ticket.purchaseDate)}
                            </span>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="light"
                            color="primary"
                            endContent={<ExternalLink size={14} />}
                            onPress={() => goToLottery()}
                          >
                            View Lottery
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Ticket size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-4">No lottery tickets yet</p>
                  <p className="text-default-500 mb-6">Try your luck with the MegaLucky Lottery!</p>
                  <Button 
                    color="primary"
                    onPress={() => goToLottery()}
                    startContent={<Ticket size={16} />}
                  >
                    Buy Lottery Tickets
                  </Button>
                </div>
              </Card>
            )}

            {isConnected && ticketsError && (
              <Card className="p-8 text-center">
                <p className="text-danger mb-4">Error loading your tickets</p>
                <Button 
                  color="primary"
                  onPress={() => getUserLotteryNumbers()}
                >
                  Retry
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 