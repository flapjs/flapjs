import { dispatchEvent, Events, State, Transition } from './FiniteAutomata.js';

/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 * @typedef {import('./FiniteAutomata').Symbol} Symbol
 */

/**
 * @param {Set<State>} out 
 * @param {FiniteAutomata} src
 * @param {State} state 
 * @param {Symbol} symbol 
 */
export function readTransitionFrom(out, src, state, symbol) {
    if (!src || !state || !symbol) {
        return;
    }
    for(let t of src.T) {
        if (t.from === state && t.read === symbol) {
            out.add(t.to);
        }
    }
}

/**
 * @param {Set<State>} out 
 * @param {FiniteAutomata} src
 * @param {State} state 
 */
export function epsilonClosureFrom(out, src, state) {
    if (!src || !state) {
        return;
    }
    let size = 0;
    let attempted = new Set();
    readTransitionFrom(out, src, state, src.EPSILON);
    out.add(state);
    attempted.add(state);
    while (size !== out.size) {
        size = out.size;
        for(let s of out) {
            if (attempted.has(s)) {
                continue;
            }
            readTransitionFrom(out, src, s, src.EPSILON);
            attempted.add(s);
        }
    }
}

/**
 * @param {Set<State>} out 
 * @param {FiniteAutomata} src
 * @param {State} state 
 * @param {Symbol} symbol
 */
export function readClosureFrom(out, src, state, symbol) {
    if (!src || !state || !symbol) {
        return;
    }
    readTransitionFrom(out, src, state, symbol);
    let closed = new Set();
    for(let s of out) {
        epsilonClosureFrom(closed, src, s);
    }
    for(let s of closed) {
        out.add(s);
    }
}

/**
 * @param {FiniteAutomata} dst
 * @param {State} from
 * @param {Symbol} read
 */
export async function startTransition(dst, from, read) {
    let transition = new Transition(from.parent, null, from, read, null);
    await dispatchEvent(dst, Events.TransitionCreate, transition);
    dst.T.add(transition);
    return transition;
}

/**
 * @param {FiniteAutomata} dst 
 * @param {Transition} transition 
 * @param {State} to
 */
export async function endTransition(dst, transition, to) {
    transition.to = to;
    await dispatchEvent(dst, Events.TransitionUpdate, transition, { to: to });
    return transition;
}

/**
 * @param {FiniteAutomata} dst
 * @param {FiniteAutomata} src
 * @param {Set<State>} states
 * @param {object} [opts]
 * @param {boolean} [opts.propagateFinals]
 */
export async function deriveStateFromSet(dst, src, states, opts = {}) {
    const { propagateFinals = false } = opts;
    /** @type {Set<State>} */
    let stateSet = new Set();
    let final = false;
    for(let state of states) {
        deriveSetFromState(stateSet, src, state);
        if (src.F.has(state)) {
            final = true;
        }
    }
    let nameList = [...stateSet].map(s => s.name);
    let name = `{${nameList.sort().join(',')}}`;
    let result = findStateByName(dst, name);
    if (!result) {
        result = new State(dst, null, name);
        await dispatchEvent(dst, Events.StateCreate, result, { derivedFrom: [...stateSet] });
        dst.Q.add(result);
        // If any states are final, make this final too...
        if (propagateFinals && final) {
            await dispatchEvent(dst, Events.StateUpdate, result, { final })
            dst.F.add(result);
        }
    }
    return result;
}

/**
 * @param {FiniteAutomata} dst 
 * @param {FiniteAutomata} src 
 * @param {Array<State>} states
 * @param {object} [opts]
 * @param {boolean} [opts.propagateFinals]
 */
export async function deriveStateFromTuple(dst, src, states, opts = {}) {
    const { propagateFinals = false } = opts;
    /** @type {Array<State>} */
    let stateTuple = [];
    let final = false;
    for(let state of states) {
        deriveTupleFromState(stateTuple, src, state);
        if (src.F.has(state)) {
            final = true;
        }
    }
    let nameList = stateTuple.map(s => s.name);
    let name = `(${nameList.sort().join(',')})`;
    let result = findStateByName(dst, name);
    if (!result) {
        result = new State(dst, null, name);
        await dispatchEvent(dst, Events.StateCreate, result, { derivedFrom: [...stateTuple] });
        dst.Q.add(result);
        // If any states are final, make this final too...
        if (propagateFinals && final) {
            await dispatchEvent(dst, Events.StateUpdate, result, { final })
            dst.F.add(result);
        }
    }
    return result;
}

/**
 * @param {Set<State>} out
 * @param {FiniteAutomata} src
 * @param {State} state 
 */
export function deriveSetFromState(out, src, state) {
    if (!state.name.startsWith('{') || !state.name.endsWith('}')) {
        out.add(state);
    } else {
        let names = state.name.substring(1, state.name.length - 1);
        let nameList = names.split(',').map(s => s.trim());
        for(let name of nameList) {
            if (!name) continue;
            let state = findStateByName(src, name);
            if (!state) {
                throw new Error(`Cannot find state with name '${name}'.`);
            }
            out.add(state);
        }
    }
    return out;
}

/**
 * @param {Array<State>} out
 * @param {FiniteAutomata} src
 * @param {State} state 
 */
export function deriveTupleFromState(out, src, state) {
    if (!state.name.startsWith('(') || !state.name.endsWith(')')) {
        return out;
    } else {
        let names = state.name.substring(1, state.name.length - 1);
        let nameList = names.split(',').map(s => s.trim());
        for(let name of nameList) {
            if (!name) continue;
            let state = findStateByName(src, name);
            if (!state) {
                throw new Error(`Cannot find state with name '${name}'.`);
            }
            out.push(state);
        }
    }
    return out;
}

/**
 * @param {FiniteAutomata} dst 
 * @param {FiniteAutomata} src 
 */
export function copy(dst, src) {
    if (dst === src) {
        return;
    }
    for(let q of src.Q) {
        dst.Q.add(q);
    }
    for(let a of src.A) {
        dst.A.add(a);
    }
    for(let t of src.T) {
        dst.T.add(t);
    }
    dst.s = src.s;
    for(let f of src.F) {
        dst.F.add(f);
    }
}

/**
 * @param {FiniteAutomata} src 
 * @param {string} name 
 * @returns {State}
 */
export function findStateByName(src, name) {
    for(let q of src.Q) {
        if (q.name === name) {
            return q;
        }
    }
    return null;
}

/**
 * @param {FiniteAutomata} src 
 * @param {string} name 
 * @returns {Symbol}
 */
export function findSymbolByName(src, name) {
    for(let a of src.A) {
        if (a.name === name) {
            return a;
        }
    }
    return null;
}
