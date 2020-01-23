import { VISIBILITY_FILTERS } from '../../main/constants';

import { Todo } from '../../../typings';

function totalTodos(todos: any){
    return todos.length;
}

function hiddenItemsCount(todos: any[], totalTodos: number) {
    return totalTodos - todos.length;
}

export default function filterVisibleTodos(todos: Todo[], visibilityFilter: string) {
    console.log('filterVisibleTodos');
    if (visibilityFilter === VISIBILITY_FILTERS.SHOW_ACTIVE) {
        return todos.filter((todo: Todo) => !todo.completed);
    }
    if (visibilityFilter === VISIBILITY_FILTERS.SHOW_COMPLETED) {
        return todos.filter((todo: Todo) => todo.completed);
    }
    return todos;
}

export {
    totalTodos,
    hiddenItemsCount,
}
