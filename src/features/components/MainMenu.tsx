import React, { FC, memo } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import { MainMenuProps } from '../../type/typesInterface';

export const MainMenu: FC<MainMenuProps> = memo((props) => {
  const { open, setOpen } = props;
  return (
    <>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ backgroundColor: 'primary.light' }}
          role="presentation"
          onClick={() => setOpen(false)}
          className={styles.list}
        >
          <List>
            {['HOME', 'ADD', 'SEARCH'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  {text === 'HOME' && (
                    <Link to="/" className={styles.list__name}>
                      <ListItemText primary={text} />
                    </Link>
                  )}
                  {text !== 'HOME' && (
                    <Link
                      to={`${text.toLowerCase()}`}
                      className={styles.list__name}
                    >
                      <ListItemText primary={text} />
                    </Link>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
});
