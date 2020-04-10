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
