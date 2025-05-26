import { useState, useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import Raffle from "@/components/Raffle";

type RaffleItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  ticketPrice: number;
  raffleDate: string;
  totalTickets: number;
  availableTickets: number;
};

export default function AllRafflesPage() {
  const [raffles, setRaffles] = useState<RaffleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        // In a real application, this would be an API call
        const response = await import("@/data/raffles.json");
        setRaffles(response.default);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading raffle data:", error);
        setIsLoading(false);
      }
    };

    fetchRaffles();
  }, []);

  return (
    <DefaultLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center mb-8 relative inline-block mx-auto w-full">
          All Raffles
          <div className="absolute h-1 w-48 left-1/2 -translate-x-1/2 bottom-[-8px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map(() => (
              
                <div className="h-[400px] rounded-lg bg-default-300"></div>
             
            ))}
          </div>
        ) : raffles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <Raffle key={raffle.id} raffle={raffle} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No Raffles Available</h2>
            <p className="text-gray-600">
              Check back soon for new exciting raffles!
            </p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
} 