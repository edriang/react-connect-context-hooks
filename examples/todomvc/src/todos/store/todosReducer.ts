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
  const { todo } = payload;

  switch (type) {
    case ACTIONS.UPDATE_ALL_TODOS:
      return { todos: payload.todos };

    case ACTIONS.UPDATE_TODO:
        return { todos: todos.map(current => current.id === todo.id ? { ...todo } : current ) };

    case ACTIONS.ADD_TODO:
      return { todos: [todo].concat(todos) };

    case ACTIONS.DELETE_TODO:
      return { todos: todos.filter(current => current.id !== todo.id) };

    default:
      return state;
  }
}

export default reducer;

export {
  initialState,
};
