import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter, Image, Button, Chip } from "@heroui/react";
import { useTheme } from "@/providers/themeProvider";

interface RaffleItem {
  id: number;
  name: string;
  description: string;
  image: string;
  ticketPrice: number;
  raffleDate: string;
  totalTickets: number;
  availableTickets: number;
  availableNumbers?: number[];
}

interface RaffleProps {
  raffle: RaffleItem;
  isDetailView?: boolean;
}

export const calculateTimeLeft = (targetDate: string) => {
  const difference = new Date(targetDate).getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

const Raffle = ({ raffle, isDetailView = false }: RaffleProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(raffle.raffleDate));
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Calculate the number of available tickets based on the availableNumbers array
  const ticketsLeft = raffle.availableNumbers ? raffle.availableNumbers.length : raffle.availableTickets;

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(raffle.raffleDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTimeValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  const handleRaffleClick = () => {
    if (!isDetailView) {
      navigate(`/raffle/${raffle.id}`);
    }
  };

  const handleSeeDetails = () => {
    navigate(`/raffle/${raffle.id}`);
  };

  return (
    <Card 
      className="max-w-md mx-auto relative"
      isPressable={!isDetailView}
      onPress={handleRaffleClick}
      isHoverable={!isDetailView}
      shadow="md"
    >
      <div className="relative">
        <Image
          removeWrapper
          alt={raffle.name}
          className="z-0 w-full h-48 object-cover"
          src={raffle.image}
        />
        
        {/* Timer displayed at the bottom of image */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {formatTimeValue(timeLeft.days)}d {formatTimeValue(timeLeft.hours)}h {formatTimeValue(timeLeft.minutes)}m {formatTimeValue(timeLeft.seconds)}s
          </div>
        </div>
      </div>
      
      <CardBody className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-bold">{raffle.name}</h3>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{raffle.description}</p>
          </div>
          <Chip color="primary" className="ml-2">
            ${raffle.ticketPrice.toFixed(2)}
          </Chip>
        </div>

        <div className="mt-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Tickets left: {ticketsLeft} of {raffle.totalTickets}
          </p>
        </div>
      </CardBody>
      <CardFooter className="px-4 pb-4 pt-0">
        {isDetailView ? (
          <Button color="primary" className="w-full">
            Enter Raffle
          </Button>
        ) : (
          <Button variant="light" color="primary" className="w-full" onPress={handleSeeDetails}>
            See Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Raffle;
