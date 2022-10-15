import { copy } from './Helper.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 */

/**
 * @param {FiniteAutomata} dst 
 * @param {FiniteAutomata} src 
 * @returns {Promise<FiniteAutomata>}
 */
export async function invertDFA(dst, src) {
    copy(dst, src);

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
    return dst;
}
