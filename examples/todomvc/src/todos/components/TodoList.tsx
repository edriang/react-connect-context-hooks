import React from 'react';
import { mergedConnectContextFactory } from 'react-connect-context-hooks';

import TodoItem from './TodoItem';
import { TodosContext } from '../provider';
import { MainContext } from '../../main/provider';
import { VISIBILITY_FILTERS } from '../../main/constants';

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
  stateMappers: ['todos', 'visibilityFilter'],
  actionMappers: ['editTodo', 'deleteTodo', 'completeTodo'],
  afterMerge(mergedProps: any) {
    const { todos, visibilityFilter } = mergedProps;

    if (visibilityFilter === VISIBILITY_FILTERS.SHOW_ALL) {
      return { todos };
    }
    if (visibilityFilter === VISIBILITY_FILTERS.SHOW_ACTIVE) {
      return { todos: todos.filter((todo: Todo) => !todo.completed) };
    }
    return { todos: todos.filter((todo: Todo) => todo.completed) };
  }
});

export {
  TodoList,
}
