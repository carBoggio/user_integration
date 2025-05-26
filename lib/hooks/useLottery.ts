import { useState, useCallback } from "react";
import { lotteryService } from "../services/lotteryService";
import { formatUnits } from "viem";

export function useLottery() {
  const [userTickets, setUserTickets] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lotteryState, setLotteryState] = useState<bigint | null>(null);
  const [currentLotteryId, setCurrentLotteryId] = useState<bigint | null>(null);
  const [drawTime, setDrawTime] = useState<bigint | null>(null);
  const [ticketPrice, setTicketPrice] = useState<{
    raw: bigint;
    formatted: string;
  } | null>(null);
  const [winningNumbers, setWinningNumbers] = useState<bigint[] | null>(null);
  const [totalPrizes, setTotalPrizes] = useState<bigint | null>(null);

  function loadingLottery() {
    console.log('🔄 Loading lottery data...');
    setIsLoading(true);
    setError(null);
  }

  // Function to load all lottery data at once
  const loadAllLotteryData = useCallback(async () => {
    loadingLottery();
    try {
      // Load all data in parallel
      const [state, id, time, price, tickets, numbers, prizes] = await Promise.all([
        lotteryService.getLotteryState(),
        lotteryService.getCurrentLotteryId(),
        lotteryService.getCurrentDrawTime(),
        lotteryService.getTicketPrice(),
        lotteryService.getUserTickets(),
        lotteryService.getWinningNumbers(),
        lotteryService.getTotalPrizes()
      ]);

      console.log('📊 Raw Data:', {
        state,
        id,
        time,
        price,
        tickets,
        numbers,
        prizes
      });

      setLotteryState(state as bigint);
      setCurrentLotteryId(id as bigint);
      setDrawTime(time as bigint);
      
      // Handle ticket price
      if (typeof price === "object" && "formatted" in price) {
        setTicketPrice(price);
      } else {
        setTicketPrice({
          raw: price as unknown as bigint,
          formatted: formatUnits(price as unknown as bigint, 18),
        });
      }

      // Format tickets
      const formattedTickets = (tickets as bigint[][]).map(ticket => 
        Array.isArray(ticket) ? ticket.map(num => Number(num)) : []
      );
      setIsLoading(false);
    }
  }, []);

  // Function to load user tickets
  const loadUserTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tickets = (await lotteryService.getUserTickets()) as bigint[][];
      
      // If no tickets returned (likely because no wallet connected), just set empty array
      if (!tickets || tickets.length === 0) {
        setUserTickets([]);
        setIsLoading(false);
        return;
      }

      // Properly convert the returned tickets to the expected format
      // Each ticket is an array of 6 numbers (uint8[6])
      const formattedTickets = tickets.map((ticket) => {
        // Convert each BigInt in the ticket array to a number
        return Array.isArray(ticket) ? ticket.map((num) => Number(num)) : [];
      });

      setUserTickets(formattedTickets);
      setIsLoading(false);
    } catch (err) {
      // Only set error if it's not related to wallet connection
      if (err instanceof Error && !err.message.includes("InvalidAddressError")) {
        setError(err.message);
      } else {
        setUserTickets([]);
      }
      setIsLoading(false);
    }
  }, []);

  // Function to load winning numbers
  const loadWinningNumbers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const numbers = await lotteryService.getWinningNumbers();
      setWinningNumbers(numbers as bigint[]);
      setTotalPrizes(prizes as bigint);
      
      console.log('✅ Data loaded successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('❌ Error loading lottery data:', err);
      setError(err instanceof Error ? err.message : "Failed to load lottery data");
      setIsLoading(false);
    }
  }, []);

  // Function to buy random tickets
  const buyRandomTickets = useCallback(async (ticketCount: number) => {
    console.log('🎫 Buying random tickets:', ticketCount);
    setIsLoading(true);
    setError(null);
    try {
      const result = await lotteryService.buyRandomTickets(ticketCount);
      console.log('🎫 Buy result:', result);
      if (result.success) {
        await loadAllLotteryData(); // Refresh all data after purchase
      }
      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('❌ Error buying tickets:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to buy tickets";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [loadAllLotteryData]);

  // Function to buy custom ticket
  const buyCustomTicket = useCallback(async (numbers: number[]) => {
    console.log('🎫 Buying custom ticket:', numbers);
    setIsLoading(true);
    setError(null);
    try {
      const result = await lotteryService.buyCustomTicket(numbers);
      console.log('🎫 Buy result:', result);
      if (result.success) {
        await loadAllLotteryData(); // Refresh all data after purchase
      }
      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('❌ Error buying custom ticket:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to buy custom ticket";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [loadAllLotteryData]);

  // Helper function to format draw time
  const formatDrawTime = (timestamp: bigint | null) => {
    if (!timestamp) return "Not set";
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  // Function to check if lottery is open
  const isLotteryOpen =  Number(lotteryState) === 1; // 1 = OPEN, 0 = CLOSED

  return {
    // State
    
    isLoading,
    error,
    displayLotteryData,
    loadAllLotteryData,
    buyRandomTickets,
    buyCustomTicket,
    clearError: () => setError(null)
  };
}
