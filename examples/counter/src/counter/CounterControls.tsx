import React from 'react';

import { useCounter } from './store';

const Counter: React.FC = () => {
    const { amount, increment, decrement } = useCounter({
        stateSelectors: ['amount'],
        actionSelectors: ['increment', 'decrement'],
    });

    return (
        <div>
            <button onClick={() => decrement(amount)}>Decrement</button>
            <button onClick={() => increment(amount)}>Increment</button>
        </div>
    )
}

export default Counter;
