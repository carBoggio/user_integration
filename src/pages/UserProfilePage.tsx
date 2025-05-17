import { useState, useEffect } from "react";
import { 
  Avatar, 
  Skeleton, 
  Divider, 
  Card, 
  CardBody, 
  CardFooter, 
  Image, 
  Chip, 
  Button,
  Spinner
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Clock, ExternalLink, Mail } from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { useGetTickets } from "@/actions/getTickets";
import { useGetUser } from "@/actions/getUser";
import { useTheme } from "@/providers/themeProvider";
import { calculateTimeLeft } from "@/components/Raffle";

export default function UserProfilePage() {
  const { getTickets, tickets, isLoading: isLoadingTickets, error: ticketsError } = useGetTickets();
  const { getUser, user, isLoading: isLoadingUser, error: userError } = useGetUser();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    // Cargar datos de usuario y tickets al montar el componente
    getUser();
    getTickets();
  }, []);

  const formatTimeValue = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  const goToRaffleDetail = (raffleId: number) => {
    navigate(`/raffle/${raffleId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <DefaultLayout>
      <div className="py-8 container">
        <h1 className="text-3xl font-bold relative inline-block mb-8">
          My Profile
          <div className="absolute h-1 w-full bottom-[-8px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección del perfil - 1/4 del ancho en escritorio */}
          <div className="md:col-span-1">
            {isLoadingUser ? (
              <Card className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="w-32 h-6 rounded-lg mb-2" />
                  <Skeleton className="w-24 h-4 rounded-lg mb-1" />
                  <Skeleton className="w-28 h-4 rounded-lg" />
                </div>
              </Card>
            ) : user ? (
              <Card className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar 
                    src={user.avatar} 
                    size="lg" 
                    className="w-24 h-24 mb-4"
                  />
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user.walletAddress}
                  </p>
                  {user.email && (
                    <p className={`text-sm mt-2 flex items-center justify-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Mail size={14} /> {user.email}
                    </p>
                  )}
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Member since {user.memberSince}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-4 text-center">
                <p className="text-danger mb-2">Failed to load user data</p>
                <Button 
                  size="sm" 
                  variant="light" 
                  onPress={() => getUser()}
                >
                  Retry
                </Button>
              </Card>
            )}
          </div>

          {/* Sección de tickets - 3/4 del ancho en escritorio */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-4 relative inline-block">
              My Tickets
              <div className="absolute h-1 w-full bottom-[-4px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>

            {isLoadingTickets ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="rounded-lg w-full">
                    <div className="h-36 rounded-lg bg-default-300"></div>
                  </Skeleton>
                ))}
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => {
                  const timeLeft = calculateTimeLeft(ticket.drawDate);
                  
                  return (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 max-h-48">
                          <Image
                            removeWrapper
                            alt={ticket.raffleName}
                            className="w-full h-48 object-cover"
                            src={ticket.raffleImage}
                          />
                        </div>
                        
                        <div className="flex-1 p-4">
                          <h3 className="text-xl font-bold mb-2">{ticket.raffleName}</h3>
                          
                          <div className="flex items-center text-sm mb-3">
                            <Clock size={16} className="mr-1" />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Draw date: {formatDate(ticket.drawDate)}
                            </span>
                          </div>
                          
                          <Divider className="my-3" />
                          
                          <div className="mb-3">
                            <p className="text-sm font-semibold mb-2">Your ticket numbers:</p>
                            <div className="flex flex-wrap gap-2">
                              {ticket.ticketNumbers.map(number => (
                                <Chip 
                                  key={number} 
                                  className="bg-purple-500 text-white"
                                >
                                  {number}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="text-sm">
                              <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Purchased:
                              </span>{" "}
                              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(ticket.purchaseDate)}
                              </span>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="light"
                              color="primary"
                              endContent={<ExternalLink size={14} />}
                              onPress={() => goToRaffleDetail(ticket.raffleId)}
                            >
                              View Raffle
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : ticketsError ? (
              <Card className="p-8 text-center">
                <p className="text-danger mb-4">Error loading your tickets</p>
                <Button 
                  color="primary"
                  onPress={() => getTickets()}
                >
                  Retry
                </Button>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-xl mb-4">You haven't purchased any tickets yet.</p>
                <Button 
                  color="primary"
                  onPress={() => navigate('/raffles')}
                  className="mt-2"
                >
                  Browse Raffles
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 