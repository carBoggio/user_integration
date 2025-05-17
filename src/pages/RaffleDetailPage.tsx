import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  Chip, 
  Skeleton, 
  Divider, 
  Image, 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { Clock, Calendar, Ticket, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { calculateTimeLeft } from "@/components/Raffle";
import { useBuyTicket } from "@/actions/buyTicket";
import { useTheme } from "@/providers/themeProvider";

type RaffleItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  ticketPrice: number;
  raffleDate: string;
  totalTickets: number;
  availableTickets: number;
  availableNumbers: number[];
  takenNumbers: number[];
};

export default function RaffleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [raffle, setRaffle] = useState<RaffleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(80); // Number of tickets to display initially
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { buyTicket, isLoading: isBuying, error, result } = useBuyTicket({ 
    raffleId: Number(id) 
  });
  const { theme } = useTheme();

  // Generate list of test images for this raffle
  const generateRaffleImages = () => {
    const baseImages = [];
    const numImages = 5; // Assuming each raffle has 5 images max
    
    if (raffle) {
      // Add the main raffle image
      baseImages.push(raffle.image);
      
      // Add additional images based on raffle ID
      for (let i = 1; i <= numImages; i++) {
        baseImages.push(`/img/raffle${id}/img${i}.jpg`);
      }
    }
    
    return baseImages.filter(Boolean);
  };

  const allImages = generateRaffleImages();

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        // In a real application, this would be an API call for a specific raffle
        const response = await import("@/data/raffles.json");
        const raffleData = response.default.find(
          (r: RaffleItem) => r.id === Number(id)
        );
        
        if (raffleData) {
          setRaffle(raffleData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading raffle data:", error);
        setIsLoading(false);
      }
    };

    fetchRaffle();
  }, [id]);

  useEffect(() => {
    if (!raffle) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(raffle.raffleDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [raffle, timeLeft]);

  const handleBack = () => {
    navigate("/raffles");
  };

  const toggleNumberSelection = (number: number) => {
    setSelectedNumbers(prev => 
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  const handleBuyTickets = async () => {
    if (selectedNumbers.length === 0) {
      return;
    }
    
    const result = await buyTicket(selectedNumbers);
    if (result?.success) {
      onOpen();
    }
  };

  const formatTimeValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const showMoreNumbers = () => {
    if (raffle) {
      const increment = 80;
      const newCount = Math.min(displayCount + increment, raffle.totalTickets);
      setDisplayCount(newCount);
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="py-8 container">
          <Skeleton className="rounded-lg mb-8">
            <div className="h-12 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="rounded-lg">
              <div className="h-[400px] rounded-lg bg-default-300"></div>
            </Skeleton>
            <div>
              <Skeleton className="rounded-lg mb-4">
                <div className="h-8 rounded-lg bg-default-300"></div>
              </Skeleton>
              <Skeleton className="rounded-lg mb-4">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
              <Skeleton className="rounded-lg">
                <div className="h-[300px] rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!raffle) {
    return (
      <DefaultLayout>
        <div className="py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Raffle Not Found</h2>
          <p className="mb-6">Sorry, the raffle you're looking for doesn't exist.</p>
          <Button color="primary" onPress={handleBack}>
            Back to Raffles
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  const isDarkMode = theme === 'dark';

  return (
    <DefaultLayout>
      <div className="py-8 container">
        <Button 
          variant="light" 
          color="primary" 
          className="mb-6 flex items-center gap-1" 
          onPress={handleBack}
          startContent={<ArrowLeft size={16} />}
        >
          Back to Raffles
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left section with image gallery */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden group">
              <Image
                removeWrapper
                alt={raffle.name}
                className="w-full h-[400px] object-cover"
                src={allImages[currentImageIndex]}
              />
              <Button 
                isIconOnly
                variant="flat"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                size="sm"
                onPress={prevImage}
              >
                <ChevronLeft />
              </Button>
              <Button 
                isIconOnly
                variant="flat"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                size="sm"
                onPress={nextImage}
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex gap-2">
                {allImages.map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    isIconOnly
                    variant="light"
                    className={`min-w-8 w-8 h-2 p-0 rounded-full ${
                      index === currentImageIndex ? "bg-primary" : "bg-default-200"
                    }`}
                    onPress={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right section with raffle details */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 relative inline-block">
                {raffle.name}
                <div className="absolute h-1 w-full bottom-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{raffle.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Chip color="primary" variant="flat" size="lg" className="text-base">
                  ${raffle.ticketPrice.toFixed(2)} per ticket
                </Chip>
                <Chip color="success" variant="flat" size="lg" className="text-base">
                  {raffle.availableNumbers.length} tickets left
                </Chip>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar size={18} />
                  <span>Draw date: {new Date(raffle.raffleDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock size={18} />
                  <span>Draw time: {new Date(raffle.raffleDate).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Ticket size={18} />
                  <span>Total tickets: {raffle.totalTickets}</span>
                </div>
              </div>
            </div>

            <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="text-lg font-semibold mb-2 relative inline-block">
                Time Remaining
                <div className="absolute h-1 w-full bottom-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h3>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatTimeValue(timeLeft.days)}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatTimeValue(timeLeft.hours)}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatTimeValue(timeLeft.minutes)}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatTimeValue(timeLeft.seconds)}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>seconds</div>
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold relative inline-block">
                  Select Your Number(s)
                  <div className="absolute h-1 w-full bottom-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </h3>
                <Chip color="primary" variant="flat">
                  {selectedNumbers.length} selected
                </Chip>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {Array.from({ length: Math.min(displayCount, raffle.totalTickets) }, (_, i) => i + 1).map((number) => {
                  const isAvailable = raffle.availableNumbers.includes(number);
                  const isSelected = selectedNumbers.includes(number);
                  const isTaken = raffle.takenNumbers.includes(number);
                  
                  return (
                    <Button
                      key={number}
                      size="sm"
                      className={`w-full ${isTaken ? "text-white dark:text-white" : ""}`}
                      color={isSelected ? "primary" : isTaken ? "danger" : "default"}
                      variant={isSelected ? "solid" : isTaken ? "flat" : "bordered"}
                      isDisabled={!isAvailable}
                      onPress={() => isAvailable && toggleNumberSelection(number)}
                    >
                      <span className={isDarkMode && !isSelected && !isTaken ? "text-white" : ""}>
                        {number}
                      </span>
                    </Button>
                  );
                })}
              </div>
              
              {displayCount < raffle.totalTickets && (
                <Button
                  size="sm"
                  className="w-full mt-2"
                  variant="light"
                  onPress={showMoreNumbers}
                >
                  Show More Numbers
                </Button>
              )}
            </div>
            
            <Divider className="my-6" />
            
            <div className="mt-6">
              <Button 
                color="primary" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                size="lg"
                isLoading={isBuying}
                isDisabled={selectedNumbers.length === 0}
                onPress={handleBuyTickets}
              >
                Purchase {selectedNumbers.length} Ticket{selectedNumbers.length !== 1 ? 's' : ''}
                {selectedNumbers.length > 0 ? ` - $${(selectedNumbers.length * raffle.ticketPrice).toFixed(2)}` : ''}
              </Button>
              
              {error && (
                <p className="text-danger mt-2 text-center">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Purchase Successful!</ModalHeader>
            <ModalBody>
              <p>You have successfully purchased {selectedNumbers.length} ticket(s) for the {raffle.name} raffle.</p>
              <p className="font-semibold mt-2">Your numbers:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedNumbers.map(number => (
                  <Chip key={number} color="primary">{number}</Chip>
                ))}
              </div>
              <p className="mt-4">Good luck in the draw!</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="bg-gradient-to-r from-blue-500 to-purple-500" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
} 