import React from 'react';
import { render } from 'react-dom';

import App from './main/components/App';

import StoreProvider from './store';

import 'todomvc-app-css/index.css';
import './todoapp.scss';


const onInit = ({ fetchTodos }: any) => {
  fetchTodos();
}

const selection = {
  actionSelectors: ['todos.fetchTodos'],
}

const AppShell = () => {
  const [count, setCount] = React.useState(0);

  const onClick = () => setCount(prevCount => {
    const newCount = prevCount + 1;

    console.log('new count', newCount);

    return newCount;
  });

  return (
    <StoreProvider onInit={[selection, onInit]}>
      <button onClick={onClick}>Count {count}</button>
      <App />
    </StoreProvider>
  )
}

render(
  <AppShell />,
  document.getElementById('root')
)
