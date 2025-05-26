import { useState, useCallback } from "react";
import { lotteryService } from "../services/lotteryService";
import { formatUnits } from "viem";

export function useLottery() {
  // Update userTickets type to match the contract return type (array of ticket number arrays)
  const [userTickets, setUserTickets] = useState<number[][]>([]);

  // Rest of the state variables remain the same...
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
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Function to load basic lottery data
  const loadLotteryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get lottery state
      const state = await lotteryService.getLotteryState();

      setLotteryState(state as bigint);

      // Get lottery ID
      const id = await lotteryService.getCurrentLotteryId();

      setCurrentLotteryId(id as bigint);

      // Get draw time
      const time = await lotteryService.getCurrentDrawTime();
      setDrawTime(time as bigint);

      // Get ticket price
      const price = await lotteryService.getTicketPrice();
      if (typeof price === "object" && "formatted" in price) {
        setTicketPrice(price);
      } else {
        // For backward compatibility if your getTicketPrice still returns just the raw bigint
        setTicketPrice({
          raw: price as unknown as bigint,
          formatted: formatUnits(price as unknown as bigint, 18), // Changed from 6 to 18 decimals
        });
      }

      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load lottery data"
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
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load winning numbers"
      );
      setIsLoading(false);
    }
  }, []);

  // Function to load total prizes
  const loadTotalPrizes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prizes = await lotteryService.getTotalPrizes();

      setTotalPrizes(prizes as bigint);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load total prizes"
      );
      setIsLoading(false);
    }
  }, []);

  // Function to buy random tickets
  const buyRandomTickets = useCallback(
    async (ticketCount: number) => {
      setIsLoading(true);
      setError(null);
      setTransactionHash(null);
      try {
        const result = await lotteryService.buyRandomTickets(ticketCount);

        if (result.success) {
          setTransactionHash(result.hash);
          // Refresh user's tickets after purchase

          await loadUserTickets();
        }
        setIsLoading(false);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to buy tickets";

        setError(errorMessage);
        setIsLoading(false);

        return { success: false, error: errorMessage };
      }
    },
    [loadUserTickets]
  );

  // Function to buy custom ticket
  const buyCustomTicket = useCallback(
    async (numbers: number[]) => {
      setIsLoading(true);
      setError(null);
      setTransactionHash(null);
      try {
        const result = await lotteryService.buyCustomTicket(numbers);
        if (result.success) {
          setTransactionHash(result.hash);
          // Refresh user's tickets after purchase
          await loadUserTickets();
        }
        setIsLoading(false);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to buy custom ticket";
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [loadUserTickets]
  );

  // Helper function to format a timestamp to human-readable date
  const formatDrawTime = (timestamp: bigint | null) => {
    if (!timestamp) return "Not set";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  
  // Function to check if lottery is open
  const isLotteryOpen =  Number(lotteryState) === 1; // 1 = OPEN, 0 = CLOSED

  // Return all the state and functions
  return {
    // State
    
    isLoading,
    error,
    lotteryState,
    currentLotteryId,
    drawTime,
    ticketPrice,
    userTickets,
    winningNumbers,
    totalPrizes,
    transactionHash,

    // Derived state
    isLotteryOpen,
    formattedDrawTime: formatDrawTime(drawTime),

    // Functions
    loadLotteryData,
    loadUserTickets,
    loadWinningNumbers,
    loadTotalPrizes,
    buyRandomTickets,
    buyCustomTicket,

    // Clear functions
    clearError: () => setError(null),
    clearTransactionHash: () => setTransactionHash(null),
  };
}
