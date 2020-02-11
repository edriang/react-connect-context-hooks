const ACTIONS = {
    SET_VISIBILITY_FILTER: Symbol('SET_VISIBILITY_FILTER'),
    SWITCH_THEME: Symbol('SWITCH_THEME'),
};

const setVisibilityFilter = (dispatch: any) => (visibilityFilter: string) => {
    dispatch({
        type: ACTIONS.SET_VISIBILITY_FILTER,
        payload: { visibilityFilter },
    })
}

const switchTheme = (dispatch: any) => () => {
    dispatch({
        type: ACTIONS.SWITCH_THEME,
    })
}

const actions = {
    setVisibilityFilter,
    switchTheme,
};

export default actions;
export {
    ACTIONS,
};
