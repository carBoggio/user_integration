import { useState, useCallback, useEffect } from "react";
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
      setUserTickets(formattedTickets);
      
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

  // Helper function to format numbers
  const formatNumbers = (numbers: bigint[] | null) => {
    if (!numbers || numbers.length === 0) return "Not drawn yet";
    return numbers.map(n => n.toString().padStart(2, '0')).join(" - ");
  };

  // Helper function to format tickets
  const formatTickets = (tickets: number[][]) => {
    if (!tickets || tickets.length === 0) return "No tickets";
    return tickets.map(ticket => 
      ticket.map(num => num.toString().padStart(2, '0')).join(" - ")
    ).join(" | ");
  };

  // Helper function to format price
  const formatPrice = (price: { raw: bigint; formatted: string; } | null) => {
    if (!price) return "Not available";
    return `${price.formatted} USDT`;
  };

  // Helper function to format prizes
  const formatPrizes = (prizes: bigint | null) => {
    if (!prizes) return "Not available";
    return `${formatUnits(prizes, 18)} USDT`;
  };

  // Function to display lottery data
  const displayLotteryData = useCallback(() => {
    if (isLoading) {
      console.log('⏳ Loading state...');
      return "Loading...";
    }
    if (error) {
      console.log('❌ Error state:', error);
      return `Error: ${error}`;
    }

    const data = {
      lotteryId: currentLotteryId?.toString() || "Not available",
      state: lotteryState === 1n ? "Open" : "Closed",
      drawTime: formatDrawTime(drawTime),
      ticketPrice: formatPrice(ticketPrice),
      totalPrizes: formatPrizes(totalPrizes),
      winningNumbers: formatNumbers(winningNumbers),
      userTickets: formatTickets(userTickets)
    };

    console.log('📊 Current Lottery Data:', data);
    return data;
  }, [isLoading, error, currentLotteryId, lotteryState, drawTime, ticketPrice, totalPrizes, winningNumbers, userTickets]);

  // Auto-load data when component mounts
  useEffect(() => {
    console.log('🚀 Initializing lottery hook...');
    loadAllLotteryData();
  }, [loadAllLotteryData]);

  return {
    isLoading,
    error,
    displayLotteryData,
    loadAllLotteryData,
    buyRandomTickets,
    buyCustomTicket,
    clearError: () => setError(null)
  };
}
