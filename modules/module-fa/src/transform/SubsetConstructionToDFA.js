import { dispatchEvent, Events } from '../FiniteAutomata.js';
import { epsilonClosureFrom, deriveStateFromSet, deriveSetFromState, startTransition, readTransitionFrom, endTransition, readClosureFrom } from '../Helper.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 */

/**
 * @param {FiniteAutomata} dst 
 * @param {FiniteAutomata} src 
 * @returns {Promise<FiniteAutomata>}
 */
export async function subsetConstructionToDFA(dst, src) {
    // Step 1
    let checked = new Set();
    let epsilonStates = new Set();
    epsilonClosureFrom(epsilonStates, src, src.s);
    // Step 2
    let s_ = await deriveStateFromSet(dst, src, epsilonStates, { propagateFinals: true });
    dst.s = s_;
    await dispatchEvent(dst, Events.StateUpdate, s_, { start: true });

    let unchecked = s_;
    let closed = new Set();
    while(unchecked) {
        checked.add(unchecked);
        deriveSetFromState(closed, src, unchecked);
        for(let a of src.A) {
            // Step X
            dst.A.add(a);
            await dispatchEvent(dst, Events.SymbolCreate, a);
            // Step X + 1
            let t = await startTransition(dst, unchecked, a);
            // Step X + 2
            let nextStates = new Set();
            for(let state of closed) {
                readClosureFrom(nextStates, src, state, a);
            }
            await dispatchEvent(src, 'readClosure', [...nextStates], { read: a });
            // Step X + 3
            let nextState = await deriveStateFromSet(dst, src, nextStates, { propagateFinals: true });
            // Step X + 4
            await endTransition(dst, t, nextState);
        }
        closed.clear();
        unchecked = null;
        for(let q of dst.Q) {
            if (!checked.has(q)) {
                unchecked = q;
                break;
            }
        }
    }

    return dst;
}
