import React from 'react';

import { withCounter } from './store';
import useCountLogger from './useCountLogger';

type CounterProps = {
    count: number;
    increment: (amount: number) => void;
    decrement: (amount: number) => void;
}

const Counter: React.FC<CounterProps> = ({ count, increment, decrement }) => {
    const [amount, setAmount] = React.useState(1);

    const updateAmount = (event: any) => {
        setAmount(parseInt(event.target.value));
    }

    // useCountLogger();

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

export {
    Counter,
}

export default withCounter(Counter, {
    stateSelectors: ['count'],
    actionSelectors: ['increment', 'decrement'],
});
