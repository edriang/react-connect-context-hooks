const API_URL = 'http://5e3243cbb92d240014ea512c.mockapi.io/api/v1/';

const fetchTodos = async () => {
    const response = await fetch(`${API_URL}/todos`);

    return response.json();
}

export {
    fetchTodos,
}
