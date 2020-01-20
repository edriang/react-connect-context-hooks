import React from 'react';

import FilterLink from './FilterLink';
import { VISIBILITY_FILTERS } from '../constants';

const FILTER_TITLES: {[key: string]: string} = {
  [VISIBILITY_FILTERS.SHOW_ALL]: 'All',
  [VISIBILITY_FILTERS.SHOW_ACTIVE]: 'Active',
  [VISIBILITY_FILTERS.SHOW_COMPLETED]: 'Completed'
}

type FooterProps = {
  completedCount: number;
  activeCount: number;
  onClearCompleted: () => void;
}

const Footer: React.FC<FooterProps> = ({ activeCount, completedCount, onClearCompleted }) => {
  const itemWord = activeCount === 1 ? 'item' : 'items';
  
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className="filters">
        {Object.keys(FILTER_TITLES).map(filter =>
          <li key={filter}>
            <FilterLink filter={filter}>
              {FILTER_TITLES[filter]}
            </FilterLink>
          </li>
        )}
      </ul>
      {
        !!completedCount &&
        <button
          className="clear-completed"
          onClick={onClearCompleted}
        >Clear completed</button>
        
      }
    </footer>
  )
}

export default Footer;

export {
  Footer,
};
