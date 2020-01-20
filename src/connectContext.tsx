import React from 'react';

import selectValues from './selectValues';

import {
    ConnectContextOptions,
    ConenctContextFactory,
    KeyValue,
    AfterMergeCallback,
} from './typings';

  
function connectContext<T = any>(Context: React.Context<T>, Component: React.ComponentType, options: ConnectContextOptions = {}): React.FunctionComponent {
    return React.memo((props?: KeyValue) => {
        const selection = getContextSelection(Context, options, props);

        return <Component {...selection} {...props} />;
    });
};

function connectContextFactory<T = any>(Context: React.Context<T>): ConenctContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => (
        connectContext(Context, Component, options)
    );
};

function useConnectedContextFactory<T = any>(Context: React.Context<T>) {
    return (options: ConnectContextOptions = {}) => {
        return getContextSelection(Context, options);
    }
}

function getContextSelection<T = any>(Context: React.Context<T>, { stateMappers, actionMappers }: ConnectContextOptions = {}, props: KeyValue = {}): KeyValue {
    const context: any = React.useContext(Context);;

    const state = selectValues(stateMappers, context.state, props);
    const actions = selectValues(actionMappers, context.actions, props);

    return { ...state, ...actions };
}

function mergedConnectContextFactory(contexts: React.Context<any>[]): ConenctContextFactory {
    return (Component: React.ComponentType, options: ConnectContextOptions = {}) => {
        return React.memo((props?: KeyValue) => {
            const selection = {};

            contexts.forEach((Context) => {
                assignDefined(selection, getContextSelection(Context, options, props));
            });

            const mergedProps = {...selection, ...props};

            if (options.afterMerge) {
                const afterMergeProps = Object.assign({}, mergedProps, options.afterMerge(mergedProps) || {});

                return <Component {...afterMergeProps} />;
            }
            return <Component {...selection} {...props} />;
        });
    };
};

function assignDefined(target: KeyValue, source: KeyValue) {
    Object.keys(source).map((key) => {
        if(source[key] !== undefined) {
            target[key] = source[key];
        }
    });

    return target;
}

export default connectContext;
export {
    connectContextFactory,
    useConnectedContextFactory,
    mergedConnectContextFactory,
};
