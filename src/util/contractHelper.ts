import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  getContract as viemGetContract,
} from 'viem';
import { defaultChainId } from './wagmi';
import { viemClients } from './viem';
// 相当于在原生viem的getContract的基础上包裹了account和chain
export const getContract = <
  TAbi extends Abi | readonly unknown[],
  TWalletClient extends WalletClient,
>({
  abi,
  address,
  chainId = defaultChainId,
  signer,
}: {
  abi: TAbi | readonly unknown[];
  address: Address;
  chainId?: number;
  signer?: TWalletClient;
}) => {
  // 创建合约实例
  const contractInstance = viemGetContract({
    abi,
    address,
    client: {
      public: viemClients(chainId),
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>;

  return {
    ...contractInstance,
    account: signer?.account,
    chain: signer?.chain
  };
};
