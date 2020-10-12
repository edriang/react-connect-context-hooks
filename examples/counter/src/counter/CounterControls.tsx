import React from 'react';

import { useCounter } from './store';

const Counter: React.FC = () => {
    const { amount, increment, decrement, count } = useCounter({
        stateSelectors: ['amount', 'count'],
        actionSelectors: ['increment', 'decrement'],
    });

    if (count === 0) {
        increment(amount);
    }

    return (
        <div>
            {count}
            <button onClick={() => decrement(amount)}>Decrement</button>
            <button onClick={() => increment(amount)}>Increment</button>
        </div>
    )
}

export default Counter;
