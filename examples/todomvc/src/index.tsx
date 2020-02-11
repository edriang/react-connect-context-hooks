import React from 'react';
import { render } from 'react-dom';

import App from './main/components/App';

import StoreProvider, { useStore } from './store';

import 'todomvc-app-css/index.css';
import './todoapp.scss';


const onInit = ({ fetchTodos }: any) => {
  fetchTodos();
}

const selection = {
  actionSelectors: ['fetchTodos'],
}

render(
  <StoreProvider onInit={[selection, onInit]}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)
