import { useState } from 'react';

interface Ticket {
  id: number;
  raffleId: number;
  raffleName: string;
  raffleImage: string;
  ticketNumbers: number[];
  purchaseDate: string;
  drawDate: string;
  type: 'raffle' | 'lottery';
}

export const useGetTickets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const getTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En una aplicación real, esto sería una llamada a la API
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo para tickets del usuario
      const mockTickets: Ticket[] = [
        {
          id: 1,
          raffleId: 1,
          raffleName: "PlayStation 5",
          raffleImage: "/img/raffle1/img1.jpg",
          ticketNumbers: [4, 6, 8, 9, 19],
          purchaseDate: "2023-04-15T10:30:00Z",
          drawDate: "2025-05-25T23:59:59Z",
          type: 'raffle'
        },
        {
          id: 2,
          raffleId: 2,
          raffleName: "MacBook Pro M3",
          raffleImage: "/img/raffle2/img1.jpg",
          ticketNumbers: [10, 11, 12, 13],
          purchaseDate: "2023-04-10T14:20:00Z",
          drawDate: "2025-05-20T20:00:00Z",
          type: 'raffle'
        },
        {
          id: 3,
          raffleId: 3,
          raffleName: "Luxury Caribbean Cruise",
          raffleImage: "/img/raffle3/img1.jpg",
          ticketNumbers: [5, 6, 7, 8, 9, 10, 11, 12, 13],
          purchaseDate: "2023-04-05T09:15:00Z",
          drawDate: "2025-05-16T18:30:00Z",
          type: 'raffle'
        },
        {
          id: 4,
          raffleId: 1001,
          raffleName: "MegaLucky Lottery",
          raffleImage: "/img/lottery/lottery-main.jpg",
          ticketNumbers: [7, 13, 21, 32, 41, 48],
          purchaseDate: "2023-04-18T16:45:00Z",
          drawDate: "2025-06-15T20:00:00Z",
          type: 'lottery'
        },
        {
          id: 5,
          raffleId: 1001,
          raffleName: "MegaLucky Lottery",
          raffleImage: "/img/lottery/lottery-main.jpg",
          ticketNumbers: [3, 11, 24, 27, 36, 45],
          purchaseDate: "2023-04-18T16:45:00Z",
          drawDate: "2025-06-15T20:00:00Z",
          type: 'lottery'
        }
      ];
      
      setTickets(mockTickets);
      return mockTickets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getTickets,
    isLoading,
    error,
    tickets
  };
}; 