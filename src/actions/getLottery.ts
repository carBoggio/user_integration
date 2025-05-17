import { useState } from 'react';

export interface LotteryData {
  id: number;
  name: string;
  description: string;
  image: string;
  ticketPrice: number;
  endDate: string;
  prizePot: number;
  maxTicketNumber: number; // Para lotería de 6 números, típicamente sería 49
  soldTickets: number;
  ticketsSold: number[][]; // Array de arrays con los 6 números seleccionados para cada ticket vendido
}

// Mock de datos para la lotería activa
const mockLotteryData: LotteryData = {
  id: 1001,
  name: "MegaLucky Lottery",
  description: "The biggest lottery draw of the season. Pick 6 numbers and win big!",
  image: "/img/lottery/lottery-main.jpg",
  ticketPrice: 5.99,
  endDate: "2025-06-15T20:00:00Z",
  prizePot: 1250000,
  maxTicketNumber: 49,
  soldTickets: 346,
  ticketsSold: [
    [1, 7, 13, 25, 36, 42],
    [5, 10, 15, 20, 25, 30],
    [2, 4, 8, 16, 32, 48],
    // ... más tickets vendidos
  ]
};

export const useGetLottery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lottery, setLottery] = useState<LotteryData | null>(null);

  const getLottery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En una aplicación real, esto recuperaría datos de la API
      setLottery(mockLotteryData);
      return mockLotteryData;
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
      if (numbers.some(num => num < 1 || num > mockLotteryData.maxTicketNumber)) {
        throw new Error(`Numbers must be between 1 and ${mockLotteryData.maxTicketNumber}`);
      }
      
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una aplicación real, esto enviaría los datos a la API
      // y actualizaría el estado con la respuesta
      const updatedLottery = { 
        ...mockLotteryData,
        soldTickets: mockLotteryData.soldTickets + 1,
        ticketsSold: [...mockLotteryData.ticketsSold, numbers]
      };
      
      setLottery(updatedLottery);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase ticket';
      setError(errorMessage);
      return false;
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
      
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generar tickets aleatorios
      const newTickets: number[][] = [];
      
      for (let i = 0; i < quantity; i++) {
        // Generar 6 números aleatorios únicos entre 1 y maxTicketNumber
        const randomTicket: number[] = [];
        while (randomTicket.length < 6) {
          const num = Math.floor(Math.random() * mockLotteryData.maxTicketNumber) + 1;
          if (!randomTicket.includes(num)) {
            randomTicket.push(num);
          }
        }
        // Ordenar los números
        randomTicket.sort((a, b) => a - b);
        newTickets.push(randomTicket);
      }
      
      // En una aplicación real, esto enviaría los datos a la API
      // y actualizaría el estado con la respuesta
      const updatedLottery = { 
        ...mockLotteryData,
        soldTickets: mockLotteryData.soldTickets + quantity,
        ticketsSold: [...mockLotteryData.ticketsSold, ...newTickets]
      };
      
      setLottery(updatedLottery);
      return newTickets;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase random tickets';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getLottery,
    buyCustomTicket,
    buyRandomTickets,
    isLoading,
    error,
    lottery
  };
}; 