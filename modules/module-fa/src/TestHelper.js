import assert from 'assert';

import { findSymbolByName } from './Helper.js';
import { solveDFA, solveNFA } from './compute/index.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 */

/**
 * @param {FiniteAutomata} src
 * @param {string} string
 */
export function stringToSymbols(src, string) {
    let result = [];
    let strings = string.split('');
    for(let s of strings) {
        let symbol = findSymbolByName(src, s);
        if (!symbol) {
            throw new Error(`Cannot find symbol by name '${s}'.`);
        }
        result.push(symbol);
    }
    return result;
}

/**
 * @param {string} inputString
 * @param {FiniteAutomata} src
 */
 export async function assertDFAAccepts(inputString, src) {
    let inputs = stringToSymbols(src, inputString);
    let result = await solveDFA(src, inputs);
    assert(result);
}

/**
 * @param {string} inputString 
 * @param {FiniteAutomata} src 
 */
export async function assertDFARejects(inputString, src) {
    let inputs = stringToSymbols(src, inputString);
    let result = await solveDFA(src, inputs);
    assert(!result);
}

/**
 * @param {string} inputString
 * @param {FiniteAutomata} src
 */
export async function assertNFAAccepts(inputString, src) {
    let inputs = stringToSymbols(src, inputString);
    let result = await solveNFA(src, inputs);
    assert(result);
}

/**
 * @param {string} inputString 
 * @param {FiniteAutomata} src 
 */
export async function assertNFARejects(inputString, src) {
    let inputs = stringToSymbols(src, inputString);
    let result = await solveNFA(src, inputs);
    assert(!result);
}
