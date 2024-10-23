import { createPublicClient, http, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';

type ClientType = {
  [key: number]: PublicClient;
};
export const viemClients = (chaiId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient;
  } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http(),
    }),
  };
  return clients[chaiId];
};
