import { Box, TextField, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import LoadingButton from '@mui/lab/LoadingButton';
import { useStakeContract } from '../../hooks/useContract';
import { Pid } from '../../util';
import { formatUnits, parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { toast } from 'react-toastify';

const Home = () => {
  // 返回合约实例以及账户信息以及链信息
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const { data } = useWalletClient();

  // 状态声明
  const [amount, setAmount] = useState<string>('0');
  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);

  // 将代币存入合约获得token
  const handleStake = async () => {
    if (!stakeContract || !data) return;

    try {
      setLoading(true);
      const tx = await stakeContract.write.depositETH([], {
        value: parseUnits(amount, 18),
      });
      // 获取交易回执
      const res = await waitForTransactionReceipt(data, { hash: tx });
      console.log(res, 'tx');
      toast.success('Transaction receipt !');
      setLoading(false);
      // 将合约中刚存入的余额进行更新
      getStakedAmount();
    } catch (error) {
      setLoading(false);
      console.log(error, 'stake-error');
    }
  };

  const getStakedAmount = useCallback(async () => {
    if (address && stakeContract) {
      const res = await stakeContract?.read.stakingBalance([Pid, address]);
      // 将wei为单位转为eth
      setStakedAmount(formatUnits(res as bigint, 18));
    }
  }, [stakeContract, address]);

  useEffect(() => {
    if (address && stakeContract) {
      getStakedAmount();
    }
  }, [stakeContract, address]);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      width={'100%'}
    >
      <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>
        Rcc Stake
      </Typography>
      <Typography sx={{}}>Stake ETH to earn tokens.</Typography>
      <Box
        sx={{
          border: '1px solid #eee',
          borderRadius: '12px',
          p: '20px',
          width: '600px',
          mt: '30px',
        }}
      >
        <Box display={'flex'} alignItems={'center'} gap={'5px'} mb="10px">
          <Box>Staked Amount: </Box>
          <Box>{stakedAmount} ETH</Box>
        </Box>
        <TextField
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          sx={{ minWidth: '300px' }}
          label="Amount"
        />
        <Box mt="30px">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <LoadingButton
              variant="contained"
              loading={loading}
              onClick={handleStake}
            >
              Stake
            </LoadingButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
