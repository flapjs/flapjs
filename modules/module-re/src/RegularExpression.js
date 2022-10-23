/**
 * @template Attachment
 * @typedef RegularExpression
 * @property {Array<Symbol<?>>} R
 * @property {Set<Symbol<?>>} A
 * @property {Symbol<?>} EMPTY_SET
 * @property {Symbol<?>} SIGMA
 * @property {Symbol<?>} KLEENE
 * @property {Symbol<?>} PLUS
 * @property {Symbol<?>} CONCAT
 * @property {Symbol<?>} UNION
 * @property {Symbol<?>} SCOPE_OPEN
 * @property {Symbol<?>} SCOPE_CLOSE
 * @property {RegularExpressionEventHandler<Attachment>} handler
 * @property {Attachment} attachment
 */

/**
 * @typedef {Symbol<?>} RegularExpressionEventTarget
 * @typedef {RegularExpressionEventTarget|Array<RegularExpressionEventTarget>} RegularExpressionEventTargets
 */

/**
 * @template Attachment
 * @typedef RegularExpressionEvent
 * @property {Events[keyof Events]} type
 * @property {RegularExpressionEventTargets} target
 * @property {object} detail
 * @property {Attachment} attachment
 */

/**
 * @template Attachment
 * @callback RegularExpressionEventHandler
 * @param {RegularExpressionEvent<Attachment>} event
 * @returns {any}
 */

/**
 * @template Attachment
 * @param {RegularExpressionEventHandler<Attachment>} [handler]
 * @param {Attachment} [attachment]
 * @returns {RegularExpression<Attachment>}
 */
export function createRegularExpression(handler = defaultEventHandler, attachment = undefined) {
    return {
        R: new Array(),
        A: new Set(),
        EMPTY_SET: null,
        SIGMA: null,
        KLEENE: null,
        PLUS: null,
        CONCAT: null,
        UNION: null,
        SCOPE_OPEN: null,
        SCOPE_CLOSE: null,
        handler,
        attachment,
    };
}

/**
 * @param {any} src 
 * @returns {boolean}
 */
export function isRegularExpression(src) {
    if (typeof src !== 'object') {
        return false;
    }
    return Array.isArray(src.R)
        && src.A instanceof Set
        && 'attachment' in src;
}

export const Events = {
    ExpressionUpdate: 'expressionUpdate',
    SymbolCreate: 'symbolCreate',
    SymbolUpdate: 'symbolUpdate',
    SymbolDelete: 'symbolDelete',
};

/**
 * @param {RegularExpression<?>} src 
 * @param {Events[keyof Events]} type 
 * @param {RegularExpressionEventTargets} target
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
 * @param {RegularExpressionEvent<?>} event
 * @returns {any}
 */
function defaultEventHandler(event) {
    switch(event.type) {
        case Events.ExpressionUpdate:
            break;
        case Events.SymbolCreate:
            break;
        case Events.SymbolDelete:
            break;
        case Events.SymbolUpdate:
            break;
        default:
            throw new Error(`Unsupported operation '${event.type}'.`);
    }
}

/**
 * @template SymbolKey
 */
export class Symbol {
    /**
     * @param {RegularExpression<?>} parent 
     * @param {SymbolKey} key 
     * @param {string} name 
     */
    constructor(parent, key, name) {
        this.parent = parent;
        this.key = key;
        this.name = name;
    }
}
