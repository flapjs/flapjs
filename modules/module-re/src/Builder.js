import { Symbol, createRegularExpression } from './RegularExpression.js';

/**
 * @template Attachment
 * @typedef {import('./RegularExpression').RegularExpression<Attachment>} RegularExpression
 */

/**
 * @template Attachment
 * @typedef {import('./RegularExpression').RegularExpressionEvent<Attachment>} RegularExpressionEvent
 */

/**
 * @template Attachment
 * @typedef {import('./RegularExpression').RegularExpressionEventHandler<Attachment>} RegularExpressionEventHandler
 */

/**
 * @template Attachment
 * @template SymbolKey
 */
export class Builder {
    /**
     * @template Attachment
     * @param {RegularExpression<Attachment>} src 
     */
    static from(src) {
        let builder = new Builder(src.handler, src.attachment);
        return builder;
    }

    /**
     * @template Attachment
     * @param {RegularExpression<Attachment>} src 
     */
    static fromIdentity(src) {
        return new Builder(src.handler, src.attachment);
    }

    /**
     * @param {RegularExpressionEventHandler<Attachment>} [handler]
     * @param {Attachment} [attachment] 
     */
    constructor(handler = undefined, attachment = undefined) {
        /** @type {RegularExpression<Attachment>} */
        this.value = createRegularExpression(handler, attachment);
        /**
         * @protected
         * @type {Map<SymbolKey, Symbol<SymbolKey>>}
         */
        this.symbolMapping = new Map();
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
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    symbol(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.A.add(result);
        return this;
    }

    /**
     * @returns {Builder<Attachment, SymbolKey>}
     */
    reset() {
        this.value = createRegularExpression(this.value.handler, this.value.attachment);
        this.symbolMapping.clear();
        return this;
    }

    build() {
        let result = this.value;
        this.reset();
        return result;
    }
}
