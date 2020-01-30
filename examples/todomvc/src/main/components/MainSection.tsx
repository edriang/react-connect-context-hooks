import React from 'react';

import Footer from './Footer';

import { withTodos } from '../../todos/provider';
import { TodosState } from '../../todos/provider/todosReducer';
import TodoList from '../../todos/components/TodoList';

type MainSectionProps = {
  todosCount: number;
  completedCount: number;
  completeAllTodos: (completed: boolean) => void;
  clearCompleted: () => void;
}

const MainSection: React.FC<MainSectionProps> = ({ todosCount, completedCount, completeAllTodos, clearCompleted }) => {
  
  const onClick = () => {
    completeAllTodos(completedCount === todosCount ? false : true);
  }

  return (
    <section className="main">
      {
        !!todosCount && 
        <span>
          <input
            className="toggle-all"
            type="checkbox"
            checked={completedCount === todosCount}
            readOnly
          />
          <label onClick={onClick}/>
        </span>
      }
      <TodoList />
      {
        !!todosCount &&
        <Footer
          completedCount={completedCount}
          activeCount={todosCount - completedCount}
          onClearCompleted={clearCompleted}
        />
      }
    </section>
  )
}

export default withTodos(MainSection, {
  stateSelectors: {
    todosCount: ({ todos }: TodosState) => todos.length,
    completedCount: ({ todos }: TodosState) => todos.filter(todo => todo.completed).length,
  },
  actionSelectors: ['completeAllTodos', 'clearCompleted'],
});

export {
  MainSection,
};
