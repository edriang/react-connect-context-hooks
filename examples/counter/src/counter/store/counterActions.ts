const ACTIONS = {
    INCREMENT: Symbol('INCREMENT'),
    DECREMENT: Symbol('DECREMENT'),
};

const incrementAction = (dispatch: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.INCREMENT,
        payload: { amount },
    });
}

const decrementAction = (dispatch: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.DECREMENT,
        payload: { amount },
    });
}

export {
    ACTIONS,
    incrementAction,
    decrementAction,
};
