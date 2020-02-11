import React from 'react';
import './App.css';

import CounterProvider from './counter/store';
import Counter from './counter/Counter';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <CounterProvider>
          <Counter />
        </CounterProvider>
      </header>
    </div>
  );
}

export default App;
