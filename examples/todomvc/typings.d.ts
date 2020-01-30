export type Todo = {
    id: number;
    completed: boolean;
    text: string;
    createdAt: number;
};

export type NewTodo = Omit<Todo, 'id'>;

export type addTodo = (text: string) => void;
