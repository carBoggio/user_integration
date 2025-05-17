import { useState } from 'react';

export interface RaffleItem {
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
}

export const useGetAllRaffles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raffles, setRaffles] = useState<RaffleItem[]>([]);

  const getAllRaffles = async (featured?: boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En una aplicación real, esto sería una llamada a la API
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Importar los datos del JSON
      const response = await import("@/data/raffles.json");
      const raffleData = response.default;
      
      // Si se solicitan solo los destacados, devolvemos una muestra (3 primeros)
      let result = raffleData;
      if (featured) {
        result = raffleData.slice(0, 3);
      }
      
      setRaffles(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch raffles';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAllRaffles,
    isLoading,
    error,
    raffles
  };
}; 