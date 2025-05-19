//lib/viem.ts
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { megaEth } from "../src/components/Chains"; // Assuming your MegaETH chain config is here

export const publicClient = createPublicClient({
  chain: megaEth,
  transport: http(
    process.env.NEXT_PUBLIC_RPC_URL || "https://carrot.megaeth.com/rpc"
  ),
});

export async function getWalletClient() {
  if (!window.ethereum) throw new Error("No ethereum provider found");

  const walletClient = createWalletClient({
    chain: megaEth,
    transport: custom(window.ethereum),
  });

  const [address] = await walletClient.getAddresses();

  return { walletClient, address };
}
