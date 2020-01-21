import { VISIBILITY_FILTERS } from '../../main/constants';

import { Todo } from '../../../typings';

export default function filterVisibleTodos(todos: Todo[], visibilityFilter: string) {
    if (visibilityFilter === VISIBILITY_FILTERS.SHOW_ACTIVE) {
        return todos.filter((todo: Todo) => !todo.completed);
    }
    if (visibilityFilter === VISIBILITY_FILTERS.SHOW_COMPLETED) {
        return todos.filter((todo: Todo) => todo.completed);
    }
    return todos;
}
