import { useMemo } from 'react';
import { Abi, Address } from 'viem';
import { useChainId, useWalletClient } from 'wagmi';
import { getContract } from '../util/contractHelper';
import { StakeContractAddress } from '../util/env';
import { stakeAbi } from '../assets/abis/stake';

type UseContractOptions = {
  chainId?: number;
};

/**
 * 返回合约实例
 * 由于又封装了一层，还返回了account和chain名称，也就是账户和区块名称（sepolia）
 */

export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const currentChainId = useChainId();
  const chainId = options?.chainId || currentChainId;
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null;
    let address: Address | undefined;
    // 证明不是map
    if (typeof addressOrAddressMap === 'string') {
      address = addressOrAddressMap;
    } else {
      address = addressOrAddressMap[chainId];
    }

    // 如果没有对应的地址 直接返回null
    if (!address) return null;
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      });
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [addressOrAddressMap, abi, chainId, walletClient]);
}

export const useStakeContract = () => {
  return useContract(StakeContractAddress, stakeAbi as Abi);
};
