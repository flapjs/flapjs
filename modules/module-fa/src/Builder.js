import { State, Symbol, Transition, createFiniteAutomata } from './FiniteAutomata.js';

/**
 * @template Attachment
 * @typedef {import('./FiniteAutomata').FiniteAutomata<Attachment>} FiniteAutomata
 */

/**
 * @template Attachment
 * @typedef {import('./FiniteAutomata').FiniteAutomataEvent<Attachment>} FiniteAutomataEvent
 */

/**
 * @template Attachment
 * @typedef {import('./FiniteAutomata').FiniteAutomataEventHandler<Attachment>} FiniteAutomataEventHandler
 */

/**
 * @template Attachment
 * @template StateKey
 * @template SymbolKey
 * @template TransitionKey
 */
export class Builder {
    /**
     * @template Attachment
     * @param {FiniteAutomata<Attachment>} src 
     */
    static from(src) {
        let builder = new Builder(src.handler, src.attachment);
        builder.startState(src.s);
        builder.epsilon(src.EPSILON);
        for(let q of src.Q) {
            builder.state(q.key, q.name);
        }
        for(let a of src.A) {
            builder.symbol(a.key, a.name);
        }
        for(let t of src.T) {
            builder.transition(t.key,
                t.from ? t.from.key : undefined,
                t.read ? t.read.key : undefined,
                t.to ? t.to.key : undefined);
        }
        for(let f of src.F) {
            builder.finalState(f.key);
        }
        return builder;
    }

    /**
     * @template Attachment
     * @param {FiniteAutomata<Attachment>} src 
     */
    static fromIdentity(src) {
        return new Builder(src.handler, src.attachment);
    }

    /**
     * @param {FiniteAutomataEventHandler<Attachment>} [handler]
     * @param {Attachment} [attachment] 
     */
    constructor(handler = undefined, attachment = undefined) {
        /** @type {FiniteAutomata<Attachment>} */
        this.value = createFiniteAutomata(handler, attachment);
        /**
         * @protected
         * @type {Map<StateKey, State<StateKey>>}
         */
        this.stateMapping = new Map();
        /**
         * @protected
         * @type {Map<SymbolKey, Symbol<SymbolKey>>}
         */
        this.symbolMapping = new Map();
        /**
         * @protected
         * @type {Map<TransitionKey, Transition<TransitionKey>>}
         */
        this.transitionMapping = new Map();
        /** @protected */
        this.availableStateIndex = 0;
    }

    /** @protected */
    nextAvailableStateName() {
        return `q${this.availableStateIndex++}`;
    }

    /**
     * @protected
     * @param {StateKey} key
     */
    resolveStateByKey(key) {
        if (this.stateMapping.has(key)) {
            return this.stateMapping.get(key);
        }
        let result = new State(this.value, key, this.nextAvailableStateName());
        this.stateMapping.set(key, result);
        return result;
    }

    /**
     * @protected
     * @param {TransitionKey} key
     */
    resolveTransitionByKey(key) {
        if (this.transitionMapping.has(key)) {
            return this.transitionMapping.get(key);
        }
        let result = new Transition(this.value, key, null, null, null);
        this.transitionMapping.set(key, result);
        return result;
    }

    /**
     * @protected
     * @param {SymbolKey} key
     */
    resolveSymbolByKey(key) {
        if (this.symbolMapping.has(key)) {
            return this.symbolMapping.get(key);
        }
        let result = new Symbol(this.value, key, String(key));
        this.symbolMapping.set(key, result);
        return result;
    }

    /**
     * @param {StateKey} key
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    startState(key) {
        let result = this.resolveStateByKey(key);
        this.value.Q.add(result);
        this.value.s = result;
        return this;
    }

    /**
     * @param {StateKey} key 
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    finalState(key) {
        let result = this.resolveStateByKey(key);
        this.value.Q.add(result);
        this.value.F.add(result);
        return this;
    }

    /**
     * @param {StateKey} key 
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    state(key, name = undefined) {
        let result = this.resolveStateByKey(key);
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.Q.add(result);
        return this;
    }

    /**
     * @param {TransitionKey} key 
     * @param {StateKey} [fromKey] 
     * @param {SymbolKey} [readKey] 
     * @param {StateKey} [toKey] 
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    transition(key, fromKey = undefined, readKey = undefined, toKey = undefined) {
        let result = this.resolveTransitionByKey(key);
        let from = null;
        let read = null;
        let to = null;
        if (typeof fromKey !== 'undefined') {
            from = this.resolveStateByKey(fromKey);
            this.state(fromKey, from.name);
        }
        if (typeof readKey !== 'undefined') {
            read = this.resolveSymbolByKey(readKey);
            this.symbol(readKey);
        }
        if (typeof toKey !== 'undefined') {
            to = this.resolveStateByKey(toKey);
            this.state(toKey, to.name);
        }
        result.from = from;
        result.read = read;
        result.to = to;
        this.value.T.add(result);
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    symbol(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.EPSILON === result) {
            return this;
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.A.add(result);
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    epsilon(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for epsilon.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.EPSILON = result;
        return this;
    }

    /**
     * @returns {Builder<Attachment, StateKey, SymbolKey, TransitionKey>}
     */
    reset() {
        this.value = createFiniteAutomata(this.value.handler, this.value.attachment);
        this.stateMapping.clear();
        this.symbolMapping.clear();
        this.transitionMapping.clear();
        this.availableStateIndex = 0;
        return this;
    }

    build() {
        let result = this.value;
        this.reset();
        return result;
    }
}
