/**
 * @template Attachment
 * @typedef FiniteAutomata
 * @property {Set<State<?>>} Q
 * @property {Set<Symbol<?>>} A
 * @property {Set<Transition<?>>} T
 * @property {State<?>} s
 * @property {Set<State<?>>} F
 * @property {Symbol<?>} EPSILON
 * @property {FiniteAutomataEventHandler<Attachment>} handler
 * @property {Attachment} attachment
 */

/**
 * @typedef {State<?>|Symbol<?>|Transition<?>} FiniteAutomataEventTarget
 * @typedef {FiniteAutomataEventTarget|Array<FiniteAutomataEventTarget>} FiniteAutomataEventTargets
 */

/**
 * @template Attachment
 * @typedef FiniteAutomataEvent
 * @property {Events[keyof Events]} type
 * @property {FiniteAutomataEventTargets} target
 * @property {object} detail
 * @property {Attachment} attachment
 */

/**
 * @template Attachment
 * @callback FiniteAutomataEventHandler
 * @param {FiniteAutomataEvent<Attachment>} event
 * @returns {any}
 */

/**
 * @template Attachment
 * @param {FiniteAutomataEventHandler<Attachment>} [handler]
 * @param {Attachment} [attachment]
 * @returns {FiniteAutomata<Attachment>}
 */
export function createFiniteAutomata(handler = defaultEventHandler, attachment = undefined) {
    return {
        Q: new Set(),
        A: new Set(),
        T: new Set(),
        s: null,
        F: new Set(),
        EPSILON: null,
        handler,
        attachment,
    };
}

/**
 * @param {any} src 
 * @returns {boolean}
 */
export function isFiniteAutomata(src) {
    if (typeof src !== 'object') {
        return false;
    }
    return src.Q instanceof Set
        && src.A instanceof Set
        && src.T instanceof Set
        && typeof src.s === 'object'
        && src.F instanceof Set
        && typeof src.EPSILON === 'object'
        && 'attachment' in src;
}

export const Events = {
    StateCreate: 'stateCreate',
    StateUpdate: 'stateUpdate',
    StateDelete: 'stateDelete',
    SymbolCreate: 'symbolCreate',
    SymbolUpdate: 'symbolUpdate',
    SymbolDelete: 'symbolDelete',
    TransitionCreate: 'transitionCreate',
    TransitionUpdate: 'transitionUpdate',
    TransitionDelete: 'transitionDelete',
};

/**
 * @param {FiniteAutomata<?>} src 
 * @param {Events[keyof Events]} type 
 * @param {FiniteAutomataEventTargets} target
 * @param {object} detail
 */
export async function dispatchEvent(src, type, target, detail = {}) {
    return await src.handler({
        type,
        target,
        detail,
        attachment: src.attachment,
    });
}

/**
 * @param {FiniteAutomataEvent<?>} event
 * @returns {any}
 */
function defaultEventHandler(event) {
    switch(event.type) {
        case Events.StateCreate:
            break;
        case Events.StateDelete:
            break;
        case Events.StateUpdate:
            break;
        case Events.SymbolCreate:
            break;
        case Events.SymbolDelete:
            break;
        case Events.SymbolUpdate:
            break;
        case Events.TransitionCreate:
            break;
        case Events.TransitionDelete:
            break;
        case Events.TransitionUpdate:
            break;
        case 'readClosure':
            break;
        default:
            throw new Error(`Unsupported operation '${event.type}'.`);
    }
}

/**
 * @template StateKey
 */
export class State {
    /**
     * @param {FiniteAutomata<?>} parent 
     * @param {StateKey} key 
     * @param {string} name 
     */
    constructor(parent, key, name) {
        this.parent = parent;
        this.key = key;
        this.name = name;
    }
}

/**
 * @template SymbolKey
 */
export class Symbol {
    /**
     * @param {FiniteAutomata<?>} parent 
     * @param {SymbolKey} key 
     * @param {string} name 
     */
    constructor(parent, key, name) {
        this.parent = parent;
        this.key = key;
        this.name = name;
    }
}

/**
 * @template TransitionKey
 */
export class Transition {
    /**
     * @param {FiniteAutomata<?>} parent 
     * @param {TransitionKey} key 
     * @param {State} from 
     * @param {Symbol} read 
     * @param {State} to 
     */
    constructor(parent, key, from, read, to) {
        this.parent = parent;
        this.key = key;
        this.from = from;
        this.read = read;
        this.to = to;
    }

    get name() {
        return `${this.from.name}-[${this.read.name}]->${this.to.name}`;
    }
}
