import { Box, TextField, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useCallback, useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import LoadingButton from '@mui/lab/LoadingButton';
import { useStakeContract } from '../../hooks/useContract';

const Home = () => {
  // 返回合约实例以及账户信息以及链信息
  const stakeContract = useStakeContract();
  const [amount, setAmount] = useState('0');
  const { address, isConnected } = useAccount();
  const { data } = useWalletClient();

  useEffect(() => {
    if (address && stakeContract) {
      const res = await stakeContract?.read.stakingBalance([])
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
          <Box>1 ETH</Box>
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
            <LoadingButton variant="contained">Stake</LoadingButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
