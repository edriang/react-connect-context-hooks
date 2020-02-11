import { createMergedStore } from 'react-connect-context-hooks';

import MainProvider from './main/store';
import TodosProvider from './todos/store';

const [StoreProvider, withStore, useStore] = createMergedStore([MainProvider, TodosProvider]);

export default StoreProvider;
export {
    withStore,
    useStore,
};
