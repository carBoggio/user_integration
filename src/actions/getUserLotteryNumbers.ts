import { useState } from 'react';

interface LotteryTicket {
  id: number;
  ticketNumbers: number[];
  purchaseDate: string;
  drawDate: string;
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

  const getUserLotteryNumbers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo para tickets de lotería del usuario
      const mockTickets: LotteryTicket[] = [
        {
          id: 1,
          ticketNumbers: [7, 13, 21, 32, 41, 48],
          purchaseDate: "2023-04-18T16:45:00Z",
          drawDate: "2025-06-15T20:00:00Z",
        },
        {
          id: 2,
          ticketNumbers: [3, 11, 24, 27, 36, 45],
          purchaseDate: "2023-04-19T12:30:00Z",
          drawDate: "2025-06-15T20:00:00Z",
        }
      ];
      
      // Ejemplo de lotería que ya ha terminado (para demostración)
      // Uncomment the following to simulate an ended lottery
      /*
      const completedLottery: LotteryResult = {
        hasEnded: true,
        winningNumbers: [3, 11, 22, 27, 36, 45],
        drawDate: "2023-06-15T20:00:00Z"
      };
      setLotteryResult(completedLottery);
      */
      
      setTickets(mockTickets);
      return { tickets: mockTickets, lotteryResult };
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