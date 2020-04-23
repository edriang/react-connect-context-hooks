import createContextProvider, { connectContextFactory, useConnectedContextFactory } from 'react-connect-context-hooks';

import counterReducer, { initialState } from './counterReducer';
import actions from './counterActions';

const [CounterProvider, CounterContext] = createContextProvider(counterReducer, initialState, actions);

const withCounter = connectContextFactory(CounterContext);
const useCounter = useConnectedContextFactory(CounterContext);

export default CounterProvider;
export {
    withCounter,
    useCounter,
};
