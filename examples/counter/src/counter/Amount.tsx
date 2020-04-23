import React from 'react';

import { useCounter } from './store';

const Amount: React.FC = () => {
    const { amount, setAmount } = useCounter({
        stateSelectors: ['amount'],
        actionSelectors: ['setAmount'],
    });

    const updateAmount = (event: any) => {
        setAmount(parseInt(event.target.value));
    }

    return (
        <p>
            <b>Amount:</b>
            <input type="number" value={amount} onChange={updateAmount} />
        </p>
    )
}

export default Amount;
