import { useState } from 'react';

interface LotteryData {
  id: string;
  name: string;
  description: string;
  prizePot: number;
  ticketPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  userPurchasedNumbers: number[][];
}

export const useGenLotteryByUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lotteryData, setLotteryData] = useState<LotteryData | null>(null);

  const getLotteryByUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un caso real, aquí consultaríamos la lotería activa y los números que el usuario ya ha comprado
      const mockLotteryData: LotteryData = {
        id: "1001",
        name: "MegaLucky Lottery",
        description: "Try your luck with our lottery and win amazing prizes!",
        prizePot: 50000,
        ticketPrice: 5,
        startDate: "2023-01-01T00:00:00Z",
        endDate: "2025-06-15T20:00:00Z",
        isActive: true,
        // Estos serían los números que el usuario ya ha comprado y no debería poder seleccionar de nuevo
        userPurchasedNumbers: [
          [8, 2, 5, 0, 3, 3],
          [7, 2, 5, 4, 3, 3]
        ]
      };
      
      setLotteryData(mockLotteryData);
      return mockLotteryData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lottery data';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para verificar si una secuencia ya ha sido comprada
  const isSequencePurchased = (sequence: number[]) => {
    if (!lotteryData) return false;
    
    return lotteryData.userPurchasedNumbers.some(purchasedSeq => 
      purchasedSeq.length === sequence.length && 
      purchasedSeq.every((num, idx) => num === sequence[idx])
    );
  };

  // Función para comprar una secuencia
  const purchaseSequence = async (sequence: number[]) => {
    if (isSequencePurchased(sequence)) {
      return { success: false, message: "You have already purchased this sequence" };
    }
    
    setIsLoading(true);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un caso real, aquí enviaríamos la compra al servidor
      // Por ahora, actualizamos localmente
      if (lotteryData) {
        const updatedLottery = {
          ...lotteryData,
          userPurchasedNumbers: [...lotteryData.userPurchasedNumbers, sequence]
        };
        setLotteryData(updatedLottery);
      }
      
      return { success: true, message: "Sequence purchased successfully" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase sequence';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para comprar múltiples secuencias aleatorias
  const purchaseRandomSequences = async (quantity: number) => {
    setIsLoading(true);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const randomSequences: number[][] = [];
      
      // Generar secuencias aleatorias
      for (let i = 0; i < quantity; i++) {
        const sequence = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
        
        // Verificar que no sea una secuencia ya comprada
        if (!isSequencePurchased(sequence)) {
          randomSequences.push(sequence);
          
          // En un caso real, aquí enviaríamos la compra al servidor
          // Por ahora, actualizamos localmente
          if (lotteryData) {
            lotteryData.userPurchasedNumbers.push(sequence);
          }
        } else {
          // Si ya está comprada, intentamos de nuevo
          i--;
        }
      }
      
      // Actualizar el estado para reflejar las nuevas compras
      if (lotteryData) {
        const updatedLottery = {
          ...lotteryData
        };
        setLotteryData(updatedLottery);
      }
      
      return { success: true, tickets: randomSequences };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase random sequences';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getLotteryByUser,
    isSequencePurchased,
    purchaseSequence,
    purchaseRandomSequences,
    isLoading,
    error,
    lotteryData
  };
}; 