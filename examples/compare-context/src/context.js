import React from 'react';

import { rows as rowsData } from './constants';

const Context = React.createContext({});

const useContext = () => React.useContext(Context);

export default (props) => {
    const [rows, setRows] = React.useState(rowsData);
    const setRowValue = (index, row) => {
        rows[index] = row;

        setRows(rows.slice(0));
    }

    const value = {
        rows,
        setRowValue,
    };

    return <Context.Provider value={value} {...props}></Context.Provider>
};

export {
    useContext,
};
