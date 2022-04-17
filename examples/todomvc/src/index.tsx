import React from 'react';
import { createRoot } from 'react-dom/client';

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
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StoreProvider onInit={[selection, onInit]}>
    <App />
  </StoreProvider>
)
