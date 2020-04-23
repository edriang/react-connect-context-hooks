const ACTIONS = {
    INCREMENT: Symbol('INCREMENT'),
    DECREMENT: Symbol('DECREMENT'),
    SET_AMOUNT: Symbol('SET_AMOUNT'),
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

const setAmountAction = (dispatch: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.SET_AMOUNT,
        payload: { amount },
    });
}

const actions = {
    increment: incrementAction,
    decrement: decrementAction,
    setAmount: setAmountAction,
};

export default actions;

export {
    ACTIONS,
};
