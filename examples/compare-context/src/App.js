import React from 'react';
import logo from './logo.svg';
import './App.css';

import ContextProvider from './context';
import RowWithContext from './components/RowWithContext';

import StoreProvider from './store';
import RowWithStore from './components/RowWithStore';

import { NUM_ROWS } from './constants';

function simulateClicks(tableClassName) {
  const buttons = document.querySelectorAll(`.table.${tableClassName} .btn`);
  const startTime = Date.now();

  clickNextButton(buttons, 0, startTime);
}

function clickNextButton(buttons, index, startTime) {
  if (index === buttons.length) {
    alert(`Render finished: ${Date.now() - startTime}ms`);
    return;
  }
  buttons[index].click();

  window.requestAnimationFrame(() => {
    clickNextButton(buttons, index + 1, startTime);
  });
}

function App() {
  const [numOfRows, setNumOfRows] = React.useState(NUM_ROWS);

  return (
    <div className="App">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"></link>
      <div className="pb-5">
        <h1>Performance comparison</h1>
        <p>Enter the number of rows you want to render</p>

        <div>
          <input type="number" className="form-control input-number" value={numOfRows} onChange={setNumOfRows} />
        </div>

        <p>On the left side, each value is read directly from Context. On the right side, values are read from react-connect-context-hooks store.</p>
        <p>When you click one of the buttons an update in the Context is triggered. That forces every child depending on that Context to re-render.</p>
        <p>Using react-connect-context-hooks prevents re-rendering the components that are not listening to an especific Context value.</p>
        <p>The "Simulate Click All" button will "click" on every button below. In the left column, you'll notice that every click forces a re-render on every component.</p>
      </div>
      <div className="row">
        <div className="col col-6">
          <h2>
            With Context
            <button className="btn btn-success btn-sm float-right" onClick={() => simulateClicks('context')}>Simulate Click All</button>
          </h2>
          <ContextProvider>
            <table className="table context">
              <tbody>
                  {(new Array(numOfRows).fill(0).map((_, index) => (
                    <RowWithContext key={`row-${index}`} name={`Row ${index + 1}A`} index={index} />
                  )))}
              </tbody>
            </table>
          </ContextProvider>
        </div>
        <div className="col col-6">
          <h2>
            With RCCH
            <button className="btn btn-success btn-sm float-right" onClick={() => simulateClicks('store')}>Simulate Click All</button>
          </h2>
          <StoreProvider>
            <table className="table store">
                <tbody>
                  {(new Array(numOfRows).fill(0).map((_, index) => (
                    <RowWithStore key={`row-${index}`} name={`Row ${index + 1}B`} index={index} />
                  )))}
                </tbody>
            </table>
          </StoreProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
