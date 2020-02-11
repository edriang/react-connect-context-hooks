import mainReducer, { initialState } from './mainReducer';
import mainActions from './mainActions';

import createContextProvider, { connectContextFactory, useConnectedContextFactory } from 'react-connect-context-hooks';

const [MainProvider, MainContext] = createContextProvider(mainReducer, initialState, mainActions);

const withMain = connectContextFactory(MainContext);
const useMain = useConnectedContextFactory(MainContext);

export default MainProvider;
export {
    withMain,
    useMain,
    MainContext,
};
