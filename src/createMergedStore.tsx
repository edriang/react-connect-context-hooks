import React from "react";

import { mergedConnectContextFactory, useMergedConnectedContextFactory } from './connectContext';
import { getProviderContext } from './createContextProvider';

import { CustomProvider, ConnectContextFactory, KeyValue, ConnectContextOptions } from "./typings";

const DefaultChild = ({ children }: any) => children;

function createMergedStore(providers: CustomProvider[]): [CustomProvider, ConnectContextFactory, Function] {
    const contexts = providers.map(Provider => getProviderContext(Provider));
    const withStore = mergedConnectContextFactory(contexts);
    const useStore = useMergedConnectedContextFactory(contexts);

    const MergedStore = (props: KeyValue) => {
        // TODO: this needs to be connected or can just read the merged values from the context similar to createContextProvider onInit
        const Child = props.onInit ?  getConnectedChild(withStore, props.onInit) : DefaultChild;

        let wrapper: any = <Child {...props} />;

        providers.forEach((Provider) => {
            const previousWrapper = wrapper;

            wrapper = <Provider>{ previousWrapper }</Provider>
        });

        return React.useMemo(() => wrapper, providers);
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
