import React from 'react';

import './Switch.css';

type SwitchProps = {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => (
    <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
    </label>
);

export default Switch;
