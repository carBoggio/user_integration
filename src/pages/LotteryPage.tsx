import { useState, useEffect, useRef } from "react";
import { useGetRaffle } from "@/actions/getRaffle";
import { useGenLotteryByUser } from "@/actions/genLoteryByUser";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  Image,
  Spinner,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input
} from "@heroui/react";
import { 
  Clock, 
  Calendar, 
  Ticket, 
  Gift, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Info,
  AlertCircle,
  X
} from "lucide-react";
import { formatDistance } from "date-fns";
import DefaultLayout from "@/layouts/default";
import { useTheme } from "@/providers/themeProvider";
import { calculateTimeLeft } from "@/components/Raffle";
import { useLocation } from "react-router-dom";

const LotteryPage = () => {
  const { getRaffle, raffle, extraData, isLoading: isLoadingRaffle, error: raffleError } = useGetRaffle();
  const { 
    getLotteryByUser, 
    isSequencePurchased, 
    purchaseSequence, 
    purchaseRandomSequences,
    isLoading: isLoadingLottery, 
    error: lotteryError,
    lotteryData
  } = useGenLotteryByUser();
  
  const [selectedNumbers, setSelectedNumbers] = useState<[number, number, number, number, number, number]>([0, 0, 0, 0, 0, 0]);
  const [randomQuantity, setRandomQuantity] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [purchasedTickets, setPurchasedTickets] = useState<number[][]>([]);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  const isLoading = isLoadingRaffle || isLoadingLottery;
  const error = raffleError || lotteryError;

  useEffect(() => {
    getRaffle();
    // Using a placeholder userId for now
    getLotteryByUser("user123");
  }, []);

  useEffect(() => {
    if (!raffle) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(raffle.raffleDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [raffle, timeLeft]);

  useEffect(() => {
    // Scroll to the how it works section if the URL has #how-it-works
    if (location.hash === '#how-it-works' && howItWorksRef.current) {
      setTimeout(() => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location, raffle]);

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

  const handleCustomTicketPurchase = async () => {
    if (!allNumbersSelected()) {
      return;
    }

    // Check if the sequence has already been purchased
    if (isSequencePurchased(selectedNumbers)) {
      setErrorMessage("You have already purchased this sequence. Please select different numbers.");
      setErrorModalOpen(true);
      return;
    }

    const result = await purchaseSequence(selectedNumbers);
    if (result.success) {
      setPurchasedTickets([selectedNumbers]);
      setSelectedNumbers([0, 0, 0, 0, 0, 0]);
      onOpen();
    } else {
      setErrorMessage(result.message || "Failed to purchase ticket");
      setErrorModalOpen(true);
    }
  };

  const handleRandomTicketPurchase = async () => {
    const result = await purchaseRandomSequences(randomQuantity);
    if (result.success && result.tickets) {
      setPurchasedTickets(result.tickets);
      onOpen();
    } else {
      setErrorMessage(result.message || "Failed to purchase tickets");
      setErrorModalOpen(true);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRandomQuantity(parseInt(e.target.value) || 1);
  };

  const formatTimeValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  if (isLoading && !raffle) {
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
                  getRaffle();
                  getLotteryByUser("user123");
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

  if (!raffle || !lotteryData) {
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
        <h1 className="text-3xl font-bold mb-3 text-center">{raffle.name}</h1>
        <p className="text-center text-default-500 mb-8">{raffle.description}</p>
        
        {/* Prize Pool y Ticket Price */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-primary" />
            <div>
              <p className="text-sm text-default-500">Prize Pool</p>
              <p className="text-2xl font-bold text-purple-500">
                ${lotteryData.prizePot.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Ticket size={24} className="text-primary" />
            <div>
              <p className="text-sm text-default-500">Ticket Price</p>
              <p className="text-2xl font-bold">
                ${lotteryData.ticketPrice}
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
                <p className="text-xl font-semibold">Draw Closes:</p>
              </div>
              
              <p className="text-3xl font-bold mb-4">
                {formatTimeValue(timeLeft.days)}d {formatTimeValue(timeLeft.hours)}h {formatTimeValue(timeLeft.minutes)}m {formatTimeValue(timeLeft.seconds)}s
              </p>

              <p className="text-sm">
                {new Date(raffle.raffleDate).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardBody>
        </Card>
        
        {/* Número Selector - Updated to 6 sequential selectors */}
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
                {lotteryData && isSequencePurchased(selectedNumbers) && (
                  <p className="text-danger mt-2">You have already purchased this sequence</p>
                )}
              </div>
              
              <Button
                color="primary"
                size="lg"
                onPress={handleCustomTicketPurchase}
                isDisabled={!allNumbersSelected() || isSequencePurchased(selectedNumbers)}
                isLoading={isLoading}
                className="px-8 mt-4"
              >
                Buy Ticket
              </Button>
            </div>
          </CardBody>
        </Card>
        
        {/* Opción de tickets aleatorios */}
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
                  ${(lotteryData.ticketPrice * randomQuantity).toFixed(2)}
                </p>
              </div>
              
              <Button
                color="primary"
                variant="flat"
                onPress={handleRandomTicketPurchase}
                isLoading={isLoading}
              >
                Buy Random Tickets
              </Button>
            </div>
          </CardBody>
        </Card>
        
        {/* How It Works - Updated with New Rules */}
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

        <div className="mt-4 bg-default-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Prize Categories:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Match first 1 digit: 5% of prize pool</li>
            <li>Match first 2 digits: 5% of prize pool</li>
            <li>Match first 3 digits: 5% of prize pool</li>
            <li>Match first 4 digits: 10% of prize pool</li>
            <li>Match first 5 digits: 20% of prize pool</li>
            <li>Match all 6 digits: 40% of prize pool (Jackpot!)</li>
          </ul>
        </div>

        {/* Modal de confirmación */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Purchase Successful!</ModalHeader>
            <ModalBody>
              <div className="text-center p-4">
                <CheckCircle size={48} className="text-success mx-auto mb-4" />
                <p className="text-xl font-bold mb-2">Thank you for your purchase!</p>
                <p>You have purchased {purchasedTickets.length} ticket(s).</p>
              </div>
              
              <div className="mt-4 bg-default-100 p-4 rounded-lg">
                <p className="font-semibold mb-2">Your tickets:</p>
                <div className="max-h-48 overflow-y-auto">
                  {purchasedTickets.map((ticket, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-default-200 rounded">
                      <span className="font-semibold">Ticket {idx + 1}: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ticket.map((num, digitIdx) => (
                          <Chip key={digitIdx} size="sm" color="primary" variant="flat">
                            {num}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Error Modal */}
        <Modal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-danger">Error</ModalHeader>
            <ModalBody>
              <div className="text-center p-4">
                <X size={48} className="text-danger mx-auto mb-4" />
                <p className="text-xl font-bold mb-2 text-danger">Unable to Complete Purchase</p>
                <p>{errorMessage}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setErrorModalOpen(false)}>
                Try Again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default LotteryPage; 