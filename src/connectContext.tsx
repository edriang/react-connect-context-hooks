import React from 'react';

import selectValues from './selectValues';

import {
    ConnectContextOptions,
    ConenctContextFactory,
    KeyValue,
    ComputedSelectors,
} from './typings';

  
function connectContext<T = any>(Context: React.Context<T>, Component: React.ComponentType, options: ConnectContextOptions = {}): React.FunctionComponent {
    return React.memo((props?: KeyValue) => {
        const [selectedState, selectedActions] = getContextSelection(Context, options, props);
        const mergedProps = getMergedProps({ ...selectedState, ...selectedActions }, props, options.computedSelectors);

        return React.useMemo(() => (
            <Component {...mergedProps} />
        ), Object.values(selectedState));
    });
};

function connectContextFactory<T = any>(Context: React.Context<T>): ConenctContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => (
        connectContext(Context, Component, options)
    );
};

function useConnectedContextFactory<T = any>(Context: React.Context<T>) {
    return (options: ConnectContextOptions = {}): KeyValue => {
        const [selectedState, selectedActions] = getContextSelection(Context, options);
        const mergedProps = getMergedProps({ ...selectedState, ...selectedActions }, {}, options.computedSelectors);

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

function mergedConnectContextFactory(contexts: React.Context<any>[]): ConenctContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => {
        return React.memo((props?: KeyValue) => {
            const mergedState = {};
            const mergedActions = {};

            contexts.forEach((Context) => {
                const context: any = React.useContext(Context);

                Object.assign(mergedState, context.state);
                Object.assign(mergedActions, context.actions);
            });

            const selection = {
                ...selectValues(options.stateSelectors, mergedState, props),
                ...selectValues(options.actionSelectors, mergedActions, props),
            }

            const mergedProps = getMergedProps(selection, props, options.computedSelectors);

            // DEPRECATED
            if (options.afterMerge) {
                const afterMergeProps = Object.assign({}, mergedProps, options.afterMerge(mergedProps) || {});

                return <Component {...afterMergeProps} />;
            }
            
            return <Component {...mergedProps} />;
        });
    };
};

function getMergedProps(selection: KeyValue, props?: KeyValue, computedSelectors: ComputedSelectors = {}) {
    const mergedProps = {...selection, ...props};

    Object.entries(computedSelectors).forEach(([key, value]) => {
        const [fn, deps] = value;
        const depValues = deps.map(dep => mergedProps[dep])
            .filter(depValue => typeof(depValue) !== 'function');

        mergedProps[key] = React.useMemo(() => fn(...depValues), depValues);
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

export default connectContext;
export {
    connectContextFactory,
    useConnectedContextFactory,
    mergedConnectContextFactory,
};
