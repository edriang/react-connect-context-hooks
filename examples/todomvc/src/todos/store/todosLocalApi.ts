import { Todo, NewTodo } from "../../../typings";

const TODOS = [
    { id: 1, completed: false, text: 'Create first demo project', createdAt: 1582728561575 },
    { id: 2, completed: false, text: 'Rate the library on github', createdAt: 1582728561575 },
    { id: 3, completed: true, text: 'Learn Reducers', createdAt: 1582728561575 },
    { id: 4, completed: true, text: 'Learn Action Creators', createdAt: 1582728561575 },
    { id: 5, completed: true, text: 'Learn Context', createdAt: 1582728561575 },
    { id: 6, completed: true, text: 'Learn React', createdAt: 1582728561575 },
];

let TODOS_IDX = TODOS.length;

const getTodosList = () => TODOS;

const fetchTodos = () => {
    return TODOS;
}

const toggleComplete = async (todo: Todo) => {
    const updatedTodo = {
        ...todo,
        completed: !todo.completed,
    };

    return updateTodo(updatedTodo);
}

const updateTodo = async (todo: Todo) => {
    // TODO: call remote service for updating TODO

    return todo;
}

const addTodo = async (todo: NewTodo) => {
    // TODO: call remote service for adding TODO

    const newTodo: Todo = {
        id: TODOS_IDX += 1,
        ...todo,
    }

    return newTodo;
}

const deleteTodo = async (todo: Todo) => {
    // TODO: call remote service for deleting TODO

    return todo;
}


const todosApi = {
    getTodosList,
    fetchTodos,
    toggleComplete,
    updateTodo,
    addTodo,
    deleteTodo,
}

export default todosApi;
