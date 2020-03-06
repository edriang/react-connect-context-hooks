import React from 'react';

const Component = ({ value, setValue, name }) => {
    const updateValue = () => {
        setValue(`Updated at: ${Date.now()}`);
    }
    // console.log(`${name} rendered`);

    return (
        <tr>
            <td>
                <strong style={{whiteSpace: 'nowrap'}}>{name}</strong>
            </td>
            <td>
                <strong>Rendered at: {Date.now()}</strong>
            </td>
            <td>
                <button style={{whiteSpace: 'nowrap'}} className="btn btn-primary btn-sm" onClick={updateValue}>Update value</button>
            </td>
        </tr>
        
    )
}

export default Component;
