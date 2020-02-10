import React from 'react';

import Header from './Header';
import MainSection from './MainSection';
import Switch from './Switch';

import { withMain } from '../provider';

import { THEME } from '../constants';


type AppProps = {
  theme: string;
  switchTheme: Function;
}

const App: React.FC<AppProps> = ({ theme, switchTheme }) => {
  const checked = theme === THEME.LIGHT;

  const handleChange = () => {
    switchTheme();
  }

  return (
    <div>
      <div className="theme-switcher">
        <Switch onChange={handleChange} checked={checked} />
      </div>
      <div className="todoapp" >
        <Header />
        <MainSection />
      </div>
    </div>
  )
}

export default withMain(App, {
  stateSelectors: ['theme'],
  actionSelectors: ['switchTheme'],
});

export {
  App,
};
