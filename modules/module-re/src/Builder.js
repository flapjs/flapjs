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
        for(let s of src.A) {
            builder.symbol(s.key);
        }
        builder.emptySet(src.EMPTY_SET);
        builder.sigma(src.SIGMA);
        builder.kleene(src.KLEENE);
        builder.plus(src.PLUS);
        builder.concat(src.CONCAT);
        builder.union(src.UNION);
        builder.scopeOpen(src.SCOPE_OPEN);
        builder.scopeClose(src.SCOPE_CLOSE);
        builder.expression(src.R.map(r => r.key));
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
     * @param  {SymbolKey[]} symbolKeys 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    expression(symbolKeys) {
        for(let symbolKey of symbolKeys) {
            let symbol = this.resolveSymbolByKey(symbolKey);
            this.value.R.push(symbol);
        }
        return this;
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
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    emptySet(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for empty set.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.EMPTY_SET = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    sigma(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for sigma.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.SIGMA = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    kleene(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for kleene.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.KLEENE = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    plus(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for plus.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.PLUS = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    concat(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for concat.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.CONCAT = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    union(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for union.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.UNION = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    scopeOpen(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for scope open.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.SCOPE_OPEN = result;
        return this;
    }

    /**
     * @param {SymbolKey} key 
     * @returns {Builder<Attachment, SymbolKey>}
     */
    scopeClose(key, name = undefined) {
        let result = this.resolveSymbolByKey(key);
        if (this.value.A.has(result)) {
            throw new Error(`Cannot reuse symbol '${key}' from alphabet for scope close.`);
        }
        if (typeof name !== 'undefined') {
            result.name = name;
        }
        this.value.SCOPE_CLOSE = result;
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
