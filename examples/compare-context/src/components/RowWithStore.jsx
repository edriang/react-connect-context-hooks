import React from 'react';

import Row from './Row';
import { withStore } from '../store';

const ComponentWithStore = withStore(Row, {
    stateSelectors: {
        value: ({ rows }, { index }) => rows[index],
        name: 'name',
    },
    actionSelectors: {
        setValue: ({ setRowValue }, { index }) => {
            return (value) => setRowValue(index, value);
        },
    },
});

export default ComponentWithStore;
