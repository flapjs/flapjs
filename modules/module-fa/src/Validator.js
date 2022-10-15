/**
 * @typedef {import('./FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 * @typedef {import('./FiniteAutomata').State<?>} State
 */

/**
 * @param {FiniteAutomata} dst 
 */
export function dedupeTransitions(dst) {
    let deduped = [];
    for(let t of dst.T) {
        let flag = true;
        for(let s of deduped) {
            if (t.from === s.from
                || t.read === s.read
                || t.to === s.to) {
                flag = false;
                break;
            }
        }
        if (flag) {
            deduped.push(t);
        }
    }
    dst.T.clear();
    for(let t of deduped) {
        dst.T.add(t);
    }
}

/**
 * @param {FiniteAutomata} src 
 */
export function testIncompleteTransitions(src) {
    /** @type {Map<string, Array<State>>} */
    let names = new Map();
    for(let state of src.Q) {
        if (!names.has(state.name)) {
            names.set(state.name, [state]);
        } else {
            let states = names.get(state.name);
            states.push(state);
        }
    }
    let result = [];
    for(let [name, states] of names.entries()) {
        if (states.length > 1) {
            result.push({
                type: 'dupeState',
                name,
                nodes: states.map(state => state.key),
            });
        }
    }
    return result;
}

/**
 * @param {FiniteAutomata} src 
 */
export function testDuplicateStates(src) {
    /** @type {Map<string, Array<State>>} */
    let names = new Map();
    for(let state of src.Q) {
        if (!names.has(state.name)) {
            names.set(state.name, [state]);
        } else {
            let states = names.get(state.name);
            states.push(state);
        }
    }
    let result = [];
    for(let [name, states] of names.entries()) {
        if (states.length > 1) {
            result.push({
                type: 'dupeState',
                name,
                nodes: states.map(state => state.key),
            });
        }
    }
    return result;
}
