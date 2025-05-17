import { useState, useEffect, useRef } from "react";
import { useGetRaffle } from "@/actions/getRaffle";
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
  useDisclosure
} from "@heroui/react";
import { 
  Clock, 
  Calendar, 
  Ticket, 
  Gift, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";
import { formatDistance } from "date-fns";
import DefaultLayout from "@/layouts/default";
import { useTheme } from "@/providers/themeProvider";
import { calculateTimeLeft } from "@/components/Raffle";
import { useLocation } from "react-router-dom";

const LotteryPage = () => {
  const { getRaffle, buyCustomTicket, buyRandomTickets, raffle, extraData, isLoading, error } = useGetRaffle();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [randomQuantity, setRandomQuantity] = useState<number>(1);
  const [displayCount, setDisplayCount] = useState(49); // Mostrar todos los números por defecto
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [purchasedTickets, setPurchasedTickets] = useState<number[][]>([]);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    getRaffle();
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

  const handleNumberClick = (num: number) => {
    if (!raffle || !raffle.availableNumbers.includes(num)) {
      return; // No permitir seleccionar números que no están disponibles
    }

    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else if (prev.length < (extraData?.maxSelectionAllowed || 6)) {
        return [...prev, num];
      }
      return prev;
    });
  };

  const handleCustomTicketPurchase = async () => {
    if (!extraData || selectedNumbers.length !== extraData.maxSelectionAllowed) {
      return;
    }

    const result = await buyCustomTicket([...selectedNumbers].sort((a, b) => a - b));
    if (result.success) {
      setPurchasedTickets([selectedNumbers]);
      setSelectedNumbers([]);
      onOpen();
    }
  };

  const handleRandomTicketPurchase = async () => {
    const result = await buyRandomTickets(randomQuantity);
    if (result.success && result.tickets) {
      setPurchasedTickets(result.tickets);
      onOpen();
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
                <Button color="primary" className="mt-4" onPress={() => getRaffle()}>
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

  if (!raffle) {
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
                <h1 className="text-3xl font-bold mb-3 text-center">          {raffle.name}        </h1>                <p className="text-center text-default-500 mb-8">{raffle.description}</p>                {/* Prize Pool y Ticket Price */}        <div className="flex justify-center gap-12 mb-8">          <div className="flex items-center gap-2">            <TrendingUp size={24} className="text-primary" />            <div>              <p className="text-sm text-default-500">Prize Pool</p>              <p className="text-2xl font-bold text-purple-500">                ${extraData.prizePot.toLocaleString()}              </p>            </div>          </div>                    <div className="flex items-center gap-2">            <Ticket size={24} className="text-primary" />            <div>              <p className="text-sm text-default-500">Ticket Price</p>              <p className="text-2xl font-bold">                ${raffle.ticketPrice}              </p>            </div>          </div>        </div>
        
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
        
        {/* Número Selector */}
        <Card className="mb-8">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-semibold">
              <span className="relative inline-block">
                Select Your Numbers
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></span>
              </span>
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm mb-4">
              Select {extraData.maxSelectionAllowed} numbers from the grid below. 
              Numbers in red are already taken.
            </p>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: displayCount }, (_, i) => i + 1).map((num) => {
                const isAvailable = raffle.availableNumbers.includes(num);
                const isSelected = selectedNumbers.includes(num);
                
                return (
                  <Button
                    key={num}
                    size="sm"
                    isIconOnly
                    variant={isSelected ? "solid" : isAvailable ? "bordered" : "flat"}
                    color={isSelected ? "primary" : isAvailable ? "default" : "danger"}
                    onPress={() => handleNumberClick(num)}
                    isDisabled={!isAvailable}
                    className={`w-9 h-9 text-sm font-semibold`}
                  >
                    {num}
                  </Button>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div>
                <p className="text-sm">Selected ({selectedNumbers.length}/{extraData.maxSelectionAllowed}):</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNumbers.map((num) => (
                    <Chip key={num} color="primary" variant="flat" onClose={() => handleNumberClick(num)}>
                      {num}
                    </Chip>
                  ))}
                  {selectedNumbers.length === 0 && (
                    <p className="text-default-500">No numbers selected</p>
                  )}
                </div>
              </div>
              
              <Button
                color="primary"
                onPress={handleCustomTicketPurchase}
                isDisabled={selectedNumbers.length !== extraData.maxSelectionAllowed}
                isLoading={isLoading}
                className="px-8"
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
              Let us pick random numbers for you. You can buy up to 100 tickets at once.
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
                  ${(raffle.ticketPrice * randomQuantity).toFixed(2)}
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
        
        {/* How It Works - Old Style */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
                      <h3 className="font-bold mb-1">Select Your Numbers</h3>
                      <p className="text-sm text-default-500">Choose {extraData.maxSelectionAllowed} numbers or go for a quick pick.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
                      <h3 className="font-bold mb-1">Buy Your Tickets</h3>
                      <p className="text-sm text-default-500">Complete your purchase securely.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
                      <h3 className="font-bold mb-1">Win Big Prizes</h3>
                      <p className="text-sm text-default-500">Wait for the draw and check your results.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
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
                        {ticket.sort((a, b) => a - b).map(num => (
                          <Chip key={num} size="sm" color="primary" variant="flat">
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
      </div>
    </DefaultLayout>
  );
};

export default LotteryPage; 