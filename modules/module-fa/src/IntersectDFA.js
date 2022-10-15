import { readTransitionFrom } from './Helper.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 * @typedef {import('./FiniteAutomata').State<?>} State
 */

/**
 * @param {FiniteAutomata} dst 
 * @param {FiniteAutomata} src1
 * @param {FiniteAutomata} src2
 */
export async function intersectDFA(dst, src1, src2) {
    throw new Error('Unsupported operation.');

    let pairs = new Map();
    let finalPairs = [];
    let transitions = [];

    for(let a of src1.A) {
        dst.A.add(a);
        if (!src2.A.has(a)) {
            throw new Error('Cannot intersect DFA with non-matching alphabet.');
        }
    }
    for(let a of src2.A) {
        if (!src1.A.has(a)) {
            throw new Error('Cannot intersect DFA with non-matching alphabet.');
        }
    }

    /** @type {[State, State]} */
    let startPair = [src1.s, src2.s];
    pairs.set(startPair[0], startPair[1]);
    if (src1.F.has(src1.s) && src2.F.has(src2.s)) {
        finalPairs.push(startPair);
    }

    /** @type {Array<[State, State]>} */
    let remainingPairs = [];
    remainingPairs.push(startPair);
    while(remainingPairs.length > 0) {
        /** @type {[State, State]} */
        let [p0, p1] = remainingPairs.pop();
        let out = new Set();
        for(let a of dst.A) {
            let state0, state1;

            readTransitionFrom(out, src1, p0, a);
            if (out.size !== 1) {
                throw new Error(`Found non-deterministic transition from ${p0} for ${a} to ${[...out].join(',')}`);
            }
            state0 = out.values().next().value;
            out.clear();

            readTransitionFrom(out, src2, p1, a);
            if (out.size !== 1) {
                throw new Error(`Found non-deterministic transition from ${p1} for ${a} to ${[...out].join(',')}`);
            }
            state1 = out.values().next().value;
            out.clear();

            // Get cartesian-product equivalent
            let newPair = [state0, state1];
        }
    }


    let toBeFinal = [];
    for(let q of dst.Q) {
        if (!dst.F.has(q)) {
            toBeFinal.push(q);
        }
    }
    dst.F.clear();
    for(let f of toBeFinal) {
        dst.F.add(f);
    }
}
