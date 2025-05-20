import { useState, useEffect } from 'react';
import { useLottery } from './../../lib/hooks/useLottery';

export interface LotteryData {
  lotteryId: string;
  state: string;
  drawTime: string;
  ticketPrice: string;
  totalPrizes: string;
  winningNumbers: string;
  userTickets: string;
  // Additional fields needed by LotteryPage
  name: string;
  description: string;
  prizePot: number;
  raffleDate: string;
  endDate: string;
}

export const useGetLottery = () => {
  const { 
    displayLotteryData, 
    loadAllLotteryData, 
    buyRandomTickets: hookBuyRandomTickets, 
    buyCustomTicket: hookBuyCustomTicket,
    isLoading: hookIsLoading,
    error: hookError
  } = useLottery();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lottery, setLottery] = useState<LotteryData | null>(null);

  const getLottery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loadAllLotteryData();
      const data = displayLotteryData();
      
      if (typeof data === 'string') {
        throw new Error(data);
      }
      
      // Transform the data to match LotteryPage requirements
      const formattedData: LotteryData = {
        ...data,
        name: "MegaLucky Lottery",
        description: "The biggest lottery draw of the season. Pick 6 numbers and win big!",
        prizePot: parseFloat(data.totalPrizes.replace(' USDT', '')),
        raffleDate: data.drawTime,
        endDate: data.drawTime
      };
      
      setLottery(formattedData);
      return formattedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lottery data';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const buyCustomTicket = async (numbers: number[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar que sean 6 números
      if (numbers.length !== 6) {
        throw new Error('You must select exactly 6 numbers');
      }
      
      // Validar que los números estén en el rango correcto
      if (numbers.some(num => num < 1 || num > 49)) {
        throw new Error(`Numbers must be between 1 and 49`);
      }
      
      const result = await hookBuyCustomTicket(numbers);
      
      if (!result.success) {
        throw new Error('Failed to purchase ticket');
      }

      // Refresh lottery data after purchase
      await getLottery();
      return { success: true, tickets: [numbers] };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase ticket';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const buyRandomTickets = async (quantity: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar la cantidad (máximo 100)
      if (quantity < 1 || quantity > 100) {
        throw new Error('You can buy between 1 and 100 random tickets');
      }
      
      const result = await hookBuyRandomTickets(quantity);
      
      if (!result.success) {
        throw new Error('Failed to purchase random tickets');
      }

      // Refresh lottery data after purchase
      await getLottery();
      return { success: true, tickets: [] }; // The actual tickets will be in the updated lottery data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase random tickets';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a sequence has been purchased
  const isSequencePurchased = (numbers: number[]) => {
    if (!lottery || !lottery.userTickets) return false;
    const userTickets = lottery.userTickets.split(' | ');
    const sequenceStr = numbers.join(' - ');
    return userTickets.includes(sequenceStr);
  };

  // Auto-load data when component mounts
  useEffect(() => {
    getLottery();
  }, []);

  return {
    getLottery,
    buyCustomTicket,
    buyRandomTickets,
    isSequencePurchased,
    isLoading: isLoading || hookIsLoading,
    error: error || hookError,
    lottery
  };
};