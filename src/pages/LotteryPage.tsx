import { useState, useEffect, useRef } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button,
  Spinner,
  Chip,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { 
  Clock, 
  Ticket, 
  TrendingUp, 
  HelpCircle,
  AlertCircle,
  Award
} from "lucide-react";
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import DefaultLayout from "@/layouts/default";
import { useTheme } from "@/providers/themeProvider";
import { useLocation } from "react-router-dom";
import { useLottery } from "../../lib/hooks/useLottery";

const LotteryPage = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const {
    isLoading,
    error,
    currentLotteryId,
    drawTime,
    ticketPrice,
    userTickets,
    winningNumbers,
    totalPrizes,
    isLotteryOpen,
    formattedDrawTime,
    loadLotteryData,
    loadUserTickets,
    loadTotalPrizes,
    buyRandomTickets,
    buyCustomTicket,
    clearError,
  } = useLottery();
  
  const [selectedNumbers, setSelectedNumbers] = useState<[number, number, number, number, number, number]>([0, 0, 0, 0, 0, 0]);
  const [randomQuantity, setRandomQuantity] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { onOpen } = useDisclosure();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const calculateMatches = (ticket: number[], winningNums: bigint[]) => {
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

  // Load initial lottery data
  useEffect(() => {
    loadLotteryData();
    loadTotalPrizes();
  }, []);

  // Load user-specific data when wallet is connected
  useEffect(() => {
    if (address) {
      loadUserTickets();
    }
  }, [address]);

  useEffect(() => {
    if (!drawTime) return;

    const calculateTimeLeft = () => {
      const difference = Number(drawTime) * 1000 - Date.now();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [drawTime, timeLeft]);

  useEffect(() => {
    if (location.hash === '#how-it-works' && howItWorksRef.current) {
      setTimeout(() => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const handleNumberChange = (index: number, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 9) return;
    
    const newNumbers = [...selectedNumbers] as [number, number, number, number, number, number];
    newNumbers[index] = numValue;
    setSelectedNumbers(newNumbers);
  };

  const allNumbersSelected = () => {
    return selectedNumbers.every(num => num >= 0 && num <= 9);
  };

  const isSequencePurchased = (sequence: number[]) => {
    return userTickets.some((ticket: number[]) => 
      ticket.every((num: number, index: number) => num === sequence[index])
    );
  };

  const handleCustomTicketPurchase = async () => {
    if (!address) {
      // If there's a connector available (like MetaMask), try to connect
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
      return;
    }

    if (!allNumbersSelected()) {
      return;
    }

    if (isSequencePurchased(selectedNumbers)) {
      // Eliminado: setErrorMessage("You have already purchased this sequence. Please select different numbers.");
      // Eliminado: setErrorModalOpen(true);
      return;
    }

    const result = await buyCustomTicket(selectedNumbers);
    if ('success' in result && result.success) {
      // Eliminado: setPurchasedTickets([selectedNumbers]);
      setSelectedNumbers([0, 0, 0, 0, 0, 0]);
      await loadUserTickets(); // Refresh user tickets
      onOpen();
    } else {
      // Eliminado: setErrorMessage('error' in result ? result.error : "Failed to purchase ticket");
      // Eliminado: setErrorModalOpen(true);
    }
  };

  const handleRandomTicketPurchase = async () => {
    if (!address) {
      // If there's a connector available (like MetaMask), try to connect
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
      return;
    }
    
    const result = await buyRandomTickets(randomQuantity);
    if ('success' in result && result.success) {
      await loadUserTickets(); // Refresh user tickets
      // Eliminado: setPurchasedTickets(userTickets.slice(-randomQuantity));
      onOpen();
    } else {
      // Eliminado: setErrorMessage('error' in result ? result.error : "Failed to purchase tickets");
      // Eliminado: setErrorModalOpen(true);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRandomQuantity(parseInt(e.target.value) || 1);
  };

  const formatTimeValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  if (isLoading && !currentLotteryId) {
    return (
      <DefaultLayout>
        <div className="py-8 container">
          <div className="flex justify-center items-center h-96">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardBody>
              <div className="text-center p-8 text-danger">
                <p className="text-xl font-bold mb-4">Error</p>
                <p>{error}</p>
                <Button color="primary" className="mt-4" onPress={() => {
                  clearError();
                  loadLotteryData();
                  loadUserTickets();
                }}>
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

  if (!currentLotteryId || !ticketPrice) {
    return (
      <DefaultLayout>
        <div className="py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Lottery Not Available</h2>
          <p className="mb-6">Sorry, there is no active lottery at the moment.</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-8 container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-center">Lottery #{currentLotteryId.toString()}</h1>
        <p className="text-center text-default-500 mb-8">
          {isLotteryOpen ? "Lottery is open for entries!" : "Lottery is currently closed"}
        </p>

        {isLotteryOpen ? (
          <>
            {/* Prize Pool and Timer section */}
            <div className="flex justify-center gap-12 mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp size={24} className="text-primary" />
                <div>
                  <p className="text-sm text-default-500">Prize Pool</p>
                  <p className="text-2xl font-bold text-purple-500">
                    ${totalPrizes ? Number(totalPrizes).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Ticket size={24} className="text-primary" />
                <div>
                  <p className="text-sm text-default-500">Ticket Price</p>
                  <p className="text-2xl font-bold">
                    ${ticketPrice ? ticketPrice.formatted : '0'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer Card */}
            <Card className="mb-8 bg-gradient-to-r from-purple-800/10 to-blue-800/10">
              <CardBody className="p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-primary" />
                    <p className="text-xl font-semibold">Draw Closes In:</p>
                  </div>
                  
                  <p className="text-3xl font-bold mb-4">
                    {formatTimeValue(timeLeft.days)}d {formatTimeValue(timeLeft.hours)}h {formatTimeValue(timeLeft.minutes)}m {formatTimeValue(timeLeft.seconds)}s
                  </p>

                  <p className="text-sm">
                    {formattedDrawTime}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Number Selector */}
            <Card className="mb-8">
              <CardHeader className="pb-0">
                <h3 className="text-xl font-semibold">
                  <span className="relative inline-block">
                    Enter Your 6-Digit Sequence
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></span>
                  </span>
                </h3>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={16} className="text-primary" />
                  <p className="text-sm">
                    Order matters! Your numbers must match the winning sequence from left to right.
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {selectedNumbers.map((num, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs mb-1">Digit {index + 1}</p>
                        <select 
                          aria-label={`Select digit ${index + 1}`}
                          value={num.toString()}
                          onChange={(e) => handleNumberChange(index, e.target.value)}
                          className="w-16 p-2 rounded-md border border-default"
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={i.toString()}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-default-100 p-4 rounded-lg mb-4 text-center">
                    <p className="text-lg font-semibold mb-2">Your sequence:</p>
                    <div className="flex justify-center gap-2">
                      {selectedNumbers.map((num, index) => (
                        <div 
                          key={index} 
                          className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-bold"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    {isSequencePurchased(selectedNumbers) && (
                      <p className="text-danger mt-2">You have already purchased this sequence</p>
                    )}
                  </div>
                  
                  {address ? (
                    <Button
                      color="primary"
                      size="lg"
                      onPress={handleCustomTicketPurchase}
                      isLoading={isLoading}
                      className="px-8 mt-4"
                    >
                      Buy Ticket
                    </Button>
                  ) : (
                    <div className="mt-4">
                      <ConnectButton />
                    </div>
                  )}

                  {!address && (
                    <p className="text-sm text-default-500 mt-2 text-center">
                      Please connect your wallet to purchase tickets
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Random tickets option */}
            <Card className="mb-8">
              <CardHeader className="pb-0">
                <h3 className="text-xl font-semibold">
                  <span className="relative inline-block">
                    Quick Pick Tickets
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></span>
                  </span>
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm mb-4">
                  Let us generate random 6-digit sequences for you. You can buy up to 100 tickets at once.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="w-full sm:w-48">
                    <p className="text-sm mb-2">Quantity:</p>
                    <select 
                      className="w-full p-2 rounded-md border border-default"
                      onChange={handleQuantityChange}
                      defaultValue="1"
                      disabled={!address}
                    >
                      {[1, 5, 10, 25, 50, 75, 100].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'ticket' : 'tickets'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm">Total:</p>
                    <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                      ${ticketPrice ? (Number(ticketPrice.formatted) * randomQuantity).toFixed(2) : '0'}
                    </p>
                  </div>
                  
                  {address ? (
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={handleRandomTicketPurchase}
                      isLoading={isLoading}
                    >
                      Buy Random Tickets
                    </Button>
                  ) : (
                    <ConnectButton />
                  )}
                </div>
              </CardBody>
            </Card>

            {/* How It Works */}
            <div ref={howItWorksRef} id="how-it-works">
              <Card className="mb-4">
                <CardBody className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex flex-col justify-center md:rounded-l-lg">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <HelpCircle size={24} />
                        How It Works
                      </h2>
                      <p className="text-white/80">
                        Follow these simple steps to participate in our lottery and get a chance to win big prizes!
                      </p>
                    </div>
                    
                    <div className="col-span-2 p-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="text-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
                          <h3 className="font-bold mb-1">Pick 6 Digits</h3>
                          <p className="text-sm text-default-500">Choose your 6-digit sequence or use Quick Pick.</p>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
                          <h3 className="font-bold mb-1">Buy Your Tickets</h3>
                          <p className="text-sm text-default-500">Complete your purchase securely.</p>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
                          <h3 className="font-bold mb-1">Win by Matching</h3>
                          <p className="text-sm text-default-500">Match digits in order from left to right to win prizes.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        ) : (
          // Show results when lottery is closed
          !address ? (
            <div className="text-center mt-8">
              <p className="text-lg mb-4">Connect your wallet to see your results</p>
              <ConnectButton />
            </div>
          ) : winningNumbers ? (
            <div className="space-y-4">
              {userTickets.map((ticket, index) => {
                const matches = calculateMatches(ticket, winningNumbers);
                return (
                  <Card key={index}>
                    <CardBody>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold mb-2">
                          MegaLucky Lottery #{currentLotteryId?.toString()}
                        </h3>
                        <Chip
                          color={matches > 0 ? "success" : "default"}
                          variant="flat"
                          startContent={matches > 0 ? <Award size={16} /> : undefined}
                        >
                          {matches > 0 ? `${matches} matches!` : "No matches"}
                        </Chip>
                      </div>

                      <Divider className="my-4" />

                      <div>
                        <p className="text-sm text-default-500 mb-1">Your Numbers</p>
                        <div className="flex gap-2">
                          {ticket.map((num, idx) => (
                            <div
                              key={idx}
                              className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold
                                ${num === Number(winningNumbers[idx])
                                  ? 'bg-green-500 text-white'
                                  : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                              `}
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
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

                      {matches > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-success">
                            Congratulations! You matched {matches} number{matches > 1 ? 's' : ''} in sequence!
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
              {userTickets.length === 0 && (
                <p className="text-center text-default-500">You didn't participate in this lottery</p>
              )}
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-lg mb-4">Waiting for winning numbers...</p>
              <Spinner />
            </div>
          )
        )}
      </div>
    </DefaultLayout>
  );
};

export default LotteryPage;