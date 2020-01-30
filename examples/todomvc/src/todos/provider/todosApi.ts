import axios from 'axios';

import { Todo, NewTodo } from "../../../typings";

// TODO: move to constants or .env
const API_URL = 'https://5e3243cbb92d240014ea512c.mockapi.io/api/v1/';

const fetchTodos = async () => {
    const response = await axios.get(`${API_URL}/todos?page=1&limit=10&sortBy=createdAt&order=desc`);

    return response.data;
}

const toggleComplete = async (todo: Todo) => {
    todo.completed = !todo.completed;

    return updateTodo(todo);
}

const updateTodo = async (todo: Todo) => {
    return await axios.put(`${API_URL}/todos/${todo.id}`, todo);
}

const addTodo = async (todo: NewTodo) => {
    const response = await axios.post(`${API_URL}/todos`, todo);
    
    return response.data;
}

const deleteTodo = async (todo: Todo) => {
    const response = await axios.delete(`${API_URL}/todos/${todo.id}`);
    
    return response.data;
}


const todosApi = {
    fetchTodos,
    toggleComplete,
    updateTodo,
    addTodo,
    deleteTodo,
}

export default todosApi;
