import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
//import RaffleCarousel from "@/components/RaffleCarousel";
import Logo from "@/components/Logo";

export default function IndexPage() {
  const navigate = useNavigate();

  const handleViewAllRaffles = () => {
    navigate("/lottery");
  };

  return (
    <DefaultLayout>
      <div className="py-10">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-5xl font-bold mb-4 relative inline-block">
            Win Amazing Prizes!
            <div className="absolute h-1 w-full bottom-[-8px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6 mb-2">
            Participate in our exclusive raffles and get a chance to win incredible items.
          </p>
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full my-8"></div>
        </div>

        <div className="relative">
          <div className="absolute -z-10 top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 top-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          {/* <RaffleCarousel /> */}
        </div>

        <div className="text-center mt-12">
          <Button 
            color="primary" 
            size="lg"
            onPress={handleViewAllRaffles}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6 text-lg font-medium"
          >
            View The Lottery!
          </Button>
        </div>
        
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4 relative inline-block">
            How It Works
            <div className="absolute h-1 w-full bottom-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2">Pick 6 Digits</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose your 6-digit sequence or use Quick Pick.</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2">Buy Your Tickets</h3>
              <p className="text-gray-600 dark:text-gray-400">Complete your purchase securely.</p>
            </div>
            
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2">Win by Matching</h3>
              <p className="text-gray-600 dark:text-gray-400">Match digits in order from left to right to win prizes.</p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}