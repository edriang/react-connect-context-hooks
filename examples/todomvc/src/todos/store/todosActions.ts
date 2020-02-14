import todosApi from './todosApi';

import { Todo, NewTodo } from '../../../typings';
import { TodosState } from './todosReducer';

const ACTIONS = {
    UPDATE_ALL_TODOS: Symbol('UPDATE_ALL_TODOS'),
    UPDATE_TODO: Symbol('UPDATE_TODO'),
    ADD_TODO: Symbol('ADD_TODO'),
    DELETE_TODO: Symbol('DELETE_TODO'),
};

const fetchTodos = (dispatch: any) => async () => {
    const todos = await todosApi.fetchTodos();
    
    dispatch({
        type: ACTIONS.UPDATE_ALL_TODOS,
        payload: { todos },
    });
}

const addTodo = (dispatch: any) => async (text: string) => {
    const todo: NewTodo = {
        text,
        completed: false,
        createdAt: Date.now(),
    }

    const newTodo = await todosApi.addTodo(todo);
    
    dispatch({
        type: ACTIONS.ADD_TODO,
        payload: { todo: newTodo },
    });
}

const editTodo = (dispatch: any) => async (todo: Todo, text: string) => {
    todo.text = text;

    const updatedTodo = await todosApi.updateTodo(todo);

    dispatch({
        type: ACTIONS.UPDATE_TODO,
        payload: { todo: updatedTodo },
    })
}

const deleteTodo = (dispatch: any) => async (todo: Todo) => {
    const deletedTodo = await todosApi.deleteTodo(todo);

    dispatch({
        type: ACTIONS.DELETE_TODO,
        payload: { todo: deletedTodo },
    })
}

const completeTodo = (dispatch: any) => async (todo: Todo) => {
    const updatedTodo = await todosApi.toggleComplete(todo);

    dispatch({
        type: ACTIONS.UPDATE_TODO,
        payload: { todo: updatedTodo },
    })
}

const completeAllTodos = (dispatch: any, getState: Function) => async (completed: boolean) => {
    const { todos } = getState();
    const todosToUpdate = todos.filter((todo: Todo) => todo.completed !== completed);

    const promises = todosToUpdate.map((todo: Todo) => (
        todosApi.updateTodo({ ...todo, completed })
    ));

    await Promise.all(promises);

    const updatedTodos = todos.map((todo: Todo) => {
        todo.completed = completed;
        return todo;
    });

    dispatch({
        type: ACTIONS.UPDATE_ALL_TODOS,
        payload: { todos: updatedTodos }
    });
}

const clearCompleted = (dispatch: any, getState: Function) => async () => {
    const { todos } = getState();
    const todosToRemove = todos.filter((todo: Todo) => todo.completed === true);

    const promises = todosToRemove.map((todo: Todo) => (
        todosApi.deleteTodo(todo)
    ));

    await Promise.all(promises);

    const updatedTodos = todos.filter((todo: Todo) => !todo.completed);

    dispatch({
        type: ACTIONS.UPDATE_ALL_TODOS,
        payload: { todos: updatedTodos }
    });
}

const actions = {
    fetchTodos,
    addTodo,
    editTodo,
    deleteTodo,
    completeTodo,
    completeAllTodos,
    clearCompleted,
};

export default actions;
export {
    ACTIONS,
};
