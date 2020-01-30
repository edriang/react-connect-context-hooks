import React from 'react';
import { render } from 'react-dom';

import App from './main/components/App';

import MainProvider from './main/provider';
import TodosProvider from './todos/provider';

import 'todomvc-app-css/index.css';
import './todoapp.scss';

render(
  <MainProvider>
    <TodosProvider onInit={({ actions }: any) => actions.fetchTodos() }>
      <App />
    </TodosProvider>
  </MainProvider>,
  document.getElementById('root')
)
