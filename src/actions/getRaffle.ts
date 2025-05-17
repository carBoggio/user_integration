import { useState } from 'react';
import { RaffleItem } from './getAllRaffles';

// Mock de datos para la lotería activa (un solo Raffle)
const mockLotteryRaffle: RaffleItem = {
  id: 1001,
  name: "MegaLucky Lottery",
  description: "The biggest lottery draw of the season. Pick 6 numbers and win big!",
  image: "/img/lottery/lottery-main.jpg",
  ticketPrice: 5.99,
  raffleDate: "2025-06-15T20:00:00Z",
  totalTickets: 1000,
  availableTickets: 654,
  availableNumbers: Array.from({ length: 49 }, (_, i) => i + 1).filter(n => !([1, 7, 13, 25, 36, 42, 5, 10, 15, 20, 25, 30, 2, 4, 8, 16, 32, 48].includes(n))),
  takenNumbers: [1, 7, 13, 25, 36, 42, 5, 10, 15, 20, 25, 30, 2, 4, 8, 16, 32, 48]
};

// Para simular una experiencia de lotería con selección de 6 números
export interface LotteryRaffleExtraData {
  prizePot: number;
  maxSelectionAllowed: number; // Número de selecciones posibles (6 para la lotería)
}

export const useGetRaffle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raffle, setRaffle] = useState<RaffleItem | null>(null);
  const [extraData, setExtraData] = useState<LotteryRaffleExtraData>({
    prizePot: 1250000,
    maxSelectionAllowed: 6
  });

  const getRaffle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En una aplicación real, esto recuperaría datos de la API
      setRaffle(mockLotteryRaffle);
      return { raffle: mockLotteryRaffle, extraData };
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
      if (numbers.length !== extraData.maxSelectionAllowed) {
        throw new Error(`You must select exactly ${extraData.maxSelectionAllowed} numbers`);
      }
      
      // Validar que los números estén disponibles
      if (!raffle || numbers.some(num => !raffle.availableNumbers.includes(num))) {
        throw new Error('One or more of the selected numbers are not available');
      }
      
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una aplicación real, esto enviaría los datos a la API
      // y actualizaría el estado con la respuesta
      if (raffle) {
        const updatedRaffle = { 
          ...raffle,
          availableTickets: raffle.availableTickets - 1,
          availableNumbers: raffle.availableNumbers.filter(n => !numbers.includes(n)),
          takenNumbers: [...raffle.takenNumbers, ...numbers]
        };
        
        setRaffle(updatedRaffle);
        return { success: true, ticket: numbers };
      }
      return { success: false };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase ticket';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
      
      // Validar que haya suficientes números disponibles
      if (!raffle || raffle.availableNumbers.length < quantity * extraData.maxSelectionAllowed) {
        throw new Error('Not enough available numbers');
      }
      
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generar tickets aleatorios
      const newTickets: number[][] = [];
      
      if (raffle) {
        // Creamos una copia de los números disponibles para trabajar con ella
        let availableNumbersCopy = [...raffle.availableNumbers];
        
        for (let i = 0; i < quantity; i++) {
          // Generar 6 números aleatorios únicos de los disponibles
          const randomTicket: number[] = [];
          while (randomTicket.length < extraData.maxSelectionAllowed) {
            const randomIndex = Math.floor(Math.random() * availableNumbersCopy.length);
            const num = availableNumbersCopy[randomIndex];
            randomTicket.push(num);
            // Removemos el número seleccionado de la copia
            availableNumbersCopy.splice(randomIndex, 1);
          }
          // Ordenar los números
          randomTicket.sort((a, b) => a - b);
          newTickets.push(randomTicket);
        }
        
        // Actualizar el estado
        const allSelectedNumbers = newTickets.flat();
        const updatedRaffle = { 
          ...raffle,
          availableTickets: raffle.availableTickets - quantity,
          availableNumbers: raffle.availableNumbers.filter(n => !allSelectedNumbers.includes(n)),
          takenNumbers: [...raffle.takenNumbers, ...allSelectedNumbers]
        };
        
        setRaffle(updatedRaffle);
      }
      
      return { success: true, tickets: newTickets };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase random tickets';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getRaffle,
    buyCustomTicket,
    buyRandomTickets,
    isLoading,
    error,
    raffle,
    extraData
  };
}; 