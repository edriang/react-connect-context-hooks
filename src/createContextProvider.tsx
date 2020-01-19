import React from 'react';

import {
    KeyValue,
    ActionCreators,
    CreateContextProviderReturn,
} from './typings';

  
function createContextProvider(reducer: React.Reducer<any, any>, initialState: KeyValue, actionCreators: ActionCreators): CreateContextProviderReturn {
    const Context = React.createContext({});

    return [
        (props: KeyValue) => {
            const [state, dispatch] = React.useReducer(reducer, initialState);
            const actions = getBindedActions(actionCreators, dispatch);

            const value = {
                state,
                actions,
            };

            return (
                <Context.Provider value={value} {...props}></Context.Provider>
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
