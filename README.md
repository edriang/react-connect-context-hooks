# react-connect-context-hooks

<!-- TOC -->

- [react-connect-context-hooks](#react-connect-context-hooks)
    - [Install](#install)
    - [What?](#what)
    - [Why?](#why)
    - [How?](#how)
    - [Example](#example)
    - [Example Actions](#example-actions)
    - [Example Reducer](#example-reducer)
    - [Selections](#selections)
        - [Selections using Array](#selections-using-array)
        - [Selections using Object](#selections-using-object)
        - [Selections using Function](#selections-using-function)
    - [Advanced Usecases](#advanced-usecases)
        - [Combining Contexts](#combining-contexts)
    - [License](#license)

<!-- /TOC -->

## Install

```bash
npm install --save react-connect-context-hooks
```

## What?

`react-connect-context-hooks` allows you to implement your own state-management solution using React.hooks, while leverages good practices and provide DRY code.

 This library takes some ideas and patterns from `redux`, such as:
 - Defining different `reducers` per feature/module.
 - Defining `actionCreators` to dispatch actions (actions follows `redux-thunk` approach).
 - Providing a `connect` like functionality to allow your components be agnostic from the global state dependencies and receive only what they need.

 Also, provides some good practices around implementing state-management with hooks:
 - Allows hiding your `Context`; it provides custom `Provider` HOC you can use instead for wrapping your components.
 - Provides custom `useContext` hook that allows selecting what you need from the store (similar to the `connect` HOC).
 - Provides different `selection` or mapping mechanisms for easily getting what you need from the `store`.

## Why?

Since React hooks are available, a lot of discussion among the developer-community arises regarding if some complex/external tooling (such as `redux`) is needed to implement state management in your apps.

While is it possible to implement redux-like functionality just with `useReducer` + `useContext`, there are good recommendations and practices that is good to consider, specially if your application grows.

This library allows implementing good practices for your custom state-management solution using hooks, while allowing to avoid repeating boilerplate for every `Provider/Consumer` you need to create.

## How?

`createContextProvider` receives a reducer function, a initial-state object, and a key-value object with actions; it will return a `Provider` component that will be used to wrap your application wherever you need to provide access to context. It will return the `Context` object to you can use to create custom `connect` HOC or `useContext`.

## Example

Take a look at the following example:

```js
/// CounterProvider.tsx

import counterReducer, { initialState } from './counterReducer';
import { increment, decrement } from './counterActions';

import createContextProvider, { connectContextFactory, useConnectedContextFactory } from 'react-connect-context-hooks';

const actions = { increment, decrement };
const [CounterProvider, CounterContext] = createContextProvider(counterReducer, initialState, actions);

const withCounter = connectContextFactory(CounterContext);
const useCounter = useConnectedContextFactory(CounterContext);

export default CounterProvider;
export {
    withCounter,
    useCounter,
};
```

***Note:** Take a look at the `example` folder to check how to define the `actions` and `reducer`*

Here we created a `Provider` component and two helper functions:
- `withCounter` is a HOC for connecting your app components as consumers of this context (this is recommended for keeping components isolated from the store).
- `useCounter` can be used as a hook function to have access to the connected context (use this in cases where you can't use the HOC).

The `Provider` can be used to wrap your applications code:

```js
/// App.tsx

import React from 'react';

import CounterProvider from './counter/provider';
import Counter from './counter/Counter';

const App: React.FC = () => {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  );
}

export default App;
```

Finally, use the `connected` HOC in your components code as follows:

```js
/// CounterComponent.tsx

import React from 'react';

import { withCounter } from './provider/CounterProvider';

const Counter: React.FC<any> = ({ count, increment, decrement }) => (
  <div>
    <h1>Counter Component</h1>
    <p>
      <b>Count: </b>
      <span>{count}</span>
    </p>
    <button onClick={() => decrement(amount)}>Decrement</button>
    <button onClick={() => increment(amount)}>Increment</button>
  </div>
)

// Export isolated component is recommended for unit-testing
export {
  Counter,
}

// Export the connected component as default
export default withCounter(Counter as React.ComponentType<any>, {
  stateMappers: ['count'],
  actionMappers: ['increment', 'decrement'],
});

```

Here we are defining a basic `Counter` component that needs to receive 3 properties: count, increment and decrement.

We are selecting this values from the state and the actions that we have available in our Context.

The `withCounter` function is the one created before, and allows creating a HOC that is bound to the right `CounterContext`. 

This HOC function receives an object with options; in the example we are using these options to select data and actions from the store.

If you need to access the store from a hook, then you would use:

```js
/// useCountLogger.ts

export default () => {
    const { count } = useCounter({
      stateMappers: ['count'],
    });
  
    console.warn(`Count is: ${count}`);
}


```

As you can see, `useCounter` receives the same `options` object that the HOC, so you can pick what to select from the store.


## Example Actions

If you are familiar to `redux-thunk` then you will be familiar to actions here too.

Actions are functions that receives a single `dispatch` parameter and returns a new function which will use the `dispatch` function to trigger some action.

Note that the returned function can declare any number of arguments (even zero) and this is the function that will get selected when you use `actionMappers` option.

Example of actions:

```js
/// counterActions.ts

const ACTIONS = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
};

const increment = (dispatch: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.INCREMENT,
        payload: { amount },
    });
}

const decrement = (dispatch: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.DECREMENT,
        payload: { amount },
    });
}

export {
    ACTIONS,
    increment,
    decrement,
};
```

## Example Reducer

This is a regular reducer function; you can check documentation about `React.useReducer` to get more familiar with it.

Here is an example:

```js
/// counterReducer.ts

import { ACTIONS } from './counterActions';

type CounterState = {
    count: number;
}

const initialState: CounterState = {
    count: 0,
};

function reducer(state: any, action: any) {
    const { amount } = action.payload;

    switch (action.type) {
        case ACTIONS.INCREMENT:
            return { ...state, count: state.count + amount };
        case ACTIONS.DECREMENT:
            return { ...state, count: state.count - amount };
        default:
            return state;
    }
}

export default reducer;
export {
    initialState,
};
```

## Selections

Similar to how `redux` work, the idea of the connected HOC or hook is to get access only to the portion of the state that is relevant to it.

You can use selections by specifying `stateMappers` and/or `actionMappers`.

A selection can be defined in different ways, either using an Array, an Object or a Function:

### Selections using Array

You can pass an Array of keys you'd like to pick from the store; e.g.: 
```js
['count', 'user']
```
This will return an object with only those properties from the store.

In case you want to assign a different name to the properties on the resulting object, you can use the following syntax: 
```js
['loggedInUser:user']
```
This will get the value of the property `user` from the store and return it in a new object in the key `loggedInUser`.

You can provide a "path" in case you need to select some nested property from an object; e.g.:
```js
['userName:user.firstName']
```

### Selections using Object

You can pass an Object of key:value pairs; e.g.: 
```js
{
  loggedInUser: 'user',
  userName: 'user.firstName',
}
```
You can note some similarities to the ones described with Arrays:
- You can select a property and assign a different key in the returned object.
- You can use path to select nested properties

One special behavior using Object is that it allows to specify a getter `Function` as the value of the key; this function will receive the `state` and, in the case of using the connect HOC, the components props; e.g.:
```js
{
  fullName: (state, props) => {
    return `${state.user.firstName}${props.separator}${state.user.lastName}`;
  },
}
```

### Selections using Function

Lastly, you can specify a `Function` to create the resulting object from the `state`. This function will also receive the components `props` when used with the connect HOC; e.g.:
```js
(state, props) => {
  return {
    isLoggedIn: Boolean(state.user),
    fullName: `${state.user.firstName}${props.separator}${state.user.lastName}`,
    count: state.count,
  }
}
```
If your store is not a key/value map, then the other selection methods won't be useful; but you can use `Function` to retrieve the whole state of the store; e.g.:
```js
// Let's asume that the store contains a `todos` Array, instead of defining an object/map { todos }:
(todos) => todos
```

## Advanced Usecases

### Combining Contexts

There are scenarios in which you'll need to access to one or more `Context` to gather all the values your component needs. In such case, instead manually nesting your connect HOC, you can use `mergedConnectContextFactory` helper function; e.g.:

```js
import { MainContext } from './main/provider';
import { TodosContext } from './todos/provider';

const TodosComponent = ({ mainStateProp, todosStateProp, todosActionProp, anotherProp}) => { } 

const withMainAndTodos = mergedConnectContextFactory([MainContext, TodosContext]);

export default withMainAndTodos(TodosComponent, {
  stateMappers: ['mainStateProp', 'todosStateProp'],
  actionMappers: ['todosActionProp'],
  afterMerge: mergedProps => {
    const { mainStateProp, todosStateProp } = mergedProps;

    return {
      anotherProp: `Mixing ${mainStateProp} and ${todosStateProp}`;
    }
  }
});
```

By using this helper function you can just specify a single `ConnectContextOptions` options defining the state-props and actions you wan't to select from the `Context` objects you provided (note that selections will be looked at both contexts, and the later will override the former in case of collision, so order os `Context` might be important).

In addition to regular state and action selectors you can define an option called `afterMerge`. This option receives a function that will be called with the resulting merged props, consisting of the combination of your selected states and actions and the Component's props.

This function should return additional (or overriding) properties that will be combined and finally passed down to the `Component`.

For a concrete example, take a look at `TodoList` component in `examples/todomvc` folder.

## License

MIT © [Adrián Gallardo](https://github.com/edriang)
