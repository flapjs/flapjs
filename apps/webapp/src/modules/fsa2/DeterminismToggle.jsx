import React from 'react';

export function DeterminismToggle(props) {
    const { app, module } = props;
    const machineController = module.getMachineController();
    return (
        <select
            onChange={(e) => {
                machineController.setMachineType(e.target.value);
            }}
            value={machineController.getMachineType()}>
            <option value="DFA">DFA</option>
            <option value="NFA">NFA</option>
        </select>
    )
}
