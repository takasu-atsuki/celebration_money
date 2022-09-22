import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { Home } from './features/components/Home';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;
