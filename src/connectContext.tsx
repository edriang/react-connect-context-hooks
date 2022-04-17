import React from 'react';
import { useContextSelector } from 'use-context-selector';

import parseSelectors, { executeParsedSelectors as selectValues } from './parseSelectors';

import {
    ConnectContextOptions,
    ConnectContextFactory,
    KeyValue,
    ComputedSelectors,
    ContextCollection,
} from './typings';

  
function connectContext<T = any>(Context: React.Context<T>, Component: React.ComponentType, options: ConnectContextOptions = {}): React.FunctionComponent {
    return React.memo((props?: KeyValue) => {
        const [selectedState, selectedActions] = getContextSelection(Context, options, props);
        const mergedProps = getMergedProps(selectedState, selectedActions, props, options.computedSelectors);

        return <Component {...mergedProps} />
    });
};

function connectContextFactory<T = any>(Context: React.Context<T>): ConnectContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => {
        const parsedOptions = normalizedContextOptions(options);
        parsedOptions.stateSelectors = parseSelectors(parsedOptions.stateSelectors);
        parsedOptions.actionSelectors = parseSelectors(parsedOptions.actionSelectors);

        return connectContext(Context, Component, parsedOptions);
    };
};

function useConnectedContextFactory<T = any>(Context: React.Context<T>) {
    return (options: ConnectContextOptions = {}): KeyValue => {
        const parsedOptions = React.useMemo(() => {
            const parsedOptions = normalizedContextOptions(options);
            parsedOptions.stateSelectors = parseSelectors(parsedOptions.stateSelectors);
            parsedOptions.actionSelectors = parseSelectors(parsedOptions.actionSelectors);

            return parsedOptions;
        }, [options]);

        const [selectedState, selectedActions] = getContextSelection(Context, parsedOptions);
        const mergedProps = getMergedProps(selectedState, selectedActions, {}, parsedOptions.computedSelectors);

        return mergedProps;
    }
}

function getContextSelection<T = any>(Context: React.Context<T>, options: ConnectContextOptions = {}, props: KeyValue = {}): [KeyValue, KeyValue] {
    const { stateSelectors, actionSelectors } = React.useMemo(() => normalizedContextOptions(options), [options]);

    const selectedState = useContextSelector(Context, (store: any) => selectValues(stateSelectors, store.state, props));
    const selectedActions = useContextSelector(Context, (store: any) => selectValues(actionSelectors, store.actions, props));

    return [selectedState, selectedActions];
    /*
    return useContextSelector(Context, (store: any) => {
        const selectedState = selectValues(stateSelectors, store.state, props);
        const selectedActions = selectValues(actionSelectors, store.actions, props);
console.log([selectedState, selectedActions])
        return [selectedState, selectedActions];
    });
    */
}

function mergedConnectContextFactory(contexts: ContextCollection): ConnectContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => {
        const parsedOptions = normalizedContextOptions(options);
        parsedOptions.stateSelectors = parseSelectors(parsedOptions.stateSelectors);
        parsedOptions.actionSelectors = parseSelectors(parsedOptions.actionSelectors);

        return React.memo((props?: KeyValue) => {
            const mergedProps = getMergedPropsFromContexts(contexts, parsedOptions, props);

            // DEPRECATED
            if (parsedOptions.afterMerge) {
                const afterMergeProps = Object.assign({}, mergedProps, parsedOptions.afterMerge(mergedProps) || {});

                return <Component {...afterMergeProps} />;
            }

            return (
                <Component {...mergedProps} />
            );
        });
    };
};

function useMergedConnectedContextFactory(contexts: ContextCollection) {
    return (options: ConnectContextOptions = {}): KeyValue => {
        const parsedOptions = React.useMemo(() => {
            const parsedOptions = normalizedContextOptions(options);
            parsedOptions.stateSelectors = parseSelectors(parsedOptions.stateSelectors);
            parsedOptions.actionSelectors = parseSelectors(parsedOptions.actionSelectors);

            return parsedOptions;
        }, [options]);

        return getMergedPropsFromContexts(contexts, parsedOptions);
    };
}

function getMergedPropsFromContexts(contexts: ContextCollection, options: ConnectContextOptions, props: KeyValue = {}) {
    const mergedContext = Object.keys(contexts).reduce((mergedContext: any, key: string) => {
        /*
        const [selectedState, selectedActions] = useContextSelector(contexts[key], (store: any) => {
            const selectedState = selectValues(options.stateSelectors, { [key]: store.state }, props);
            const selectedActions = selectValues(options.actionSelectors, { [key]: store.actions }, props);
    
            return [selectedState, selectedActions];
        });
        */

        const selectedState = useContextSelector(contexts[key], (store: any) => {
            return selectValues(options.stateSelectors, { [key]: store.state }, props)
        });
        const selectedActions = useContextSelector(contexts[key], (store: any) => selectValues(options.actionSelectors, { [key]: store.actions }, props));

        Object.assign(mergedContext.selectedState, selectedState);
        Object.assign(mergedContext.selectedActions, selectedActions);

        return mergedContext;
    }, { selectedState: {}, selectedActions: {} });

    // TODO: rename getMergedProps to something related with computedSelectors, and create a new getMergedProps that all these 3 steps
    const mergedProps = getMergedProps(mergedContext.selectedState, mergedContext.selectedActions, props, options.computedSelectors);

    return mergedProps
}

function getMergedProps(selectedState: KeyValue, selectedActions: KeyValue, props?: KeyValue, computedSelectors: ComputedSelectors = {}) {
    const mergedProps = {...selectedState, ...selectedActions, ...props};

    Object.entries(computedSelectors).forEach(([key, value]) => {
        const [fn, deps] = value;
        const depValues = deps.map(dep => mergedProps[dep]);
        const memoValues = memoizableValues(depValues);

        mergedProps[key] = React.useMemo(() => fn(...depValues), memoValues);
    });

    return mergedProps;
}

function normalizedContextOptions(options: ConnectContextOptions): ConnectContextOptions {
    const normalized: KeyValue = { ...options };

    // DEPRECATED
    if (options.stateMappers) {
        normalized.stateSelectors = options.stateMappers;
    }
    if (options.actionMappers) {
        normalized.actionSelectors = options.actionMappers;
    }

    return normalized;
}

function memoizableValues(value: any[] | Object): any[] {
    if (value instanceof Array) {
        return value.filter(value => typeof(value) !== 'function');
    }
    return Object.values(value).filter(value => typeof(value) !== 'function');
}

export default connectContext;
export {
    connectContextFactory,
    useConnectedContextFactory,
    mergedConnectContextFactory,
    useMergedConnectedContextFactory,
    getMergedProps,
    getMergedPropsFromContexts,
    normalizedContextOptions,
};
