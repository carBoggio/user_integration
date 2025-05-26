import {  formatEther, formatUnits } from "viem";
import { publicClient, getWalletClient } from "../viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lottery";
import { ERC20_ABI, CONTRACT_ERC20 } from "../erc20";

export const lotteryService = {
  // Read functions
  async getLotteryState() {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "currentState",
      });
      // Returns 0 for CLOSED, 1 for OPEN
      return result;
    } catch (error) {
      console.error("Error getting lottery state:", error);
      throw error;
    }
  },

  async getCurrentLotteryId() {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "currentLotteryId",
      });
      return result;
    } catch (error) {
      console.error("Error getting lottery ID:", error);
      throw error;
    }
  },

  async getCurrentDrawTime() {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "currentDrawTime",
      });
      return result;
    } catch (error) {
      console.error("Error getting draw time:", error);
      throw error;
    }
  },

  async getTicketPrice() {
    try {
      const result = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ticketPrice",
      })) as bigint;
      // Format from raw units to a human-readable format using 18 decimals
      return {
        raw: result,
        formatted: formatUnits(result, 18), // Changed from 6 to 18 decimals
      };
    } catch (error) {
      console.error("Error getting ticket price:", error);
      throw error;
    }
  },

  async getUserTickets() {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient?.address) {
        // Return empty array if no wallet is connected
        return [];
      }
      
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getUserTickets",
        args: [walletClient.address],
      });
      return result;
    } catch (error) {
      console.error("Error getting user tickets:", error);
      throw error;
    }
  },

  async getWinningNumbers() {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getWinningNumbers",
      });
      return result;
    } catch (error) {
      console.error("Error getting winning numbers:", error);
      throw error;
    }
  },

  async getTotalPrizes() {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getTotalPrizes",
      });
      if (typeof result !== "number" && typeof result !== "bigint") {
        throw new Error("Unexpected result type for total prizes");
      }
      return formatEther(result as bigint); // Format to Ether
    } catch (error) {
      console.error("Error getting total prizes:", error);
      throw error;
    }
  },

  // Write functions
  async buyRandomTickets(ticketCount: number) {
    try {
      const { walletClient, address } = await getWalletClient();

      // 1. Get ticket price from contract
      const ticketPrice = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ticketPrice",
      })) as bigint;

      // 2. Calculate total cost (ticketPrice × ticketCount)
      const totalCost = ticketPrice * BigInt(ticketCount);

      // 3. Get payment token address from contract
      //const paymentTokenAddress = "0xE9b6e75C243B6100ffcb1c66e8f78F96FeeA727F";

      // const tokenContract = getContract({
      //   address: CONTRACT_ERC20,
      //   abi: ERC20_ABI,
      //   client: walletClient,
      // });

      //console.log("Payment token address:", paymentTokenAddress);
      console.log("Approving total cost:", totalCost.toString());

      // 4. Check current allowance
      const allowance = (await publicClient.readContract({
        address: CONTRACT_ERC20,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, CONTRACT_ADDRESS],
      })) as bigint;

      console.log("Current allowance:", allowance.toString());

      // 5. Approve token spending if needed
      if (allowance < totalCost) {
        console.log("Insufficient allowance. Approving...");

        // Prepare approval request
        const { request: approveRequest } = await publicClient.simulateContract(
          {
            account: address,
            address: CONTRACT_ERC20,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACT_ADDRESS, totalCost],
          }
        );

        // Execute approval transaction
        const approvalHash = await walletClient.writeContract(approveRequest);
        console.log("Approval transaction hash:", approvalHash);

        // Wait for approval transaction to be confirmed
        const approvalReceipt = await publicClient.waitForTransactionReceipt({
          hash: approvalHash,
        });
        console.log(
          "Approval confirmed in block:",
          approvalReceipt.blockNumber
        );
      } else {
        console.log("Sufficient allowance already granted");
      }

      // 6. Buy the tickets
      console.log("Buying tickets:", ticketCount);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "buyRandomTickets",
        args: [BigInt(ticketCount)],
      });

      // 7. Execute the ticket purchase
      const hash = await walletClient.writeContract(request);
      console.log("Purchase transaction hash:", hash);

      // 8. Wait for purchase to be confirmed (optional)
      // await publicClient.waitForTransactionReceipt({ hash });

      // 9. Return success response
      return {
        success: true,
        hash,
        ticketCount,
        totalCost: formatUnits(totalCost, 18), // Changed from 6 to 18 decimals
      };
    } catch (error) {
      console.error("Error buying random tickets:", error);
      throw error;
    }
  },

  async buyCustomTicket(numbers: number[]) {
    try {
      if (numbers.length !== 6) {
        throw new Error("Must provide exactly 6 numbers");
      }

      for (const num of numbers) {
        if (num < 0 || num > 9) {
          throw new Error("Numbers must be between 0-9");
        }
      }

      const { walletClient, address } = await getWalletClient();

      // Get ticket price
      const ticketPriceRaw = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ticketPrice",
      })) as bigint;

      // // Check allowance first for cUSD
      // const paymentTokenAddress = await publicClient.readContract({
      //   address: CONTRACT_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: "paymentToken",
      // });

      // Check if user has granted sufficient allowance to the contract
      const allowance = (await publicClient.readContract({
        address: CONTRACT_ERC20,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, CONTRACT_ADDRESS],
      })) as bigint;

      if (allowance < ticketPriceRaw) {
        // User needs to approve the contract first
        const { request: approveRequest } = await publicClient.simulateContract(
          {
            account: address,
            address: CONTRACT_ERC20,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACT_ADDRESS, ticketPriceRaw],
          }
        );

        // Execute the approval transaction
        const approvalHash = await walletClient.writeContract(approveRequest);
        console.log("Approval transaction hash:", approvalHash);

        // Wait for approval to be mined
        await publicClient.waitForTransactionReceipt({ hash: approvalHash });
      }

      // Convert to correct format for Solidity uint8[6]
      const numbersArray = numbers.map((num) => Number(num));

      // Simulate the transaction first to check for errors
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "buyCustomTicket",
        args: [numbersArray],
      });

      // If simulation succeeds, send the transaction
      const hash = await walletClient.writeContract(request);

      // Return transaction details
      return {
        success: true,
        hash,
        numbers: numbersArray,
        cost: formatUnits(ticketPriceRaw, 18), // Changed from 6 to 18 decimals
      };
    } catch (error) {
      console.error("Error buying custom ticket:", error);
      throw error;
    }
  },
};
