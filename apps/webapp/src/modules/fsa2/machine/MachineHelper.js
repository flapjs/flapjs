import { Builder, subsetConstructionToDFA, invertDFA as transform } from '@flapjs/module-fa';
import { graphToNFA } from '../transformer/FiniteAutomataGraph';

import GraphLayout from '../GraphLayout';

/**
 * @param {import('./MachineController').default} machineController 
 */
export async function convertToDFA(machineController) {
    let src = graphToNFA(machineController.graphController);
    let dst = Builder.fromIdentity(src).build();
    await subsetConstructionToDFA(dst, src);

    GraphLayout.applyLayout(machineController.graphController.getGraph());
    machineController.setMachineType('DFA');

    /*
    // Original
    const result = transform1(machineController.getMachineBuilder().getMachine());
    machineController.setGraphToMachine(machineController.graphController.getGraph(), result);
    machineController.setMachineType('DFA');
    */
}

export async function invertDFA(machineController) {
    let src = graphToNFA(machineController.graphController);
    let dst = Builder.fromIdentity(src).build();
    await transform(dst, src);
}
