import { createMergedStore } from 'react-connect-context-hooks';

import MainProvider from './main/store';
import TodosProvider from './todos/store';

const [StoreProvider, withStore, useStore] = createMergedStore({
    main: MainProvider,
    todos: TodosProvider,
});

export default StoreProvider;
export {
    withStore,
    useStore,
};
