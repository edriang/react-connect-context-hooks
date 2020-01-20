import todosReducer, { initialState } from './todosReducer';
import todosActions from './todosActions';

import createContextProvider, { connectContextFactory, useConnectedContextFactory } from 'react-connect-context-hooks';

const [TodosProvider, TodosContext] = createContextProvider(todosReducer, initialState, todosActions);

const withTodos = connectContextFactory(TodosContext);
const useTodos = useConnectedContextFactory(TodosContext);

export default TodosProvider;
export {
    withTodos,
    useTodos,
    TodosContext,
};
