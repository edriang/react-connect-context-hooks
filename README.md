# react-connect-context-hooks

<!-- TOC -->

- [react-connect-context-hooks](#react-connect-context-hooks)
    - [Install](#install)
    - [Demo App](#demo-app)
    - [What?](#what)
    - [Why?](#why)
    - [How? (Example)](#how-example)
        - [Actions](#actions)
        - [Reducer](#reducer)
    - [Selections](#selections)
        - [Selections using Array](#selections-using-array)
        - [Selections using Object](#selections-using-object)
        - [Selections using Function](#selections-using-function)
    - [Other Use-cases](#other-use-cases)
        - [Combining Contexts](#combining-contexts)
        - [Deriving State](#deriving-state)
        - [Fetching initial data](#fetching-initial-data)
    - [Problems or Suggestions](#problems-or-suggestions)
    - [License](#license)

<!-- /TOC -->

## Install

```bash
npm install --save react-connect-context-hooks
```

## Demo App

[https://edriang.github.io/react-connect-context-hooks](https://edriang.github.io/react-connect-context-hooks)

## What?

`react-connect-context-hooks` allows you to implement a state-management solution using React.hooks, while leverages good practices and provide DRY code.

 This library takes ideas and patterns from `redux` and its ecosystem and integrates them all under a lightweight and easy to learn package; e.g.:
 - Splitting the `state` per feature-modules.
 - Defining `actionCreators` to dispatch actions (higher-order functions like `redux-thunk`).
 - Providing a `connect` HOC for selecting values from your state.
- Computing derived data (like `reselect`).

 Also, enforces good practices for implementing state-management with hooks; e.g.:
 - Provides custom `Provider` HOC for wrapping your components.
 - Provides custom `useContext` hook for selecting what you need from the store (similar to the `connect` HOC mentioned above).
 - Provides different `selection` or mapping options for easily getting what you need from the `store`.
 - Prevents unnecessary re-renders implementing basic memoization on top of your components.

## Why?

Since React hooks are available, a lot of discussion among the developer-community arose regarding if external tooling (such as `redux`) is needed to implement global state management in your apps.

While it is possible to implement a simple redux-like functionality just with `useReducer` + `useContext`, there are good recommendations and practices that are good to consider, especially for growing applications.

This library allows you implementing good practices for your custom state-management solution using React hooks while reducing the boilerplate for every `Provider/Consumer` you need to create.

## How? (Example)

> *In this section, we will review the basic functionality provided by the library. The snippets are based on the example application located in `examples/counter`. For a more complete/advanced use-case take a look at `examples/todomvc`.*

Let's go through this example by explaining what is happening on the different files:

```js
/// CounterProvider.tsx

import counterReducer, { initialState } from './counterReducer';
import counterActions from './counterActions';

import createContextProvider, { connectContextFactory, useConnectedContextFactory } from 'react-connect-context-hooks';

const [CounterProvider, CounterContext] = createContextProvider(counterReducer, initialState, counterActions);

const withCounter = connectContextFactory(CounterContext);
const useCounter = useConnectedContextFactory(CounterContext);

export default CounterProvider;
export {
    withCounter,
    useCounter,
};
```

`createContextProvider` receives a `reducer` function, an `initialState` object, and an object with `actions`; it returns:
 - a `Provider` component for wrapping your application and allowing its children to have access to the underlying `Context`.
 - a `Context` object that we use next to create our custom `connect` HOC and/or `useContext` hook (`withCounter` and `useCounter` in the example).

 **Note**: you can check below the documentation for defining `actions` and `reducer`.

 Next, use the `Provider` component for wrapping your application's code.

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

// Export the connected component as default for using in your application
export default withCounter(Counter, {
  stateSelectors: ['count'],
  actionSelectors: ['increment', 'decrement'],
});
```

In this example, we define a simple `Counter` component expects 3 properties: `count`, `increment` and `decrement`. We will provide these values by selecting from our `Context`; e.g.:
 - `withCounter` is a HOC that allows connecting to `CounterContext`. 
 - this HOC function receives the `Counter` component and some options for selecting data from your `store` (check below how to define selectors).

In general, using the `connected` HOC is recommended, but if you need to access the store's data from a hook you can use the `hook` helper; e.g.:

```js
/// useCountLogger.ts

export default () => {
    const { count } = useCounter({
      stateSelectors: ['count'],
    });
  
    console.warn(`Count is: ${count}`);
}

```

`useCounter` receives the same `options` object as the HOC, so you can select only what you need from the store.


### Actions

Actions are higher-order functions that receive two parameters:
- `dispatch`: used to trigger an action to be handled by the reducer.
- `state`: reference to the current state values of your store.

This function MUST return a function. The returned function can be defined as you like with zero or more parameters and even as `async`.

**Note:** if you ever used [`redux-thunk`](https://github.com/reduxjs/redux-thunk) you will notice the similarities.

```js
/// counterActions.ts

const ACTIONS = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
};

const increment = (dispatch: any, state: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.INCREMENT,
        payload: { amount },
    });
}

const decrement = (dispatch: any, state: any) => (amount: number) => {
    dispatch({
        type: ACTIONS.DECREMENT,
        payload: { amount },
    });
}

const actions = {
  increment,
  decrement,
}

export default actions;

export {
    ACTIONS,
};
```

**Note:** for accessing these actions you will use the `actionSelectors` option as described above.


### Reducer

This is a regular reducer function; you can check [`React.useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) documentation to get more familiar with it; e.g.:

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

You can use `selectors` for retrieving data from your store. You define selections by using `stateSelectors` and/or `actionSelectors` options.

A selection can be defined in different ways, either using an Array, an Object or a Function as specified below.


### Selections using Array

You can pass an Array of keys you'd like to pick from the store; e.g.: 
```js
['count', 'user']
```

In case you want to assign a different name to the properties on the resulting object, you can use the following syntax: 
```js
['loggedInUser:user']
```
This will get the value of the `user` property from the store and will provide it to the component as `loggedInUser` prop.

You can select nested properties by providing a `path`; e.g.:
```js
['userName:user.firstName']
```
Note that in this case is mandatory to specify a mapping property (`userName`) to assign the result of the selection (`user.firstName`).

The `path` notation also works for selecting values from an array; e.g.:
```js
['firstTaskTitle:todos[0].title']
```

### Selections using Object

You can pass an Object of `key:value` pairs; e.g.: 
```js
{
  loggedInUser: 'user',
  userName: 'user.firstName',
}
```

There are similarities to working with Arrays:
- You can select a property from the store (`user`) and assign a different name (`loggedInUser`) in the resulting props.
- You can use a `path` for selecting nested properties as well.

One special behavior using Object selectors is it allows specifying a getter `Function`; this function will be called with the `state` and `props` of your component (the latter only available with `connect` HOC); e.g.:

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

**Tip:**  If your store is not a key/value map, you can use `Function` to retrieve the whole state of the store; e.g.:
```js
// Assuming your store is an Array of `todos` instead of { todos }:
(todos) => todos
```


## Other Use-cases

### Combining Contexts

There are scenarios in which you'll need to access more than one `Context` to gather all the values your component needs. In such cases you can use `mergedConnectContextFactory` helper function; e.g.:

```js
import { MainContext } from './main/provider';
import { TodosContext } from './todos/provider';

const TodosComponent = ({ mainStateProp, todosStateProp, todosActionProp, anotherProp}) => { } 

const withMainAndTodos = mergedConnectContextFactory([MainContext, TodosContext]);

export default withMainAndTodos(TodosComponent, {
  stateSelectors: ['mainStateProp', 'todosStateProp'],
  actionSelectors: ['todosActionProp'],
});
```

This helper function is similar to `connectContextFactory`, but instead receives an array of `Context` objects.

Now, you can use your regular `selectors` for retrieving data from any of the specified store contexts.

**Note:** the stores' data will be merged together before applying `selectors`; this means that the order of `Context` objects in the Array might be important in case properties have the same name.


### Deriving State

It is a good practice to save in the store the minimum data and then derive or compute any other value your components might need; e.g.: 

- Let's say you are developing a TO-DO app and you want to display lists of `todos` filtered by some criteria: `ALL', 'COMPLETED', 'PENDING'.
- In this case, instead of storing and having to maintain 3 different lists for each filter, a better approach is to store the full list and current filter; then, you can use `computedSelector` to retrieve the filtered list.

```js
// TodosComponent.ts

import { withTodos } from './todos/provider';

const TodosComponent = ({ todos }) => { /* your components' code here */ } 

// This is the selector function
const filterVisibleTodos(todos, visibilityFilter) {
  switch(visibilityFilter) {
    case 'COMPLETED': return todos.filter(todo => todo.completed);
    case 'UNCOMPLETED': return todos.filter(todo => !todo.completed);
    default: return todos;
  }
}

export default withTodos(TodosComponent, {
  stateSelectors: ['todos', 'visibilityFilter'],
  computedSelectors: {
    todos: [filterVisibleTodos, ['todos', 'visibilityFilter']],
  },
});
```

The `computedSelectors` option expects an object with the following signature:
- the `key` defines the name associated with the resulting object.
- the `values` expect a tuple (array) with two elements: 
  - the first element is a function that will be called to compute the resulting value.
  - the second element is an array of dependencies (used for memoization). 
  
**Note:** the `dependencies` array can list properties coming from any of the following sources:
- the result of previous selections (e.g. `stateSelectors` or `stateSelectors`).
- the original `props` provided to the components.
- previous returned values by other `computedSelectors` functions.

**Important:** `computedSelectors` are memoized using `React.memo()`; this avoids re-computing a giving selector if none of the listed dependencies changed.


### Fetching initial data

Sometimes you'll need to call some service when the application starts so you can populate your store with initial data.

To cover that scenario, the `Provider` returned by `createContextProvider` accepts a special property called `onInit`, which expects to receive a function.

If provided, this function will get called when the provider is mounted; the context value will be provided as the only parameter, you with this object you can access to both `initialState` and `actions`; e.g.:

```js
// index.tsx

render(
  <TodosProvider onInit={({ actions }: any) => actions.fetchTodos() }>
    <App />
  </TodosProvider>
  document.getElementById('root')
)

```


## Problems or Suggestions

Please feel free to open an issue on [github](https://github.com/edriang/react-connect-context-hooks).

## License

MIT © [Adrián Gallardo](https://github.com/edriang)
