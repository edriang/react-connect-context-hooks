import React from 'react';

import {
    KeyValue,
    ActionCreators,
    CreateContextProviderReturn,
} from './typings';

  
function createContextProvider(reducer: React.Reducer<any, any>, initialState: KeyValue, actionCreators: ActionCreators): CreateContextProviderReturn {
    const Context = React.createContext({});

    return [
        ({ onInit, ...props }: KeyValue) => {
            const [state, dispatch] = React.useReducer(reducer, initialState);
            const actions = getBindedActions(actionCreators, dispatch);

            const contextValue = {
                state,
                actions,
            };

            if (onInit) {
                React.useMemo(() => {
                    onInit(contextValue);
                }, onInit);
            }

            return (
                <Context.Provider value={contextValue} {...props}></Context.Provider>
            );
        },
        Context,
    ]
    
}

function getBindedActions(actions: ActionCreators, dispatch: React.Dispatch<any>): {[key: string]: Function} {
    const bindedActions = {};

    Object.entries(actions).forEach(([key, value]) => {
        bindedActions[key] = value(dispatch);
    });

    return bindedActions;
}

export default createContextProvider;
