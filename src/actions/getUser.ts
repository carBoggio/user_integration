import { useState } from 'react';

interface User {
  id: string;
  name: string;
  avatar: string;
  walletAddress: string;
  memberSince: string;
  email?: string;
}

export const useGetUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En una aplicación real, esto sería una llamada a la API
      // Simulamos un retraso para imitar una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos de ejemplo para el usuario
      const mockUser: User = {
        id: "1",
        name: "Carla Rodriguez",
        avatar: "https://i.pravatar.cc/300?u=carla", // Avatar aleatorio para demo
        walletAddress: "0x8A1d...f450",
        memberSince: "March 2023",
        email: "carla@example.com"
      };
      
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getUser,
    isLoading,
    error,
    user
  };
}; 