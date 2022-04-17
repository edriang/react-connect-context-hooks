import React from 'react';

import { useCounter } from './store';

type Props = {
    children: React.ReactNode;
};

const Counter: React.FC<Props> = ({ children }) => {
    const { count } = useCounter({
        stateSelectors: ['count'],
    });

    return (
        <div>
            <p>
                <b>Count: </b>
                <span>{count}</span>
            </p>
            {children}
        </div>
    )
}

export default Counter;
