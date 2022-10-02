import React from 'react';
import { Header } from './features/components/Header';
import { Router } from './features/components/Router';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <Header />
          <Router />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
