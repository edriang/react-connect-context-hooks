import React from 'react';

import selectValues from './selectValues';

import {
    ConnectContextOptions,
    ConnectContextFactory,
    KeyValue,
    ComputedSelectors,
} from './typings';

  
function connectContext<T = any>(Context: React.Context<T>, Component: React.ComponentType, options: ConnectContextOptions = {}): React.FunctionComponent {
    return React.memo((props?: KeyValue) => {
        const [selectedState, selectedActions] = getContextSelection(Context, options, props);
        const mergedProps = getMergedProps(selectedState, selectedActions, props, options.computedSelectors);

        return React.useMemo(() => (
            <Component {...mergedProps} />
        ), memoizableValues(selectedState));
    });
};

function connectContextFactory<T = any>(Context: React.Context<T>): ConnectContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => (
        connectContext(Context, Component, options)
    );
};

function useConnectedContextFactory<T = any>(Context: React.Context<T>) {
    return (options: ConnectContextOptions = {}): KeyValue => {
        const [selectedState, selectedActions] = getContextSelection(Context, options);
        const mergedProps = getMergedProps(selectedState, selectedActions, {}, options.computedSelectors);

        return mergedProps;
    }
}

function getContextSelection<T = any>(Context: React.Context<T>, options: ConnectContextOptions = {}, props: KeyValue = {}): [KeyValue, KeyValue] {
    const context: any = React.useContext(Context);
    const { stateSelectors, actionSelectors } = normalizedContextOptions(options);

    const selectedState = selectValues(stateSelectors, context.state, props);
    const selectedActions = selectValues(actionSelectors, context.actions, props);

    return [selectedState, selectedActions];
}

function mergedConnectContextFactory(contexts: React.Context<any>[]): ConnectContextFactory {
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

function useMergedConnectedContextFactory(contexts: React.Context<any>[]) {
    return (options: ConnectContextOptions = {}): KeyValue => {
        return getMergedPropsFromContexts(contexts, options);
    };
}

function getMergedPropsFromContexts(contexts: React.Context<any>[], options: ConnectContextOptions, props: KeyValue = {}) {
    const mergedState = {};
    const mergedActions = {};

    contexts.forEach((Context) => {
        const context: any = React.useContext(Context);

        Object.assign(mergedState, context.state);
        Object.assign(mergedActions, context.actions);
    });

    const selectedState = selectValues(options.stateSelectors, mergedState, props);
    const selectedActions = selectValues(options.actionSelectors, mergedActions, props);

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
    const normalized: KeyValue = {};

    // DEPRECATED
    if (options.stateMappers) {
        normalized.stateSelectors = options.stateMappers;
    }
    if (options.actionMappers) {
        normalized.actionSelectors = options.actionMappers;
    }

    return Object.assign({}, options, normalized);
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
};
