import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#89c592',
      light: '#f7fff6',
    },
    secondary: {
      main: '#498bf0',
    },
  },
  typography: {
    fontFamily: ['"Delius", cursive', '"M PLUS 1p"'].join(','),
  },
});
