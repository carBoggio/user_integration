import { useEffect, useState } from "react";
import { useLottery } from "../../lib/hooks/useLottery"; // Adjust the path according to your structure

const LotteryTestComponent = () => {
  const {
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
    isLotteryOpen,
    formattedDrawTime,
    loadLotteryData,
    loadUserTickets,
    loadWinningNumbers,
    loadTotalPrizes,
    buyRandomTickets,
    buyCustomTicket,
    clearError,
    clearTransactionHash,
  } = useLottery();

  const [testNumbers, setTestNumbers] = useState([1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] Component mounted, loading all data...");
    
    // Load all data on component mount
    const loadAllData = async () => {
      try {
        console.log("🧪 [LotteryTest] Loading lottery data...");
        await loadLotteryData();
        
        console.log("🧪 [LotteryTest] Loading user tickets...");
        await loadUserTickets();
        
        console.log("🧪 [LotteryTest] Loading winning numbers...");
        await loadWinningNumbers();
        
        console.log("🧪 [LotteryTest] Loading total prizes...");
        await loadTotalPrizes();
        
        console.log("🧪 [LotteryTest] All data loaded!");
      } catch (err) {
        console.error("🧪 [LotteryTest] Error loading data:", err);
      }
    };

    loadAllData();
  }, [loadLotteryData, loadUserTickets, loadWinningNumbers, loadTotalPrizes]);

  // Log state changes
  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - isLoading:", isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - error:", error);
  }, [error]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - lotteryState:", lotteryState);
  }, [lotteryState]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - currentLotteryId:", currentLotteryId);
  }, [currentLotteryId]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - drawTime:", drawTime);
  }, [drawTime]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - ticketPrice:", ticketPrice);
  }, [ticketPrice]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - userTickets:", userTickets);
  }, [userTickets]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - winningNumbers:", winningNumbers);
  }, [winningNumbers]);

  useEffect(() => {
    console.log("🧪 [LotteryTest] State Update - totalPrizes:", totalPrizes);
  }, [totalPrizes]);

  const handleTestCustomTicket = async () => {
    console.log("🧪 [LotteryTest] Testing custom ticket purchase...");
    const result = await buyCustomTicket(testNumbers);
    console.log("🧪 [LotteryTest] Custom ticket result:", result);
  };

  const handleTestRandomTickets = async () => {
    console.log("🧪 [LotteryTest] Testing random tickets purchase...");
    const result = await buyRandomTickets(2);
    console.log("🧪 [LotteryTest] Random tickets result:", result);
  };

  const handleRefreshData = async () => {
    console.log("🧪 [LotteryTest] Refreshing all data...");
    await loadLotteryData();
    await loadUserTickets();
    await loadWinningNumbers();
    await loadTotalPrizes();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🧪 Lottery Hook Test Component</h1>
      <p><em>Check the console for detailed logs!</em></p>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>📊 Current State</h2>
        <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Lottery Open:</strong> {isLotteryOpen ? 'Yes' : 'No'}</p>
          <p><strong>Lottery State:</strong> {lotteryState?.toString() || 'Not loaded'}</p>
          <p><strong>Current ID:</strong> {currentLotteryId?.toString() || 'Not loaded'}</p>
          <p><strong>Draw Time:</strong> {formattedDrawTime}</p>
          <p><strong>Ticket Price:</strong> {ticketPrice ? `${ticketPrice.formatted} (raw: ${ticketPrice.raw.toString()})` : 'Not loaded'}</p>
          <p><strong>User Tickets Count:</strong> {userTickets.length}</p>
          <p><strong>Winning Numbers:</strong> {winningNumbers ? winningNumbers.map(n => Number(n)).join(', ') : 'Not loaded'}</p>
          <p><strong>Total Prizes:</strong> {totalPrizes?.toString() || 'Not loaded'}</p>
          <p><strong>Transaction Hash:</strong> {transactionHash || 'None'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>🎫 User Tickets Detail</h2>
        <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {userTickets.length > 0 ? (
            userTickets.map((ticket, index) => (
              <p key={index}>
                <strong>Ticket {index + 1}:</strong> [{ticket.join(', ')}]
              </p>
            ))
          ) : (
            <p>No tickets found</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>🎮 Test Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleRefreshData}
            disabled={isLoading}
            style={{ padding: '10px 15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            🔄 Refresh All Data
          </button>
          
          <button 
            onClick={handleTestCustomTicket}
            disabled={isLoading}
            style={{ padding: '10px 15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            🎯 Test Custom Ticket [1,2,3,4,5,6]
          </button>
          
          <button 
            onClick={handleTestRandomTickets}
            disabled={isLoading}
            style={{ padding: '10px 15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            🎰 Test 2 Random Tickets
          </button>
          
          <button 
            onClick={clearError}
            style={{ padding: '10px 15px', cursor: 'pointer' }}
          >
            🧹 Clear Error
          </button>
          
          <button 
            onClick={clearTransactionHash}
            style={{ padding: '10px 15px', cursor: 'pointer' }}
          >
            🧹 Clear TX Hash
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>📝 Test Numbers Input</h2>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span>Numbers: </span>
          {testNumbers.map((num, index) => (
            <input
              key={index}
              type="number"
              min="0"
              max="9"
              value={num}
              onChange={(e) => {
                const newNumbers = [...testNumbers];
                newNumbers[index] = parseInt(e.target.value) || 0;
                setTestNumbers(newNumbers);
              }}
              style={{ width: '40px', padding: '5px', textAlign: 'center' }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Open browser console to see detailed logs</li>
          <li>All methods are called automatically on mount</li>
          <li>Use the buttons to test individual actions</li>
          <li>Check console logs for data formats and API responses</li>
        </ul>
      </div>
    </div>
  );
};

export default LotteryTestComponent;