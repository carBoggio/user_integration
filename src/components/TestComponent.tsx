import React from 'react';
import { useLottery } from '../../lib/hooks/useLottery';

export const TestComponent: React.FC = () => {
  const lottery = useLottery();

  const handleLoadLotteryData = async () => {
    console.log('Testing loadLotteryData...');
    await lottery.loadLotteryData();
    console.log({
      lotteryState: lottery.lotteryState,
      currentLotteryId: lottery.currentLotteryId,
      drawTime: lottery.drawTime,
      ticketPrice: lottery.ticketPrice,
      isLotteryOpen: lottery.isLotteryOpen,
      formattedDrawTime: lottery.formattedDrawTime
    });
  };

  const handleLoadUserTickets = async () => {
    console.log('Testing loadUserTickets...');
    await lottery.loadUserTickets();
    console.log('User tickets:', lottery.userTickets);
  };

  const handleLoadWinningNumbers = async () => {
    console.log('Testing loadWinningNumbers...');
    await lottery.loadWinningNumbers();
    console.log('Winning numbers:', lottery.winningNumbers);
  };

  const handleLoadTotalPrizes = async () => {
    console.log('Testing loadTotalPrizes...');
    await lottery.loadTotalPrizes();
    console.log('Total prizes:', lottery.totalPrizes);
  };

  const handleBuyRandomTickets = async () => {
    console.log('Testing buyRandomTickets...');
    const result = await lottery.buyRandomTickets(1);
    console.log('Buy random tickets result:', result);
    console.log('Transaction hash:', lottery.transactionHash);
  };

  const handleBuyCustomTicket = async () => {
    console.log('Testing buyCustomTicket...');
    const numbers = [1, 2, 3, 4, 5, 6];
    const result = await lottery.buyCustomTicket(numbers);
    console.log('Buy custom ticket result:', result);
    console.log('Transaction hash:', lottery.transactionHash);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Lottery Test Component</h2>
      
      {/* Status display */}
      <div className="mb-4">
        <p>Loading: {lottery.isLoading ? 'Yes' : 'No'}</p>
        {lottery.error && <p className="text-red-500">Error: {lottery.error}</p>}
      </div>

      {/* Test buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleLoadLotteryData}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={lottery.isLoading}
        >
          Load Lottery Data
        </button>

        <button
          onClick={handleLoadUserTickets}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={lottery.isLoading}
        >
          Load User Tickets
        </button>

        <button
          onClick={handleLoadWinningNumbers}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
          disabled={lottery.isLoading}
        >
          Load Winning Numbers
        </button>

        <button
          onClick={handleLoadTotalPrizes}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 disabled:bg-gray-400"
          disabled={lottery.isLoading}
        >
          Load Total Prizes
        </button>

        <button
          onClick={handleBuyRandomTickets}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400"
          disabled={lottery.isLoading || !lottery.isLotteryOpen}
        >
          Buy Random Ticket
        </button>

        <button
          onClick={handleBuyCustomTicket}
          className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 disabled:bg-gray-400"
          disabled={lottery.isLoading || !lottery.isLotteryOpen}
        >
          Buy Custom Ticket
        </button>
      </div>

      {/* Clear buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={lottery.clearError}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          disabled={!lottery.error}
        >
          Clear Error
        </button>
        <button
          onClick={lottery.clearTransactionHash}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          disabled={!lottery.transactionHash}
        >
          Clear Transaction Hash
        </button>
      </div>
    </div>
  );
}; 