import { useState } from 'react';

interface LotteryTicket {
  id: number;
  ticketNumbers: number[];
  purchaseDate: string;
  drawDate: string;
  matchCategory?: number; // How many numbers matched in sequence
}

interface LotteryResult {
  hasEnded: boolean;
  winningNumbers: number[] | null;
  drawDate: string;
}

export const useGetUserLotteryNumbers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [lotteryResult, setLotteryResult] = useState<LotteryResult>({
    hasEnded: false,
    winningNumbers: null,
    drawDate: "2025-06-15T20:00:00Z"
  });

  // Helper function to calculate match category (how many numbers in sequence match)
  const calculateMatchCategory = (ticketNumbers: number[], winningNumbers: number[]): number => {
    let matchCount = 0;
    
    for (let i = 0; i < ticketNumbers.length; i++) {
      if (ticketNumbers[i] === winningNumbers[i]) {
        matchCount++;
      } else {
        break; // Stop counting as soon as a mismatch is found
      }
    }
    
    return matchCount;
  };

  const getUserLotteryNumbers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ejemplo de lotería que ya ha terminado (para demostración)
      const completedLottery: LotteryResult = {
        hasEnded: true,
        winningNumbers: [8, 2, 5, 4, 3, 3],
        drawDate: "2023-06-15T20:00:00Z"
      };
      
      // Datos de ejemplo para tickets de lotería del usuario
      let mockTickets: LotteryTicket[] = [
        {
          id: 1,
          ticketNumbers: [8, 2, 5, 0, 3, 3],
          purchaseDate: "2023-04-18T16:45:00Z",
          drawDate: "2023-06-15T20:00:00Z",
        },
        {
          id: 2,
          ticketNumbers: [7, 2, 5, 4, 3, 3],
          purchaseDate: "2023-04-19T12:30:00Z",
          drawDate: "2023-06-15T20:00:00Z",
        }
      ];
      
      // If lottery has ended and we have winning numbers, calculate match categories
      if (completedLottery.hasEnded && completedLottery.winningNumbers !== null) {
        mockTickets = mockTickets.map(ticket => ({
          ...ticket,
          matchCategory: calculateMatchCategory(ticket.ticketNumbers, completedLottery.winningNumbers as number[])
        }));
      }
      
      setLotteryResult(completedLottery);
      setTickets(mockTickets);
      
      return { tickets: mockTickets, lotteryResult: completedLottery };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lottery numbers';
      setError(errorMessage);
      return { tickets: [], lotteryResult };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getUserLotteryNumbers,
    isLoading,
    error,
    tickets,
    lotteryResult
  };
}; 