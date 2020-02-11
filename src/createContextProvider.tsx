import React from 'react';

import {
    KeyValue,
    ActionCreators,
    CreateContextProviderReturn,
    CustomProvider,
} from './typings';
import selectValues from './selectValues';
import { getMergedProps } from './connectContext';

const providerContextMap = new Map<CustomProvider, React.Context<any>>();

function createContextProvider(reducer: React.Reducer<any, any>, initialState: KeyValue, actionCreators: ActionCreators): CreateContextProviderReturn {
    const Context = React.createContext({});
    const Provider = ({ onInit, ...props }: KeyValue) => {
        const [state, dispatch] = React.useReducer(reducer, initialState);
        const actions = getBindedActions(actionCreators, dispatch, state);

        const contextValue = {
            state: Object.freeze(state),
            actions: Object.freeze(actions),
        };

        if (onInit) {
            const [options, onInitFn] = onInit;

            const selectedState = selectValues(options.stateSelectors, state, props);
            const selectedActions = selectValues(options.actionSelectors, actions, props);
            const mergedProps = getMergedProps(selectedState, selectedActions, {}, options.computedSelectors);

            React.useMemo(() => {
                onInitFn(mergedProps);
            }, []);
        }

        return (
            <Context.Provider value={contextValue} {...props}></Context.Provider>
        );
    };
    providerContextMap.set(Provider, Context);

    return [Provider, Context];
    
}

function getBindedActions(actions: ActionCreators, dispatch: React.Dispatch<any>, state: KeyValue): {[key: string]: Function} {
    const bindedActions = {};

    Object.entries(actions).forEach(([key, value]) => {
        bindedActions[key] = value(dispatch, state);
    });

    return bindedActions;
}

function getProviderContext(Provider: CustomProvider): React.Context<any> {
    const Context = providerContextMap.get(Provider);

    if (!Context) {
        throw `Context not found for Provider ${Provider}`;
    }
    return Context;
}

export default createContextProvider;
export {
    getProviderContext,
};
