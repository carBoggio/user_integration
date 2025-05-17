import { useState, useEffect } from "react";
import { Button, Skeleton } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Raffle from "./Raffle";
import { useGetAllRaffles } from "@/actions/getAllRaffles";

const RaffleCarousel = () => {
  const { getAllRaffles, raffles, isLoading, error } = useGetAllRaffles();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Cargar solo los raffles destacados
    getAllRaffles(true);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, raffles.length - 3) : Math.max(0, prevIndex - 1)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= raffles.length - 3 ? 0 : prevIndex + 1
    );
  };

  // Get the currently visible raffles (3 at a time)
  const getVisibleRaffles = () => {
    if (raffles.length <= 3) {
      return raffles;
    }
    return raffles.slice(currentIndex, currentIndex + 3);
  };

  return (
    <div className="relative py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Raffles</h2>
      
      <div className="flex items-center justify-center">
        <Button
          isIconOnly
          className="mr-4 z-10"
          variant="light"
          onPress={handlePrevious}
          aria-label="Previous raffle"
        >
          <ChevronLeft />
        </Button>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="rounded-lg">
                  <div className="h-[400px] rounded-lg bg-default-300"></div>
                </Skeleton>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 border rounded-lg text-danger">
              Error loading raffles. Please try again.
            </div>
          ) : raffles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ease-in-out">
              {getVisibleRaffles().map((raffle) => (
                <Raffle key={raffle.id} raffle={raffle} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              No raffles available at the moment.
            </div>
          )}
        </div>

        <Button
          isIconOnly
          className="ml-4 z-10"
          variant="light"
          onPress={handleNext}
          aria-label="Next raffle"
        >
          <ChevronRight />
        </Button>
      </div>

      {!isLoading && raffles.length > 3 && (
        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(raffles.length / 3))].map((_, index) => {
            const pageIndex = index * 3;
            return (
              <Button
                key={index}
                size="sm"
                isIconOnly
                variant="light"
                className={`mx-1 min-w-8 w-8 h-2 p-0 rounded-full ${
                  currentIndex === pageIndex
                    ? "bg-primary"
                    : "bg-default-200"
                }`}
                onPress={() => setCurrentIndex(pageIndex)}
                aria-label={`Go to page ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RaffleCarousel; 