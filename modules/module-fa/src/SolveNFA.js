import { epsilonClosureFrom, readClosureFrom } from './Helper.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 * @typedef {import('./FiniteAutomata').Symbol<?>} Symbol
 */

const MAX_COMPUTATION_STEPS = 1_000;

/**
 * @param {FiniteAutomata} src
 * @param {Iterable<Symbol>} inputs
 * @return {Promise<boolean>}
 */
export async function solveNFA(src, inputs) {
    let cachedStates = [];
    let cachedSymbols = [];
    let output = new Set();

    let state = src.s;
    // NOTE: `index` refers to stack depth of computation
    cachedStates.push({ state, index: 0 });
    epsilonClosureFrom(output, src, state);
    for(let closed of output) {
        cachedStates.push({ state: closed, index: 0 });
    }

    let counter = 0;
    let i = 0;
    while(cachedStates.length > 0) {
        let symbol = inputs[i++];
        if (solveNFAStep(src, symbol, cachedStates, cachedSymbols)) {
            return true;
        }
        ++counter;
        if (counter > MAX_COMPUTATION_STEPS) {
            // ERROR: This took too many steps to compute.
            return false;
        }
    }
    return false;
}

function solveNFAStep(src, symbol, cachedStates, cachedSymbols) {
    if (symbol) {
        cachedSymbols.push(symbol);
    }
    let output = new Set();
    let nextStates = [];
    let nextIndex = 0;
    for(let cached of cachedStates) {
        let { state, index } = cached;
        symbol = index < cachedSymbols.length
            ? cachedSymbols[index]
            : null;
        if (symbol) {
            nextIndex = index + 1;
            readClosureFrom(output, src, state, symbol);
            for(let next of output) {
                nextStates.push({ state: next, index: nextIndex });
            }
            output.clear();
        } else {
            if (src.F.has(state)) {
                return true;
            }
        }

        nextIndex = index;
    }
    cachedStates.length = 0;
    cachedStates.push(...nextStates);
    return false;
}
