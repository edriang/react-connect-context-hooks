import React from 'react';
import './App.css';

import CounterProvider from './counter/store';
import Counter from './counter/Counter';
import CounterControls from './counter/CounterControls';
import Amount from './counter/Amount';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <CounterProvider>
          <div>
            <h1>Counter App</h1>
            <Counter>
              <>
                <Amount>
                  <hr />
                  <CounterControls />
                </Amount>
              </>
            </Counter>
          </div>
        </CounterProvider>
      </header>
    </div>
  );
}

export default App;
