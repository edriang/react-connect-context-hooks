import React from 'react';
import classnames from 'classnames';

type TodoTextInputProps = {
  onSave: (text: string) => void;
  text?: string;
  placeholder?: string;
  editing?: boolean;
  newTodo?: boolean;
}

const TodoTextInput: React.FC<TodoTextInputProps> = ({ onSave, text, placeholder, editing, newTodo }) => {
  const [currentText, setCurrentText] = React.useState(text || '');

  const handleSubmit = (event: any) => {
    if (event.which !== 13) {
      return;
    }
    const text = event.target.value.trim();

    onSave(text);

    if (newTodo) {
      setCurrentText('');
    }
  }

  const handleChange = (event: any) => {
    setCurrentText(event.target.value);
  }

  const handleBlur = (event: any) => {
    if (newTodo) {
      return;
    }
    onSave(event.target.value);
  }

  return (
    <input className={
      classnames({
        edit: editing,
        'new-todo': newTodo,
      })}
      type="text"
      placeholder={placeholder}
      autoFocus={true}
      value={currentText}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleSubmit} />
  )
}

export default TodoTextInput;
export {
  TodoTextInput,
};
