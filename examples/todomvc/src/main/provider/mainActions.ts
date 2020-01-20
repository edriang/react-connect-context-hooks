const ACTIONS = {
    SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER',
};

const setVisibilityFilter = (dispatch: any) => (visibilityFilter: string) => {
    dispatch({
        type: ACTIONS.SET_VISIBILITY_FILTER,
        payload: { visibilityFilter },
    })
}

const actions = {
    setVisibilityFilter,
};

export default actions;
export {
    ACTIONS,
};
