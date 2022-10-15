import { readTransitionFrom } from './Helper.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 * @typedef {import('./FiniteAutomata').Symbol<?>} Symbol
 */

/**
 * @param {FiniteAutomata} src
 * @param {Iterable<Symbol>} inputs
 * @return {Promise<boolean>}
 */
export async function solveDFA(src, inputs) {
    let output = new Set();
    let state = src.s;
    for(let symbol of inputs) {
        readTransitionFrom(output, src, state, symbol);
        if (output.size < 1) {
            // ERROR: Found a non-existent state after read!
            return false;
        }
        // DFA should ALWAYS transition to only 1 other state.
        state = output.values().next().value;
        output.clear();
    }
    return src.F.has(state);
}
