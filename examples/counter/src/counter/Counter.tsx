import React from 'react';

import { useCounter } from './store';

const Counter: React.FC = () => {
    const { count } = useCounter({
        stateSelectors: ['count'],
    });

    return (
        <p>
            <b>Count: </b>
            <span>{count}</span>
        </p>
    )
}

export default Counter;
