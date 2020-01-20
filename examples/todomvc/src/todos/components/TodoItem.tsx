import React from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';

import { Todo } from '../../../typings';

type TodoItemProps = {
  todo: Todo;
  editTodo: (todo: Todo, text: string) => void;
  deleteTodo: (todo: Todo) => void;
  completeTodo: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editTodo, deleteTodo, completeTodo }) => {
  const [editing, setEditing] = React.useState(false);

  const handleSave = (text: string) => {
    if (text.length === 0) {
      deleteTodo(todo);
    } else {
      editTodo(todo, text);
    }
    setEditing(false);
  }

  const handleDoubleClick = () => {
    setEditing(true);
  }

  return (
    <li className={classnames({
      completed: todo.completed,
      editing: editing
    })}>
      {editing ? (
        <TodoTextInput
          text={todo.text}
          editing={editing}
          onSave={(text: string) => handleSave(text)}
        />
      ) : (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(todo)}
          />
          <label onDoubleClick={handleDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={() => deleteTodo(todo)} />
        </div>
      )}
    </li>
  )
}

export default TodoItem;
export {
  TodoItem,
};
