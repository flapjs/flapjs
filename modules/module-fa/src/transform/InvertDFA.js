import { dispatchEvent, Events } from '../FiniteAutomata.js';
import { copy } from '../Helper.js';

/**
 * @typedef {import('../FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 */

/**
 * @param {FiniteAutomata} dst 
 * @param {FiniteAutomata} src 
 * @returns {Promise<FiniteAutomata>}
 */
export async function invertDFA(dst, src) {
    copy(dst, src);

    let toBeOther = [];
    let toBeFinal = [];
    for(let q of dst.Q) {
        if (!dst.F.has(q)) {
            toBeFinal.push(q);
        } else {
            toBeOther.push(q);
        }
    }
    for(let q of toBeOther) {
        await dispatchEvent(dst, Events.StateUpdate, q, { final: false });
    }
    dst.F.clear();
    for(let f of toBeFinal) {
        await dispatchEvent(dst, Events.StateUpdate, f, { final: true });
        dst.F.add(f);
    }
    return dst;
}
