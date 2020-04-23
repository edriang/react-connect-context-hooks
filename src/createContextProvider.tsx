import React from 'react';
import { createContext, isEqualShallow } from 'use-context-selection';

import {
    KeyValue,
    ActionCreators,
    CreateContextProviderReturn,
    CustomProvider,
} from './typings';
import parseSelectors, { executeParsedSelectors as selectValues } from './parseSelectors';
import { getMergedProps, normalizedContextOptions } from './connectContext';

const providerContextMap = new Map<CustomProvider, React.Context<any>>();

function createContextProvider(reducer: React.Reducer<any, any>, initialState: KeyValue, actionCreators: ActionCreators): CreateContextProviderReturn;

function createContextProvider(initialState: KeyValue, actionCreators: ActionCreators): CreateContextProviderReturn

function createContextProvider(...args: any[]): CreateContextProviderReturn {
    const Context = createContext({}, customIsEqualShallow);
    const Provider = ({ onInit, ...props }: KeyValue) => {
        // TODO: add better typing
        const contextValue = React.useRef<any>({});
        let reducer: any, initialState: any, actionCreators: any;
        let state: any, actions: any, dispatch: any, setState: any;

        if (typeof args[0] === 'function') {
            [reducer, initialState, actionCreators] = args;
            [state, dispatch] = React.useReducer(reducer, initialState);
            
        } else {
            [initialState, actionCreators] = args;
            [state, setState] = React.useState(initialState);
            dispatch = React.useMemo(() => createStateSetterDispatch(setState, contextValue), [initialState]);
        }

        actions = React.useMemo(() => getBindedActions(actionCreators, dispatch, contextValue), [actionCreators]);

        contextValue.current.state = Object.freeze(state);
        contextValue.current.actions = Object.freeze(actions);

        if (onInit) {
            const [options, onInitFn] = onInit;

            React.useMemo(() => {
                const parsedOptions = normalizedContextOptions(options);
                parsedOptions.stateSelectors = parseSelectors(parsedOptions.stateSelectors);
                parsedOptions.actionSelectors = parseSelectors(parsedOptions.actionSelectors);
    
                const selectedState = selectValues(parsedOptions.stateSelectors, state, props);
                const selectedActions = selectValues(parsedOptions.actionSelectors, actions, props);
                const mergedProps = getMergedProps(selectedState, selectedActions, props, parsedOptions.computedSelectors);

                onInitFn(mergedProps);
            }, []);
        }

        return (
            <Context.Provider value={{...contextValue.current}} {...props}></Context.Provider>
        );
    };
    providerContextMap.set(Provider, Context);

    return [Provider, Context];
    
}

function getBindedActions(actions: ActionCreators, dispatch: React.Dispatch<any>, contextValue: any): {[key: string]: Function} {
    const bindedActions = {};
    const getState = () => contextValue.current.state;

    Object.entries(actions).forEach(([key, value]) => {
        bindedActions[key] = value(dispatch, getState);
    });

    return bindedActions;
}

function createStateSetterDispatch(dispatch: React.Dispatch<any>, contextValue: any): React.Dispatch<any> {
    return (params: any) => {
        const newState = { ...contextValue.current.state, ...params };

        dispatch(newState);
    }
}

function getProviderContext(Provider: CustomProvider): React.Context<any> {
    const Context = providerContextMap.get(Provider);

    if (!Context) {
        throw `Context not found for Provider ${Provider}`;
    }
    return Context;
}

const customIsEqualShallow = (stateA: KeyValue[], stateB: KeyValue[]) => {
    // [0] is state values, [1] ar action creators
    return isEqualShallow(stateA[0], stateB[0]);
}

export default createContextProvider;
export {
    getProviderContext,
};
