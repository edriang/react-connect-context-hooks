import React from 'react';
import { mergedConnectContextFactory } from 'react-connect-context-hooks';

import TodoItem from './TodoItem';
import { TodosContext } from '../provider';
import { MainContext } from '../../main/provider';
import filterVisibleTodos from '../utils/filterVisibleTodos';

import { Todo } from '../../../typings';

type TodoListProps = {
  todos: Todo[];
  editTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
  completeTodo: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, editTodo, deleteTodo, completeTodo }) => (
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
  </ul>
);

const withMainAndTodos = mergedConnectContextFactory([MainContext, TodosContext]);

export default withMainAndTodos(TodoList, {
  stateSelectors: ['todos', 'visibilityFilter'],
  actionSelectors: ['editTodo', 'deleteTodo', 'completeTodo'],
  afterMerge: ({ todos, visibilityFilter }: any) => {
    const filteredTodos = filterVisibleTodos(todos, visibilityFilter);

    return { todos: filteredTodos };
  }
});

export {
  TodoList,
}
