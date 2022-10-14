```js
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
