import React from 'react';
import { render } from 'react-dom';

import App from './main/components/App';

import MainProvider from './main/provider';
import TodosProvider from './todos/provider';

import 'todomvc-app-css/index.css';

render(
  <MainProvider>
    <TodosProvider>
      <App />
    </TodosProvider>
  </MainProvider>,
  document.getElementById('root')
)
