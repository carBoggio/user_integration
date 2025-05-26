import { parseUnits, formatUnits, getContract } from "viem";
import { publicClient, getWalletClient } from "../viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../lottery";
import { ERC20_ABI, CONTRACT_ERC20 } from "../erc20";

interface TicketInfo {
  ticketId: number;
  numbers: number[];
}
type LogData = unknown;

interface LogStyles {
  title: string;
  success: string;
  info: string;
  warning: string;
  error: string;
  data: string;
}

interface LogService {
  title: (message: string) => void;
  info: (message: string, data?: LogData) => void;
  success: (message: string, data?: LogData) => void;
  warning: (message: string, data?: LogData) => void;
  error: (message: string, error?: Error | LogData) => void;
  contractData: <T>(funcName: string, data: T) => T;
}

// Configuración de logging
const LOG_PREFIX = "🎮 LOTTERY SERVICE";
const LOG_STYLES: LogStyles = {
  title: "background: #6b46c1; color: white; padding: 2px 4px; border-radius: 4px;",
  success: "color: #22c55e; font-weight: bold;",
  info: "color: #3b82f6; font-weight: bold;",
  warning: "color: #f59e0b; font-weight: bold;",
  error: "color: #ef4444; font-weight: bold;",
  data: "color: #8b5cf6; font-style: italic;",
};

// Función de logging mejorada
const logService: LogService = {
  title: (message: string): void => console.log(`%c ${LOG_PREFIX} %c ${message}`, LOG_STYLES.title, ""),
  info: (message: string, data: LogData = null): void => {
    console.log(`%c INFO %c ${message}`, LOG_STYLES.info, "", data || "");
    if (data && typeof data === "object") console.dir(data);
  },
  success: (message: string, data: LogData = null): void => {
    console.log(`%c SUCCESS %c ${message}`, LOG_STYLES.success, "", data || "");
    if (data && typeof data === "object") console.dir(data);
  },
  warning: (message: string, data: LogData = null): void => {
    console.log(`%c WARNING %c ${message}`, LOG_STYLES.warning, "", data || "");
    if (data && typeof data === "object") console.dir(data);
  },
  error: (message: string, error: Error | LogData = null): void => {
    console.log(`%c ERROR %c ${message}`, LOG_STYLES.error, "", error || "");
    if (error && error instanceof Error) console.error(error);
    else if (error) console.dir(error);
  },
  contractData: <T>(funcName: string, data: T): T => {
    console.log(`%c CONTRACT DATA [${funcName}] %c`, LOG_STYLES.data, "");
    console.dir(data);
    return data; // Para permitir encadenamiento
  }
};

export const lotteryService = {
  // Read functions
  async getLotteryState() {
    logService.title("Obteniendo estado de la lotería");
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "currentState",
      });
      
      const stateMap = {
        0: "CERRADO",
        1: "ABIERTO"
      };
      
      logService.success("Estado obtenido correctamente", {
        rawValue: result,
        state: stateMap[Number(result)] || "DESCONOCIDO"
      });
      
      return logService.contractData("currentState", result);
    } catch (error) {
      logService.error("Error al obtener el estado de la lotería", error);
      throw error;
    }
  },

  async getCurrentLotteryId() {
    logService.title("Obteniendo ID de la lotería actual");
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "currentLotteryId",
      });
      
      logService.success("ID de lotería obtenido", { lotteryId: result.toString() });
      return logService.contractData("currentLotteryId", result);
    } catch (error) {
      logService.error("Error al obtener el ID de la lotería", error);
      throw error;
    }
  },

  async getCurrentDrawTime() {
    logService.title("Obteniendo tiempo del próximo sorteo");
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "currentDrawTime",
      });
      
      // Convertir timestamp a fecha
      const drawDate = new Date(Number(result) * 1000);
      
      logService.success("Tiempo de sorteo obtenido", {
        rawTimestamp: result.toString(),
        date: drawDate.toLocaleString(),
        timeLeft: this.formatTimeLeft(Number(result))
      });
      
      return logService.contractData("currentDrawTime", result);
    } catch (error) {
      logService.error("Error al obtener el tiempo del sorteo", error);
      throw error;
    }
  },
  
  // Función auxiliar para formatear el tiempo restante
  formatTimeLeft(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    
    if (diff <= 0) return "El sorteo ha finalizado";
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  },

  async getTicketPrice() {
    logService.title("Obteniendo precio del ticket");
    try {
      const result = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ticketPrice",
      })) as bigint;
      
      const formattedPrice = formatUnits(result, 18);
      
      logService.success("Precio del ticket obtenido", {
        raw: result.toString(),
        formatted: formattedPrice,
        decimals: 18
      });
      
      return {
        raw: result,
        formatted: formattedPrice,
      };
    } catch (error) {
      logService.error("Error al obtener el precio del ticket", error);
      throw error;
    }
  },

  async getUserTickets() {
    logService.title("Obteniendo tickets del usuario");
    try {
      const { address } = await getWalletClient();
      logService.info(`Dirección del usuario: ${address}`);
      
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getUserTickets",
        args: [address],
      });
      
      // Formatear tickets para mejor visualización
      const formattedTickets: TicketInfo[] = Array.isArray(result) ? result.map((ticket, index) => {
        return {
          ticketId: index,
          numbers: Array.isArray(ticket) ? ticket.map(num => Number(num)) : [],
        };
      }) : [];
      
      logService.success(`Se encontraron ${formattedTickets.length} tickets`, formattedTickets);
      
      return logService.contractData("getUserTickets", result);
    } catch (error) {
      logService.error("Error al obtener los tickets del usuario", error);
      throw error;
    }
  },

  async getWinningNumbers() {
    logService.title("Obteniendo números ganadores");
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getWinningNumbers",
      });
      
      const formattedNumbers = Array.isArray(result) 
        ? result.map(num => Number(num))
        : [];
      
      logService.success("Números ganadores obtenidos", formattedNumbers);
      
      return logService.contractData("getWinningNumbers", result);
    } catch (error) {
      logService.error("Error al obtener los números ganadores", error);
      throw error;
    }
  },

  async getTotalPrizes() {
    logService.title("Obteniendo premios totales");
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getTotalPrizes",
      });
      
      // Formatear los premios para mejor visualización
      const formattedPrizes = formatUnits(result, 18);
      
      logService.success("Premios totales obtenidos", {
        raw: result.toString(),
        formatted: formattedPrizes + " tokens",
        decimals: 18
      });
      
      return logService.contractData("getTotalPrizes", result);
    } catch (error) {
      logService.error("Error al obtener los premios totales", error);
      throw error;
    }
  },

  // Write functions
  async buyRandomTickets(ticketCount: number): Promise<{
    success: boolean;
    hash: `0x${string}`;
    ticketCount: number;
    totalCost: string;
    blockNumber: bigint;
  }> {
    logService.title(`Comprando ${ticketCount} tickets aleatorios`);
    try {
      const { walletClient, address } = await getWalletClient();
      logService.info(`Dirección del usuario: ${address}`);

      // 1. Get ticket price from contract
      logService.info("Obteniendo precio del ticket...");
      const ticketPrice = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ticketPrice",
      })) as bigint;
      
      logService.info(`Precio por ticket: ${formatUnits(ticketPrice, 18)} tokens`);

      // 2. Calculate total cost (ticketPrice × ticketCount)
      const totalCost = ticketPrice * BigInt(ticketCount);
      logService.info(`Costo total para ${ticketCount} tickets: ${formatUnits(totalCost, 18)} tokens`);

      // 3. Verificar la dirección del token de pago
      logService.info(`Dirección del token ERC20: ${CONTRACT_ERC20}`);

      // 4. Check current allowance
      logService.info(`Verificando allowance actual para ${CONTRACT_ADDRESS}...`);
      const allowance = (await publicClient.readContract({
        address: CONTRACT_ERC20,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, CONTRACT_ADDRESS],
      })) as bigint;

      logService.info(`Allowance actual: ${formatUnits(allowance, 18)} tokens`, {
        raw: allowance.toString(),
        required: totalCost.toString(),
        sufficient: allowance >= totalCost
      });

      // 5. Approve token spending if needed
      if (allowance < totalCost) {
        logService.warning(`Allowance insuficiente. Se requiere aprobación para ${formatUnits(totalCost, 18)} tokens`);

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
        
        logService.info("Simulación de aprobación exitosa, enviando transacción...");

        // Execute approval transaction
        const approvalHash = await walletClient.writeContract(approveRequest);
        logService.info(`Transacción de aprobación enviada: ${approvalHash}`);

        // Wait for approval transaction to be confirmed
        logService.info("Esperando confirmación de la transacción...");
        const approvalReceipt = await publicClient.waitForTransactionReceipt({
          hash: approvalHash,
        });
        
        logService.success(`¡Aprobación confirmada en el bloque ${approvalReceipt.blockNumber}!`, {
          txHash: approvalHash,
          blockNumber: approvalReceipt.blockNumber,
          gasUsed: approvalReceipt.gasUsed.toString()
        });
      } else {
        logService.success(`Allowance suficiente ya otorgado: ${formatUnits(allowance, 18)} tokens`);
      }

      // 6. Buy the tickets
      logService.info(`Preparando compra de ${ticketCount} tickets aleatorios...`);
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "buyRandomTickets",
        args: [BigInt(ticketCount)],
      });
      
      logService.info("Simulación exitosa, enviando transacción...");

      // 7. Execute the ticket purchase
      const hash = await walletClient.writeContract(request);
      logService.success(`¡Transacción de compra enviada!`, {
        txHash: hash,
        ticketCount,
        totalCost: formatUnits(totalCost, 18)
      });

      // 8. Wait for purchase to be confirmed
      logService.info("Esperando confirmación de la compra...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      logService.success(`¡Compra confirmada en el bloque ${receipt.blockNumber}!`, {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      // 9. Return success response
      return {
        success: true,
        hash,
        ticketCount,
        totalCost: formatUnits(totalCost, 18),
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logService.error("Error al comprar tickets aleatorios", error);
      throw error;
    }
  },

  async buyCustomTicket(numbers: number[]): Promise<{
    success: boolean;
    hash: `0x${string}`;
    numbers: number[];
    cost: string;
    blockNumber: bigint;
  }> {
    logService.title(`Comprando ticket personalizado: [${numbers.join(', ')}]`);
    try {
      if (numbers.length !== 6) {
        const errorMsg = "Debe proporcionar exactamente 6 números";
        logService.error(errorMsg);
        throw new Error(errorMsg);
      }

      for (const num of numbers) {
        if (num < 0 || num > 9) {
          const errorMsg = "Los números deben estar entre 0-9";
          logService.error(errorMsg);
          throw new Error(errorMsg);
        }
      }

      const { walletClient, address } = await getWalletClient();
      logService.info(`Dirección del usuario: ${address}`);

      // Get ticket price
      logService.info("Obteniendo precio del ticket...");
      const ticketPriceRaw = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ticketPrice",
      })) as bigint;
      
      logService.info(`Precio del ticket: ${formatUnits(ticketPriceRaw, 18)} tokens`);

      // Check allowance first for token
      logService.info("Verificando token de pago...");
      const paymentTokenAddress = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "paymentToken",
      });
      
      logService.info(`Token de pago: ${paymentTokenAddress}`);
      logService.info(`Token configurado: ${CONTRACT_ERC20}`);
      
      if (paymentTokenAddress !== CONTRACT_ERC20) {
        logService.warning("La dirección del token configurado no coincide con la del contrato", {
          configured: CONTRACT_ERC20,
          fromContract: paymentTokenAddress
        });
      }

      // Check if user has granted sufficient allowance to the contract
      logService.info("Verificando allowance...");
      const allowance = (await publicClient.readContract({
        address: CONTRACT_ERC20,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, CONTRACT_ADDRESS],
      })) as bigint;

      logService.info(`Allowance actual: ${formatUnits(allowance, 18)} tokens`, {
        raw: allowance.toString(),
        required: ticketPriceRaw.toString(),
        sufficient: allowance >= ticketPriceRaw
      });

      if (allowance < ticketPriceRaw) {
        // User needs to approve the contract first
        logService.warning("Allowance insuficiente. Solicitando aprobación...");
        
        const { request: approveRequest } = await publicClient.simulateContract(
          {
            account: address,
            address: CONTRACT_ERC20,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACT_ADDRESS, ticketPriceRaw],
          }
        );
        
        logService.info("Simulación de aprobación exitosa, enviando transacción...");

        // Execute the approval transaction
        const approvalHash = await walletClient.writeContract(approveRequest);
        logService.info(`Transacción de aprobación enviada: ${approvalHash}`);

        // Wait for approval to be mined
        logService.info("Esperando confirmación de la aprobación...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash: approvalHash });
        
        logService.success(`¡Aprobación confirmada en el bloque ${receipt.blockNumber}!`, {
          txHash: approvalHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        });
      } else {
        logService.success(`Allowance suficiente ya otorgado: ${formatUnits(allowance, 18)} tokens`);
      }

      // Convert to correct format for Solidity uint8[6]
      const numbersArray = numbers.map((num) => Number(num));
      logService.info(`Preparando compra de ticket con números: [${numbersArray.join(', ')}]`);

      // Simulate the transaction first to check for errors
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "buyCustomTicket",
        args: [numbersArray],
      });
      
      logService.info("Simulación exitosa, enviando transacción...");

      // If simulation succeeds, send the transaction
      const hash = await walletClient.writeContract(request);
      logService.success(`¡Transacción de compra enviada!`, {
        txHash: hash,
        numbers: numbersArray
      });
      
      // Wait for purchase to be confirmed
      logService.info("Esperando confirmación de la compra...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      logService.success(`¡Compra confirmada en el bloque ${receipt.blockNumber}!`, {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      // Return transaction details
      return {
        success: true,
        hash,
        numbers: numbersArray,
        cost: formatUnits(ticketPriceRaw, 18),
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logService.error("Error al comprar ticket personalizado", error);
      throw error;
    }
  },
};