import { ACTIONS } from './counterActions';

type CounterState = {
    count: number;
    amount: number;
}

const initialState: CounterState = {
    count: 0,
    amount: 1,
};

function reducer(state: any, action: any) {
    const { amount } = action.payload;

    switch (action.type) {
        case ACTIONS.INCREMENT:
            return { ...state, count: state.count + amount };
        case ACTIONS.DECREMENT:
            return { ...state, count: state.count - amount };
        case ACTIONS.SET_AMOUNT:
            return { ...state, amount };
        default:
            return state;
    }
}

export default reducer;
export {
    initialState,
};
