import React from "react";

import { mergedConnectContextFactory, useMergedConnectedContextFactory } from './connectContext';
import { getProviderContext } from './createContextProvider';

import { CustomProvider, ConnectContextFactory, KeyValue, ConnectContextOptions, ProviderCollection, ContextCollection } from "./typings";

const DefaultChild = ({ children }: any) => children;

// DEPRECATE: just use Object notation
function getContextsFromProviderCollection(providers: ProviderCollection): ContextCollection {
    if (providers instanceof Array) {
        return providers.map(Provider => getProviderContext(Provider));
    }
    return Object.keys(providers).reduce((contexts, key) => {
        contexts[key] = getProviderContext(providers[key]);

        return contexts;
    }, {});
}

function createMergedStore(providers: ProviderCollection): [CustomProvider, ConnectContextFactory, Function] {
    const contexts = getContextsFromProviderCollection(providers);
    const withStore = mergedConnectContextFactory(contexts);
    const useStore = useMergedConnectedContextFactory(contexts);

    const MergedStore = (props: KeyValue) => {
        // TODO: this needs to be connected or can just read the merged values from the context similar to createContextProvider onInit
        const Child = props.onInit ?  getConnectedChild(withStore, props.onInit) : DefaultChild;

        let wrapper: any = <Child {...props} />;

        Object.values(providers).forEach((Provider) => {
            const previousWrapper = wrapper;

            wrapper = <Provider>{ previousWrapper }</Provider>
        });

        return React.useMemo(() => wrapper, []);
    }

    return [
        MergedStore,
        withStore,
        useStore,
    ];
}

function getConnectedChild(withStore: ConnectContextFactory, onInit: [ConnectContextOptions, Function]) {
    const [options, onInitFn] = onInit;

    return withStore(({ children, ...selectionResult }: KeyValue) => {
        React.useMemo(() => {
            onInitFn(selectionResult);
        }, []);

        return children
    }, options);
}

export default createMergedStore;
