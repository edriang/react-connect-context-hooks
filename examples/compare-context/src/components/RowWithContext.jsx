import React from 'react';

import Row from './Row';
import { useContext } from '../context';

const ComponentWithContext = ({ name, index }) => {
    const { rows, setRowValue } = useContext();
    const setValue = (value) => setRowValue(index, value);

    return <Row value={rows[index]} setValue={setValue} name={name} />
}

export default ComponentWithContext;
