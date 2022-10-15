// import { convertToDFA as transform1 } from './FSAUtils';
// import { transform as transform2 } from '../transformer/ConvertToDFA';
import { Builder, subsetConstructionToDFA as transform3 } from '@flapjs/module-fa';
import { graphToNFA } from '../transformer/FiniteAutomataGraph';

/**
 * @param {import('./MachineController').default} machineController 
 */
export async function convertToDFA(machineController) {
    let src = graphToNFA(machineController.graphController);
    let dst = Builder.fromIdentity(src).build();
    await transform3(dst, src);

    /*
    // Original
    const result = transform1(machineController.getMachineBuilder().getMachine());
    machineController.setGraphToMachine(machineController.graphController.getGraph(), result);
    machineController.setMachineType('DFA');
    */

    /*
    // Attempt 2
    transform(this.graphController, this);
    */
}
