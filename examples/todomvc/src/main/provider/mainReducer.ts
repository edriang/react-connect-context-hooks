import { ACTIONS } from './mainActions';
import { VISIBILITY_FILTERS, THEME, DEFAULT_THEME } from '../constants';

export type MainState = {
  visibilityFilter: string;
  theme: string;
}

const initialState: MainState = {
  visibilityFilter: VISIBILITY_FILTERS.SHOW_ALL,
  theme: DEFAULT_THEME,
};

document.body.classList.add(initialState.theme);

function reducer(state: MainState, { type, payload = {} }: any): MainState {
  const { visibilityFilter } = payload;

  switch (type) {
    case ACTIONS.SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter };

    case ACTIONS.SWITCH_THEME:
      const newTheme = state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      document.body.classList.replace(state.theme, newTheme);

      return { ...state, theme: newTheme };

    default:
      return state;
  }
}

export default reducer;

export {
  initialState,
};
