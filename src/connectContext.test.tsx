import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import createContextProvider, { connectContextFactory, useConnectedContextFactory, mergedConnectContextFactory } from './';

const mockState = {
    count: 0,
    testProp: 'TEST',
};

const MockComponent = ({ testProp }: any) => testProp;
const CountComponent = ({ count, increment, amount = 1 }: any) => (
    <button data-testid="button" onClick={() => increment(amount)}>
        {count}
    </button>
);

function reducer(state: any, action: any) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + action.payload.amount };
        default:
            return state;
    }
}

const actions = {
    increment: (dispatch: Function) => (amount: number) => {
        dispatch({ type: 'INCREMENT', payload: { amount }});
    },
    reset: (dispatch: Function) => () => {
        dispatch({ type: 'RESET' });
    },
}

let CounterProvider: any, CounterContext: any;

beforeEach(() => {
    [CounterProvider, CounterContext] = createContextProvider(reducer, mockState, actions);
});

describe('createContextProvider', () => {

    it('creates a Context and children have access to its values', () => {
        const { getByText } = render(
            <CounterProvider>
                <CounterContext.Consumer>
                    {({ state }: any) => state.testProp}
                </CounterContext.Consumer>
            </CounterProvider>
        );

        expect(getByText(mockState.testProp)).toBeTruthy();
    });

    it('updates component after executing an action', () => {
        const amount = 10;
        const { getByTestId, getByText,  } = render(
            <CounterProvider>
                <CounterContext.Consumer>
                    {({ state, actions }: any) => (
                        <CountComponent count={state.count} increment={actions.increment} amount={amount} />
                    )}
                </CounterContext.Consumer>
            </CounterProvider>
        );
        const button = getByTestId('button');

        act(() => {
            fireEvent.click(button);
        });

        expect(getByText(amount.toString())).toBeTruthy();
    });
});

describe('connectContextFactory', () => {
    let withCounter: any;
    const amount = 10;

    beforeEach(() => {
        withCounter = connectContextFactory(CounterContext);
    });

    it('creates connect HOC', () => {
        const Component = ({ testProp }: any) => testProp;
        const ComponentWithCounter = withCounter(Component, {
            stateMappers: ['testProp']
        });
        const { getByText } = render(<CounterProvider><ComponentWithCounter/></CounterProvider>);
        
        expect(getByText(mockState.testProp)).toBeTruthy();
    });

    it('passes down any property from Component', () => {
        const Component = ({ amount }: any) => amount;
        const ComponentWithCounter: React.FC<any> = withCounter(Component, {
            stateMappers: ['testProp']
        });
        const { getByText } = render(<CounterProvider><ComponentWithCounter amount={amount}/></CounterProvider>);
        
        expect(getByText(amount.toString())).toBeTruthy();
    });

    it('allows calling actions', () => {
        const withCounter = connectContextFactory(CounterContext);
        const ComponentWithCounter: React.FC<any> = withCounter(CountComponent, {
            stateMappers: ['count'],
            actionMappers: ['increment'],
        });
        const { getByTestId, getByText } = render(<CounterProvider><ComponentWithCounter amount={amount} /></CounterProvider>);
        const button = getByTestId('button');

        act(() => {
            fireEvent.click(button);
        });

        expect(getByText(amount.toString())).toBeTruthy();
    });
});

describe('useConnectedContextFactory', () => {
    let useCounter: any;
    const amount = 10;

    beforeEach(() => {
        useCounter = useConnectedContextFactory(CounterContext);
    });

    it('creates connect hook', () => {
        const ComponentWithCounter = () => {
            const {testProp} = useCounter({
                stateMappers: ['testProp'],
            });
            
            return <MockComponent testProp={testProp} />
        }
        const { getByText } = render(<CounterProvider><ComponentWithCounter/></CounterProvider>);
        
        expect(getByText(mockState.testProp)).toBeTruthy();
    });

    it('creates connect hook with access to actions', () => {
        const ComponentWithCounter = () => {
            const {count, increment} = useCounter({
                stateMappers: ['count'],
                actionMappers: ['increment'],
            });
            
            return <CountComponent count={count} increment={increment} amount={amount} />
        }        
        const { getByTestId, getByText } = render(<CounterProvider><ComponentWithCounter/></CounterProvider>);
        const button = getByTestId('button');

        act(() => {
            fireEvent.click(button);
        });

        expect(getByText(amount.toString())).toBeTruthy();
    });
});


describe('mergedConnectContextFactory', () => {
    const secondMockState = {
        count2: 2000,
        testProp2: 'TEST 2',
    };

    function reducer(state: any) {
        return state;
    }

    let CounterProvider2: any, CounterContext2: any, withBothContexts: any;

    beforeEach(() => {
        [CounterProvider2, CounterContext2] = createContextProvider(reducer, secondMockState, {});
        withBothContexts = mergedConnectContextFactory([CounterContext, CounterContext2]);
    });

    it('loads values from both contexts', () => {
        const Component = ({testProp, testProp2}: any) => `${testProp}-${testProp2}`;
        const ComponentWithCounter = withBothContexts(Component, {
            stateMappers: ['testProp', 'testProp2']
        });

        const { getByText } = render(
            <CounterProvider>
                <CounterProvider2>
                    <ComponentWithCounter/>
                </CounterProvider2>
            </CounterProvider>
        );
        
        expect(getByText(`${mockState.testProp}-${secondMockState.testProp2}`)).toBeTruthy();
    });

    it('overrides first context value with second one', () => {
        const ComponentWithCounter = withBothContexts(MockComponent, {
            stateMappers: ['testProp', 'testProp:testProp2']
        });

        const { getByText } = render(
            <CounterProvider>
                <CounterProvider2>
                    <ComponentWithCounter/>
                </CounterProvider2>
            </CounterProvider>
        );
        
        expect(getByText(secondMockState.testProp2)).toBeTruthy();
    });

    it('overrides props with afterMerge callback', () => {
        const Component = ({testProp, testProp2}: any) => `${testProp}-${testProp2}`;
        const ComponentWithCounter = withBothContexts(Component, {
            stateMappers: ['testProp', 'testProp2'],
            afterMerge: (state: any) => ({
                testProp: state.testProp.toUpperCase(),
                testProp2: state.testProp2.toUpperCase(),
            }),
        });

        const { getByText } = render(
            <CounterProvider>
                <CounterProvider2>
                    <ComponentWithCounter/>
                </CounterProvider2>
            </CounterProvider>
        );
        
        const textMatch = `${mockState.testProp.toUpperCase()}-${secondMockState.testProp2.toUpperCase()}`;
        expect(getByText(textMatch)).toBeTruthy();
    });
    
});
