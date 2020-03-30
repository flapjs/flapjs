import React from 'react';

import MachineService from '@flapjs/deprecated/services/machine/MachineService.js';

class RenameAlphabetSymbolSection extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            oldSymbol: '',
            newSymbol: ''
        };

        this.handleRenameOldSymbolChange = this.handleRenameOldSymbolChange.bind(this);
        this.handleRenameNewSymbolChange = this.handleRenameNewSymbolChange.bind(this);
        this.onRenameSymbol = this.onRenameSymbol.bind(this);
    }

    handleRenameOldSymbolChange(e)
    {
        this.setState({ oldSymbol: e.target.value });
    }

    handleRenameNewSymbolChange(e)
    {
        this.setState({ newSymbol: e.target.value });
    }

    onRenameSymbol(machineController)
    {
        let oldSymbol = this.state.oldSymbol || machineController.getMachine().getAlphabet()[0];
        let newSymbol = this.state.newSymbol;
        machineController.renameSymbol(oldSymbol, newSymbol);
    }

    /** @override */
    render()
    {
        const state = this.state;

        return (
            <MachineService.CONTEXT.StateConsumer>
                {
                    machineService =>
                    {
                        const alphabet = machineService.machineController.getMachine().getAlphabet();
                        const canRenameSymbol = state.newSymbol && (state.oldSymbol || alphabet[0]) != state.newSymbol;
                        return (
                            <fieldset>
                                <legend>Rename alphabet symbol</legend>
                                <p>
                                    <select
                                        value={this.state.renameOldSymbol || alphabet[0]}
                                        onChange={this.handleRenameOldSymbolChange}
                                        onBlur={this.handleRenameOldSymbolChange}>
                                        {
                                            alphabet.map(e =>
                                                <option key={e}>{e}</option>
                                            )
                                        }
                                    </select>
                                    <span>{'=>'}</span>
                                    <input type="text"
                                        value={this.state.renameNewSymbol}
                                        onChange={this.handleRenameNewSymbolChange}/>
                                </p>
                                <button onClick={e => this.onRenameSymbol(machineService.machineController)}
                                    disabled={!canRenameSymbol}>
                                    Apply
                                </button>
                            </fieldset>
                        );
                    }
                }
            </MachineService.CONTEXT.StateConsumer>
        );
    }
}

export default RenameAlphabetSymbolSection;
