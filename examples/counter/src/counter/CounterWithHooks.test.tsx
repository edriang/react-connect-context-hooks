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
