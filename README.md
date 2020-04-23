# react-connect-context-hooks

<!-- TOC -->

- [react-connect-context-hooks](#react-connect-context-hooks)
    - [Install](#install)
    - [What?](#what)
    - [Why?](#why)
    - [How? (Example)](#how-example)
        - [Provider](#provider)
        - [Connect using HOC](#connect-using-hoc)
        - [Connect using hooks](#connect-using-hooks)
    - [Demo App](#demo-app)
    - [Examples](#examples)
        - [Actions](#actions)
        - [Reducer](#reducer)
    - [Selections](#selections)
        - [Selections using Array](#selections-using-array)
        - [Selections using Object](#selections-using-object)
        - [Selections using Function](#selections-using-function)
    - [Other Use-cases](#other-use-cases)
        - [Fetching initial data](#fetching-initial-data)
        - [Combining Contexts](#combining-contexts)
        - [Merged Store](#merged-store)
        - [Deriving State](#deriving-state)
        - [Store without reducer](#store-without-reducer)
    - [Benefits of using Context](#benefits-of-using-context)
    - [Testing](#testing)
        - [Testing your connected components with HOC](#testing-your-connected-components-with-hoc)
        - [Testing components connected with useContext](#testing-components-connected-with-usecontext)
    - [Problems or Suggestions](#problems-or-suggestions)
    - [License](#license)

<!-- /TOC -->

## Install

```bash
npm install --save react-connect-context-hooks
```

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

Exciting new features:
 - Since version 1.10.0 `react-connect-context-hooks` implements [`use-context-selection`](https://www.npmjs.com/package/use-context-selection) internally, so your selections using hooks will be as fast as they are now using HOC!! `use-context-selection` allows selecting from Context only what you need and then trigger a re-render on consumer components only when that data changes.


## Why?

Since React hooks are available, a lot of discussion among the developer-community arose regarding if external tooling (such as `redux`) is needed to implement global state management in your apps.

While it is possible to implement a simple redux-like functionality just with `useReducer` + `useContext`, there are good recommendations and practices to follow, especially for growing applications.

This library allows you implementing good practices for your custom state-management solution using React hooks while reducing the boilerplate for every `Provider/Consumer` you need to create.

## How? (Example)

> *In this section, we will review the basic functionality provided by the library. The snippets are based on the example application located in `examples/counter`. For a more complete/advanced use-case take a look at `examples/todomvc`.*

Let's go through this example by explaining what is happening on the different files:

### Provider

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

import CounterProvider from './counter/store';
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

### Connect using HOC

After creating and configuring your Provider you can connect your components with the Context using the HOC helper as follows:

```js
/// CounterComponent.tsx

import React from 'react';

import { withCounter } from './store/CounterProvider';

const Counter: React.FC = ({ count, increment, decrement }) => {
  const [amount, setAmount] = React.useState(1);

  const updateAmount = (event: any) => {
    setAmount(parseInt(event.target.value));
  }

  return (
    <div>
      <h1>Counter Component</h1>
      <p>
        <b>Amount:</b>
        <input type="number" value={amount} onChange={updateAmount} />
      </p>
      <p>
        <b>Count: </b>
        <span>{count}</span>
      </p>
      <hr />
      <button onClick={() => decrement(amount)}>Decrement</button>
      <button onClick={() => increment(amount)}>Increment</button>
    </div>
  )
}

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


### Connect using hooks

In general, using the HOC helper is the recommended way to access your Context (for testing purposes and separations of concerns), but if desired you can also use the hook helper. Let's see how to recreate the same example as above using `useCounter` hook; e.g.:

```js
/// CounterComponent.tsx

import React from 'react';

import { useCounter } from './store/CounterProvider';

const Counter: React.FC = () => {
  const [amount, setAmount] = React.useState(1);
  const { count, increment, decrement } = useCounter({
    stateSelectors: ['count'],
    actionSelectors: ['increment', 'decrement'],
  });
  
  const updateAmount = (event: any) => {
    setAmount(parseInt(event.target.value));
  }

  return (
    <div>
      <h1>Counter Component</h1>
      <p>
        <b>Amount:</b>
        <input type="number" value={amount} onChange={updateAmount} />
      </p>
      <p>
        <b>Count: </b>
        <span>{count}</span>
      </p>
      <hr />
      <button onClick={() => decrement(amount)}>Decrement</button>
      <button onClick={() => increment(amount)}>Increment</button>
    </div>
  )
}

export default Counter;
```

`useCounter` receives the same `options` object as the HOC helper, so you can select only what you need from the store.

## Demo App

[https://edriang.github.io/react-connect-context-hooks](https://edriang.github.io/react-connect-context-hooks)


## Examples

Check these examples to better understand the library and get inspiration to write your next awesome app!

- **Counter App**

This is a simple Counter application; it uses a reducer to manage state and connects components to the store using the hooks helpers. 

[https://github.com/edriang/react-connect-context-hooks/tree/master/examples/counter](https://github.com/edriang/react-connect-context-hooks/tree/master/examples/counter)

- **Todo MVC**

This is a more complex and complete App; these are some of the features it uses:
- Stores the application data on multiple Contexts, each one with its own state and actions.
- Merges all context into a single StoreProvider for easier access.
- Uses `onInit` prop to fetch initial data when the Provider renders for the first time.
- Connects components to the store using HOC helpers.
- Derives state using `computeSelectors`.

[https://github.com/edriang/react-connect-context-hooks/tree/master/examples/counter](https://github.com/edriang/react-connect-context-hooks/tree/master/examples/counter)


### Actions

Actions are higher-order functions that receive two parameters:
- `dispatch`: a function used to trigger an action to be handled by the reducer.
- `getState`: a function to retrieve a reference to the current state values of your store.

This function MUST return a function. The returned function can be defined as you like with zero or more parameters and even as `async`.

**Note:** if you ever used [`redux-thunk`](https://github.com/reduxjs/redux-thunk) you will notice the similarities.

```js
/// counterActions.ts

const ACTIONS = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
};

const increment = (dispatch: any, getState: Function) => (amount: number) => {
    dispatch({
        type: ACTIONS.INCREMENT,
        payload: { amount },
    });
}

const decrement = (dispatch: any, getState: Function) => (amount: number) => {
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
['user:loggedInUser']
```
This will get the value of the `user` property from the store and will provide it to the component as `loggedInUser` prop (similar to object destructuring with assignation).

You can select nested properties by providing a `path`; e.g.:
```js
['user.firstName:userName']
```
In this case, we are selecting the property `firstName` from `user`, and then returning with the name `userName`.

If in the example above you didn't provide `:userName`, then the returning value will be assigned with a key equals to the last part of the selection path; e.g.: 

```js
['user.firstName']
```
This will select `user.firstName` from the store and return it as `firstName` on the resulting selection.

The `path` notation also works for selecting values from an array; e.g.:
```js
['todos[0].title:firstTaskTitle']
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

### Fetching initial data

Sometimes you'll need to call some service when the application starts so you can populate your store with initial data.

To cover that scenario, the `Provider` returned by `createContextProvider` accepts a special property called `onInit`, which expects to receive a tuple (array) with two values: a selections object and a function.

The `selection object` is the same as the one used with connect HOC and allows selecting only what you need from your store, as well as applying derived state functions.

The `function` provided as second parameter will be called with the result of the previous selection.

Note that, if provided, `onInit` function will be triggered only once when the Provider is first rendered; e.g.:

```js
// index.tsx

const selectionOption = {
  actionSelectors: ['fetchTodos'],
}

const onInit({ fetchTodos }) => fetchTodos();

render(
  <TodosProvider onInit={[selectionOption, onInit]}>
    <App />
  </TodosProvider>
  document.getElementById('root')
)

```

### Combining Contexts

There are scenarios in which you'll need to access more than one `Context` to gather all the values your component needs. In such cases you can use `mergedConnectContextFactory` helper function; e.g.:

```js
import { MainContext } from './main/store';
import { TodosContext } from './todos/store';

const TodosComponent = ({ mainStateProp, todosStateProp, todosActionProp, anotherProp}) => { } 

const withMainAndTodos = mergedConnectContextFactory({
  main: MainContext,
  todos: TodosContext,
});

export default withMainAndTodos(TodosComponent, {
  stateSelectors: ['main.stateProp:mainStateProp', 'todos.stateProp:todosStateProp'],
  actionSelectors: ['todos.actionProp:todosActionProp'],
});
```

This helper function is similar to `connectContextFactory`, but instead receives a dictionary of `Context` objects.

Then, you can use regular `selectors` for retrieving data from any of the specified store contexts; the only consideration you should keep in mind is that now you'll need to specify the name (key) provided on `mergedConnectContextFactory` Context-dictionary (in the example `main` and `todos`).

**Note:** the stores' data will be merged together before applying `selectors` so you have access to the value of all the contexts.


### Merged Store

The use case for Merged Stores is similar to "Combining Contexts" as explained above, but the main difference is it allows you to create one merged store with all your providers for wrapping your App; e.g.:

```js
// store.tsx

import { createMergedStore } from 'react-connect-context-hooks';

import MainProvider from './main/store';
import TodosProvider from './todos/store';

const [StoreProvider, withStore, useStore] = createMergedStore({
  main: MainProvider,
  todos: TodosProvider
});

export default StoreProvider;
export {
    withStore,
    useStore,
};
```

Note you provide a dictionary to `createMergedStore`; this is important to keep in mind, as now your selectors must be prefixed with this key. This is necessary to avoid property-collisions between different stores.

Then you can wrap your `App` using this only provider:

```js
// index.tsx
import React from 'react';
import { render } from 'react-dom';

import App from './main/components/App';
import StoreProvider, { useStore } from './store';


const onInit = ({ fetchTodos }: any) => {
  fetchTodos();
}

const selection = {
  // As stated above, now you should use the `todos` prefix assigned to `TodosProvider` on previous step
  actionSelectors: ['todos.fetchTodos'],
}

render(
  <StoreProvider onInit={[selection, onInit]}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)
```

As you can see, `StoreProvider` also support `onInit` function for triggering an action when your Provider is rendered.

Notice that `createMergedStore` also returns two additional values:
- `withStore`: will connect any component with all your merged stores context values.
- `useStore`: is a hook that will let you access all your merged stores context values.


### Deriving State

It is a good practice to save in the store the minimum data and then derive or compute any other value your components might need; e.g.: 

- Let's say you are developing a TO-DO app and you want to display lists of `todos` filtered by some criteria: `ALL', 'COMPLETED', 'PENDING'.
- In this case, instead of storing and having to maintain 3 different lists for each filter, a better approach is to store the full list and current filter; then, you can use `computedSelector` to retrieve the filtered list.

```js
// TodosComponent.ts

import { withTodos } from './todos/store';

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


### Store without reducer

There are cases in which you'll need to add some values to a Context to make them available to every component, but those values won't change so often, for example, to keep track of authentication. In those cases, creating a `reducer` might be a little overkill, so you can skip it and use the library as follows:

> *Check [this codesandbox](https://codesandbox.io/s/rcch-context-auth-ut64i) for quickly testing this approach, or check the auth0 example located at `examples/react-spa`;

```js
// authStore.js

import createContextProvider, { connectContextFactory } from 'react-connect-context-hooks';
import authService from './authService';

const loginAction = (dispatch, getState) => async (username, password) => {
  dispatch({ loading: true });

  try {
    const user = await authService.login(username, password);

    dispatch({ loading: false, user, isAuthenticated: true });

  } catch (error) {
    dispatch({ loading: false, error });
  }
}

const actions = {
  login: loginAction
}

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    error: null,
}

const [AuthProvider, AuthContext] = createContextProvider(initialState, actions);

const withAuth = connectContextFactory(AuthContext);

export default AuthProvider;

export {
    withAuth,
};
```

As you can see, we didn't provide a `reducer` and instead just provided the initial state and actions.

You'll notice that `actions` are created as regular `actionCreators`; they receive a `dispatch` and `getState` functions and must return a function that will be called by consumers/connected components.

The main difference is that you'll call `dispatch` with an object to `patch` (update) your current state, instead of triggering reducer actions to produce the mutations.

And that's it for the store... for completeness, below you have an example of how will look a component using this approach:

```js
// App.js

import React from 'react';
import { withAuth } from "./authStore";

const App = ({ loading, isAuthenticated, user, login, logout }) => {
  if (loading) {
    return <span>Loading...</span>
  }
  if (isAuthenticated) {
    return (
      <div>
        <h1>{`Hello ${user.name}!!`}</h1>
        <button onClick={logout}>Log out</button>
      </div>
    )
  }
  return <button onClick={() => login("test", "pass")}>Log in</button>
}

export default withAuth(App, {
  stateSelectors: ['loading', 'isAuthenticated', 'user'],
  actionSelectors: ['login', 'logout'],
});
```

Finally, remember to wrap your App with the context provider:

```js
// index.js

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import AuthProvider from "./authStore";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  rootElement
);
```

## Benefits of using Context

The main benefit of a `Context` based state-management solution is that you can co-locate your state closer to the components using it. This approach goes against having a big-global state for your entire app (like in Redux).

Having co-located state is a good practice specially if you are using client-side routing and lazy-loading, because you are going to load and unload pieces of the UI and when those sections are detached the state related to them should probably be garbage-collected too.

On the other hand, in the scenarios where you need to have part of your state global, you can easily move the provider related to that specific state higher on the components hierarchy.

Combining different `Contexts` to create a merged store is also something possible with this library. You can create a combined provider (`Store`) or merge them on demmand whenever you need it.

Then, you can use `selectors` to access specific pieces of your state and trust this library to update the underlying components only when some of those properties changes. This leads to important performance benefits against using `React.ContextAPI` by your own (if you are not cautious).


## Testing

### Testing your connected components with HOC

Using the HOC is the recommended way to connect your components with your Context because it makes unit-testing easier.

The main idea is that you will export your connected component as the default export and your dumb/presentational component as your named export; let's review the following example:

```js
export const LoginForm = ({ error, login }) => {
  const [username, setUsername] = React.useState();

  function onSubmit(event) {
    event.preventDefault();

    login(username);
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <pre>{error}</pre>}
      <input data-testid="input-username" value={username} onChange={e => setUsername(e.target.value)} />
      <button type="submit" data-testid="button-login">Log In</button>
    </form>
  );
};

export default withCounter(LoginForm, {
  stateSelectors: ['error'],
  actionSelectors: ['login'],
});
```

As you can see, the default export is the HOC that connects your `LoginForm` with the Context. You don't need to test this default export, as this library is already tested and you don't have to worry about its internal behavior.

What you'd want to test is your `LoginForm` component isolated; this is why we are exporting it in addition to the default export.

Following this approach you'll just need to create test-assertions to validate that your component behaves as expected with the received props; here is an example using `jest` and `react-testing-library`:

```js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

const mockData = {
  error: null,
  login: jest.fn()
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders LoginForm component', () => {
    const { queryByText, getByTestId } = render(<LoginForm {...mockData} />);

    expect(queryByText(mockData.error)).toBeFalsy();
    expect(getByTestId('input-username')).toBeTruthy();
    expect(getByTestId('button-login')).toBeTruthy();
  });

  it('renders error', () => {
    const error = 'Some error';
    const { getByText, getByTestId } = render(<LoginForm {...mockData} error={error} />);

    expect(getByText(error)).toBeTruthy();
    expect(getByTestId('input-username')).toBeTruthy();
    expect(getByTestId('button-login')).toBeTruthy();
  });

  it('triggers login fn', () => {
    const { getByTestId } = render(<LoginForm {...mockData} />);

    fireEvent.click(getByTestId('button-login'));

    expect(mockData.login).toHaveBeenCalled();
  });
});
```

### Testing components connected with useContext

Consider the following example file:

```js
// CounterWithHooks.tsx

import React from 'react';

import { useCounter } from './store';

const Counter: React.FC = () => {
    const { count, increment, decrement } = useCounter({
        stateSelectors: ['count'],
        actionSelectors: ['increment', 'decrement'],
    });
    const [amount, setAmount] = React.useState(1);

    const updateAmount = (event: any) => {
        setAmount(parseInt(event.target.value));
    }

    return (
        <div>
            <h1>Counter Component</h1>
            <p>
                <b>Amount:</b>
                <input type="number" value={amount} onChange={updateAmount} />
            </p>
            <p>
                <b>Count: </b>
                <span>{count}</span>
            </p>
            <hr />
            <button onClick={() => decrement(amount)}>Decrement</button>
            <button onClick={() => increment(amount)}>Increment</button>
        </div>
    )
}

export default Counter;
```

As you can notice, this component is accessing directly the Context values using the `useCounter` hook (check `CounterProvider.tsx` example).

As it uses `useContext` internally we need to provide the component with a Context; for this purpose, we can use `createMockProvider` utility function.

`createMockProvider` receives the `Provider` component (the one created with `createContextProvider`) and a `ReactNode`; it returns a `MockProvider` component which can be used to provide the Context values to your component. The `MockProvider` component accepts two properties: `state` and `actions`.

Take a look at the following test file:

```js
// `CounterWithHooks.test.tsx`

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createMockProvider } from 'react-connect-context-hooks';

import CounterProvider from './store/CounterProvider';
import Counter from './CounterWithHooks';

const MockProvider = createMockProvider(CounterProvider, <Counter />);
const mockedState = {
    count: 999,
};
const mockedActions = {
    increment: jest.fn(),
    decrement: jest.fn(),
};

describe('Counter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders counter component', () => {
        const { getByText } = render(<MockProvider state={mockedState} actions={mockedActions} />);

        expect(getByText(String(mockedState.count))).toBeTruthy();
    });

    it('calls increment when press increment button', () => {
        const { getByText } = render(<MockProvider state={mockedState} actions={mockedActions} />);
        const button = getByText('Increment');

        fireEvent.click(button);

        expect(mockedActions.increment).toHaveBeenCalledTimes(1);
    });

    it('calls decrement when press decrement button', () => {
        const { getByText } = render(<MockProvider state={mockedState} actions={mockedActions} />);
        const button = getByText('Decrement');

        fireEvent.click(button);

        expect(mockedActions.decrement).toHaveBeenCalledTimes(1);
    });
});
```


## Problems or Suggestions

Please feel free to open an issue on [github](https://github.com/edriang/react-connect-context-hooks).

## License

MIT © [Adrián Gallardo](https://github.com/edriang)
