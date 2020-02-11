import React from 'react';
import { mergedConnectContextFactory } from 'react-connect-context-hooks';

import TodoItem from './TodoItem';
import { TodosContext } from '../store';
import { MainContext } from '../../main/store';
import filterVisibleTodos, { totalTodos, hiddenItemsCount } from '../utils/filterVisibleTodos';

import { Todo } from '../../../typings';

type TodoListProps = {
  todos: Todo[];
  editTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
  completeTodo: (todo: Todo) => void;
  hiddenItems: number;
}

const TodoList: React.FC<TodoListProps> = ({ todos, editTodo, deleteTodo, completeTodo, hiddenItems }) => (
  <ul className="todo-list">
    {todos.map(todo =>
      <TodoItem
        key={todo.id}
        todo={todo}
        editTodo={editTodo}
        deleteTodo={deleteTodo}
        completeTodo={completeTodo}
      />
    )}
    {hiddenItems > 0 ? (
      <div className="hidden-items">{hiddenItems} hidden item/s by filters...</div>
    ) : ''}
  </ul>
);

const withMainAndTodos = mergedConnectContextFactory([MainContext, TodosContext]);

export default withMainAndTodos(TodoList, {
  stateSelectors: ['todos', 'visibilityFilter'],
  actionSelectors: ['editTodo', 'deleteTodo', 'completeTodo'],
  computedSelectors: {
    // This example might not be practical, but done this way to illustrate that computed selectors can override
    // previous selected props and also these functions can access values returned by previous ones
    totalTodos: [totalTodos, ['todos']],
    todos: [filterVisibleTodos, ['todos', 'visibilityFilter']],
    hiddenItems: [hiddenItemsCount, ['todos', 'totalTodos']],
  }
});

export {
  TodoList,
}
