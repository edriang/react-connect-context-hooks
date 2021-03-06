import React from 'react';

import TodoTextInput from '../../todos/components/TodoTextInput';
import { withTodos } from '../../todos/store';

import { addTodo } from '../../../typings';

type HeaderProps = {
  addTodo: addTodo;
}

const Header: React.FC<HeaderProps> = ({ addTodo }) => (
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={(text: string) => {
        if (text.length !== 0) {
          addTodo(text)
        }
      }}
      placeholder="What needs to be done?"
    />
  </header>
);

export default withTodos(Header, {
  actionSelectors: ['addTodo'],
});

export {
  Header,
};
