import React from 'react';
import Switch from "react-switch";

import Header from './Header';
import MainSection from './MainSection';

import { withMain } from '../provider';

type AppProps = {
  switchTheme: Function;
}

const App: React.FC<AppProps> = ({ switchTheme }) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
    switchTheme();
  }

  return (
    <div>
      <div className="theme-switcher">
        <Switch onChange={handleChange} checked={checked} onColor="#333" />
      </div>
      <div className="todoapp" >
        <Header />
        <MainSection />
      </div>
    </div>
  )
}

export default withMain(App, {
  actionSelectors: ['switchTheme'],
});

export {
  App,
};
