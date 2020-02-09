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
            const actions = getBindedActions(actionCreators, dispatch, state);

            const contextValue = {
                state: Object.freeze(state),
                actions: Object.freeze(actions),
            };

            if (onInit) {
                React.useMemo(() => {
                    onInit(contextValue);
                }, [onInit]);
            }

            return (
                <Context.Provider value={contextValue} {...props}></Context.Provider>
            );
        },
        Context,
    ]
    
}

function getBindedActions(actions: ActionCreators, dispatch: React.Dispatch<any>, state: KeyValue): {[key: string]: Function} {
    const bindedActions = {};

    Object.entries(actions).forEach(([key, value]) => {
        bindedActions[key] = value(dispatch, state);
    });

    return bindedActions;
}

export default createContextProvider;
