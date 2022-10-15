```js
// ATTEMPT 4
import { SYMBOL_SEPARATOR } from '../graph/element/FSAEdge';

/**
 * @typedef {import('../graph/FSAGraphController').default} GraphController
 * @typedef {import('../graph/FSAGraph').default} Graph
 * @typedef {import('../graph/element/FSAEdge').default} Edge
 * @typedef {import('../graph/element/FSANode').default} Node
 */

/**
 * This converts an NFA into DFA using subset construction. But this can be animated! :D
 * 
 * @param {GraphController} graphController 
 * @param {import('../machine/MachineController').default} machineController
 */
export async function transform(graphController, machineController) {
    let src = graphToNFA(graphController);
    let dst = deriveNFA(src);

    // Step 1
    let checked = new Set();
    let epsilonStates = new Set();
    epsilonClosureFrom(epsilonStates, src, src.s);
    await animate(dst, 'closure', { targets: [...epsilonStates] });
    // Step 2
    let s_ = deriveStateFromSet(dst, src, epsilonStates);
    await animate(dst, 'derive', { targets: [s_, ...epsilonStates] });

    let uncheckedState = s_;
    while(uncheckedState) {
        checked.add(uncheckedState);
        let closedStates = new Set();
        deriveSetFromState(closedStates, src, uncheckedState);
        for(let a of src.A) {
            // Step X
            await animate(dst, 'forEach', { targets: [a] });
            // Step X + 1
            let t = startTransition(dst, uncheckedState, a);
            await animate(dst, 'startTransition', { targets: [t] });
            // Step X + 2
            let nextStates = new Set();
            for(let state of closedStates) {
                transitionFrom(nextStates, src, state, a);
            }
            let nextStatesWithClosure = new Set(nextStates);
            for(let state of nextStates) {
                epsilonClosureFrom(nextStatesWithClosure, src, state);
            }
            await animate(dst, 'closure', { targets: [...nextStatesWithClosure] });
            // Step X + 3
            let nextState = deriveStateFromSet(dst, src, nextStatesWithClosure);
            await animate(dst, 'derive', { targets: [nextState, ...nextStatesWithClosure] });
            // Step X + 4
            endTransition(dst, t, nextState);
            await animate(dst, 'endTransition', { targets: [t] });
        }
        uncheckedState = null;
        for(let state of dst.Q) {
            if (!checked.has(state)) {
                uncheckedState = state;
                break;
            }
        }
    }

    machineController.setMachineType('NFA');
}

/**
 * @typedef {ReturnType<graphToNFA>} NFA
 */

/**
 * @param {NFA} dst
 * @param {FlapState} from
 * @param {FlapSymbol} symbol
 */
function startTransition(dst, from, symbol) {
    let graph = /** @type {Graph} */ (dst.ctx.graph);
    let edge = /** @type {Edge} */ (graph.createEdge(from.source));
    edge.setEdgeLabel(symbol.name);
    let t = new FlapTransition(dst, edge, from, symbol, null);
    dst.T.add(t);
    return t;
}

/**
 * @param {NFA} dst 
 * @param {FlapTransition} t 
 * @param {FlapState} to
 */
function endTransition(dst, t, to) {
    t.to = to;
    let edge = t.source;
    edge.setEdgeTo(to.source);
    return t;
}

/**
 * @param {NFA} dst
 * @param {Set<FlapState>} states
 */
function deriveStateFromSet(dst, src, states) {
    /** @type {Set<FlapState>} */
    let stateSet = new Set();
    for(let state of states) {
        deriveSetFromState(stateSet, src, state);
    }
    let idSet = [...stateSet].map(s => s.name);
    let idString = `{ ${idSet.sort().join(', ')} }`;
    let state = findStateByName(dst, idString);
    if (!state) {
        let graph = /** @type {Graph} */ (dst.ctx.graph);
        let node = graph.createNode();
        node.setNodeLabel(idString);
        state = new FlapState(dst, node, idString);
        dst.Q.add(state);
    }
    return state;
}

/**
 * @param {Set<FlapState>} out
 * @param {NFA} src
 * @param {FlapState} state 
 */
function deriveSetFromState(out, src, state) {
    if (!state.name.startsWith('{') || !state.name.endsWith('}')) {
        out.add(state);
    } else {
        let idString = state.name.substring(1, state.name.length - 1);
        let idSet = idString.split(',').map(s => s.trim());
        for(let id of idSet) {
            if (!id) continue;
            let state = findStateByName(src, id);
            if (!state) {
                throw new Error(`Cannot find state with name '${id}'.`);
            }
            out.add(state);
        }
    }
}

/**
 * @param {NFA} src 
 * @param {string} name 
 * @returns {FlapState}
 */
function findStateByName(src, name) {
    for(let q of src.Q) {
        if (q.name === name) {
            return q;
        }
    }
    return null;
}

/**
 * @param {NFA} src 
 * @returns {NFA}
 */
function deriveNFA(src) {
    /** @type {FlapState} */
    let s = null;
    /** @type {Set<FlapState>} */
    let Q = new Set();
    /** @type {Set<FlapSymbol>} */
    let A = new Set();
    /** @type {Set<FlapTransition>} */
    let T = new Set();
    /** @type {Set<FlapState>} */
    let F = new Set();
    return {
        Q, A, T, s, F,
        /** @type {FlapSymbol} */
        EPSILON: src.EPSILON,
        ctx: src.ctx,
    };
}

/**
 * @param {GraphController} graphController
 */
function graphToNFA(graphController) {
    let graph = /** @type {Graph} */ (graphController.getGraph());
    let dst = {
        /** @type {Set<FlapState>} */
        Q: new Set(),
        /** @type {Set<FlapSymbol>} */
        A: new Set(),
        /** @type {Set<FlapTransition>} */
        T: new Set(),
        /** @type {FlapState} */
        s: null,
        /** @type {Set<FlapState>} */
        F: new Set(),
        /** @type {FlapSymbol} */
        EPSILON: null,
        ctx: {
            graphController,
            graph,
            animations: [],
        }
    };
    let nodeMapping = new Map();
    let symbolMapping = new Map();

    let i = 0;
    let startNode = graph.getStartNode();
    dst.s = new FlapState(dst, startNode, `q${i++}`);
    dst.Q.add(dst.s);
    nodeMapping.set(startNode, dst.s);
    for(let node of graph.getNodes()) {
        if (node === startNode) {
            continue;
        }
        let q = new FlapState(dst, node, `q${i++}`);
        dst.Q.add(q);
        if (node.getNodeAccept()) {
            dst.F.add(q);
        }
        nodeMapping.set(node, q);
    }

    let tuples = [];
    for(let edge of graph.getEdges()) {
        let fromNode = edge.getEdgeFrom();
        let toNode = edge.getEdgeTo();
        let symbols = edge.getEdgeLabel()
            .split(SYMBOL_SEPARATOR)
            .map(s => s.toLowerCase().trim());
        for(let symbolName of symbols) {
            let flag = true;
            for(let [tupleFrom, tupleSymbol, tupleTo, _] of tuples) {
                if (fromNode === tupleFrom &&
                    symbolName === tupleSymbol &&
                    toNode === tupleTo) {
                    flag = false;
                    break;
                }
            }
            // Not a duplicate.
            if (flag) {
                tuples.push([fromNode, symbolName, toNode, edge]);
            }
        }
    }

    let epsilon = new FlapSymbol(dst, 'epsilon');
    for(let [fromNode, symbolName, toNode, edge] of tuples) {
        let a;
        if (symbolName === 'ε') {
            a = epsilon;
        } else if (!symbolMapping.has(symbolName)) {
            a = new FlapSymbol(dst, symbolName);
            symbolMapping.set(symbolName, a);
            dst.A.add(a);
        } else {
            a = symbolMapping.get(symbolName);
        }
        let t = new FlapTransition(dst, edge,
            nodeMapping.get(fromNode), a, nodeMapping.get(toNode));
        dst.T.add(t);
    }

    dst.EPSILON = epsilon;
    return dst;
}

/**
 * @param {Set<FlapState>} out 
 * @param {NFA} src
 * @param {FlapState} state 
 */
function epsilonClosureFrom(out, src, state) {
    if (!src || !state) {
        return;
    }
    let size = 0;
    let attempted = new Set();
    transitionFrom(out, src, state, src.EPSILON);
    out.add(state);
    attempted.add(state);
    while (size !== out.size) {
        size = out.size;
        for(let s of out) {
            if (attempted.has(s)) {
                continue;
            }
            transitionFrom(out, src, s, src.EPSILON);
            attempted.add(s);
        }
    }
}

/**
 * @param {Set<FlapState>} out 
 * @param {NFA} src
 * @param {FlapState} state 
 * @param {FlapSymbol} symbol 
 */
function transitionFrom(out, src, state, symbol) {
    if (!src || !state || !symbol) {
        return;
    }
    for(let t of src.T) {
        if (t.from === state && t.symbol === symbol) {
            out.add(t.to);
        }
    }
}

async function waitStep(time = 1_000) {
    return new Promise((resolve, _) => setTimeout(resolve, time));
}

/**
 * 
 * @param {NFA} machine 
 * @param {string} action 
 * @param {object} options 
 */
async function animate(machine, action, options) {
    machine.ctx.animations.push({
        action,
        options,
    });
    machine.ctx.graphController.clearTargets();
    for(let target of options.targets) {
        if (target instanceof FlapSymbol) {
            // TODO: How to render symbol animations?
            continue;
        } else {
            machine.ctx.graphController.addTarget(target.source);
        }
    }
    await waitStep();
}

class FlapState {
    /**
     * @param {NFA} machine
     * @param {Node} node 
     * @param {string} name 
     */
    constructor(machine, node, name) {
        this.machine = machine;
        this.source = node;
        this.name = name;
    }

    /**
     * @param {FlapState} other 
     * @returns {number}
     */
    compareTo(other) {
        if (other instanceof FlapState) {
            return this.name.localeCompare(other.name);
        } else {
            return -1;
        }
    }
}

class FlapTransition {
    /**
     * @param {NFA} machine
     * @param {Edge} edge 
     * @param {FlapState} from 
     * @param {FlapSymbol} symbol 
     * @param {FlapState} to 
     */
    constructor(machine, edge, from, symbol, to) {
        this.machine = machine;
        this.source = edge;
        this.from = from;
        this.symbol = symbol;
        this.to = to;
    }

    /**
     * @param {FlapTransition} other 
     * @returns {number}
     */
    compareTo(other) {
        if (other instanceof FlapTransition) {
            let f = this.from.name.localeCompare(other.from.name);
            let s = this.symbol.name.localeCompare(other.symbol.name);
            let t = this.to.name.localeCompare(other.to.name);
            if (f !== 0 || s !== 0 || t !== 0) {
                return Math.max(f, s, t);
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }
}

class FlapSymbol {
    /**
     * @param {NFA} machine
     * @param {string} name 
     */
    constructor(machine, name) {
        this.machine = machine;
        this.name = name;
    }

    /**
     * @param {FlapSymbol} other 
     * @returns {number}
     */
    compareTo(other) {
        if (other instanceof FlapSymbol) {
            return this.name.localeCompare(other.name);
        } else {
            return -1;
        }
    }
}
```


```js
// ATTEMPT 3
const EPSILON = Symbol('epsilon');

/**
 * @param {FlapSet} out 
 * @param {*} P 
 * @param {object} state 
 * @param {string|Symbol} symbol 
 */
function transitionFrom(out, P, state, symbol) {
    let [Q, A, T, s, F] = P;
    let t = findMatchingTuple(T, state, symbol);
    if (t) {
        let states = t[2];
        out.addAll(states);
    }
}

/**
 * @param {FlapSet} out 
 * @param {*} P 
 * @param {object} state 
 */
function epsilonClosureFrom(out, P, state) {
    let size = 0;
    while (size !== out.size()) {
        size = out.size();
        transitionFrom(out, P, state, EPSILON);
    }
}

function stateOf(label) {
    return new FlapObject('state', label);
}

function transitionOf(from, symbol, to) {
    return new FlapTuple(from, symbol, to);
}

// ATTEMPT 3
function subsetConstructionNFAToDFA(ctx, P, P_) {
    let [Q, A, T, s, F] = P;
    let [Q_, A_, T_, s_, F_] = P_;
    A_.addAll(A);
    let stateClosures = new FlapMap();
    let checked = new FlapSet();
    {
        let epsilonStates = new FlapSet();
        epsilonClosureFrom(epsilonStates, P, s);
        s_ = stateOf(epsilonStates);
        stateClosures.set(s_, epsilonStates);
        Q_.add(s_);
    }

    let uncheckedState = new FlapRef();
    uncheckedState.set(s_);
    while(!uncheckedState.empty()) {
        checked.add(uncheckedState.get());
        let closedStates = stateClosures.get(uncheckedState.get());
        for(let i of A) {
            let t = transitionOf(uncheckedState.get(), i, null);
            let nextStates = new FlapSet();
            for(let state of closedStates) {
                transitionFrom(nextStates, P, state, i);
            }
            let nextStatesWithClosure = new FlapSet();
            nextStatesWithClosure.addAll(nextStates);
            for(let state of nextStates) {
                epsilonClosureFrom(nextStatesWithClosure, P, state);
            }
            let nextState = stateOf(nextStatesWithClosure);
            stateClosures.set(nextState, nextStatesWithClosure);
            t[2] = nextState;
            Q_.add(nextState);
            T_.add(t);
        }
        uncheckedState.clear();
        for(let state of Q_) {
            if (!checked.has(state)) {
                uncheckedState.set(state);
                break;
            }
        }
    }
}
```

```js
// ATTEMPT 2
in P = NFA(Q, A, T, s, F)
out Q = NFA(Q', A, T', s', F')

let stateClosures = Map[]

let checked = {}
{
    let epsilonStates = {}
    epsilonClosure(epsilonStates, P, s)
    s' = stateFromStates(epsilonStates)
    stateClosures[s'] = epsilonStates
    add(Q', s')
}

let uncheckedState = **
uncheckedState = s'

while !empty(uncheckedState) {
    add(checked, uncheckedState)
    let closedStates = stateClosures[uncheckedState]
    for let i of A {
        let t = Transition(uncheckedState, i, null)
        let nextStates = {}
        for let state of closedStates {
            readTransition(nextStates, P, state, i)
        }
        let nextStatesWithClosure = nextStates
        for let state of nextStates {
            epsilonClosure(nextStatesWithClosure, P, state)
        }
        let nextState = stateFromStates(nextStatesWithClosure)
        stateClosures[nextState] = nextStatesWithClosure
        t[2] = nextState
        add(Q', nextState)
        add(T', t)
    }
    uncheckedState = null
    for let state of Q' {
        if !contains(checked, state) {
            uncheckedState = state
            break;
        }
    }
}
```

```JS
// ATTEMPT 1
export function subsetConstructionNFAToDFA(ctx, nfa) {
    let alphabet = allocateSet(ctx, 'alphabet');
    getAlphabet(ctx, alphabet, nfa);
    let startState = allocatePointer(ctx, 'startState');
    getStartState(ctx, startState, nfa);

    let result = constructNFA(ctx);

    let checked = allocateSet(ctx, 'checked');
    let epsilonStates = allocateSet(ctx, 'epsilonStates');
    epsilonClosureOf(ctx, epsilonStates, nfa, startState);
    let resultEpsilonState = constructStateFromStates(ctx, result, nfa, epsilonStates);
    constructStartState(ctx, result, resultEpsilonState);
    deallocateSet(ctx, epsilonStates);
    
    let resultStates = allocateNFAStates(ctx, 'states\'');

    let resultUncheckedState = allocatePointer(ctx, 'uncheckedState');
    resultUncheckedState.set(resultEpsilonState);

    do {
        checked.add(resultUncheckedState.get());
        let stateStates = allocateSet(ctx, 'setOfStates');
        unwrapStateFromStates(ctx, stateStates, result, resultUncheckedState.get());
        for(let symbol of alphabet) {
            let resultNextTransition = constructTransitionFrom(ctx, result, resultUncheckedState.get());
            constructTransitionSymbol(ctx, result, resultNextTransition, symbol);
            let nextStates = allocateSet(ctx, 'nextStates');
            for(let state of stateStates) {
                readTransitionsFrom(ctx, nextStates, nfa, state, symbol);
            }
            let nextStatesWithClosure = allocateSet(ctx, 'nextStatesWithClosure');
            for(let state of nextStates) {
                epsilonClosureOf(ctx, nextStatesWithClosure, nfa, state);
            }
            let resultNextState = constructStateFromStates(ctx, result, nfa, nextStatesWithClosure);
            constructTransitionTo(ctx, result, resultNextTransition, resultNextState);
        }
        resultUncheckedState.clear();
        for(let state of resultStates) {
            if (!checked.contains(state)) {
                resultUncheckedState.set(state);
                break;
            }
        }
    } while(!resultUncheckedState.empty())
}
```
