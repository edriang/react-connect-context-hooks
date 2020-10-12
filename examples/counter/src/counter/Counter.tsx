import React from 'react';

import { useCounter } from './store';

const Counter: React.FC = ({ children }) => {
    const { count } = useCounter({
        stateSelectors: ['count'],
    });

    return (
        <div>
            <p>
                <b>Count: </b>
                <span>{count}</span>
            </p>
            Controls
            {children}
        </div>
    )
}

export default Counter;
