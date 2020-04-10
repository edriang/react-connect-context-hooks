import React from 'react';

import { getProviderContext } from './createContextProvider';
import { KeyValue } from './typings';

function withMockProvider(Provider: any, Component: React.ReactNode) {
    const Context: React.Context<any> = getProviderContext(Provider);

    return ({ state = {}, actions = {} }: { state: KeyValue, actions: KeyValue }) => (
        <Context.Provider value={{ state, actions }}>
            {Component}
        </Context.Provider>
    );
}

export {
    withMockProvider,
};
