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
  Spinner,
  Tab,
  Tabs
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Clock, ExternalLink, Mail, Ticket, Gift } from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { useGetTickets } from "@/actions/getTickets";
import { useGetUser } from "@/actions/getUser";
import { useTheme } from "@/providers/themeProvider";
import { calculateTimeLeft } from "@/components/Raffle";

export default function UserProfilePage() {
  const { getTickets, tickets, isLoading: isLoadingTickets, error: ticketsError } = useGetTickets();
  const { getUser, user, isLoading: isLoadingUser, error: userError } = useGetUser();
  const [selectedTab, setSelectedTab] = useState<string>("all");
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

  const goToLottery = () => {
    navigate('/lottery');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Filtrar tickets según la pestaña seleccionada
  const filteredTickets = tickets.filter(ticket => {
    if (selectedTab === "all") return true;
    if (selectedTab === "lottery") return ticket.type === 'lottery';
    if (selectedTab === "raffles") return ticket.type === 'raffle';
    return true;
  });
  
  // Verificar si hay tickets de cada tipo
  const hasLotteryTickets = tickets.some(ticket => ticket.type === 'lottery');
  const hasRaffleTickets = tickets.some(ticket => ticket.type === 'raffle');

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold relative inline-block">
                My Tickets
                <div className="absolute h-1 w-full bottom-[-4px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h2>
              
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                aria-label="Ticket types"
                color="primary"
                variant="light"
                size="sm"
              >
                <Tab key="all" title="All" />
                <Tab key="lottery" title="Lottery" />
                <Tab key="raffles" title="Raffles" />
              </Tabs>
            </div>

            {isLoadingTickets ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="rounded-lg w-full">
                    <div className="h-36 rounded-lg bg-default-300"></div>
                  </Skeleton>
                ))}
              </div>
            ) : filteredTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
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
                          <div className="flex justify-between">
                            <h3 className="text-xl font-bold mb-2">{ticket.raffleName}</h3>
                            <Chip
                              color={ticket.type === 'lottery' ? 'secondary' : 'primary'}
                              variant="flat"
                              size="sm"
                            >
                              {ticket.type === 'lottery' ? 'Lottery' : 'Raffle'}
                            </Chip>
                          </div>
                          
                          <div className="flex items-center text-sm mb-3">
                            <Clock size={16} className="mr-1" />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Draw date: {formatDate(ticket.drawDate)}
                            </span>
                          </div>
                          
                          <Divider className="my-3" />
                          
                          <div className="mb-3">
                            <p className="text-sm font-semibold mb-2">Your {ticket.type === 'lottery' ? 'lottery' : 'ticket'} numbers:</p>
                            <div className="flex flex-wrap gap-2">
                              {ticket.ticketNumbers.map(number => (
                                <Chip 
                                  key={number} 
                                  className={ticket.type === 'lottery' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}
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
                              onPress={() => ticket.type === 'lottery' ? goToLottery() : goToRaffleDetail(ticket.raffleId)}
                            >
                              View {ticket.type === 'lottery' ? 'Lottery' : 'Raffle'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : selectedTab === "all" && tickets.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Ticket size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-4">You don't have any tickets yet</p>
                  <p className="text-default-500 mb-6">Participate in our raffles and lottery to win amazing prizes!</p>
                  <div className="flex gap-4">
                    <Button 
                      color="primary"
                      onPress={() => goToLottery()}
                      startContent={<Ticket size={16} />}
                    >
                      Buy Lottery Tickets
                    </Button>
                    <Button 
                      color="default"
                      variant="bordered"
                      onPress={() => navigate('/raffles')}
                      startContent={<Gift size={16} />}
                    >
                      Explore Raffles
                    </Button>
                  </div>
                </div>
              </Card>
            ) : selectedTab === "lottery" && !hasLotteryTickets ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Ticket size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-4">No lottery tickets yet</p>
                  <p className="text-default-500 mb-6">Try your luck with the MegaLucky Lottery!</p>
                  <Button 
                    color="primary"
                    onPress={() => goToLottery()}
                    startContent={<Ticket size={16} />}
                  >
                    Buy Lottery Tickets
                  </Button>
                </div>
              </Card>
            ) : selectedTab === "raffles" && !hasRaffleTickets ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Gift size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold mb-4">No raffle tickets yet</p>
                  <p className="text-default-500 mb-6">Explore our raffles and win amazing prizes!</p>
                  <Button 
                    color="primary"
                    onPress={() => navigate('/raffles')}
                    startContent={<Gift size={16} />}
                  >
                    Explore Raffles
                  </Button>
                </div>
              </Card>
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
                <p className="mb-4">No tickets found for the selected filter.</p>
                <Button 
                  color="primary"
                  onPress={() => setSelectedTab("all")}
                >
                  View All Tickets
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 