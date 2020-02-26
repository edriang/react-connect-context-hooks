import React from 'react';

import selectValues from './selectValues';
import parseSelectors from './ignore-parsed-options';

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

        return React.useMemo(() => (
            <Component {...mergedProps} />
        ), memoizableValues(mergedProps));
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
    const context: any = React.useContext(Context);
    const { stateSelectors, actionSelectors } = React.useMemo(() => normalizedContextOptions(options), [options]);

    const selectedState = selectValues(stateSelectors, context.state, props);
    const selectedActions = selectValues(actionSelectors, context.actions, props);

    return [selectedState, selectedActions];
}

function mergedConnectContextFactory(contexts: ContextCollection): ConnectContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => {
        return React.memo((props?: KeyValue) => {
            const mergedProps = getMergedPropsFromContexts(contexts, options, props);

            // DEPRECATED
            if (options.afterMerge) {
                const afterMergeProps = Object.assign({}, mergedProps, options.afterMerge(mergedProps) || {});

                return <Component {...afterMergeProps} />;
            }

            return React.useMemo(() => (
                <Component {...mergedProps} />
            ), memoizableValues(mergedProps));
        });
    };
};

function useMergedConnectedContextFactory(contexts: ContextCollection) {
    return (options: ConnectContextOptions = {}): KeyValue => {
        return getMergedPropsFromContexts(contexts, options);
    };
}

function getMergedPropsFromContexts(contexts: ContextCollection, options: ConnectContextOptions, props: KeyValue = {}) {
    const mergedState = {};
    const mergedActions = {};

    if (contexts instanceof Array) {
        // DEPRECATE: just use Object notation
        contexts.forEach((Context) => {
            const context: any = React.useContext(Context);
    
            Object.assign(mergedState, context.state);
            Object.assign(mergedActions, context.actions);
        });
    } else {
        Object.keys(contexts).forEach((key: string) => {
            const context: any = React.useContext(contexts[key]);
    
            mergedState[key] = context.state;
            mergedActions[key] = context.actions;
        });
    }
    

    const selectedState = selectValues(options.stateSelectors, mergedState, props);
    const selectedActions = selectValues(options.actionSelectors, mergedActions, props);
    // TODO: rename getMergedProps to something related with computedSelectors, and create a new getMergedProps that all these 3 steps
    const mergedProps = getMergedProps(selectedState, selectedActions, props, options.computedSelectors);

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
};
