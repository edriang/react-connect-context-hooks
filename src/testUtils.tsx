import React from 'react';
import { Context } from 'use-context-selector';

import { getProviderContext } from './createContextProvider';
import { KeyValue } from './typings';

function createMockProvider(Provider: any, Component: React.ReactNode) {
    const Context: Context<any> = getProviderContext(Provider);

    return ({ state = {}, actions = {} }: { state: KeyValue, actions: KeyValue }) => (
        <Context.Provider value={{ state, actions }}>
            {Component}
        </Context.Provider>
    );
}

export {
    createMockProvider,
};
