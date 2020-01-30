import { fetchTodos } from './todosHelper';

import { Todo } from '../../../typings';

const ACTIONS = {
    GET_ALL_TODOS: 'GET_ALL_TODOS',
    ADD_TODO: 'ADD_TODO',
    EDIT_TODO: 'EDIT_TODO',
    DELETE_TODO: 'DELETE_TODO',
    COMPLETE_TODO: 'COMPLETE_TODO',
    COMPLETE_ALL_TODOS: 'COMPLETE_ALL_TODOS',
    CLEAR_COMPLETED: 'CLEAR_COMPLETED',
};

let TODO_MAX_ID = 0;

const getAllTodos = (dispatch: any) => async () => {
    const todos = await fetchTodos();
    
    dispatch({
        type: ACTIONS.GET_ALL_TODOS,
        payload: { todos },
    });
}

const addTodo = (dispatch: any) => (text: string) => {
    ++TODO_MAX_ID;

    const todo: Todo = {
        text,
        id: TODO_MAX_ID,
        completed: false,
    }
    
    dispatch({
        type: ACTIONS.ADD_TODO,
        payload: { todo },
    });
}

const editTodo = (dispatch: any) => (todo: Todo, text: string) => {
    dispatch({
        type: ACTIONS.EDIT_TODO,
        payload: { todo, text },
    })
}

const deleteTodo = (dispatch: any) => (todo: Todo) => {
    dispatch({
        type: ACTIONS.DELETE_TODO,
        payload: { todo },
    })
}

const completeTodo = (dispatch: any) => (todo: Todo) => {
    dispatch({
        type: ACTIONS.COMPLETE_TODO,
        payload: { todo },
    })
}

const completeAllTodos = (dispatch: any) => () => {
    dispatch({
        type: ACTIONS.COMPLETE_ALL_TODOS,
    })
}

const clearCompleted = (dispatch: any) => () => {
    dispatch({
        type: ACTIONS.CLEAR_COMPLETED,
    })
}

const actions = {
    getAllTodos,
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
