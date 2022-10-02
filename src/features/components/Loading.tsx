import React, { FC, memo } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const Loading: FC = memo(() => {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#303030',
          display: 'block',
          textAlign: 'center',
        }}
      >
        <CircularProgress
          // className={styles.modal__circle}
          sx={{
            position: 'absolute',
            top: '50%',
            display: 'block',
            left: '46%',
          }}
        />
      </Box>
    </>
  );
});
