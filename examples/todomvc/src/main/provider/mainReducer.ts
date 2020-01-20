import { ACTIONS } from './mainActions';
import { VISIBILITY_FILTERS } from '../constants';

export type MainState = {
  visibilityFilter: string;
}

const initialState: MainState = {
  visibilityFilter: VISIBILITY_FILTERS.SHOW_ALL,
};

function reducer(state: MainState, { type, payload = {} }: any): MainState {
  const { visibilityFilter } = payload;

  switch (type) {
    case ACTIONS.SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter };

    default:
      return state;
  }
}

export default reducer;

export {
  initialState,
};
