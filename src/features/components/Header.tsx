import React, { FC, useState, memo } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './header.module.css';
import { MainMenu } from './MainMenu';

export const Header: FC = memo(() => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <MainMenu open={open} setOpen={setOpen} />
      <Box sx={{ flexGrow: 1, marginBottom: '30px' }}>
        <AppBar position="static">
          <Toolbar className={styles.menu}>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: 'left',
              }}
              className={styles.title}
            >
              CELEBRATION GIFT
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
});
