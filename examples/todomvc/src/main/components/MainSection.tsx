import React from 'react';

import Footer from './Footer';

import { withTodos } from '../../todos/provider';
import { TodosState } from '../../todos/provider/todosReducer';
import TodoList from '../../todos/components/TodoList';

type MainSectionProps = {
  todosCount: number;
  completedCount: number;
  completeAllTodos: () => void;
  clearCompleted: () => void;
}

const MainSection: React.FC<MainSectionProps> = ({ todosCount, completedCount, completeAllTodos, clearCompleted }) => (
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
        <label onClick={completeAllTodos}/>
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

export default withTodos(MainSection, {
  stateMappers: {
    todosCount: ({ todos }: TodosState) => todos.length,
    completedCount: ({ todos }: TodosState) => todos.filter(todo => todo.completed).length,
  },
  actionMappers: ['completeAllTodos', 'clearCompleted'],
});

export {
  MainSection,
};
