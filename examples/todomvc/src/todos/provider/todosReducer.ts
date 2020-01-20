import { ACTIONS } from './todosActions';

import { Todo } from '../../../typings';

export type TodosState = {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};

function reducer(state: TodosState, { type, payload = {} }: any): TodosState {
  const { todos } = state;
  const { todo, text } = payload;

  switch (type) {
    case ACTIONS.ADD_TODO:
      return { todos: todos.concat([todo]) };

    case ACTIONS.EDIT_TODO:
      return { todos: todos.map(current => current.id === todo.id ? { ...todo, text } : current ) };

    case ACTIONS.DELETE_TODO:
      return { todos: todos.filter(current => current.id !== todo.id) };
    
    case ACTIONS.COMPLETE_TODO:
      return { todos: todos.map(current => current.id === todo.id ? { ...todo, completed: !todo.completed } : current ) };

    case ACTIONS.COMPLETE_ALL_TODOS:
      const allMarked = todos.every(todo => todo.completed);

      return {
          todos: todos.map(todo => ({
              ...todo,
              completed: !allMarked,
          }))
      };

    case ACTIONS.CLEAR_COMPLETED:
      return { todos: todos.filter(todo => !todo.completed) };

    default:
      return state;
  }
}

export default reducer;

export {
  initialState,
};
