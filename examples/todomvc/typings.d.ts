export type Todo = {
    id: number;
    completed: boolean;
    text: string;
};

export type addTodo = (text: string) => void;
